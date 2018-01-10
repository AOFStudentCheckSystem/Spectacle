export class Principal {
    constructor (type, identification) {
        this.type = type
        this.identification = identification
    }
}

export const PrincipalType = {
    USERNAME: 'USERNAME',
    EMAIL: 'EMAIL',
    PHONE: 'PHONE',
    IDNUMBER: 'IDNUMBER'
}

export class Credential {
    constructor (type, identification) {
        this.type = type
        this.secret = identification
    }
}

export const CredentialType = {
    PASSWORD: 'PASSWORD',
    TOTP: 'TOTP'
}
