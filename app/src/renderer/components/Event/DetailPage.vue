/**
* Created by dummy on 4/14/17.
*/
<style scoped>

</style>

<template>
  <f7-page @page:beforeanimation="pageInit">
    <f7-list form tablet-inset v-show="currentEvent">
      <f7-list-item>
        <f7-label>Name</f7-label>
        <f7-input v-model="name" type="textarea" placeholder="Name" @input="throttledEditName"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Description</f7-label>
        <f7-input v-model="description" type="textarea" placeholder="Description" @input="throttledEditDescription"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Date</f7-label>
        <f7-input type="text" placeholder="Date" id="event-detail-date-picker"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Time</f7-label>
        <f7-input type="text" placeholder="Time" id="event-detail-time-picker"></f7-input>
      </f7-list-item>
    </f7-list>
    <div v-show="!currentEvent">
      <f7-block-title>To start using this app</f7-block-title>
      <f7-block>Select an event from the list on the left</f7-block>
    </div>
  </f7-page>
</template>

<script>
    import {mapGetters} from 'vuex'
    import * as PickerUtil from '../../util/picker'
    import {throttle} from '../../util/throttle'

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
                    month: 1,
                    date: 1
                },
                name: '',
                description: '',
                throttledEditName: throttle(this.editName, 5000),
                throttledEditDescription: throttle(this.editDescription, 5000),
                throttledEditTime: throttle(this.editTime, 5000)
            }
        },
        computed: {
            ...mapGetters([
                'currentEvent',
                'currentEventRecords'
            ])
        },
        methods: {
            buildPickers (date) {
                this.destroyPickers()
                const self = this
                if (!this.picker) {
                    this.picker = this.$f7.picker(PickerUtil.timePicker('#event-detail-time-picker',
                        '#event-time-picker-container',
                        (picker, values, displayValues) => {
                            self.pickerValue.hour = Number(values[0])
                            self.pickerValue.minute = Number(values[1])
                            self.throttledEditTime()
                        }, date))
                }
                if (!this.calendar) {
                    this.calendar = this.$f7.picker(PickerUtil.datePicker('#event-detail-date-picker',
                        '#event-date-picker-container',
                        (picker, values, displayValues) => {
                            self.calendarValue.month = Number(values[0])
                            self.calendarValue.date = Number(values[1])
                            self.calendarValue.year = Number(values[2])
                            self.throttledEditTime()
                        }, date))
                }
            },
            destroyPickers () {
                this.calendar ? this.calendar.destroy() : undefined
                this.picker ? this.picker.destroy() : undefined
                this.calendar = null
                this.picker = null
            },
            editName () {
                this.$store.dispatch('patchCurrentEvent', {
                    patch: {
                        name: this.name
                    }
                })
            },
            editDescription () {
                this.$store.dispatch('patchCurrentEvent', {
                    patch: {
                        description: this.description
                    }
                })
            },
            editTime () {
                this.$store.dispatch('patchCurrentEvent', {
                    patch: {
                        time: new Date(this.calendarValue.year,
                            this.calendarValue.month,
                            this.calendarValue.date,
                            this.pickerValue.hour,
                            this.pickerValue.minute).getTime()
                    }
                })
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

