/**
 * Created by dummy on 4/8/17.
 */
export class ActionResult {
    constructor (json) {
        this.success = json.success
        this.error = json.error
    }
}
