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
        try {
            await http.delete('student/card/' + student.idNumber)
            return new ActionResult({success: true, error: null})
        } catch (e) {
            return new ActionResult({success: false, error: 'unknown'})
        }
    },
    async bindCardWithStudent (student, cardSecret) {
        try {
            await http.put('/student/card/', {
                idNumber: student.idNumber,
                cardSecret: cardSecret
            })
            return new ActionResult({success: true, error: null})
        } catch (e) {
            return new ActionResult({success: false, error: 'unknown'})
        }
    },
    async pullStudent (id) {
        return new Student((await http.get('student/' + id)).data)
    }
}
