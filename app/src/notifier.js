/**
 * Created by dummy on 11/14/16.
 */
import {store} from './main'
import {NotificationLevel} from './models/NotificationLevel'
import {Notification} from './models/Notification'

export default {
  info (title, text) {
    store.dispatch('pushNotification', { notification: new Notification(title, text, NotificationLevel.INFO) })
  },
  success (title, text) {
    store.dispatch('pushNotification', { notification: new Notification(title, text, NotificationLevel.SUCCESS) })
  },
  warning (title, text) {
    store.dispatch('pushNotification', { notification: new Notification(title, text, NotificationLevel.WARNING) })
  },
  danger (title, text) {
    store.dispatch('pushNotification', { notification: new Notification(title, text, NotificationLevel.DANGER) })
  }
}
