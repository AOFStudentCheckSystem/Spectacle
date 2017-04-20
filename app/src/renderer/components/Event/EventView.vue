/**
* Created by dummy on 4/14/17.
*/
<style scoped>

</style>

<template>
    <f7-view class="view-main" navbar-through tab active :dynamic-navbar="true" main ref="view" @tab:show="onTabShown" @tab:hide="onTabHidden">
        <f7-navbar sliding>
            <!--<f7-nav-left v-if="currentEvent">-->
            <!--<f7-link href="/event/edit/">Edit</f7-link>-->
            <!--</f7-nav-left>-->
            <f7-nav-left v-if="currentEvent && currentEvent.status < 2">
                <f7-link href="#" @click="completeEvent">Complete</f7-link>
            </f7-nav-left>
            <f7-nav-center sliding>{{ computedTitle }}</f7-nav-center>
            <f7-nav-right v-if="currentEvent">
                <f7-link href="/event/check/">{{ currentEvent && currentEvent.status < 2 ? 'Check In' : 'View Records'}}</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-pages>
            <detail-page></detail-page>
        </f7-pages>
    </f7-view>
</template>

<script>
    import DetailPage from './DetailPage.vue'
    import {EventBusMixin} from '../../mixins/event-bus'
    import {mapGetters} from 'vuex'

    export default {
        mixins: [EventBusMixin],
        components: {DetailPage},
        data () {
            return {
                sidePanel: true
            }
        },
        computed: {
            router () {
                if (this.$refs['view']) {
                    return this.$refs['view'].f7View.router
                }
                return null
            },
            computedTitle () {
                return this.currentEvent ? this.currentEvent.name : ''
            },
            ...mapGetters([
                'currentEvent'
            ])
        },
        methods: {
            onTabHidden () {
                this.$publish(this.$channels.EVENT_TAB_SHOW, {status: false})
            },
            routeTo (route, sidePanel) {
                this.routeSidePanel(sidePanel)
                this.router.load({url: route})
            },
            routeSidePanel (route) {
                if (route) {
                    this.sidePanel = true
                    this.$publish(this.$channels.LEFT_VIEW_ROUTE, {url: route})
                    this.$publish(this.$channels.LEFT_VIEW_ENABLE, true)
                } else {
                    this.sidePanel = false
                    this.$publish(this.$channels.LEFT_VIEW_ROUTE, {url: '/left/'})
                    this.$publish(this.$channels.LEFT_VIEW_ENABLE, false)
                }
            },
            onTabShown () {
                this.$publish(this.$channels.EVENT_TAB_SHOW, {status: true})
                this.routeSidePanel('/left/event/')
            },
            completeEvent () {
                const self = this
                const currentEvent = self.currentEvent
                if (currentEvent) {
                    this.$f7.confirm('You may not modify the even once it has been completed.', `Mark event "${currentEvent.name}" as complete?`, function () {
                        self.$store.dispatch('patchEvent', {
                            event: currentEvent,
                            patch: {
                                status: 2
                            }
                        })
                    })
                }
            }
        },
        watch: {
            router (newVal) {
                if (newVal) {
                    this.setSidePanel()
                }
            }
        }
    }
</script>

