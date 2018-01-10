/**
 * Created by dummy on 4/8/17.
 */
import { http } from '../main'
import { EventPage } from '../models/event_page'
import {ActivityEvent} from '../models/event'
import {ActionResult} from '../models/result'

export default {
    async pagedEvents (page, size) {
        return (new EventPage((await http.get(`event/list?page=${page}&size=${size}&sort=eventTime,desc`)).data))
    },
    async listAllEvents () {
        return (await http.get('checkin/event/listall')).data.content.map((rawJson) => new ActivityEvent(rawJson))
        // return (new EventPage((await http.get(`event/list?page=${page}&size=${size}&sort=eventTime,desc`)).data))
    },
    async pullEvent (id) {
        return new ActivityEvent((await http.get('event/list/' + id)).data)
    },
    async createEvent (localEvent) {
        const result = (await http.post('event/create', localEvent)).data
        if (result.success) {
            return result.newEvent.eventId
        } else {
            return new ActionResult(result)
        }
    },
    async editEvent (localEvent, patch) {
        return new ActionResult((await http.post('event/edit', {
            eventId: localEvent.id,
            newTime: patch.time,
            newName: patch.name,
            newDescription: patch.description,
            newStatus: patch.status
        })).data)
    },
    async creditEvent (localEvent) {
        return new ActionResult((await http.post('event/credit', {
            eventId: localEvent.id,
            name: localEvent.name,
            time: localEvent.time,
            description: localEvent.description
        })).data)
    },
    async sendMail (eventId, emailAddress) {
        return new ActionResult((await http.post('event/sendmail', {
            eventId: eventId,
            address: emailAddress
        })).data)
    }
    // @RequestParam("eventId") eventID: String,
    // @RequestParam("newTime", required = false, defaultValue = "0") newTime: Long,
    // @RequestParam("newName", required = false, defaultValue = "") newName: String,
    // @RequestParam("newDescription", required = false, defaultValue = "") newDescription: String,
    // @RequestParam("newStatus", required = false, defaultValue = ""
}
