/**
* Created by dummy on 4/14/17.
*/
<style scoped>
  .remove-list-margin {
    margin: 0 !important;
  }
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
  .active, .sync {
    background-color: #007aff;
  }
  .active, .local {
    background-color: #4cd964;
  }
  .active, .new {
    background-color: #ff3b30;
  }
  /* TODO make this work! actually display the color */
</style>

<style>
  .list-block {
    margin: 0 !important;
  }
</style>

<template>
  <f7-page pull-to-refresh @ptr:refresh="onRefresh">
    <!--
      Searchbar to search thorugh VL Items
      List to search specified in "search-list" prop
    -->
    <f7-searchbar cancel-link="Cancel" search-list="#search-list"></f7-searchbar>

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
      <f7-list>
        <f7-list-item media-item
                      v-for="e in mergedEvents" swipeout :title="e.name"
                      :subtitle="e.description || 'Event'"
                      :badge="e.status === 0 ? 'Future' : e.status === 1 ? 'Boarding' : 'Complete'"
                      :badge-color="e.status === 0 ? 'blue' : e.status === 1 ? 'red' : 'green'"
                      @click="onClick(e.id)"
                      class="item-link"
                      :class="{
                          'active': currentEvent ? currentEvent.id === e.id : false
                      }"
        >
        </f7-list-item>
      </f7-list>
    </f7-list>
  </f7-page>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    export default {
        methods: {
            addNewItem: function () {
                let self = this
                self.items.push({
                    title: 'Item ' + (self.items.length + 1),
                    subtitle: 'Subtitle ' + (self.items.length + 1)
                })
            },
            // Function to proceed search results
            searchAll: function (query) {
                let self = this
                let found = []
                for (let i = 0; i < self.items.length; i++) {
                    if (self.items[i].title.indexOf(query) >= 0 || query.trim() === '') found.push(i)
                }
                return found
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
        },
        watch: {
            events (updated) {
                console.log(updated)
//                this.$forceUpdate()
            },
            currentEvent (updated) {
                console.log(updated)
//                this.$forceUpdate()
            }
        }
    }
</script>

