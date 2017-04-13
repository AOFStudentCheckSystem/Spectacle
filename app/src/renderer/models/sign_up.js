/**
 * Created by dummy on 4/8/17.
 */
import {EventGroup} from './event'

export class SignUpSheet {
    constructor (json) {
        this.id = json.id
        this.name = json.name
        this.status = json.status
        this.eventGroups = json.events.map((element) => new EventGroup(element))
    }

    newInstance () {
        return new SignUpSheetInstance(this)
    }

    instanceFrom (json) {
        const sheetInstance = this.newInstance()
        sheetInstance.form = this.eventGroups.reduce((acc, entry) => {
            acc[entry.id] = json['sheet'][entry.id]
            return acc
        }, {})
        return sheetInstance
    }
}

export class SignUpSheetInstance {
    constructor (sheet) {
        this.id = sheet.id
        this.name = sheet.name
        this.status = sheet.status
        this.form = sheet.eventGroups.reduce((acc, entry) => {
            acc[entry.id] = '-1'
            return acc
        }, {})
        this.rules = sheet.eventGroups.reduce((acc, entry) => {
            acc[entry.id] = [{ required: true, message: 'Please select one of the options', trigger: 'blur' }]
            return acc
        }, {})
    }
}

export const EMPTY_SIGN_UP_SHEET = new SignUpSheet({
    id: -1,
    name: '',
    status: -1,
    events: []
})

export const EMPTY_SIGN_UP_SHEET_INSTANCE = EMPTY_SIGN_UP_SHEET.newInstance()

