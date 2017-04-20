<template>
  <f7-page>
    <f7-block-title>Events</f7-block-title>
    <f7-list tablet-inset>
      <f7-list-button @click="exportBroken" title="Export Errored Events"></f7-list-button>
      <f7-list-button @click="exportRemote" title="Export Remote Events"></f7-list-button>
      <f7-list-button @click="exportLocal" title="Export Local Events"></f7-list-button>
      <f7-list-button @click="clearEvents" title="Empty Persistence Store"></f7-list-button>
    </f7-list>
    <f7-block-title>Subjects</f7-block-title>
    <f7-list tablet-inset>
      <f7-list-button @click="clearSubjects" title="Empty Persistence Store"></f7-list-button>
    </f7-list>
    <f7-block-title>Authentication</f7-block-title>
    <f7-list tablet-inset>
      <f7-list-button @click="resetAuth" title="Empty Persistence Store"></f7-list-button>
      <f7-list-button :disabled="!online" @click="authenticationClicked" :title="authenticationTitle"></f7-list-button>
    </f7-list>
    <f7-block-title class="center">Built by Yaotian Feng, Peiqi Liu, Yuanchu Xie with ♥</f7-block-title>
  </f7-page>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import * as types from '../../vuex/mutation-types'
    import fs from 'fs'
    const {dialog} = require('electron').remote

    export default {
        computed: {
            ...mapGetters([
                'authenticated',
                'offline',
                'online',
                'brokenEvents',
                'events',
                'localEvents'
            ]),
            authenticationClassObject () {
                return {
                    disabled: this.offline
                }
            },
            authenticationTitle () {
                return this.authenticated ? 'Sign Out' : 'Sign In'
            }
        },
        methods: {
            authenticationClicked () {
                if (this.authenticated) {
                    this.signOut()
                } else if (this.online) {
                    this.$f7.loginScreen()
                }
            },
            ...mapActions([
                'signOut'
            ]),
            clearEvents () {
                this.$store.commit(types.SET_ALL_EVENTS, {events: []})
                this.$store.commit(types.SET_BROKEN_EVENTS, {events: []})
                this.$store.commit(types.SET_LOCAL_EVENTS, {localEvents: []})
                this.$store.commit(types.SET_CURRENT_EVENT, {event: null})
                this.$store.commit(types.SET_CURRENT_LOADING, {id: null})
            },
            clearSubjects () {
                this.$store.commit(types.SET_ALL_STUDENTS, {students: []})
                this.$store.commit(types.SET_CURRENT_STUDENT, {student: null})
            },
            resetAuth () {
                this.$store.commit(types.CLEAR_CONSISTENCY)
                this.$store.commit(types.SET_OFFLINE, {offline: true})
                this.$store.commit(types.SET_ONLINE, {online: false})
                this.$store.commit(types.SET_SIGNING_IN, {signingIn: false})
                this.$store.commit(types.SET_USER_TOKEN, {token: null})
            },
            exportString (obj) {
                const self = this
                dialog.showSaveDialog({
                    title: 'Save Events',
                    defaultPath: 'events-' + new Date().getTime(),
                    filters: [
                        {name: 'Javascript Object Notation', extensions: ['json']}
                    ],
                    buttonLabel: 'Save'
                }, (filePath) => {
                    if (filePath) {
                        fs.writeFile(filePath, JSON.stringify(obj, null, 4), function (err) {
                            if (err) {
                                self.$f7.alert('Error', err)
                            } else {
                                self.$f7.alert('Spectacular!', 'Success')
                            }
                        })
                    }
                })
            },
            exportBroken () {
                this.exportString(this.brokenEvents)
            },
            exportRemote () {
                this.exportString(this.events)
            },
            exportLocal () {
                this.exportString(this.localEvents)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .center {
    text-align: center;
  }
  .left {
    text-align: left !important;
  }
</style>
