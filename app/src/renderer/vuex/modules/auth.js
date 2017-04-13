import * as types from '../mutation-types'
import api from '../../api/auth'
import { http } from '../../main'

const state = {
    token: null
}

const mutations = {
    [types.SET_USER_TOKEN] (state, { token }) {
        http.defaults.headers = { Authorization: token ? token.token : null }
        state.token = token
    }
}

const getters = {
    userToken (state) {
        return state.token
    },
    authenticated (state) {
        return state.token !== null
    }
}

const actions = {
    async authenticate ({ commit }, { email, password }) {
        commit(types.SET_USER_TOKEN, { token: await api.authenticate(email, password) })
    },
    async signOut ({ commit }) {
        await api.signOut()
        commit(types.SET_USER_TOKEN, { token: null })
    },
    async verify ({ commit }) {
        try {
            commit(types.SET_USER_TOKEN, { token: await api.verify() })
        } catch (e) {
            commit(types.SET_USER_TOKEN, { token: null })
        }
    },
    async authenticateWithToken ({ commit }, { tokenString }) {
        try {
            commit(types.SET_USER_TOKEN, { token: await api.verifyWithToken(tokenString) })
        } catch (e) {
            commit(types.SET_USER_TOKEN, { token: null })
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
