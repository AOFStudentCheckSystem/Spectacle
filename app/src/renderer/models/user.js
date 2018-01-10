/**
 * Created by dummy on 4/8/17.
 */
import {Student} from './student'
export class UserToken {
    constructor (json) {
        this.sessionKey = json.sessionKey
        // this.subject = new Subject(json.subject)
        this.permissions = json.permissions
        // this.authenticatedFactors = json.authenticatedFactors
    }

    isAuthorized (permission) {
        return this.token !== null // TODO: Actually check for permission... Humm. Ikr
    }
}

export class Subject {
    constructor (json) {
        this.email = json.email
        this.userLevel = json.userLevel
        this.student = json.student ? new Student(json.student) : null
    }

}
