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
        this.id = json.eventId
        this.name = json.eventName
        this.time = new Date(json.eventTime).getTime()
        this.status = json.eventStatus
        this.description = json.eventDescription
        this.records = []
    }
}

export class ActivityEventRecord {
    constructor (json) {
        this.student = json.student
        this.event = new Event(json.event)
        this.signUpTime = json.signUpTime === -1 ? null : new Date(json.signUpTime).getTime()
        this.checkInTime = json.checkInTime === -1 ? null : new Date(json.checkInTime).getTime()
    }
}

export class LocalEvent {
    constructor (remoteEvent) {
        if (remoteEvent) {
            this.hasRemote = true
            this.dirty = false
            this.id = remoteEvent.id
            this.localId = remoteEvent.id
            this.name = remoteEvent.name
            this.time = remoteEvent.time
            this.status = remoteEvent.status
            this.description = remoteEvent.description
        } else {
            this.hasRemote = false
            this.dirty = true
            this.id = null
            this.localId = String(Math.random())
            this.name = ''
            this.time = new Date().getTime()
            this.status = 0
            this.description = ''
        }
        this.records = remoteEvent.records ? JSON.parse(JSON.stringify(remoteEvent.records)) : []
    }
}

// TODO match backend
