/**
* Created by dummy on 11/13/16.
*/
<style scoped>
  .notification-list {
    position: absolute;
    right: 30px;
    bottom: 10px;
    z-index: 1000;
    vertical-align: text-bottom;
    pointer-events: none;
  }

  .notification-list-item {
    text-align: left;
    transition: all 0.5s;
  }

  .notification-list-enter {
    opacity: 0;
    transform: translateY(10px); /* translate(0, 10px); */
  }

  .notification-list-leave-active {
    opacity: 0;
    transform: translateY(-10px); /* translate(0, -10px); */
  }
</style>

<template>
  <div class="container">
    <div class="notification-list col-sm-4">
      <transition-group name="notification-list">
        <div class="alert notification-list-item" v-for="n in notifications" role="alert" v-bind:class="n.level.styles"
             v-bind:key="n">
          <strong>{{n.title}}</strong> {{n.text}}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      notifications () {
        return this.$store.getters.notifications
      }
    }
  }
</script>

