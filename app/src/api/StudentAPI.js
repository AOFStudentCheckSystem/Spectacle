/**
 * Created by dummy on 11/11/16.
 */
import Vue from 'vue'

export class StudentAPI {
  /**
   * Geta all the students and their respective info
   * @returns {Promise} returns an array of students if success
   */
  all () {
    return new Promise((resolve, reject) => {
      Vue.http.get('student/all').then((response) => {
        response.json().then((json) => {
          resolve(json.students)
        }, (failed) => {
          reject(failed)
        })
      }, (response) => {
        reject(response)
      })
    })
  }

  getImage (id) {
    return new Promise((resolve, reject) => {
      Vue.http.get('student/' + id + '/image').then((response) => {
        response.blob().then((blob) => {
          const reader = new window.FileReader()
          reader.readAsDataURL(blob)
          reader.onloadend = function () {
            let base64data = reader.result
            resolve(base64data)
          }
        }, (failed) => {
          reject(failed)
        })
      }, (response) => {
        reject(response)
      })
    })
  }

  updateStudent (id, rfid) {
    const update = new FormData()
    update.append('rfid', rfid)
    return new Promise((resolve, reject) => {
      Vue.http.post('student/' + id + '/update', update).then((response) => {
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
