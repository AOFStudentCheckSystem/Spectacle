/**
* Created by dummy on 4/14/17.
*/
<style scoped>
  .disable {
    display: none;
  }
</style>

<template>
  <f7-view navbar-through ref="view" :class="styleClassObject" :animate-pages="false" :preloadPreviousPage="false" :swipeBackPage="false">
    <f7-navbar title="Spectacle" slide>
      <f7-nav-right>
        <!-- Add new VL item on click -->
        <f7-link @click="addNewItem">
          <f7-icon f7="add"></f7-icon>
        </f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-pages>
      <event-left-view ref="event-left-view" id="event-left-view"></event-left-view>
    </f7-pages>
  </f7-view>
</template>

<script>
    import {EventBusMixin} from '../../mixins/event-bus'
    import EventLeftView from '../Event/EventLeftView.vue'

    export default {
        components: {EventLeftView},
        mixins: [EventBusMixin],
        data () {
            return {
                enabled: true
            }
        },
        methods: {
            addNewItem () {
                this.$refs['event-left-view'].addNewItem()
            }
        },
        computed: {
            styleClassObject () {
                return {
                    'view-left': true,
                    'disable': !this.enabled
                }
            },
            router () {
                return this.$refs['view'].f7View.router
            }
        },
        created () {
            const self = this
            this.$subscribe(this.$channels.LEFT_VIEW_ENABLE, (enable) => {
                self.enabled = enable
            })
            this.$subscribe(this.$channels.LEFT_VIEW_ROUTE, (data) => {
                try {
                    self.router.load(data)
                } catch (e) {
                    console.error(e)
                }
            })
        }
    }
</script>

