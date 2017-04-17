/**
 * Created by dummy on 4/16/17.
 */
import { http } from '../main'
import {Student} from '../models/student'
import {ActionResult} from '../models/result'

export default {
    async listAllStudents () {
        return (await http.get('student/listall')).data.map((rawJson) => new Student(rawJson))
    },
    async editStudent (student, patch) {
        return new ActionResult((await http.post('student/edit', Object.assign({
            idNumber: student.idNumber
        }, patch))).data)
    },
    async clearRfid (student) {
        return new ActionResult((await http.post('student/edit/clear-card', {
            studentId: student.idNumber
        })).data)
    },
    async bindCardWithStudent (student) {
        return new ActionResult((await http.post('student/edit/bind-card', {
            studentId: student.idNumber,
            cardSecret: student.cardSecret
        })).data)
    },
    async pullStudent (id) {
        return new Student((await http.get('student/list/' + id)).data)
    }
}
