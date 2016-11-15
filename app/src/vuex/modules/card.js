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
  setAtr: ({dispatch, state, commit, rootState}, { atr }) => {
    if (atr === '') {
      commit(types.SET_CARD_STATUS, { status: false })
    } else if (atr !== state.atr) {
      const students = rootState.students.students
      dispatch('addStudent', { id: Object.keys(students).map((key) => students[key]).find((s) => s.rfid.toLowerCase() === atr.toLowerCase()).id })
      commit(types.SET_CARD_STATUS, { status: true })
    }
    commit(types.SET_CARD_ATR, { atr })
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
