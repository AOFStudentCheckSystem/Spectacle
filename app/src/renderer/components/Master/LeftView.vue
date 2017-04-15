/**
* Created by dummy on 4/14/17.
*/
<style scoped>
</style>

<template>
  <f7-view navbar-through dynamic-navbar ref="view" :class="styleClassObject">
    <f7-navbar title="" sliding>
    </f7-navbar>
    <f7-pages>
      <f7-page id="default-left-view">
      </f7-page>
      <event-left-view id="event-left-view"></event-left-view>
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
                enabled: false
            }
        },
        computed: {
            styleClassObject () {
                return {
                    'view-left': true,
                    'disabled': !this.enabled
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
                if (!enable) {
                    self.router.load({ page: 'default-left-view' })
                }
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

