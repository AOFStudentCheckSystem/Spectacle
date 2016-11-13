import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'
import devices from './smartcard'

import App from './App'
import routes from './routes'

// import jquery from '../../node_modules/jquery/dist/jquery.min'
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/bootstrap/dist/js/bootstrap'
import '../../node_modules/font-awesome/css/font-awesome.css'

Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)
Vue.config.debug = true

const router = new Router({
  scrollBehavior: () => ({y: 0}),
  routes
})

const mixin = {
  beforeCreate () {
    let self = this
    devices.onActivated().then((event) => {
      self.$store.dispatch('setReaderStatus', { status: true })
      let device = event.device
      device.on('card-inserted', function (event) {
        let card = event.atr
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

/* eslint-disable no-new */
new Vue({
  mixins: [mixin],
  router,
  ...App
}).$mount('#app')

Vue.http.options.root = 'http://hn2.guardiantech.com.cn:57463/api'
delete Vue.http.headers['post']
delete Vue.http.headers['get']
