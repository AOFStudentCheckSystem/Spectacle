/**
* Created by dummy on 4/14/17.
*/
<style scoped>
  .sync {
    color: #000000;
  }

  .local {
    color: #4cd964;
  }

  .new {
    color: #ff3b30;
  }

  .active {
    color: #FFFFFF;
  }

  .active.sync {
    background-color: #007aff;
  }

  .active.local {
    background-color: #4cd964;
  }

  .active.new {
    background-color: #ff3b30;
  }

  .list-block {
    margin-top: 0 !important;
  }

  /*.remove-list-margin {*/
    /*margin: 0 !important;*/
  /*}*/
</style>

<style>
</style>

<template>
  <f7-page pull-to-refresh @ptr:refresh="onRefresh">
    <f7-navbar title="Event">
      <f7-nav-right>
        <!-- Add new VL item on click -->
        <f7-link @click="addNewItem">
          <f7-icon f7="add"></f7-icon>
        </f7-link>
      </f7-nav-right>
    </f7-navbar>
    <!--
      Searchbar to search thorugh VL Items
      List to search specified in "search-list" prop
    -->
    <f7-searchbar cancel-link="Cancel"
                  :params="{ searchList: '#search-list', searchIn: '.item-title, .badge'}"></f7-searchbar>

    <!-- This block will become visible when there is nothing found -->
    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>

    <!-- Search through this list -->
    <f7-list
            id="search-list"
            class="searchbar-found remove-list-margin"
            media-list
    >
      <f7-list-item media-item
                    v-for="e in mergedEvents" :title="e.name"
                    :subtitle="e.description || formatTime(e.time)"
                    :badge="e.status === 0 ? 'Future' : e.status === 1 ? 'Boarding' : 'Complete'"
                    :badge-color="e.status === 0 ? 'blue' : e.status === 1 ? 'red' : 'green'"
                    @click="onClick(e.id)"
                    class="item-link"
                    :class="classObjForEvent(e)"
      >
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import {ActivityEvent, LocalEvent} from '../../models/event'
    import {EventBusMixin} from '../../mixins/event-bus'
    import moment from 'moment'
    //    import CreatePopup from './CreatePopup.vue'

    export default {
//        components: {CreatePopup},
        mixins: [EventBusMixin],
        methods: {
            addNewItem () {
//                this.$refs['popup'].open()
                this.$publish(this.$channels.OPEN_EVENT_POPUP)
            },
            ...mapActions([
                'refreshEvents'
            ]),
            async pullCurrentEvent (id) {
                await this.$store.dispatch('pullCurrentEvent', {id})
            },
            onRefresh (event, done) {
                this.refreshEvents().then(() => {
                    done()
                    this.$forceUpdate()
                }).catch((e) => {
                    console.error(e)
                    done()
                })
            },
            onClick (id) {
                if (!this.currentEvent || this.currentEvent.id !== id) {
                    this.pullCurrentEvent(id).then(() => {
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            },
            classObjForEvent (event) {
                return {
                    'active': this.currentEvent ? this.currentEvent.id === event.id : false,
                    'new': event instanceof LocalEvent && !event.hasRemote,
                    'sync': (event instanceof ActivityEvent),
                    'local': event instanceof LocalEvent && event.hasRemote
                }
            },
            formatTime (time) {
                return moment(time).format('ddd, MMM Mo YYYY HH:mm')
            }
        },
        computed: {
            ...mapGetters([
                'mergedEvents',
                'currentEvent'
            ])
        },
        created () {
            this.refreshEvents()
        }// ,
//        watch: {
//            events (updated) {
//                console.log(updated)
//                this.$forceUpdate()
//            },
//            currentEvent (updated) {
//                console.log(updated)
//                this.$forceUpdate()
//            }
//        }
    }
</script>

