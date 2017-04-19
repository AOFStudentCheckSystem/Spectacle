/**
 * Created by dummy on 4/8/17.
 */
import * as types from '../mutation-types'
import api from '../../api/event'
import checkApi from '../../api/check'
import {ActivityEvent, LocalEvent} from '../../models/event'
import {ActionResult} from '../../models/result'

const state = {
    events: [],
    currentEvent: null,
    localEvents: [],
    broken: [],
    currentLoading: null
}

const mutations = {
    [types.SET_ALL_EVENTS] (state, {events}) {
        state.events = events
    },
    [types.SET_CURRENT_EVENT] (state, {event}) {
        state.currentEvent = event
    },
    [types.PATCH_CURRENT_EVENT] (state, {patch}) {
        if (patch.name) {
            state.currentEvent.name = patch.name
        }
        if (patch.time) {
            state.currentEvent.time = patch.time
        }
        if (patch.description) {
            state.currentEvent.description = patch.description
        }
        if (patch.status) {
            state.currentEvent.status = patch.status
        }
        if (state.currentEvent instanceof LocalEvent) {
            state.currentEvent.dirty = true
        }
    },
    [types.PATCH_EVENT] (state, {event, patch}) {
        if (patch.name) {
            event.name = patch.name
        }
        if (patch.time) {
            event.time = patch.time
        }
        if (patch.description) {
            event.description = patch.description
        }
        if (patch.status) {
            event.status = patch.status
        }
        if (state.currentEvent instanceof LocalEvent) {
            event.dirty = true
        }
    },
    [types.ADD_EVENT_RECORD] (state, {record}) {
        const currentEvent = state.currentEvent
        if (currentEvent) {
            const existingRecords = currentEvent.records
                .find((rec) => rec.student.idNumber === record.student.idNumber)
            if (existingRecords) {
                currentEvent.records = currentEvent.records.filter((rec) => rec !== existingRecords)
            }
            currentEvent.records.unshift(record)
            if (currentEvent instanceof LocalEvent) {
                currentEvent.dirty = true
            }
        }
    },
    [types.ADD_TO_LOCAL_EVENTS] (state, {localEvent}) {
        const currentEvent = state.currentEvent
        const existingEvent = state.localEvents.find((event) => event.localId === localEvent.localId)
        if (!existingEvent) state.localEvents.unshift(localEvent)
        if (currentEvent instanceof LocalEvent) {
            currentEvent.dirty = true
        }
    },
    [types.REMOVE_FROM_LOCAL_EVENTS] (state, {localEvent}) {
        state.localEvents = state.localEvents.filter((event) => event.localId !== localEvent.localId)
    },
    [types.REMOVE_LOCAL_EVENTS] (state) {
        state.localEvents = []
    },
    [types.SET_LOCAL_EVENTS] (state, {localEvents}) {
        state.localEvents = localEvents
    },
    [types.APPEND_BROKEN_EVENT] (state, {broken}) {
        state.broken.push(broken)
    },
    [types.SET_BROKEN_EVENTS] (state, {events}) {
        state.broken = events
    },
    [types.SET_CURRENT_LOADING] (state, {id}) {
        state.currentLoading = id
    }
}

const getters = {
    events (state, getters, rootState) {
        return state.events
    },
    currentEvent (state, getters, rootState) {
        return state.currentEvent
    },
    currentEventRecords (state, getters, rootState) {
        return state.currentEvent ? state.currentEvent.records : []
    },
    localEvents (state) {
        return state.localEvents
    },
    brokenEvents (state) {
        return state.broken
    },
    mergedEvents (state) {
        return state.localEvents.filter((localEvent) => !localEvent.hasRemote).concat(state.events.map((remoteEvent) => {
            const localEvent = state.localEvents.find((localE) => localE.localId === remoteEvent.id)
            return localEvent || remoteEvent
        })).sort(function (x, y) {
            const xStatus = x.status === 2 ? -1 : x.status
            const yStatus = y.status === 2 ? -1 : y.status
            return xStatus === yStatus ? (y.time - x.time) : yStatus - xStatus
        })
    },
    sortedCurrentEventRecords (state, getters) {
        return getters.currentEventRecords.concat().sort((a, b) => {
            return Math.abs(b.checkInTime) - Math.abs(a.checkInTime)
        })
    }
}

