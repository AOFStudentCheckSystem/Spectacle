/**
* Created by dummy on 4/14/17.
*/
<style scoped>

</style>

<template>
  <div>
    <f7-navbar title="Events">
      <f7-nav-right>
        <!-- Add new VL item on click -->
        <f7-link @click="onAdd"><f7-icon f7="add"></f7-icon></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-page>
      this is the event left view
    </f7-page>
  </div>
</template>

<script>
    export default {
        methods: {
            onAdd () {
            }
        }
    }
</script>

