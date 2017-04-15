/**
* Created by dummy on 4/14/17.
*/
<style scoped>

</style>

<template>
  <f7-view navbar-through tab active dynamic-navbar main ref="view" class="main-view">
    <f7-navbar :title="title" sliding></f7-navbar>
    <f7-pages>
      <detail-page id="event-detail-page"></detail-page>
    </f7-pages>
  </f7-view>
</template>

<script>
    import DetailPage from './DetailPage.vue'
    import {EventBusMixin} from '../../mixins/event-bus'

    export default {
        mixins: [EventBusMixin],
        components: {DetailPage},
        data () {
            return {
                title: 'currentEvent',
                sidePanel: true
            }
        },
        computed: {
            router () {
                return this.$refs['view'].f7View.router
            },
            eventClassObject () {
                return {
                    'main-view': this.sidePanel
                }
            }
        },
        methods: {
            routeTo (route, sidePanel) {
                if (sidePanel) {
                    this.$publish(this.$channels.LEFT_VIEW_ROUTE, {page: sidePanel})
                    this.$publish(this.$channels.LEFT_VIEW_ENABLE, true)
                } else {
                    this.$publish(this.$channels.LEFT_VIEW_ENABLE, false)
                }
                this.router.load({page: route})
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.routeTo('event-detail-page', 'event-left-view')
            })
        }
    }
</script>

