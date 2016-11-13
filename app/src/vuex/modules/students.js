/**
 * Created by dummy on 11/10/16.
 */
import api from '../../api/SpectacleAPI'
import * as types from '../mutation-types'

const state = {
  students: [],
  studentsAvailable: false
}

const mutations = {
  [types.UPDATE_STUDENT] (state, { id, rfid }) {
    state.students[id].rfid = rfid
  },
  [types.UPDATE_STUDENT_FAILURE] (state) { },
  [types.SET_STUDENTS] (state, { students }) {
    state.students = students
    state.studentsAvailable = true
  },
  [types.SET_STUDENTS_FAILURE] (state) {
    state.studentsAvailable = false
  },
  [types.SET_STUDENT_IMAGE] (state, { id, image }) {
    state.students[id].image = image
  },
  [types.SET_STUDENT_IMAGE_FAILURE] (state) {}
}

const actions = {
  refreshStudents: ({commit}) => {
    api.student.all().then((response) => {
      commit(types.SET_STUDENTS, { students: response })
    }, (response) => {
      commit(types.SET_STUDENTS_FAILURE)
    })
  },
  updateStudent: ({commit}, { id, rfid }) => {
    api.student.updateStudent(id, rfid).then((fulfilled) => {
      commit(types.UPDATE_STUDENT, { id, rfid })
    }, (rejected) => {
      commit(types.UPDATE_STUDENT_FAILURE)
    })
  },
  refreshImage: ({commit}, { id }) => {
    api.student.getImage(id).then((image) => {
      commit(types.SET_STUDENT_IMAGE, { id, image })
    }, (rejected) => {
      commit(types.SET_STUDENT_IMAGE_FAILURE)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
