<template>
  <div id="app">
    <!--<f7-statusbar></f7-statusbar>-->
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
  #app {
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
  }
  body {
    -webkit-user-select: none;
    -webkit-app-region: no-drag;
  }
  .webkit-draggable {
    -webkit-app-region: drag;
  }
</style>

<style scoped>

</style>
