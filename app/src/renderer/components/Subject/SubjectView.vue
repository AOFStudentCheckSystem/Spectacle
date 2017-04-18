/**
* Created by dummy on 4/14/17.
*/
<style scoped>

</style>

<template>
  <f7-view class="view-main" ref="view" tab navbar-through :dynamic-navbar="true" @tab:show="setSidePanel">
    <f7-navbar>
      <f7-nav-center>{{ computedTitle }}</f7-nav-center>
    </f7-navbar>
    <f7-pages>
      <subject-page></subject-page>
    </f7-pages>
  </f7-view>
</template>

<script>
    import {EventBusMixin} from '../../mixins/event-bus'
    import SubjectPage from './SubjectPage.vue'
    import {mapGetters} from 'vuex'

    export default {
        mixins: [EventBusMixin],
        components: {SubjectPage},
        data () {
            return {
                sidePanel: false
            }
        },
        computed: {
            router () {
                if (this.$refs['view']) {
                    return this.$refs['view'].f7View.router
                }
                return null
            },
            ...mapGetters([
                'currentStudent'
            ]),
            computedTitle () {
                return this.currentStudent ? this.currentStudent.lastName + ', ' + this.currentStudent.firstName : ''
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
                this.routeSidePanel('/left/subject/')
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

