<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  * {
    /*margin: 0;*/
    padding: 0;
  }

  *:focus {
    outline: none !important;
  }

  *::-webkit-scrollbar {
    display: none;
  }

  html,
  body {
    height: 100%;
  }

  body {
    overflow: hidden;
    -webkit-user-select: none;
    align-items: center;
    background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 1) 0%,
            rgba(229, 229, 229, .85) 100%
    ), center;
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    text-align: center;
  }

  .navbar-center {
    display: inline-block;
    float: none;
    vertical-align: top;
    text-align: center;
  }

  .navbar {
    -webkit-app-region: drag;
  }

  .navbar-header {
    -webkit-app-region: no-drag;
  }

  .navbar-nav {
    -webkit-app-region: no-drag;
  }

  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(100px, 0);
    transform: translate(100px, 0);
    transition: opacity .2s ease;
  }

  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-100px, 0);
    transform: translate(-100px, 0);
    transition: opacity .2s ease;
  }

  .child-transition {
    transition: all .4s ease; /* cubic-bezier(.55, 0, .1, 1) */
  }

  .main-view {
    padding-top: 100px;
  }
</style>

<template>
  <div>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <a class="navbar-center navbar-brand">Spectacle</a>
      <div class="container-fluid">
        <div class="navbar-header">
          <div class="navbar-brand" v-show="backEnabled" v-on:click="back()">
            <i class="fa fa-arrow-left" aria-hidden="true"></i>
            Back
          </div>
        </div>
        <ul class="nav navbar-nav navbar-right collapse navbar-collapse" v-on:click="signOut()">
          <li><a class="navbar-brand">{{ signInStatus }}</a></li>
        </ul>
      </div>
    </nav>
    <transition :name="transitionName" mode="out-in">
      <router-view class="child-transition main-view"></router-view>
    </transition>
    <global-notifications class="hidden-xs"></global-notifications>
  </div>
</template>

<script>
  import GlobalNotifications from './components/GlobalNotifications'

  export default {
    components: {
      GlobalNotifications
    },
    data () {
      return {
        transitionName: 'slide-left',
        backEnabled: false
      }
    },
    methods: {
      signOut () {
        if (this.$store.state.authentication.authenticated) {
          this.$store.dispatch('signOut')
          this.$router.replace('/portal')
        }
      },
      back () {
        this.$router.go(-1)
      }
    },
    computed: {
      signInStatus () {
        return this.authenticated ? 'Sign Out' : ''
      },
      authenticated () {
        return this.$store.state.authentication.authenticated
      }
    },
    created () {
      if (!this.authenticated) {
        this.$router.replace('/portal')
      }
      let self = this
      this.$router.beforeEach((to, from, next) => {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        self.transitionName = toDepth < fromDepth ? 'slide-right' : to.path.length < 2 ? 'slide-right' : 'slide-left'
        self.backEnabled = !(to.path.length < 2 || to.path === '/portal')
        next()
      })
    }
  }
</script>
