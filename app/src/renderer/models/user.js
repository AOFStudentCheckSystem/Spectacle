/**
 * Created by dummy on 4/8/17.
 */
import {Student} from './student'
export class UserToken {
    constructor (json) {
        this.token = json.token
        this.user = new User(json.user)
    }
}

export class User {
    constructor (json) {
        this.email = json.email
        this.userLevel = json.userLevel
        this.student = json.student ? new Student(json.student) : null
    }

    isAuthorized (level) {
        return this.userLevel >= level
    }
}
