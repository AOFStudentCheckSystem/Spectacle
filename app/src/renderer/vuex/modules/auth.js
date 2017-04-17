import * as types from '../mutation-types'
import api from '../../api/auth'
import {http, rawHttp} from '../../main'

const state = {
    token: null,
    offline: true,
    consistency: 0
}

const mutations = {
    [types.SET_USER_TOKEN] (state, {token}) {
        http.defaults.headers = {Authorization: token ? token.token : null}
        rawHttp.defaults.headers = {Authorization: token ? token.token : null}
        state.token = token
    },
    [types.SET_OFFLINE] (state, { offline }) {
        state.offline = offline
    },
    [types.ADD_CONSISTENCY] (state) {
        state.consistency = state.consistency > 9 ? 10 : state.consistency + 1
    },
    [types.CLEAR_CONSISTENCY] (state) {
        state.consistency = 0
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
    }
}

const actions = {
    async authenticate ({commit}, {email, password}) {
        commit(types.SET_USER_TOKEN, {token: await api.authenticate(email, password)})
    },
    async signOut ({commit}) {
        await api.signOut()
        commit(types.SET_USER_TOKEN, {token: null})
    },
    async verify ({commit, state, dispatch}) {
        try {
            const token = await api.verify()
            if (state.offline) {
                commit(types.ADD_CONSISTENCY)
                if (state.consistency > 5) {
                    commit(types.SET_USER_TOKEN, {token: token})
                    commit(types.SET_OFFLINE, {offline: false})
                    dispatch('syncLocalEvents')
                }
            }
        } catch (e) {
            if (e.response) {
                commit(types.SET_USER_TOKEN, {token: null})
                console.error(e.request)
                console.log('token expired')
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
