/**
* Created by dummy on 4/14/17.
*/
<style scoped>
</style>

<template>
  <f7-page>
    <f7-list form tablet-inset v-show="currentEvent">
      <f7-list-item>
        <f7-label>Name</f7-label>
        <f7-input :disabled="disabled" v-model="name" type="textarea" placeholder="Name"
                  @input="throttledEditName(currentEvent)"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Description</f7-label>
        <f7-input :disabled="disabled" v-model="description" type="textarea" placeholder="Description"
                  @input="throttledEditDescription(currentEvent)"></f7-input>
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
    <div v-show="!currentEvent">
      <f7-block-title>To start using this app</f7-block-title>
      <f7-block>Select an event from the list</f7-block>
    </div>
  </f7-page>
</template>

<script>
    import {mapGetters} from 'vuex'
    import * as PickerUtil from '../../util/picker'
    import {debounce} from '../../util/suppress'

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
                throttledEditTime: debounce(this.editTime, 500) // throttle(this.editTime, 5000)
            }
        },
        computed: {
            ...mapGetters([
                'currentEvent',
                'currentEventRecords'
            ]),
            disabled () {
                return this.currentEvent ? this.currentEvent.status > 1 : true
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
            }
        },
        methods: {
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
                                self.throttledEditTime(self.currentEvent)
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
                                self.throttledEditTime(self.currentEvent)
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
            editName (event) {
                if (event.status < 2) {
                    this.$store.dispatch('patchEvent', {
                        event,
                        patch: {
                            name: this.name
                        }
                    })
                }
            },
            editDescription (event) {
                if (event.status < 2) {
                    this.$store.dispatch('patchEvent', {
                        event,
                        patch: {
                            description: this.description
                        }
                    })
                }
            },
            editTime (event) {
                if (event) {
                    if (event.status < 2) {
                        this.$store.dispatch('patchEvent', {
                            event,
                            patch: {
                                time: new Date(this.calendarValue.year,
                                    this.calendarValue.month,
                                    this.calendarValue.date,
                                    this.pickerValue.hour,
                                    this.pickerValue.minute).getTime()
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
                    const date = new Date(newVal.time)
                    const oldDate = oldVal ? new Date(oldVal.time) : null
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

