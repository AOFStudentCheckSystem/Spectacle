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
    broken: []
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
    [types.ADD_EVENT_RECORD] (state, {record}) {
        const existingRecords = state.currentEvent.records
            .find((rec) => rec.student.idNumber === record.student.idNumber)
        if (existingRecords) {
            state.currentEvent.records = state.currentEvent.records.filter((rec) => rec !== existingRecords)
        }
        state.currentEvent.records.unshift(record)
        if (state.currentEvent instanceof LocalEvent) {
            state.currentEvent.dirty = true
        }
    },
    [types.ADD_TO_LOCAL_EVENTS] (state, {localEvent}) {
        const existingEvent = state.localEvents.find((event) => event.localId === localEvent.localId)
        if (!existingEvent) state.localEvents.unshift(localEvent)
        if (state.currentEvent instanceof LocalEvent) {
            state.currentEvent.dirty = true
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
        return state.currentEvent.records
    },
    localEvents (state) {
        return state.localEvents
    },
    brokenEvents (state) {
        return state.broken
    }
}

const actions = {
    async refreshEvents ({commit}) {
        commit(types.SET_ALL_EVENTS, {events: await api.listAllEvents()})
    },
    async pullCurrentEvent ({state, dispatch, commit, rootState}, {id}) {
        const cachedLocalEvent = state.localEvents.find((element) => element.id === id)
        const cachedEvent = state.events.find((element) => element.id === id)

        if (cachedLocalEvent) {
            commit(types.SET_CURRENT_EVENT, {event: cachedLocalEvent})
            return
        }

        if (rootState.auth.offline) {
            if (cachedEvent) {
                const localEvent = new LocalEvent(cachedEvent)
                commit(types.ADD_TO_LOCAL_EVENTS, {localEvent: localEvent})
                commit(types.SET_CURRENT_EVENT, {event: localEvent})
            }
        } else {
            if (cachedEvent) {
                commit(types.SET_CURRENT_EVENT, {event: cachedEvent})

                const remoteEvent = await api.pullEvent(id)
                if (!(
                        remoteEvent.id === cachedEvent.id &&
                        remoteEvent.name === cachedEvent.name &&
                        remoteEvent.description === cachedEvent.description &&
                        remoteEvent.status === cachedEvent.status &&
                        remoteEvent.time === cachedEvent.time
                    )) {
                    commit(types.SET_CURRENT_EVENT, {event: remoteEvent})
                    await dispatch('refreshEvents')
                }
            } else {
                commit(types.SET_CURRENT_EVENT, {event: await api.pullEvent(id)})
            }
        }
    },
    async clearCurrentEvent ({commit}) {
        commit(types.SET_CURRENT_EVENT, {event: null})
    },
    async patchCurrentEvent ({commit, state, dispatch, rootState}, payload) {
        if (rootState.auth.offline) {
            if (state.currentEvent instanceof ActivityEvent) {
                commit(types.SET_CURRENT_EVENT, {event: new LocalEvent(state.currentEvent)})
            }
            commit(types.PATCH_CURRENT_EVENT, payload)
            return
        }
        try {
            await api.editEvent(state.currentEvent, payload.patch)
            commit(types.PATCH_CURRENT_EVENT, payload)
            // commit(types.SET_ALL_EVENTS, {events: state.events})
        } catch (e) {
            commit(types.APPEND_BROKEN_EVENT, {broken: { patch: payload.patch, event: state.currentEvent }})
            console.error(e)
        }
        dispatch('refreshEvents')
    },
    async addEventRecord ({commit, state, rootState}, {record}) {
        if (!rootState.auth.offline && state.currentEvent instanceof ActivityEvent) {
            if (await checkApi.submitRecords(state.currentEvent, [record])) {
                commit(types.ADD_EVENT_RECORD, {record})
            } else {
                throw new Error('Unknown Error: some event record requests went wrong.')
            }
        } else {
            commit(types.ADD_EVENT_RECORD, {record})
        }
    },
    async syncLocalEvents ({commit, state, dispatch, rootState}) {
        if (!rootState.auth.offline) {
            const toRemove = await state.localEvents.reduce(async (acc, element) => {
                try {
                    let eventId = element.localId
                    if (!element.hasRemote) {
                        eventId = await api.createEvent(element)
                    }
                    if (eventId instanceof ActionResult) {
                        console.error(eventId)
                        console.error(element)
                        commit(types.APPEND_BROKEN_EVENT, {broken: element})
                    }
                    element.id = eventId
                    const editResult = api.editEvent(element, element)
                    if (!editResult.success) {
                        console.error('failed to push edits for', element)
                        commit(types.APPEND_BROKEN_EVENT, {broken: element})
                    }
                    if (event.records && event.records.length > 0 && event.status < 2) {
                        const recordResult = await checkApi.submitRecords(element, element.records)
                        if (recordResult) {
                            acc.push(element)
                        } else {
                            console.error('failed to push records for', element)
                            commit(types.APPEND_BROKEN_EVENT, {broken: element})
                        }
                    } else {
                        acc.push(element)
                    }
                } catch (e) {
                    console.error('encounted an error whilst synchronizing', element, e)
                    commit(types.APPEND_BROKEN_EVENT, {broken: element})
                }
                return acc
            }, [])
            toRemove.forEach((event) => {
                commit(types.REMOVE_FROM_LOCAL_EVENTS, event)
            })
            await dispatch('refreshEvents')
            if (state.currentEvent && state.currentEvent instanceof LocalEvent) {
                const instanceInToRemove = toRemove.find((e) => e.localId === state.currentEvent.localId)
                if (instanceInToRemove) {
                    try {
                        await dispatch('pullCurrentEvent', {id: instanceInToRemove.id})
                        console.log('successfully resynced currentEvent')
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
