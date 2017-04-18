/**
 * Created by dummy on 4/8/17.
 */
export class EventGroup {
    constructor (json) {
        this.id = json.id
        this.name = json.name
        this.events = json.events.map((element) => new ActivityEvent(element))
    }
}

export class ActivityEvent {
    constructor (json) {
        this.id = json.id === 0 ? json.id : json.id || json.eventId
        this.name = json.name || json.eventName
        this.time = new Date(json.time === 0 ? json.time : json.time || json.eventTime).getTime()
        this.status = json.status === 0 ? json.status : json.status || json.eventStatus
        this.description = json.description || json.eventDescription
        this.records = json.records ? json.records.map((rawRecords) => new ActivityEventRecord(rawRecords)) : []
    }
}

export class ActivityEventRecord {
    constructor (json) {
        this.student = json.student
        // this.event = new Event(json.event)
        this.signUpTime = json.signUpTime === -1 ? -1 : new Date(json.signUpTime).getTime()
        this.checkInTime = json.checkInTime === -1 ? -1 : new Date(json.checkInTime).getTime()
    }
}

export class LocalEvent {
    constructor (remoteEvent) {
        if (remoteEvent) {
            this.hasRemote = remoteEvent.hasRemote === false ? remoteEvent.hasRemote : remoteEvent.hasRemote || true
            this.dirty = !!remoteEvent.dirty
            this.id = remoteEvent.id
            this.localId = remoteEvent.localId === 0 ? remoteEvent.localId : remoteEvent.localId || remoteEvent.id
            this.name = remoteEvent.name
            this.time = remoteEvent.time
            this.status = remoteEvent.status
            this.description = remoteEvent.description
            this.records = remoteEvent.records ? JSON.parse(JSON.stringify(remoteEvent.records)) : []
        } else {
            this.hasRemote = false
            this.dirty = true
            this.id = null
            this.localId = String(Math.random())
            this.name = ''
            this.time = new Date().getTime()
            this.status = 0
            this.description = ''
            this.records = []
        }
    }
}

// TODO match backend
