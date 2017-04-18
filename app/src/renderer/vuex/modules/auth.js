import * as types from '../mutation-types'
import api from '../../api/auth'
import {http, rawHttp} from '../../main'

const state = {
    token: null,
    // unauthenticated or network offline !!! application working in offline mode
    offline: true,
    consistency: 4,
    // network online, can sign in !!! should only be used for sign in
    online: false,
    signingIn: false
}

const mutations = {
    [types.SET_USER_TOKEN] (state, {token}) {
        http.defaults.headers = {Authorization: token ? token.token : null}
        rawHttp.defaults.headers = {Authorization: token ? token.token : null}
        state.token = token
    },
    [types.SET_OFFLINE] (state, {offline}) {
        state.offline = offline
    },
    [types.ADD_CONSISTENCY] (state) {
        state.consistency = state.consistency > 9 ? 10 : state.consistency + 1
    },
    [types.CLEAR_CONSISTENCY] (state) {
        state.consistency = 0
    },
    [types.SET_ONLINE] (state, {online}) {
        state.online = online
    },
    [types.SET_SIGNING_IN] (state, {signingIn}) {
        state.signingIn = signingIn
    }
}

const getters = {
    userToken (state) {
        return state.token
    },
    authenticated (state) {
        return state.token !== null
    },
    offline (state) {
        return state.offline
    },
    online (state) {
        return state.online
    }
}

const actions = {
    async authenticate ({commit}, {email, password}) {
        commit(types.SET_SIGNING_IN, {signingIn: true})
        commit(types.SET_USER_TOKEN, {token: await api.authenticate(email, password)})
        commit(types.SET_SIGNING_IN, {signingIn: false})
    },
    async signOut ({commit}) {
        await api.signOut()
        commit(types.SET_USER_TOKEN, {token: null})
    },
    async verify ({commit, state, dispatch}) {
        // if (!state.token) {
        //     if (!state.offline) {
        //         commit(types.SET_OFFLINE, {offline: true})
        //     }
        //     return
        // }
        try {
            const token = await api.verify()
            if (state.offline) {
                commit(types.ADD_CONSISTENCY)
                if (state.consistency > 4) {
                    commit(types.SET_USER_TOKEN, {token: token})
                    commit(types.SET_OFFLINE, {offline: false})
                    dispatch('syncLocalEvents')
                    dispatch('refreshStudents')
                }
            }
            if (!state.online) {
                commit(types.SET_ONLINE, {online: true})
            }
        } catch (e) {
            if (e.response) {
                if (state.token && !state.signingIn) {
                    commit(types.SET_USER_TOKEN, {token: null})
                    console.error(e.request)
                    console.log('token expired')
                }
                if (!state.online) {
                    commit(types.SET_ONLINE, {online: true})
                }
            } else {
                if (!state.offline) {
                    console.error(e)
                }
            }
            if (!state.offline) {
                commit(types.SET_OFFLINE, {offline: true})
                commit(types.CLEAR_CONSISTENCY)
            }
        }
    },
    async authenticateWithToken ({commit}, {tokenString}) {
        try {
            commit(types.SET_USER_TOKEN, {token: await api.verifyWithToken(tokenString)})
        } catch (e) {
            commit(types.SET_USER_TOKEN, {token: null})
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
