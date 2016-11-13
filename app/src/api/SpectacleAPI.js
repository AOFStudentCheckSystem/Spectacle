import {EventAPI} from './EventAPI'
import {StudentAPI} from './StudentAPI'
import {AuthAPI} from './AuthAPI'
/**
 * Created by dummy on 11/11/16.
 */
export default {
  event: new EventAPI(),
  student: new StudentAPI(),
  auth: new AuthAPI()
}
