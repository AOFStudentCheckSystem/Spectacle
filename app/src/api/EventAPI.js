/**
 * Created by dummy on 11/11/16.
 */
import Vue from 'vue'

export class EventAPI {
  all () {
    return new Promise((resolve, reject) => {
      Vue.http.get('event/list').then((response) => {
        response.json().then((fulfilled) => {
          resolve(fulfilled.events)
        }, (failed) => {
          reject(response)
        })
      }, (response) => {
        reject(response)
      })
    })
  }

  getDetail (id) {
    return new Promise((resolve, reject) => {
      Vue.http.get('event/' + id + '/detail').then((response) => {
        response.json().then((fulfilled) => {
          resolve(fulfilled.students)
        }, (failed) => {
          reject(failed)
        })
      }, (response) => {
        reject(response)
      })
    })
  }

  addEvent (name) {
    return new Promise((resolve, reject) => {
      Vue.http.get('event/add').then((response) => {
        response.json().then((fulfilled) => {
          resolve(fulfilled.eventId)
        }, (failed) => {
          reject(failed)
        })
      }, (response) => {
        reject(response)
      })
    })
  }

  deleteEvent (id) {
    return new Promise((resolve, reject) => {
      Vue.http.post('event/' + id + '/delete').then((response) => {
        if (response.ok) {
          resolve()
        } else {
          reject(response)
        }
      }, (response) => {
        reject(response)
      })
    })
  }

  addStudent (eventId, eventRecord) {
    return new Promise((resolve, reject) => {
      Vue.http.post('event/' + eventId + '/add', {
        params: {
          add: [{
            id: eventRecord.id,
            checkin: eventRecord.inTime,
            checkout: eventRecord.outTime
          }]
        }
      }).then((response) => {
        if (response.ok) {
          resolve()
        } else {
          reject(response)
        }
      }, (response) => {
        reject(response)
      })
    })
  }

  removeStudent (eventId, id) {
    return new Promise((resolve, reject) => {
      Vue.http.post('event/' + eventId + '/remove', {
        params: {
          remove: [id]
        }
      }).then((response) => {
        if (response.ok) {
          resolve()
        } else {
          reject(response)
        }
      }, (response) => {
        reject(response)
      })
    })
  }

  complete (eventId) {
    return new Promise((resolve, reject) => {
      Vue.http.post('event/' + eventId + '/complete').then((response) => {
        if (response.ok) {
          resolve()
        } else {
          reject(response)
        }
      }, (response) => {
        reject(response)
      })
    })
  }
}
