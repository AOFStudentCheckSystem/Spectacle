import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'

import App from './App'
import routes from './routes'

Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)
Vue.config.debug = true

const router = new Router({
    scrollBehavior: () => ({y: 0}),
    routes
})

Vue.http.options.root = 'http://hn2.guardiantech.com.cn:10492/v2/api'

/* eslint-disable no-new */
new Vue({
    router,
    ...App
}).$mount('#app')
