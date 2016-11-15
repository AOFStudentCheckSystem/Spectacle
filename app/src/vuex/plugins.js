/**
 * Created by dummy on 11/14/16.
 */
import * as types from './mutation-types'
import Vue from 'vue'

export const localStoragePlugin = store => {
  const deserialize = JSON.parse
  const serialize = JSON.stringify

  const savedToken = localStorage.getItem('authentication')
  if (savedToken !== null) {
    const payload = deserialize(savedToken)
    Vue.http.headers.common['Authorization'] = 'Bearer ' + payload.token
    store.commit(types.AUTHENTICATION, payload)
  }

  // load async
  window.setTimeout(() => {
    const savedStudents = localStorage.getItem('students')
    if (savedStudents !== null) {
      store.commit(types.SET_STUDENTS, deserialize(savedStudents))
    }
  }, 0)
  // persist sign-in
  store.subscribe(({type, payload}, state) => {
    window.setTimeout(() => {
      switch (type) {
        case types.AUTHENTICATION:
          localStorage.setItem('authentication', serialize(payload))
          break
        case types.AUTHENTICATION_FAILURE:
          localStorage.removeItem('authentication')
          break
        case types.SET_STUDENTS:
          localStorage.setItem('students', serialize(payload))
          break
        case types.SET_STUDENT_IMAGE:
          localStorage.setItem('students', serialize(state.students.students))
          break
      }
    }, 1)
  })
}
