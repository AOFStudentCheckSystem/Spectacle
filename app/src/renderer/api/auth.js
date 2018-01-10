/**
 * Created by dummy on 4/8/17.
 */
import {http} from '../main'
import {AuthenticationRequest} from '../models/requests/authentication_request'
import {UserToken} from '../models/user'
import {ActionResult} from '../models/result'

export default {
    async authenticate (email, password) {
        return new UserToken((await http.post('auth/auth', new AuthenticationRequest(email, password))).data)
    },
    async register (email, password) {
        return new ActionResult((await http.post('auth/register', { email, password })).data)
    },
    async signOut () {
        await http.post('auth/logout')
    },
    async verify () {
        return new UserToken((await http.post('auth/auth')).data)
    },
    async verifyWithToken (tokenString) {
        return new UserToken((await http.get('auth/verify', {
            headers: {
                Authorization: tokenString
            }
        })).data)
    }
}
