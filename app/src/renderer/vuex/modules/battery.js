/**
 * Created by dummy on 4/18/17.
 */
import * as types from '../mutation-types'

const state = {
    charge: 100,
    charging: false
}

const mutations = {
    [types.SET_BATTERY_CHAEGE] (state, {charge}) {
        state.charge = charge
    },
    [types.SET_BATTERY_CHARGING] (state, {charging}) {
        state.charging = charging
    }
}

const getters = {
    charge (state) {
        return state.charge
    },
    charging (state) {
        return state.charging
    }
}

const actions = {
    async setCharge ({commit}, payload) {
        commit(types.SET_BATTERY_CHAEGE, payload)
    },
    async setCharging ({commit}, payload) {
        commit(types.SET_BATTERY_CHARGING, payload)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
