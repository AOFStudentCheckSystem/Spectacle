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

export const authStoragePlugin = localStoragePlugin(types.SET_USER_TOKEN)

