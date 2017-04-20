/**
 * Created by dummy on 4/16/17.
 */
import {http, rawHttp} from '../main'
import {ActivityEventRecord} from '../models/event'

export default {
    async getRecords (id) {
        return (await http.get('checkin/record/' + id)).data.records
            .map((json) => new ActivityEventRecord(json))
    },
    async submitRecords (event, records) {
        const result = (await rawHttp.put('checkin/submit', {
            targetEvent: event.id,
            recordsToUpload: records.map((recordObj) => {
                return {
                    studentId: recordObj.student.idNumber,
                    timestamp: recordObj.checkInTime
                }
            })
        })).data
        return Number(result.totalRecordsReceived) === records.length
    }
}
