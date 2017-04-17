/**
* Created by dummy on 4/13/17.
*/
<style scoped>

</style>

<template>
  <f7-views tabs toolbar-through>
    <left-view id="left-view"></left-view>
    <event-view id="event-view"></event-view>
    <subject-view id="subject-view"></subject-view>
    <preference-view id="preference-view"></preference-view>

    <f7-toolbar tabbar labels>
      <f7-link iconF7="calendar" text="Events" tab-link="#event-view" active></f7-link>
      <f7-link iconF7="persons" text="Subjects" tab-link="#subject-view"></f7-link>
      <f7-link iconF7="settings" text="Preferences" tab-link="#preference-view"></f7-link>
    </f7-toolbar>
    <create-popup ref="popup"></create-popup>
  </f7-views>
</template>

<script>
    import LeftView from './LeftView.vue'
    import EventView from '../Event/EventView.vue'
    import SubjectView from '../Subject/SubjectView.vue'
    import PreferenceView from '../Preference/PreferenceView.vue'
    import {EventBusMixin} from '../../mixins/event-bus'
    import CreatePopup from '../Event/CreatePopup.vue'

    export default {
        components: {LeftView, EventView, SubjectView, PreferenceView, CreatePopup},
        mixins: [EventBusMixin],
        data () {
            return {
                leftViewShow: false,
                leftViewPath: null
            }
        },
        created () {
            const self = this
            this.$subscribe(this.$channels.OPEN_EVENT_POPUP, () => {
                self.$refs['popup'].open()
            })
        }
    }
</script>