const actions = {
    async createEvent ({commit, rootState, dispatch}, {event}) {
        if (rootState.auth.offline) {
            commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: event})
            return
        }
        try {
            const submittedEvent = await api.createEvent(event)
            if (submittedEvent instanceof ActionResult) {
                console.error(event)
                commit(types.APPEND_BROKEN_EVENT, {broken: event})
                commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: event})
            } else {
                await dispatch('refreshEvents')
            }
        } catch (e) {
            if (e.response) {
                console.error(e, event)
                commit(types.APPEND_BROKEN_EVENT, {broken: event})
            }
            commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: event})
        }
    },
    async refreshEvents ({commit, rootState}) {
        if (!rootState.auth.offline) {
            // const currentEvent = state.currentEvent
            // commit(types.SET_ALL_EVENTS, {
            //     events: (await api.listAllEvents()).filter((event) => {
            //         return !currentEvent || event.id !== currentEvent.id
            //     }).concat(currentEvent ? [currentEvent] : [])
            // })
            commit(types.SET_ALL_EVENTS, {
                events: await api.listAllEvents()
            })
        }
    },
    async pullCurrentEvent ({state, dispatch, commit, rootState}, {id}) {
        const cachedEvent = state.events.find((element) => element.id === id)

        if (rootState.auth.offline) {
            const cachedLocalEvent = state.localEvents.find((element) => element.id === id)
            if (cachedLocalEvent) {
                commit(types.SET_CURRENT_EVENT, {event: cachedLocalEvent})
                return
            }
            if (cachedEvent) {
                if (cachedEvent.status < 2) {
                    const localEvent = new LocalEvent(cachedEvent)
                    commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: localEvent})
                    commit(types.SET_CURRENT_EVENT, {event: localEvent})
                } else {
                    commit(types.SET_CURRENT_EVENT, {event: cachedEvent})
                }
            }
        } else {
            if (cachedEvent) {
                commit(types.SET_CURRENT_EVENT, {event: cachedEvent})
                commit(types.SET_CURRENT_LOADING, {id: cachedEvent.id})

                const remoteEvent = await api.pullEvent(id)
                remoteEvent.records = await checkApi.getRecords(remoteEvent.id)
                if (state.currentLoading === cachedEvent.id) {
                    const compareRecords = (x, y) => {
                        if (x.length !== y.length) return false
                        let objectsAreSame = true
                        for (let propertyName of x) {
                            if (x[propertyName] !== y[propertyName]) {
                                objectsAreSame = false
                                break
                            }
                        }
                        return objectsAreSame
                    }
                    if (cachedEvent instanceof LocalEvent ||
                        cachedEvent.name !== remoteEvent.name ||
                        cachedEvent.id !== remoteEvent.id ||
                        cachedEvent.description !== remoteEvent.description ||
                        cachedEvent.time !== remoteEvent.time ||
                        !compareRecords(cachedEvent.records, remoteEvent.records)
                    ) {
                        commit(types.SET_CURRENT_EVENT, {event: remoteEvent})
                    }
                }
            } else {
                const remoteEvent = await api.pullEvent(id)
                remoteEvent.records = await checkApi.getRecords(remoteEvent.id)
                commit(types.SET_CURRENT_EVENT, {event: remoteEvent})
            }
        }
    },
    async clearCurrentEvent ({commit}) {
        commit(types.SET_CURRENT_EVENT, {event: null})
    },
    async patchCurrentEvent ({commit, state, dispatch, rootState}, payload) {
        const currentEvent = state.currentEvent

        if (!currentEvent) {
            commit(types.APPEND_BROKEN_EVENT, {broken: currentEvent})
            console.error('the current event is gone', payload)
            return
        }

        if (currentEvent.status > 1) {
            commit(types.APPEND_BROKEN_EVENT, {broken: currentEvent})
            console.error('the current event is complete')
        }

        if (currentEvent instanceof LocalEvent) {
            commit(types.PATCH_CURRENT_EVENT, payload)
            return
        }
        if (rootState.auth.offline && currentEvent instanceof ActivityEvent) {
            const localEvent = new LocalEvent(currentEvent)
            commit(types.SET_CURRENT_EVENT, {event: localEvent})
            commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: localEvent})
            commit(types.PATCH_CURRENT_EVENT, payload)
            return
        }

        const previousState = new ActivityEvent(currentEvent)
        try {
            commit(types.PATCH_CURRENT_EVENT, payload)
            await api.editEvent(currentEvent, payload.patch)
            // commit(types.SET_ALL_EVENTS, {events: state.events})
        } catch (e) {
            if (!e.response && currentEvent instanceof ActivityEvent) {
                commit(types.PATCH_CURRENT_EVENT, {patch: previousState})
                const localEvent = new LocalEvent(currentEvent)
                commit(types.SET_CURRENT_EVENT, {event: localEvent})
                commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: localEvent})
                return
            }
            commit(types.APPEND_BROKEN_EVENT, {broken: {patch: payload.patch, event: currentEvent}})
            commit(types.PATCH_CURRENT_EVENT, {patch: previousState})
            console.error(e)
            dispatch('refreshEvents')
        }
    },
    async patchEvent ({commit, rootState}, {event, patch}) {
        if (event.status > 1) {
            commit(types.APPEND_BROKEN_EVENT, {broken: event})
            console.error('event is complete')
            return
        }

        if (event instanceof LocalEvent) {
            commit(types.PATCH_EVENT, {event, patch})
            return
        }
        if (rootState.auth.offline && event instanceof ActivityEvent) {
            commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: new LocalEvent(event)})
            commit(types.PATCH_EVENT, {event, patch})
            return
        }

        const previousState = new ActivityEvent(event)
        try {
            commit(types.PATCH_EVENT, {event, patch})
            await api.editEvent(event, patch)
        } catch (e) {
            if (!e.response && event instanceof ActivityEvent) {
                commit(types.PATCH_EVENT, {event, patch: previousState})
                const localEvent = new LocalEvent(event)
                commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: localEvent})
                commit(types.PATCH_EVENT, {event: localEvent, patch})
            } else {
                commit(types.APPEND_BROKEN_EVENT, {broken: {patch: patch, event: event}})
                commit(types.PATCH_EVENT, {event, patch: previousState})
                console.error(e)
            }
        }
    },
    async addEventRecord ({commit, state, rootState}, {record}) {
        const currentEvent = state.currentEvent

        if (currentEvent.status > 1) {
            console.error('the current event is complete')
        }

        if (currentEvent instanceof LocalEvent) {
            commit(types.ADD_EVENT_RECORD, {record})
            return
        }
        if (rootState.auth.offline && currentEvent instanceof ActivityEvent) {
            const localEvent = new LocalEvent(currentEvent)
            commit(types.SET_CURRENT_EVENT, {event: localEvent})
            commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: localEvent})
            commit(types.ADD_EVENT_RECORD, {record})
            return
        }
        try {
            if (await checkApi.submitRecords(currentEvent, [record])) {
                commit(types.ADD_EVENT_RECORD, {record})
            } else {
                console.error('Unknown Error: some event record requests went wrong.', currentEvent, record)
            }
        } catch (e) {
            if (!e.response && currentEvent instanceof ActivityEvent) {
                const localEvent = new LocalEvent(currentEvent)
                commit(types.SET_CURRENT_EVENT, {event: localEvent})
                commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: localEvent})
                commit(types.ADD_EVENT_RECORD, {record})
                return
            }
            console.log(e)
            commit(types.APPEND_BROKEN_EVENT, {broken: currentEvent})
        }
    },
    async syncLocalEvents ({commit, state, dispatch, rootState}) {
        if (!rootState.auth.offline) {
            const toRemove = []
            if (state.localEvents) {
                const duplicateLocalEvents = JSON.parse(JSON.stringify(state.localEvents))
                for (const element of duplicateLocalEvents) {
                    try {
                        let eventId = element.localId
                        if (!element.hasRemote) {
                            eventId = await api.createEvent(element)
                        }
                        if (eventId instanceof ActionResult) {
                            console.error(eventId, element)
                            commit(types.APPEND_BROKEN_EVENT, {broken: element})
                            continue
                        }
                        if (element.status > 1 && element.hasRemote) {
                            // commit(types.APPEND_BROKEN_EVENT, {broken: element})
                            // console.error('edited or checked in for completed event')
                            toRemove.push(element)
                            continue
                        }
                        element.id = eventId
                        const editResult = await api.editEvent(element, element)
                        if (!editResult.success) {
                            console.error('failed to push edits for', element)
                            commit(types.APPEND_BROKEN_EVENT, {broken: element})
                        }
                        if (element.records && element.records.length > 0 && element.status < 2) {
                            const recordResult = await checkApi.submitRecords(element, element.records)
                            if (recordResult) {
                                toRemove.push(element)
                            } else {
                                console.error('failed to push records for', element)
                                commit(types.APPEND_BROKEN_EVENT, {broken: element})
                            }
                        } else {
                            toRemove.push(element)
                        }
                    } catch (e) {
                        console.error('encountered an error whilst synchronizing', element, e)
                        commit(types.APPEND_BROKEN_EVENT, {broken: element})
                    }
                }
                toRemove.forEach((event) => {
                    commit(types.REMOVE_FROM_LOCAL_EVENTS, {localEvent: event})
                })
            }
            await dispatch('refreshEvents')
            const currentEvent = state.currentEvent
            if (currentEvent && currentEvent instanceof LocalEvent) {
                const instanceInToRemove = toRemove.find((e) => e.localId === currentEvent.localId)
                if (instanceInToRemove) {
                    try {
                        await dispatch('pullCurrentEvent', {id: instanceInToRemove.id})
                        console.log('successfully resynced', currentEvent)
                    } catch (e) {
                        commit(types.APPEND_BROKEN_EVENT, {broken: instanceInToRemove})
                        console.error(e)
                    }
                } else {
                    console.error('for unknown reasons, the current event is not in sync')
                }
            }
        } else {
            console.error('failed to sync, check connection')
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
