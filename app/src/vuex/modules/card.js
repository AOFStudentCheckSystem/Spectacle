/**
 * Created by dummy on 11/11/16.
 * Complete
 */
import * as types from '../mutation-types'

const state = {
  readerStatus: false,
  cardStatus: false,
  atr: ''
}

const mutations = {
  [types.SET_READER_STATUS] (state, { status }) {
    state.readerStatus = status
  },
  [types.SET_CARD_STATUS] (state, { status }) {
    state.cardStatus = status
  },
  [types.SET_CARD_ATR] (state, { atr }) {
    state.atr = atr
  }
}

const actions = {
  setAtr: ({commit}, payload) => {
    commit(types.SET_CARD_ATR, payload)
    if (payload.atr === '') {
      commit(types.SET_CARD_STATUS, { status: false })
    } else {
      commit(types.SET_CARD_STATUS, { status: true })
    }
  },
  setReaderStatus: ({dispatch, commit}, payload) => {
    dispatch('setAtr', { atr: '' })
    commit(types.SET_READER_STATUS, payload)
  }
}

export default {
  state,
  mutations,
  actions
}
