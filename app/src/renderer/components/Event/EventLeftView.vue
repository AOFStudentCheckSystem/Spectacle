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
    <!--<f7-searchbar cancel-link="Cancel"-->
                  <!--:params="{ customSearch: true }"-->
                  <!--@searchbar:search="onSearch"></f7-searchbar>-->

    <!-- Search Bar overlay-->
    <search-bar v-model="filter" @refresh="$refs['virtualscroller'].updateVisibleItems()" @overlayActive="overlayActive = $event"></search-bar>
    <search-bar-overlay :active="overlayActive"></search-bar-overlay>

    <!-- This block will become visible when there is nothing found -->
    <f7-list v-show="filteredEvents.length === 0">
      <f7-list-item title="No Events Available"></f7-list-item>
    </f7-list>

    <!-- Search through this list -->
    <!--<f7-list-->
    <!--id="search-list"-->
    <!--class="searchbar-found remove-list-margin"-->
    <!--media-list-->
    <!--&gt;-->
    <!--<f7-list-item-->
    <!--:badge="e.status === 0 ? 'Future' : e.status === 1 ? 'Boarding' : 'Complete'"-->
    <!--:badge-color="e.status === 0 ? 'blue' : e.status === 1 ? 'red' : 'green'"-->
    <!--@click="onClick(e.id)"-->
    <!--class="item-link"-->
    <!--:class="classObjForEvent(e)"-->
    <!--&gt;-->
    <!--</f7-list-item>-->
    <!--</f7-list>-->
    <virtual-scroller ref="virtualscroller" id="event-search-list" containerTag="ul" mainTag="div"
                      :class="['list-block', 'media-list', 'event-searchbar-found']"
                      :items="filteredEvents" :itemHeight="63" keyField="id" v-show="filteredEvents.length !== 0">
      <template scope="props">
        <li class="item-link" @click="onClick(props.item.id)" :class="classObjForEvent(props.item)"
            :key="props.itemKey">
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">{{props.item.name}}</div>
                <div class="item-after"><span class="badge"
                                              :class="props.item.status == 0 ? 'color-blue' : props.item.status === 1 ? 'color-red' : 'color-green'">
                  {{props.item.status == 0 ? 'Future' : props.item.status === 1 ? 'Boarding' : 'Complete'}}</span>
                </div>
              </div>
              <div class="item-subtitle">{{props.item.description || formatTime(props.item.time)}}</div>
            </div>
          </div>
        </li>
      </template>
    </virtual-scroller>
  </f7-page>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import {ActivityEvent, LocalEvent} from '../../models/event'
    import {EventBusMixin} from '../../mixins/event-bus'
    import moment from 'moment'
    import SearchBar from '../Master/SearchBar.vue'
    import SearchBarOverlay from '../Master/SearchBarOverlay.vue'
    //    import CreatePopup from './CreatePopup.vue'

    export default {
//        components: {CreatePopup},
        mixins: [EventBusMixin],
        components: {SearchBar, SearchBarOverlay},
        data () {
            return {
                filter: '',
                overlayActive: false
            }
        },
        methods: {
            addNewItem () {
//                this.$refs['popup'].open()
                this.$publish(this.$channels.OPEN_EVENT_POPUP)
            },
            ...mapActions([
                'refreshEvents',
                'syncLocalEvents'
            ]),
            async pullCurrentEvent (id) {
                await this.$store.dispatch('pullCurrentEvent', {id})
            },
            onRefresh (event, done) {
                this.syncLocalEvents().then(() => {
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
            ]),
            filteredEvents () {
                const filter = this.filter
                return this.filter === '' ? this.mergedEvents : this.mergedEvents.filter((event) => {
                    const status = (event.status === 0 ? 'Future' : event.status === 1 ? 'Boarding' : 'Complete')
                    return event.name.toLowerCase().includes(filter) || status.toLowerCase().includes(filter)
                })
            }
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

