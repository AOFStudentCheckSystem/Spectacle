/**
* Created by dummy on 11/13/16.
*/
<style scoped>
  .login-root {
    max-width: 320px;
  }
</style>

<template>
  <div class="container login-root" v-if="notAuthenticated">
    <div class="panel">
      <div class="panel-heading" align="center">
        <!--<p class="text-muted">Avon Old Farms Events System</p>-->
        <h3>Sign In</h3>
      </div>
      <div class="panel-body">
        <form v-on:submit.prevent="handleSubmit">
          <input type="text" v-model="username" class="form-control"
                 placeholder="username" required>
          <br>
          <input type="password" v-model="password" class="form-control"
                 placeholder="password" required>
          <br>
          <button type="submit" class="btn btn-block btn-primary" v-bind:class="{ 'btn-danger': error }">
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      handleSubmit (event) {
        let self = this
        this.$store.dispatch('setError', {error: false})
        this.$store.dispatch('authenticate', {
          username: this.username,
          password: this.password,
          callback () {
            self.$router.replace('/')
          }
        })
//        this.username = ''
        this.password = ''
      }
    },
    computed: {
      notAuthenticated () {
        return !this.$store.state.authentication.authenticated
      },
      error () {
        return this.$store.state.authentication.error
      }
    }
  }
</script>
