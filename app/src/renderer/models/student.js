/**
 * Created by dummy on 4/8/17.
 */
export class Student {
    constructor (json) {
        this.idNumber = json.idNumber
        this.lastName = json.account.lastName
        this.firstName = json.account.firstName
        this.preferredName = json.account.preferredName
        this.cardSecret = json.cardSecret
        this.email = json.account.email
        this.dirty = !!json.dirty
        this.cardSecretUpdate = !!json.cardSecretUpdate
    }
}
