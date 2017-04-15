import Vue from 'vue'
import App from './App'
import Electron from 'vue-electron'

import Vuex from 'vuex'
import storeOptions from './vuex/store'

// Import F7
/* eslint-disable no-unused-vars */
import Framework7 from 'framework7'
// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue'
// Import F7 iOS Theme Styles
/* eslint-disable no-unused-vars */
import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css'
/* eslint-disable no-unused-vars */
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'
/* OR for Material Theme:
 import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
 import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'
 */
import './css/app.css'
import 'framework7-icons/css/framework7-icons.css'
import routerOptions from './routes'
import axios from 'axios'

Vue.use(Electron)

Vue.use(Framework7Vue)

export const http = axios.create({
    baseURL: process.env.SERVER_URL,
    headers: {
        Authorization: ''
    },
    transformRequest: [data => {
        // iView.LoadingBar.start()
        return data ? Object.keys(data).map(key => {
            return {key: key, value: data[key]}
        }).reduce((formData, entry) => {
            const value = entry.value
            switch (typeof value) {
                case 'object':
                    formData.append(entry.key, JSON.stringify(value))
                    break
                default:
                    formData.append(entry.key, value)
                    break
            }
            return formData
        }, new FormData()) : data
    }],
    transformResponse: [data => {
        // iView.LoadingBar.finish()
        return data ? JSON.parse(data) : data
    }]
})

Vue.use(Vuex)
export const store = new Vuex.Store(storeOptions)

Vue.config.debug = true

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { App },
    store,
    framework7: {
        root: '#app',
        /* Uncomment to enable Material theme: */
        // material: true,
        routes: routerOptions
    },
    render (h) {
        return h(App)
    }
})
