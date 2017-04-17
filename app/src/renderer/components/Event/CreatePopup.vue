/**
* Created by dummy on 4/17/17.
*/
<style scoped>

</style>

<template>
  <f7-popup @popup:open="pickerInit" ref="popup">
    <f7-view navbar-fixed>
      <f7-navbar>
        <f7-nav-left>
          <f7-link close-popup>Cancel</f7-link>
        </f7-nav-left>
        <f7-nav-center>Create</f7-nav-center>
        <f7-nav-right>
          <f7-link @click="doneClicked">Done</f7-link>
        </f7-nav-right>
      </f7-navbar>
      <f7-pages>
        <f7-page>
          <f7-list form tablet-inset>
            <f7-list-item>
              <f7-label>Name</f7-label>
              <f7-input v-model="name" type="text" placeholder="Name"></f7-input>
            </f7-list-item>
            <f7-list-item>
              <f7-label>Description</f7-label>
              <f7-input v-model="description" type="textarea" placeholder="Description"></f7-input>
            </f7-list-item>
            <f7-list-item>
              <f7-label>Date</f7-label>
              <f7-input type="text" placeholder="Date" id="event-date-picker"></f7-input>
            </f7-list-item>
            <f7-list-item>
              <f7-label>Time</f7-label>
              <f7-input type="text" placeholder="Time" id="event-time-picker"></f7-input>
            </f7-list-item>
          </f7-list>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-popup>
</template>

<script>
    import * as PickerUtil from '../../util/picker'
    import {LocalEvent} from '../../models/event'
    const today = new Date()
    export default {
        data () {
            return {
                picker: null,
                pickerValue: {
                    hour: today.getHours(),
                    minute: today.getMinutes()
                },
                calendar: null,
                calendarValue: {
                    year: today.getFullYear(),
                    month: today.getMonth(),
                    date: today.getDate()
                },
                name: '',
                description: ''
            }
        },
        methods: {
            pickerInit () {
                if (!this.picker) {
                    const self = this
                    this.picker = this.$f7.picker(PickerUtil.timePicker('#event-time-picker',
                        '#event-time-picker-container',
                        (picker, values, displayValues) => {
                            self.pickerValue.hour = Number(values[0])
                            self.pickerValue.minute = Number(values[1])
                        }))
                }
                if (!this.calendar) {
                    const self = this
                    this.calendar = this.$f7.picker(PickerUtil.datePicker('#event-date-picker',
                        '#event-date-picker-container',
                        (picker, values, displayValues) => {
                            self.calendarValue.month = values[0]
                            self.calendarValue.date = values[1]
                            self.calendarValue.year = values[2]
                        }))
                }
            },
            doneClicked () {
                const self = this
                const localEvent = new LocalEvent()
                localEvent.name = self.name
                localEvent.description = self.description
                localEvent.time = new Date(self.calendarValue.year,
                    self.calendarValue.month,
                    self.calendarValue.date,
                    self.pickerValue.hour,
                    self.pickerValue.minute).getTime()
                self.$f7.showIndicator()
                this.$store.dispatch('createEvent', {
                    event: localEvent
                }).then(() => {
                    self.$f7.hideIndicator()
                    self.$refs['popup'].close()
                }).catch(() => {
                    self.$f7.hideIndicator()
                })
            },
            open () {
                this.$refs['popup'].open()
            }
        },
        beforeDestroy () {
            this.calendar ? this.calendar.destroy() : undefined
            this.picker ? this.picker.destroy() : undefined
        }
    }
</script>

