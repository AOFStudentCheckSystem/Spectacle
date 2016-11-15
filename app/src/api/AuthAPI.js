/**
 * Created by dummy on 11/12/16.
 */
import Vue from 'vue'
import md5 from 'md5'

export class AuthAPI {
  /**
   * Authenticates with the server
   * @param username
   * @param password
   * @returns {Promise} resolve -> token, reject -> response
   */
  authenticate (username, password) {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', md5(password))
    return new Promise((resolve, reject) => {
      Vue.http.post('auth', formData).then((response) => {
        response.json().then((json) => {
          resolve(json.token)
        }, (failed) => {
          reject(failed)
        })
      }, (response) => {
        reject(response)
      })
    })
  }
}
