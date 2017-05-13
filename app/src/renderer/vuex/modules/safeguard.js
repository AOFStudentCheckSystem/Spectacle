/**
 * Created by dummy on 5/12/17.
 */
import * as types from '../mutation-types'

const state = {
    verbose: false
}

const mutations = {
    [types.SET_VERBOSE] (state, {verbose}) {
        state.verbose = verbose
    }
}

const getters = {
    verbose (state) {
        return state.verbose
    }
}

const actions = {
    async setVerbose ({commit}, payload) {
        commit(types.SET_VERBOSE, payload)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
