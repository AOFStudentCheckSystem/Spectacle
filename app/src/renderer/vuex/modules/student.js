/**
 * Created by dummy on 4/16/17.
 */
import * as types from '../mutation-types'
import api from '../../api/student'

const state = {
    students: [],
    currentStudent: null
}

const mutations = {
    [types.SET_ALL_STUDENTS] (state, {students}) {
        state.students = students
    },
    [types.SET_CURRENT_STUDENT] (state, {student}) {
        state.currentStudent = student
    },
    [types.PATCH_CURRENT_STUDENT] (state, {patch}) {
        if (patch.lastName) {
            state.currentStudent.lastName = patch.lastName
        }
        if (patch.firstName) {
            state.currentStudent.firstName = patch.firstName
        }
        if (patch.preferredName) {
            state.currentStudent.preferredName = patch.preferredName
        }
        if (patch.cardSecret) {
            state.currentStudent.cardSecret = patch.cardSecret
        }
        if (patch.email) {
            state.currentStudent.email = patch.email
        }
    }
}

const getters = {
    students (state) {
        return state.students
    },
    currentStudent (state) {
        return state.currentStudent
    },
    cardSecretStudentMap (state) {
        return state.students.reduce((acc, student) => {
            const cardSecret = student.cardSecret
            if (cardSecret) {
                acc[cardSecret] = student
            }
            return acc
        }, {})
    }
}

const actions = {
    async refreshStudents ({commit}) {
        commit(types.SET_ALL_STUDENTS, {students: await api.listAllStudents()})
    },
    async pullCurrentStudent ({commit, dispatch, state}, {id}) {
        const cachedStudent = state.students.find((element) => element.idNumber === id)
        if (cachedStudent) {
            commit(types.SET_CURRENT_STUDENT, {student: cachedStudent})

            const remoteStudent = await api.pullStudent(id)
            if (!(
                    remoteStudent.idNumber === cachedStudent.idNumber &&
                    remoteStudent.lastName === cachedStudent.lastName &&
                    remoteStudent.firstName === cachedStudent.firstName &&
                    remoteStudent.preferredName === cachedStudent.preferredName &&
                    remoteStudent.cardSecret === cachedStudent.cardSecret &&
                    remoteStudent.email === cachedStudent.email
                )) {
                commit(types.SET_CURRENT_STUDENT, {student: remoteStudent})
                await dispatch('refreshStudents')
            }
        } else {
            commit(types.SET_CURRENT_STUDENT, {student: await api.pullStudent(id)})
        }
    },
    async clearCurrentStudent ({commit}) {
        commit(types.SET_CURRENT_STUDENT, {student: null})
    },
    async patchCurrentStudent ({commit, state, dispatch}, payload) {
        try {
            await api.editStudent(state.currentStudent, payload.patch)
            commit(types.PATCH_CURRENT_STUDENT, payload)
            dispatch('refreshStudents')
            // commit(types.SET_ALL_STUDENTS, {students: state.students})
        } catch (e) {
            console.error(e)
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
