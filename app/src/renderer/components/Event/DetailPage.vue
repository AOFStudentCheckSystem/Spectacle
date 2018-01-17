/**
* Created by dummy on 4/14/17.
*/
<style scoped>
</style>

<template>
  <f7-page>
    <f7-list tablet-inset v-show="currentEvent">
      <f7-list-item>
        <f7-label>Name</f7-label>
        <f7-input :disabled="disabled" v-model="name" type="textarea" placeholder="Name"
                  @input="throttledEditName(currentEvent, name)"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Description</f7-label>
        <f7-input :disabled="disabled" v-model="description" type="textarea" placeholder="Description"
                  @input="throttledEditDescription(currentEvent, description)"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Date</f7-label>
        <f7-input ref="calendar" :disabled="disabled" type="text" placeholder="Date" :value="displayedDate"
                  id="event-detail-date-picker"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Time</f7-label>
        <f7-input ref="picker" :disabled="disabled" type="text" placeholder="Time" :value="displayedTime"
                  id="event-detail-time-picker"></f7-input>
      </f7-list-item>
    </f7-list>
    <f7-list tablet-inset v-show="emailEnabled">
      <f7-list-item>
        <f7-label>Email</f7-label>
        <f7-input v-model="emailAddress" type="text" placeholder="Address"></f7-input>
      </f7-list-item>
      <f7-list-button :disabled="sendButtonDisabled" @click="onEmailSend" title="Send"></f7-list-button>
    </f7-list>
    <div v-show="!currentEvent">
      <f7-block-title>To start using this app</f7-block-title>
      <f7-block>Select an event from the list</f7-block>
    </div>
  </f7-page>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import * as PickerUtil from '../../util/picker'
    import {debounce} from '../../util/suppress'
    import {ActivityEvent, EventStatus} from '../../models/event'
    import moment from 'moment'

    export default {
        data () {
            return {
                picker: null,
                pickerValue: {
                    hour: 0,
                    minute: 0
                },
                calendar: null,
                calendarValue: {
                    year: 2000,
                    month: 0,
                    date: 1
                },
                name: '',
                description: '',
                throttledEditName: debounce(this.editName, 500), // throttle(this.editName, 5000),
                throttledEditDescription: debounce(this.editDescription, 500), // throttle(this.editDescription, 5000),
                throttledEditTime: debounce(this.editTime, 500), // throttle(this.editTime, 5000),
                emailAddress: ''
            }
        },
        computed: {
            ...mapGetters([
                'currentEvent',
                'currentEventRecords',
                'isAdmin'
            ]),
            disabled () {
                return this.currentEvent ? (!this.isUnlockedEvent(this.currentEvent)) : true
            },
            displayedDate () {
                if (this.calendar) {
                    return PickerUtil.monthMap[this.calendarValue.month] + ' ' + this.calendarValue.date + ', ' + this.calendarValue.year
                } else {
                    return ''
                }
            },
            displayedTime () {
                if (this.picker) {
                    return this.pickerValue.hour + ':' + (this.pickerValue.minute < 10 ? ('0' + this.pickerValue.minute) : this.pickerValue.minute)
                } else {
                    return ''
                }
            },
            emailEnabled () {
                return this.currentEvent && this.currentEvent instanceof ActivityEvent && ((!this.isUnlockedEvent(this.currentEvent)) || this.isAdmin)
            },
            sendButtonDisabled () {
                return !this.emailAddress.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
            }
        },
        methods: {
            ...mapActions([
                'emailEvent'
            ]),
            isUnlockedEvent (event) {
                return event.status !== EventStatus.COMPLETED
            },
            onEmailSend () {
                if (this.emailAddress && this.currentEvent) {
                    const currentEvent = this.currentEvent
                    const emailAddress = this.emailAddress
                    const self = this
                    self.$f7.showIndicator()
                    this.emailEvent({
                        event: currentEvent,
                        email: emailAddress
                    }).then(() => {
                        self.emailAddress = ''
                        self.$f7.hideIndicator()
                        self.$f7.alert('The email has been sent.', 'Spectacular!')
                    }).catch((error) => {
                        self.emailAddress = ''
                        self.$f7.hideIndicator()
                        self.$f7.alert(error, 'Error')
                    })
                }
            },
            buildPickers (date) {
//                this.destroyPickers()
                const self = this
                if (!this.picker) {
                    this.picker = this.$f7.picker(PickerUtil.timePicker('#event-detail-time-picker',
                        '#event-time-picker-container',
                        (picker, values, displayValues) => {
                            const hour = Number(values[0])
                            const minute = Number(values[1])
                            if (self.pickerValue.minute !== minute || self.pickerValue.hour !== hour) {
                                self.pickerValue.minute = minute
                                self.pickerValue.hour = hour
                                self.throttledEditTime(self.currentEvent, new Date(this.calendarValue.year,
                                    this.calendarValue.month,
                                    this.calendarValue.date,
                                    this.pickerValue.hour,
                                    this.pickerValue.minute).getTime())
                            }
                        }, date))
                }
                if (!this.calendar) {
                    this.calendar = this.$f7.picker(PickerUtil.datePicker('#event-detail-date-picker',
                        '#event-date-picker-container',
                        (picker, values, displayValues) => {
                            const month = Number(values[0])
                            const date = Number(values[1])
                            const year = Number(values[2])
                            if (self.calendarValue.month !== month || self.calendarValue.date !== date ||
                                self.calendarValue.year !== year
                            ) {
                                self.calendarValue.month = month
                                self.calendarValue.date = date
                                self.calendarValue.year = year
                                self.throttledEditTime(self.currentEvent, new Date(this.calendarValue.year,
                                    this.calendarValue.month,
                                    this.calendarValue.date,
                                    this.pickerValue.hour,
                                    this.pickerValue.minute).getTime())
                            }
                        }, date))
                }
                this.picker.setValue([self.pickerValue.hour, self.pickerValue.minute < 10 ? ('0' + self.pickerValue.minute) : self.pickerValue.minute], 1000)
                this.calendar.setValue([self.calendarValue.month, self.calendarValue.date, self.calendarValue.year], 1000)
            },
            destroyPickers () {
                this.calendar ? this.calendar.destroy() : undefined
                this.picker ? this.picker.destroy() : undefined
                this.calendar = null
                this.picker = null
            },
            editName (event, name) {
                if (this.isUnlockedEvent(event)) {
                    this.$store.dispatch('patchEvent', {
                        event,
                        patch: {
                            name: name
                        }
                    })
                }
            },
            editDescription (event, description) {
                if (this.isUnlockedEvent(event)) {
                    this.$store.dispatch('patchEvent', {
                        event,
                        patch: {
                            description: description
                        }
                    })
                }
            },
            editTime (event, time) {
                if (event) {
                    if (this.isUnlockedEvent(event)) {
                        this.$store.dispatch('patchEvent', {
                            event,
                            patch: {
                                time: moment(time).unix()
                            }
                        })
                    }
                }
            },
            pageInit () {
                this.buildPickers(new Date())
            }
        },
        watch: {
            currentEvent (newVal, oldVal) {
                if (newVal) {
                    this.name = newVal.name
                    this.description = newVal.description
                    const date = new Date(moment.unix(newVal.time).valueOf())
                    const oldDate = oldVal ? new Date(moment.unix(oldVal.time).valueOf()) : null
                    if (date && (!oldDate || date.getTime() !== oldDate.getTime())) {
                        this.pickerValue = {
                            hour: date.getHours(),
                            minute: date.getMinutes()
                        }
                        this.calendarValue = {
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            date: date.getDate()
                        }
                        this.buildPickers(date)
                    }
                } else {
                    this.name = ''
                    this.description = ''
                    this.destroyPickers()
                }
            }
        },
        beforeDestroy () {
            this.destroyPickers()
        }
    }
</script>

