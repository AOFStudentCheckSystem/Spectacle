import * as types from './mutation-types'

export const decrementMain = ({ commit }) => {
  commit(types.DECREMENT_MAIN_COUNTER)
}

export const incrementMain = ({ commit }) => {
  commit(types.INCREMENT_MAIN_COUNTER)
}

export const setCard = ({commit}, payload) => {
  commit(types.SET_CARD_ATR, payload)
}
