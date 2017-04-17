/**
* Created by dummy on 4/14/17.
*/
<style scoped>

</style>

<template>
    <f7-view navbar-through tab active :dynamic-navbar="true" main ref="view" :class="eventClassObject" @tab:show="setSidePanel">
        <f7-navbar title="titi" sliding></f7-navbar>
        <f7-pages>
            <detail-page></detail-page>
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
                if (this.$refs['view']) {
                    return this.$refs['view'].f7View.router
                }
                return null
            },
            eventClassObject () {
                return {
                    'main-view': this.sidePanel
                }
            }
        },
        methods: {
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
            setSidePanel () {
                this.routeSidePanel('/left/event/')
            }
        },
        watch: {
            router (newVal) {
                if (newVal) {
                    console.log(newVal)
                    this.setSidePanel()
                }
            }
        }
    }
</script>

