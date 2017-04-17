/**
* Created by dummy on 4/14/17.
*/
<style scoped>

</style>

<template>
    <f7-view ref="view" tab navbar-through :dynamic-navbar="true" :class="classObject" @tab:show="clearSidePanel">
        <f7-navbar title="Preferences" sliding></f7-navbar>
        <f7-pages>
            <preference-page></preference-page>
        </f7-pages>
    </f7-view>
</template>

<script>
    import PreferencePage from './PreferencePage.vue'
    import {EventBusMixin} from '../../mixins/event-bus'
    export default {
        mixins: [EventBusMixin],
        components: {PreferencePage},
        data () {
            return {
                sidePanel: false
            }
        },
        computed: {
            router () {
                return this.$refs['view'].f7View.router
            },
            classObject () {
                return {
                    'main-view': this.sidePanel
                }
            }
        },
        methods: {
            routeTo (route, sidePanel) {
                if (sidePanel) {
                    this.sidePanel = true
                    this.$publish(this.$channels.LEFT_VIEW_ROUTE, {url: sidePanel})
                    this.$publish(this.$channels.LEFT_VIEW_ENABLE, true)
                } else {
                    this.sidePanel = false
                    this.$publish(this.$channels.LEFT_VIEW_ENABLE, false)
                }
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
            clearSidePanel () {
                this.routeSidePanel()
            }
        }
    }
</script>

