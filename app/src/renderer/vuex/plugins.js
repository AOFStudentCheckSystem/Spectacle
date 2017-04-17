/**
 * Created by dummy on 4/10/17.
 */
import * as types from './mutation-types'

function localStoragePlugin (mut) {
    const deserialize = JSON.parse
    const serialize = JSON.stringify
    return store => {
        const raw = window.localStorage.getItem(mut)
        if (raw) {
            try {
                const saved = deserialize(raw)
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

export const authStoragePlugin = localStoragePlugin(types.SET_USER_TOKEN)
export const localEventStoragePlugin = localStoragePlugin(types.SET_LOCAL_EVENTS)
export const eventStoragePlugin = localStoragePlugin(types.SET_ALL_EVENTS)
export const studentStoragePlugin = localStoragePlugin(types.SET_ALL_STUDENTS)
export const brokenEventStoragePlugin = localStoragePlugin(types.SET_BROKEN_EVENTS)

export const brokenEventPatchPersistencePlugin = localStoragePatchPlugin(types.APPEND_BROKEN_EVENT,
    store => {
        return {events: store.state.event.broken}
    }, types.SET_BROKEN_EVENTS)

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

