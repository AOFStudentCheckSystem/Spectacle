/**
 * Created by dummy on 4/3/17.
 */
import * as hexify from 'hexify'

export class SmartCardController {
    constructor() {
        this.__internal = new SmartCardInternal()
    }

    /**
     * callback with reader as the first parameter
     * @param callback
     * @returns () unsubscribe function
     */
    onConnect(callback) {
        const callbackId = this.__internal.addConnectCallback(callback)
        const self = this
        return () => self.removeConnectCallback(callbackId)
    }

    /**
     * callback with an error as the first parameter
     * @param callback
     * @returns () unsubscribe function
     */
    onError(callback) {
        const callbackId = this.__internal.addErrorCallback(callback)
        const self = this
        return () => self.removeErrorCallback(callbackId)
    }

    /**
     * frees up resources, make sure you clean up!
     */
    close() {
        this.__internal.close()
    }

    removeConnectCallback(id) {
        this.__internal.removeConnectCallback(id)
    }

    removeErrorCallback(id) {
        this.__internal.removeErrorCallback(id)
    }
}

class SmartCardInternal {
    constructor() {
        this.callbackId = 0
        this.connectCallbacks = {}
        this.errorCallbacks = {}
        this.readers = {}

        const pcsclite = require('@codetector/pcsclite')
        const pcsc = pcsclite()

        const self = this
        pcsc.on('reader', function (reader) {
            console.log('New reader detected', reader.name)
            const smartCardReader = new Reader(reader.name, reader)
            self.readers[reader.name] = smartCardReader
            Object.values(self.connectCallbacks).forEach(e => e(smartCardReader))
        })

        pcsc.on('error', function (err) {
            console.log('PCSC error', err.message)
            Object.values(self.errorCallbacks).forEach(e => e(err))
        })

        this.pcsc = pcsc
    }

    addConnectCallback(callback) {
        this.connectCallbacks[this.callbackId++] = callback
        return this.callbackId
    }

    addErrorCallback(callback) {
        this.errorCallbacks[this.callbackId++] = callback
        return this.callbackId
    }

    close() {
        this.pcsc.close()
    }

    removeConnectCallback(id) {
        delete this.connectCallbacks[id]
    }

    removeErrorCallback(id) {
        delete this.errorCallbacks[id]
    }
}

export class Reader {
    constructor(name, pcscliteReader) {
        this.name = name
        this.__internal = new ReaderInternal(pcscliteReader)
    }

    /**
     * adds a insert callback
     * @param callback
     * @returns insert callback id
     */
    onInsert(callback) {
        return this.__internal.addInsertCallback(callback)
    }

    /**
     * adds a insert callback
     * @param callback
     * @returns remove callback id
     */
    onEmpty(callback) {
        return this.__internal.addEmptyCallback(callback)
    }

    /**
     * adds a insert callback
     * @param callback
     * @returns error callback id
     */
    onError(callback) {
        return this.__internal.addErrorCallback(callback)
    }

    /**
     * adds a reader disconnect callback
     * @param callback
     * @returns end callback id
     */
    onEnd(callback) {
        return this.__internal.addEndCallback(callback)
    }

    /**
     * frees up resources, make sure to do this!
     */
    close() {
        this.__internal.close()
    }
}

class ReaderInternal {
    constructor(pcscliteReader) {
        this.callbackId = 0
        this.insertCallbacks = {}
        this.emptyCallbacks = {}
        this.errorCallbacks = {}
        this.endCallbacks = {}

        const self = this
        pcscliteReader.on('error', function (err) {
            console.debug('[ERROR] Reader(', this.name, '):', err.message)
            Object.values(self.errorCallbacks).forEach((e) => e(err))
        })

        pcscliteReader.on('status', function (status) {
            console.debug('[INFO] Reader(', this.name, '):', status)
            /* check what has changed */
            const changes = this.state ^ status.state
            if (changes) {
                if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                    console.debug('card empty')
                    /* card removed */
                    pcscliteReader.disconnect(pcscliteReader.SCARD_LEAVE_CARD, function (err) {
                        if (err) {
                            console.debug(err)
                            Object.values(self.errorCallbacks).forEach((e) => e(err))
                        } else {
                            console.debug('emptied')
                            Object.values(self.emptyCallbacks).forEach((e) => e())
                        }
                    })
                } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                    console.debug('card inserted', status)
                    /* card inserted */
                    const card = new Card(2, status.atr.toString('hex'))
                    Object.values(self.insertCallbacks).forEach((e) => e(card))
                    // pcscliteReader.connect({share_mode: this.SCARD_SHARE_SHARED}, function (err, protocol) {
                    //     if (err) {
                    //         console.debug(err)
                    //         // Object.values(self.errorCallbacks).forEach((e) => e(err))
                    //         const card = new Card(2, status.atr.toString('hex'))
                    //         console.debug('[INFO!] Card(', card.protocol, card.atr, '): Inserted ')
                    //     } else {
                    //         const card = new Card(protocol, status.atr.toString('hex'))
                    //         console.debug('[INFO] Card(', card.protocol, card.atr, '): Inserted ')
                    //         Object.values(self.insertCallbacks).forEach((e) => e(card))
                    //     }
                    // })
                }
            }
        })

        pcscliteReader.on('end', function () {
            console.debug('[INFO] Reader(', pcscliteReader.name, '):', 'removed')
            Object.values(self.endCallbacks).forEach((e) => e())
            pcscliteReader.close()
        })

        this.internalReader = pcscliteReader
    }

    addInsertCallback(callback) {
        this.insertCallbacks[this.callbackId++] = callback
        return this.callbackId
    }

    addEmptyCallback(callback) {
        this.emptyCallbacks[this.callbackId++] = callback
        return this.callbackId
    }

    addErrorCallback(callback) {
        this.errorCallbacks[this.callbackId++] = callback
        return this.callbackId
    }

    addEndCallback(callback) {
        this.endCallbacks[this.callbackId++] = callback
        return this.callbackId
    }

    async transmit(card, apduCommand) {
        let buffer

        if (Array.isArray(apduCommand)) {
            buffer = new Buffer(apduCommand)
        } else if (typeof apduCommand === 'string') {
            buffer = new Buffer(hexify.toByteArray(apduCommand))
        } else if (Buffer.isBuffer(apduCommand)) {
            buffer = apduCommand
        } else if (typeof apduCommand === 'string') {
            buffer = new Buffer(hexify.toByteArray(apduCommand))
        } else {
            buffer = apduCommand.toBuffer()
        }

        return new Promise((resolve, reject) => {
            this.internalReader.transmit(buffer, 0xFF, card.protocol, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    console.log('Data received', data)
                    resolve(data)
                }
            })
        })
    }

    close() {
        console.debug('[INFO] Reader(', this.internalReader.name, '):', 'removed')
        Object.values(this.endCallbacks).forEach((e) => e())
        this.internalReader.close()
    }
}

export class Card {
    constructor(protocol, atr) {
        this.protocol = protocol
        this.atr = atr
    }
}
