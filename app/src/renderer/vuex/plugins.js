/**
 * Created by dummy on 4/10/17.
 */
import * as types from './mutation-types'
import {UserToken} from '../models/user'
import {ActivityEvent, LocalEvent} from '../models/event'
import {Student} from '../models/student'

function localStoragePlugin (mut, preprocess) {
    const deserialize = JSON.parse
    const serialize = JSON.stringify
    return store => {
        const raw = window.localStorage.getItem(mut)
        if (raw) {
            try {
                const saved = preprocess ? preprocess(deserialize(raw)) : deserialize(raw)
                store.commit(mut, saved)
            } catch (e) {
                console.error(e)
            }
        }

        store.subscribe(({type, payload}) => {
            if (type === mut) {
                window.localStorage.setItem(type, serialize(payload))
            }
        })
    }
}

function localStoragePatchPlugin (typeMutatePatch, stateGetter, typeMutateAll) {
    // const deserialize = JSON.parse
    const serialize = JSON.stringify
    return store => {
        // const raw = window.localStorage.getItem(typeMutateAll)
        // if (raw) {
        //     try {
        //         const saved = deserialize(raw)
        //         store.commit(typeMutateAll, saved)
        //     } catch (e) {
        //         console.error(e)
        //     }
        // }
        store.subscribe(({type}) => {
            if (type === typeMutatePatch) {
                try {
                    window.localStorage.setItem(typeMutateAll, serialize(stateGetter(store)))
                } catch (e) {
                    console.error(e)
                }
            }
        })
    }
}

export const authStoragePlugin = localStoragePlugin(types.SET_USER_TOKEN, ({token}) => {
    return {token: token ? new UserToken(token) : token}
})
export const localEventStoragePlugin = localStoragePlugin(types.SET_LOCAL_EVENTS, ({localEvents}) => {
    if (!localEvents) {
        return localEvents
    }
    return {localEvents: localEvents.map(localEvent => new LocalEvent(localEvent))}
})
export const eventStoragePlugin = localStoragePlugin(types.SET_ALL_EVENTS, ({events}) => {
    if (!events) {
        return events
    }
    return {events: events.map(remoteEvent => new ActivityEvent(remoteEvent))}
})
export const studentStoragePlugin = localStoragePlugin(types.SET_ALL_STUDENTS, ({students}) => {
    if (!students) {
        return students
    }
    return {students: students.map(student => new Student(student))}
})
export const brokenEventStoragePlugin = localStoragePlugin(types.SET_BROKEN_EVENTS, ({events}) => {
    if (!events) {
        return events
    }
    return {
        events: events.map((brokenEvent) => {
            return !brokenEvent.hasRemote && brokenEvent.id ? new ActivityEvent(brokenEvent) : new LocalEvent(brokenEvent)
        })
    }
})

export const brokenEventPatchPersistencePlugin = localStoragePatchPlugin(types.APPEND_BROKEN_EVENT,
    store => {
        return {events: store.state.event.broken}
    }, types.SET_BROKEN_EVENTS)

export const localEventAddPersistencePlugin = localStoragePatchPlugin(types.REMOVE_FROM_LOCAL_EVENTS,
    store => {
        return {localEvents: store.state.event.localEvents}
    }, types.SET_LOCAL_EVENTS)

export const localEventRemovePersistencePlugin = localStoragePatchPlugin(types.ADD_TO_LOCAL_EVENTS,
    store => {
        return {localEvents: store.state.event.localEvents}
    }, types.SET_LOCAL_EVENTS)

export const localEventPatchPersistencePlugin = localStoragePatchPlugin(types.PATCH_CURRENT_EVENT,
    store => {
        return {localEvents: store.state.event.localEvents}
    }, types.SET_LOCAL_EVENTS)

export const remoteEventPatchPersistencePlugin = localStoragePatchPlugin(types.PATCH_CURRENT_EVENT,
    store => {
        return {events: store.state.event.events}
    }, types.SET_ALL_EVENTS)

export const studentPatchPersistencePlugin = localStoragePatchPlugin(types.PATCH_CURRENT_STUDENT,
    store => {
        return {students: store.state.student.students}
    }, types.SET_ALL_STUDENTS)

export const localRecordPersistencePlugin = localStoragePatchPlugin(types.ADD_EVENT_RECORD,
    store => {
        return {localEvents: store.state.event.localEvents}
    }, types.SET_LOCAL_EVENTS)

export const remoteRecordPersistencePlugin = localStoragePatchPlugin(types.ADD_EVENT_RECORD,
    store => {
        return {events: store.state.event.events}
    }, types.SET_ALL_EVENTS)
// export const eventBrokenPersistencePlugin = store => {
//     const deserialize = JSON.parse
//     const serialize = JSON.stringify
//     return store => {
//         const raw = window.localStorage.getItem('broken_events')
//         if (raw) {
//             try {
//                 const saved = deserialize(raw)
//                 store.commit(types.SET_BROKEN_EVENTS, saved)
//             } catch (e) {
//                 console.error(e)
//             }
//         }
//
//         store.subscribe(({type}) => {
//             if (type === types.APPEND_BROKEN_EVENT) {
//                 window.localStorage.setItem('broken_events', serialize(store.state.event.broken))
//             }
//         })
//     }
// }
// export const eventStoragePatchPlugin = localStoragePatchPlugin(types.PATCH_CURRENT_EVENT, types.SET_ALL_EVENTS, (old, patch, store) => {
//     console.log(old, patch)
// })
// export const studentStoragePatchPlugin = localStoragePatchPlugin(types.PATCH_CURRENT_STUDENT, types.SET_ALL_STUDENTS, (old, patch, store) => {
//     console.log(old, patch)
// })

