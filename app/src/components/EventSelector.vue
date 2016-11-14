/**
* Created by dummy on 11/13/16.
*/
<style scoped>
  .list-group-item {
    text-align: left;
  }

  .list-group {
    max-height: 60vh;
    overflow-y: auto;
  }

  .list-group::-webkit-scrollbar {
    display: none;
  }

  .event-status {
    float: right;
    font-size: 1em;
  }

  .planned {
    color: dodgerblue;
  }

  .boarding {
    color: darkorange;
  }

  .no-active {
    padding-bottom: 20vh;
  }
</style>

<template>
  <div class="container" style="max-width: 700px;">
    <div class="row">
      <div class="col-xs-12 event-list">
        <div class="list-group">
          <a class="list-group-item" v-for="e in eventList" v-bind:key="e.id" v-on:click="onClickEvent(e.id)"
             v-bind:class="{ 'active': active === e.id }">
            <h4 class="list-group-item-heading">{{e.name}}</h4>
            <a class="event-status" v-bind:class="{ 'planned': e.status.value === -1, 'boarding': e.status.value === 0 }">{{e.status.text}}</a>
            <p class="list-group-item-text">{{new Date( e.time * 1000 ).toString()}} {{e.id}}</p>
          </a>
        </div>
      </div>
    </div>
    <h2 v-if="eventList.length < 1" class="no-active">No Active Events</h2>
    <div class="row">
      <div class="col-xs-6">
        <button class="btn btn-danger btn-block" v-bind:class="{ 'disabled': active === '' }" v-on:click="onComplete">Complete Event</button>
      </div>
      <div class="col-xs-6">
        <button class="btn btn-primary btn-block" v-bind:class="{ 'disabled': active === '' }">Continue</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        active: ''
      }
    },
    methods: {
      onClickEvent (event) {
        if (this.active === event) {
          this.active = ''
        } else {
          this.active = event
        }
      },
      onComplete () {
        if (this.active !== '') {
          this.$store.dispatch('completeEvent', { id: this.active })
        }
      }
    },
    computed: {
      eventList () {
        return this.$store.getters.activeEvents
      }
    },
    created () {
      this.$store.dispatch('refreshEvents')
    }
  }
</script>
