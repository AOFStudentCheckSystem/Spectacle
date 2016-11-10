<style scoped>
  img {
    margin-top: -25px;
    width: 450px;
  }
</style>

<template>
  <div>
    <img src="./LandingPageView/assets/logo.png" alt="electron-vue">
    <h1>Welcome, dumb ass</h1>
    <h1>{{card}}</h1>
    <current-page></current-page>
    <versions></versions>
    <links></links>
  </div>
</template>

<script>
  import CurrentPage from './LandingPageView/CurrentPage'
  import Links from './LandingPageView/Links'
  import Versions from './LandingPageView/Versions'
  import devices from '../smartcard'

  export default {
    data () {
      return {
        card: 'No Reader'
      }
    },
    components: {
      CurrentPage,
      Links,
      Versions
    },
    name: 'landing-page',
    beforeCreate () {
      let self = this
      console.log('Landing')
      devices.onActivated().then((event) => {
        self.card = 'No Card'
        let device = event.device
        device.on('card-inserted', function (event) {
          let card = event.card
          self.card = card.getAtr()
        })
        device.on('card-removed', function (event) {
          self.card = 'No Card'
        })
      })
      devices.onDeactivated().then((event) => {
        self.card = 'No Reader'
      })
    }
  }
</script>
