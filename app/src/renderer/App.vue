<template>
  <div id="app">
    <f7-statusbar></f7-statusbar>
    <layout></layout>
    <authentication-panel id="login-screen"></authentication-panel>
  </div>
</template>

<script>
    import AuthenticationPanel from './components/Authentication/AuthenticationPanel.vue'
    import Layout from './components/Master/Layout.vue'
    export default {
        components: {AuthenticationPanel, Layout}
    }
</script>

<style>
  body {
    -webkit-user-select: none;
    -webkit-app-region: no-drag;
  }
</style>

<style scoped>
  .nav-bar {
    -webkit-app-region: drag;
  }
</style>
