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
        this.time = new Date(json.eventTime)
        this.status = json.eventStatus
        this.description = json.eventDescription
    }
}

export class ActivityEventRecord {
    constructor (json) {
        this.student = json.student
        this.event = new Event(json.event)
        this.signUpTime = json.signUpTime === -1 ? null : new Date(json.signUpTime)
        this.checkInTime = json.checkInTime === -1 ? null : new Date(json.checkInTime)
    }
}

// TODO match backend
