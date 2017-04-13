/**
 * Created by dummy on 4/8/17.
 */
export class Student {
    constructor (json) {
        this.idNumber = json.idNumber
        this.lastName = json.lastName
        this.firstName = json.firstName
        this.preferredName = json.preferredName
        this.cardSecret = json.cardSecret
    }
}
