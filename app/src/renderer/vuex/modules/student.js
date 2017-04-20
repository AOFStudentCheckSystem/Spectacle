/**
 * Created by dummy on 4/16/17.
 */
import * as types from '../mutation-types'
import api from '../../api/student'
import {Student} from '../../models/student'

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
    [types.PATCH_STUDENT] (state, {student, patch}) {
        if (patch.lastName) {
            student.lastName = patch.lastName
        }
        if (patch.firstName) {
            student.firstName = patch.firstName
        }
        if (patch.preferredName) {
            student.preferredName = patch.preferredName
        }
        if (patch.cardSecret !== null && patch.cardSecret !== undefined) {
            student.cardSecret = patch.cardSecret
        }
        if (patch.email) {
            student.email = patch.email
        }
        if (patch.dirty !== null && patch.dirty !== undefined) {
            student.dirty = patch.dirty
        }
        if (patch.cardSecretUpdate !== null && patch.cardSecretUpdate !== undefined) {
            student.cardSecretUpdate = patch.cardSecretUpdate
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
    cardSecretStudentMap (state, getters) {
        return getters.students.reduce((acc, student) => {
            const cardSecret = student.cardSecret
            if (cardSecret && cardSecret !== '') {
                acc[cardSecret] = student
            }
            return acc
        }, {})
    }
}

const actions = {
    async refreshStudents ({commit, rootState}) {
        if (!rootState.auth.offline) {
            commit(types.SET_ALL_STUDENTS, {students: await api.listAllStudents()})
        }
    },
    async pullCurrentStudent ({commit, dispatch, state, rootState}, {id}) {
        const cachedStudent = state.students.find((element) => element.idNumber === id)
        if (rootState.auth.offline) {
            commit(types.SET_CURRENT_STUDENT, {student: cachedStudent})
        } else {
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
                }
            } else {
                commit(types.SET_CURRENT_STUDENT, {student: await api.pullStudent(id)})
            }
        }
    },
    async clearCurrentStudent ({commit}) {
        commit(types.SET_CURRENT_STUDENT, {student: null})
    },
    async patchStudent ({commit, rootState}, {student, patch}) {
        if (rootState.auth.offline) {
            patch['dirty'] = true
            commit(types.PATCH_STUDENT, {student, patch})
        } else {
            const previousState = new Student(student)
            try {
                commit(types.PATCH_STUDENT, {student, patch})
                await api.editStudent(student, patch)
            } catch (e) {
                if (!e.response) {
                    patch['dirty'] = true
                    commit(types.PATCH_STUDENT, {student, patch})
                } else {
                    commit(types.PATCH_STUDENT, {student, patch: previousState})
                    console.error(e)
                }
            }
        }
    },
    async patchStudentCardSecret ({commit, rootState}, {student, cardSecret}) {
        if (rootState.auth.offline) {
            commit(types.PATCH_STUDENT, {student, patch: {cardSecret, cardSecretUpdate: true}})
        } else {
            const previousState = new Student(student)
            try {
                commit(types.PATCH_STUDENT, {student, patch: {cardSecret}})
                if (!((await api.clearRfid(student)).success)) {
                    commit(types.PATCH_STUDENT, {student, patch: previousState})
                    console.error('failed to clear', student)
                }
                if (cardSecret !== null && cardSecret !== undefined && cardSecret !== '') {
                    if (!((await api.bindCardWithStudent(student, cardSecret)).success)) {
                        commit(types.PATCH_STUDENT, {student, patch: previousState})
                        console.error('failed to bind', student)
                    }
                }
            } catch (e) {
                if (!e.response) {
                    commit(types.PATCH_STUDENT, {student, patch: {cardSecret, cardSecretUpdate: true}})
                } else {
                    commit(types.PATCH_STUDENT, {student, patch: previousState})
                    console.error(e)
                }
            }
        }
    },
    async syncAllStudents ({state, dispatch, rootState}) {
        if (!rootState.auth.offline) {
            const duplicateStudents = JSON.parse(JSON.stringify(state.students))
            for (const element of duplicateStudents) {
                try {
                    if (element.cardSecretUpdate) {
                        if (!((await api.clearRfid(element)).success)) {
                            console.error('failed to clear', element)
                        }
                        if (!((await api.bindCardWithStudent(element, element.cardSecret)).success)) {
                            console.error('failed to bind', element)
                        }
                        element.cardSecretUpdate = false
                    }
                    if (element.dirty) {
                        await api.editStudent(element, element)
                        element.dirty = false
                    }
                } catch (e) {
                    console.error('encountered an error whilst synchronizing', element, e)
                }
            }
            await dispatch('refreshStudents')
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
