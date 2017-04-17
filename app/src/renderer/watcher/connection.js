/**
 * Created by dummy on 4/16/17.
 */
export class ConnectionWatcher {

    /**
     *
     * @param request returns true or false
     */
    constructor (request) {
        this.request = request
        this.intervalId = window.setInterval(() => {
            request()
        }, 1000)
    }

    stop () {
        window.clearInterval(this.intervalId)
    }
}
