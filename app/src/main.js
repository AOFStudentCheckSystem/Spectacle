import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'
import Vuex from 'vuex'
import devices from './smartcard'
import {NotificationLevel} from './models/NotificationLevel'
import {Notification} from './models/Notification'

import App from './App'
import routes from './routes'
import storeParams from './vuex/store'

import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/bootstrap/dist/js/bootstrap'
import '../../node_modules/font-awesome/css/font-awesome.css'

Vue.use(Electron)
Vue.use(Router)
Vue.use(Resource)
Vue.config.debug = true

Vue.use(Vuex)

export const notifier = {
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

export const store = new Vuex.Store(storeParams)

const router = new Router({
  scrollBehavior: () => ({y: 0}),
  routes
})

const mixin = {
  created () {
    let self = this
    devices.onActivated().then((event) => {
      self.$store.dispatch('setReaderStatus', { status: true })
      let device = event.device
      device.on('card-inserted', function (event) {
        let card = event.card
        notifier.info('Card Inserted', card.getAtr())
        self.$store.dispatch('setAtr', { atr: card.getAtr() })
      })
      device.on('card-removed', function (event) {
        self.$store.dispatch('setAtr', { atr: '' })
      })
    })
    devices.onDeactivated().then((event) => {
      self.$store.dispatch('setReaderStatus', { status: false })
    })
  }
}

Vue.http.options.root = 'http://hn2.guardiantech.com.cn:57463/api'
delete Vue.http.headers['post']
delete Vue.http.headers['get']

/* eslint-disable no-new */
new Vue({
  el: '#app',
  mixins: [mixin],
  router,
  store,
  render: function (createElement) {
    return createElement('App')
  },
  components: { App }
})

