/**
* Created by dummy on 4/18/17.
*/
<style scoped>
  .view-container {
    height: 24px;
  }

  .box {
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif !important;
    display: flex;
    flex-direction: row;
    background-color: black;
    color: white;
    font-size: 12px;
    padding: 2px;
  }

  .item {
    padding-left: 1px;
    padding-right: 1px;
  }

  .clock {
    text-align: center;
    flex: 1 1 auto;
  }

  .battery {
    text-align: right;
    flex: 0 0 100px;
  }

  .spectacle {
    text-align: left;
    flex: 0 0 100px;
  }

  i {
    padding-left: 1px;
    padding-right: 1px;
  }
</style>

<template>
  <div class="view-container" @click="statusBarClick">
    <div class="box webkit-draggable">
      <div class="item spectacle">Spectacle</div>
      <div class="item clock">{{displayTime}}</div>
      <div class="item battery">
        <i v-if="offline" class="fa fa-cloud-download" aria-hidden="true"></i>

        <i class="fa fa-cloud" aria-hidden="true" v-else></i>

        {{charge}}% <i class="fa" :class="batteryClass" aria-hidden="true"></i> <i class="fa fa-bolt" v-if="charging"
                                                                                   aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>

<script>
    import moment from 'moment'
    import {mapActions, mapGetters} from 'vuex'
    import {EventBusMixin} from '../../mixins/event-bus'

    export default {
        mixins: [EventBusMixin],
        data () {
            return {
                date: moment(),
                intervalId: null,
                batteryMap: {
                    0: 'fa-battery-empty',
                    1: 'fa-battery-quarter',
                    2: 'fa-battery-half',
                    3: 'fa-battery-three-quarters',
                    4: 'fa-battery-full'
                }
            }
        },
        methods: {
            ...mapActions([
                'setCharge',
                'setCharging'
            ]),
            statusBarClick () {
                this.$publish(this.$channels.STATUS_BAR_CLICK)
            }
        },
        computed: {
            displayTime () {
                return this.date.format('HH:mm')
            },
            ...mapGetters([
                'offline',
                'charge',
                'charging'
            ]),
            batteryClass () {
                return this.batteryMap[Math.round(this.charge / 25)]
            }
        },
        mounted () {
            const self = this
            this.intervalId = window.setInterval(() => {
                self.date = moment()
            }, 1000)
            navigator.getBattery()
                .then((battery) => {
                    self.setCharging({charging: battery.charging})
                    self.setCharge({charge: Math.floor(battery.level * 100)})

                    battery.addEventListener('chargingchange', function () {
                        self.setCharging({charging: battery.charging})
                        console.log(battery)
                    })

                    battery.addEventListener('levelchange', function () {
                        self.setCharge({charge: Math.floor(battery.level * 100)})
                        console.log(battery)
                    })
                })
        },
        beforeDestroy () {
            window.clearInterval(this.intervalId)
        }
    }
</script>

