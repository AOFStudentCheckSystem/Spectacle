/**
 * Created by dummy on 4/8/17.
 */
import {ActivityEvent} from './event'

export class EventPage {
    constructor (json) {
        this.events = json.content.map((event) => new ActivityEvent(event))
        this.page = json.number
        this.totalPages = json.totalPages
        this.last = json.last
        this.first = json.first
        this.size = json.size
    }
}

export const EMPTY_PAGE = new EventPage({
    content: [],
    page: 0,
    totalPages: 0,
    last: true,
    first: true,
    size: 0
})
