/**
 * Created by dummy on 4/4/17.
 */
import Vue from 'vue'
export class AuthAPI {
    static async login (username, password) {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        try {
            return await (await Vue.http.post('auth', formData)).json()
        } catch (e) {
            console.error(e)
        }
    }
}
