/**
 * Created by dummy on 11/13/16.
 */
import * as types from '../mutation-types'

const state = {
  notificationStream: []
}

const mutations = {
  [types.PUSH_NOTIFICATION] (state, { notification }) {
    state.notificationStream.push(notification)
  },
  [types.POP_NOTIFICATION] (state) {
    state.notificationStream.shift()
  }
}

const actions = {
  pushNotification: ({commit}, payload) => {
    commit(types.PUSH_NOTIFICATION, payload)
    window.setTimeout(() => {
      commit(types.POP_NOTIFICATION)
    }, 3000)
  }
}

const getters = {
  notifications: state => state.notificationStream
}

export default {
  state,
  mutations,
  actions,
  getters
}
