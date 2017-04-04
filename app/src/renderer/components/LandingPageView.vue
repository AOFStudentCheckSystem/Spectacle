<template>
  <div>
    <img src="./LandingPageView/assets/logo.png" alt="electron-vue">
    <h1>Welcome.</h1>
    <h2>{{reader}}</h2>
    <current-page></current-page>
    <versions></versions>
    <links></links>
  </div>
</template>

<script>
    import CurrentPage from './LandingPageView/CurrentPage'
    import Links from './LandingPageView/Links'
    import Versions from './LandingPageView/Versions'
    import { SmartCardController } from 'smartcard'
    import { AuthAPI } from '../api/auth'

    export default {
        components: {
            CurrentPage,
            Links,
            Versions
        },
        name: 'landing-page',
        data () {
            return {
                smartcard: new SmartCardController(),
                reader: ''
            }
        },
        async created () {
            const self = this
            this.smartcard.onConnect(reader => {
                reader.onInsert(data => {
                    self.reader = data
                })
                reader.onRemove(() => {
                    self.reader = ''
                })
            })
            console.log(await AuthAPI.login('someuser', 'somepassword'))
        },
        beforeDestroy () {
            this.smartcard.close()
        }
    }
</script>

<style scoped>
  img {
    margin-top: -25px;
    width: 450px;
  }
</style>
