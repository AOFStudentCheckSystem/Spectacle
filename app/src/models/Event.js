import {EventStatus} from './EventStatus'
/**
 * Created by dummy on 11/10/16.
 */
export class Event {
  constructor (id, name, time, status) {
    switch (status) {
      case -1:
        this.status = EventStatus.OFFLINE
        break
      case 0:
        this.status = EventStatus.PLANNED
        break
      case 1:
        this.status = EventStatus.BOARDING
        break
      case 2:
        this.status = EventStatus.COMPLETE
        break
    }
    this.id = id
    this.name = name
    this.time = time
    this.records = {}
  }
}

export const blankEvent = new Event('', '', 0, -1)
