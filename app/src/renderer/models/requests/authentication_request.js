// import {} from '../auth'

import {Credential, CredentialType, Principal, PrincipalType} from '../auth'

export class AuthenticationRequest {
    constructor (username, password) {
        this.principal = new Principal(
            PrincipalType.USERNAME, // TODO implement auto principal detection
            username
        )

        this.credential = new Credential(
            CredentialType.PASSWORD,
            password
        )
    }
}
