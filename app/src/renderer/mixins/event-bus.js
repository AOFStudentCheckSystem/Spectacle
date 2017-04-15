/**
 * Created by dummy on 4/14/17.
 */
import $channels from './event-bus-types'

class Subscription {
    constructor (channel, uid) {
        this.channel = channel
        this.uid = uid
    }
}

class EventBus {
    constructor () {
        this.subscribers = {}
        this.anotherBestPracticeGloballyDefinedCounterTotallySafe = 0
    }

    subscribe (channel, callback) {
        const subscription = this.anotherBestPracticeGloballyDefinedCounterTotallySafe++
        if (this.subscribers[channel]) {
            this.subscribers[channel][subscription] = callback
        } else {
            const channelObj = {}
            channelObj[subscription] = callback
            this.subscribers[channel] = channelObj
        }
        return new Subscription(channel, subscription)
    }

    unsubscribe (subscription) {
        const channelSubscriptions = this.subscribers[subscription.channel]
        if (channelSubscriptions) {
            delete channelSubscriptions[subscription.uid]
            if (Object.keys(channelSubscriptions).length < 1) {
                delete this.subscribers[subscription.channel]
            }
        }
    }

    publish (channel, data) {
        const channelSubscriptions = this.subscribers[channel]
        if (channelSubscriptions) {
            Object.keys(channelSubscriptions).map((key) => channelSubscriptions[key]).forEach((value) => value(data))
        }
    }
}

const theBestPracticeGlobalEventBusVariable = new EventBus()

export const EventBusMixin = {
    methods: {
        $publish (channel, data) {
            theBestPracticeGlobalEventBusVariable.publish(channel, data)
        },
        $subscribe (channel, callback) {
            return theBestPracticeGlobalEventBusVariable.subscribe(channel, callback)
        },
        $unsubscribe (subscription) {
            theBestPracticeGlobalEventBusVariable.unsubscribe(subscription)
        }
    },
    computed: {
        $channels () {
            return $channels
        }
    }
}
