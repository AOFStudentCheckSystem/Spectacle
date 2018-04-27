/**
 * Created by dummy on 4/8/17.
 */
import {http} from '../main'
import {EventPage} from '../models/event_page'
import {ActivityEvent} from '../models/event'
import {ActionResult} from '../models/result'
import moment from 'moment'

export default {
    async pagedEvents (page, size) {
        return (new EventPage((await http.get(`event/list?page=${page}&size=${size}&sort=eventTime,desc`)).data))
    },
    async listAllEvents () {
        return (await http.get('checkin/event/listall')).data.map((rawJson) => new ActivityEvent(rawJson))
        // return (new EventPage((await http.get(`event/list?page=${page}&size=${size}&sort=eventTime,desc`)).data))
    },
    async pullEvent (id) {
        return new ActivityEvent((await http.get('/checkin/event/' + id)).data)
    },
    async createEvent (localEvent) {
        // Transform Local Event Into an acceptable event creation request.

        let remoteEvent = {
            name: localEvent.name,
            status: localEvent.status,
            time: moment(localEvent.time).unix(),
            description: localEvent.description
        }

        try {
            const result = (await http.put('/checkin/event/', remoteEvent)).data
            return result.eventId
        } catch (e) {
            return new ActionResult({success: false, error: e})
        }
    },
    async editEvent (localEvent, patch) {
        return new ActionResult((await http.post('/checkin/event/', {
            eventId: localEvent.id,
            time: patch.time,
            name: patch.name,
            description: patch.description,
            status: patch.status
        })).data)
    },
    // async creditEvent (localEvent) {
    //     return new ActionResult((await http.post('event/credit', {
    //         eventId: localEvent.id,
    //         name: localEvent.name,
    //         time: localEvent.time,
    //         description: localEvent.description
    //     })).data)
    // },
    async sendMail (eventId, emailAddress) {
        return (await http.post('/checkin/event/sendmail', {
            eventId: eventId,
            address: emailAddress
        }).data)
    }
    // @RequestParam("eventId") eventID: String,
    // @RequestParam("newTime", required = false, defaultValue = "0") newTime: Long,
    // @RequestParam("newName", required = false, defaultValue = "") newName: String,
    // @RequestParam("newDescription", required = false, defaultValue = "") newDescription: String,
    // @RequestParam("newStatus", required = false, defaultValue = ""
}
