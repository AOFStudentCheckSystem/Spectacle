/**
 * Created by dummy on 11/11/16.
 */
import * as types from '../mutation-types'

const state = {
  routeStack: []
}

const mutations = {
  [types.PUSH_ROUTE_STACK] (state, { route }) {
    state.routeStack.push(route)
  },
  [types.POP_ROUTE_STACK] (state) {
    state.routeStack.pop()
  }
}

const actions = {
  pushRoute: ({commit}, payload) => {
    commit(types.PUSH_ROUTE_STACK, payload)
  },
  popRoute: ({commit}) => commit(types.POP_ROUTE_STACK)
}

const getters = {
  lastRoute: state => state.routeStack[state.routes.routeStack.length - 1]
}

export default {
  state,
  mutations,
  actions,
  getters
}
