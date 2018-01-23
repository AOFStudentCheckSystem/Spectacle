/**
 * Created by dummy on 4/8/17.
 */
export class Student {
    constructor (json) {
        this.idNumber = json.idNumber
        this.cardSecret = json.cardSecret
        this.account = new Account(json.account)
        this.dirty = !!json.dirty
        this.cardSecretUpdate = !!json.cardSecretUpdate
    }
    get lastName () {
        return this.account.lastName
    }
    get firstName () {
        return this.account.firstName
    }
    get email () {
        return this.account.email
    }
    get preferredName () {
        return this.account.preferredName
    }
}

export class Account {
    constructor (json) {
        this.lastName = json.lastName
        this.firstName = json.firstName
        this.email = json.email
        this.preferredName = json.preferredName
    }
}
