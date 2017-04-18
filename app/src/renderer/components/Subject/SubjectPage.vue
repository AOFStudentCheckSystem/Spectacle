/**
* Created by dummy on 4/18/17.
*/
<style scoped>

</style>

<template>
  <f7-page @page:init="setPageActive(true)"
           @page:reinit="setPageActive(true)" @page:beforeremove="setPageActive(false)">
    <f7-list tablet-inset v-if="currentStudent">
      <f7-list-item>
        <f7-label>ID Number</f7-label>
        <f7-input type="text" disabled :value="currentStudent.idNumber"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>First Name</f7-label>
        <f7-input type="text" disabled :value="currentStudent.firstName"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Last Name</f7-label>
        <f7-input type="text" disabled :value="currentStudent.lastName"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Preferred Name</f7-label>
        <f7-input type="text" disabled :value="currentStudent.preferredName"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Email</f7-label>
        <f7-input type="text" disabled :value="currentStudent.email"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Card Secret</f7-label>
        <f7-input type="text" disabled :value="currentStudent.cardSecret"></f7-input>
      </f7-list-item>
      <f7-list-button :title="scanTitle" @click="onClick"></f7-list-button>
      <f7-list-button title="Clear Card Secret" @click="clearCardSecret"></f7-list-button>
    </f7-list>
    <div v-else>
      <f7-block-title>To start using this app</f7-block-title>
      <f7-block>Select a subject from the list on the left</f7-block>
    </div>
  </f7-page>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {SmartCardController} from 'smartcard'

    export default {
        computed: {
            ...mapGetters([
                'currentStudent'
            ]),
            scanTitle () {
                return this.smart ? 'Stop Scanning' : 'Scan Card'
            }
        },
        data () {
            return {
                smart: null,
                errorCallbackUnsubscriber: null,
                connectCallbackUnsubscriber: null,
                pageActive: false
            }
        },
        methods: {
            setPageActive (active) {
                this.pageActive = active
            },
            setCardSecret (atr) {
                this.$store.dispatch('patchStudentCardSecret', {
                    student: this.currentStudent,
                    cardSecret: atr
                })
            },
            clearCardSecret () {
                this.setCardSecret('')
            },
            onClick () {
                if (this.smart) {
                    this.smart ? this.smart.close() : undefined
                    this.errorCallbackUnsubscriber ? this.errorCallbackUnsubscriber() : undefined
                    this.connectCallbackUnsubscriber ? this.connectCallbackUnsubscriber() : undefined
                    this.smart = null
                    this.errorCallbackUnsubscriber = null
                    this.connectCallbackUnsubscriber = null
                } else {
                    const self = this
                    this.smart = new SmartCardController()
                    this.errorCallbackUnsubscriber = this.smart.onError((error) => {
                        console.log(error)
                    })
                    this.connectCallbackUnsubscriber = this.smart.onConnect((reader) => {
                        console.log(self.currentStudent)
                        reader.onInsert((card) => {
                            if (self.pageActive && self.currentStudent) {
                                self.setCardSecret(card.atr)
                            }
                        })
                        reader.onError((error) => {
                            console.log(error)
                        })
                    })
                }
            },
            beforeDestroy () {
                this.smart ? this.smart.close() : undefined
                this.errorCallbackUnsubscriber ? this.errorCallbackUnsubscriber() : undefined
                this.connectCallbackUnsubscriber ? this.connectCallbackUnsubscriber() : undefined
            }
        }
    }
</script>

