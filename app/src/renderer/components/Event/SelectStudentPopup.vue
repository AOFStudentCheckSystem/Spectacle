/**
* Created by dummy on 4/18/17.
*/
<style scoped>
  .active {
    color: #FFFFFF;
    background-color: #007aff;
  }
</style>

<template>
  <f7-popup ref="popup" @popup:close="cancelClicked">
    <f7-view navbar-fixed>
      <f7-navbar>
        <f7-nav-left>
          <f7-link close-popup href="#">Cancel</f7-link>
        </f7-nav-left>
        <f7-nav-center>
          Select
        </f7-nav-center>
        <f7-nav-right>
          <f7-link @click="confirmClicked" href="#" :disabled="!selected">Confirm</f7-link>
        </f7-nav-right>
      </f7-navbar>
      <f7-pages>
        <f7-page>
          <search-bar v-model="filter" @input="$refs['virtualscroller'].updateVisibleItems()" @overlayActive="overlayActive = $event"></search-bar>
          <search-bar-overlay :active="overlayActive"></search-bar-overlay>

          <!-- This block will become visible when there is nothing found -->
          <f7-list tablet-inset v-show="filteredStudents.length === 0">
            <f7-list-item title="Nothing found"></f7-list-item>
          </f7-list>

          <virtual-scroller ref="virtualscroller" id="empty-card-list" containerTag="ul" mainTag="div" :class="['list-block', 'media-list', 'empty-card-searchbar-found', 'tablet-inset']"
                            :items="filteredStudents" :itemHeight="63" keyField="idNumber" v-show="filteredStudents.length !== 0">
            <template scope="props">
              <li class="item-content media-item"
                  @click="onClick(props.item)"
                  :key="props.itemKey"
                  :class="computedClass(props.item)">
                <div class="item-inner">
                  <div class="item-title-row">
                    <div class="item-title">{{props.item.lastName + ', ' + props.item.firstName}}</div>
                  </div>
                  <div class="item-subtitle">{{props.item.preferredName || props.item.firstName}}</div>
                </div>
              </li>
            </template>
          </virtual-scroller>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-popup>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import {EventBusMixin} from '../../mixins/event-bus'
    import SearchBar from '../Master/SearchBar.vue'
    import SearchBarOverlay from '../Master/SearchBarOverlay.vue'

    export default {
        mixins: [EventBusMixin],
        components: {SearchBar, SearchBarOverlay},
        data () {
            return {
                selected: null,
                subscription: null,
                filter: '',
                overlayActive: false
            }
        },
        methods: {
            ...mapActions([
                'refreshStudents'
            ]),
            onClick (e) {
                this.selected = e
            },
            computedClass (e) {
                return {
                    'active': this.selected ? this.selected.idNumber === e.idNumber : false
                }
            },
            confirmClicked () {
                if (this.selected) {
                    this.$publish(this.$channels.SELECTED_STUDENT, {
                        student: this.selected
                    })
                    this.$refs['popup'].close()
                    this.selected = null
                } else {
                    this.cancelClicked()
                }
            },
            cancelClicked () {
                this.$publish(this.$channels.SELECTED_STUDENT, {
                    student: null
                })
                this.selected = null
            }
        },
        computed: {
            ...mapGetters([
                'students'
            ]),
            filteredStudents () {
                const filter = this.filter
                return this.filter === '' ? this.students : this.students.filter((student) => {
                    const fullName = (student.firstName + ' ' + student.lastName + ' ' + student.preferredName).toLowerCase()
                    return fullName.includes(filter)
                })
            }
        },
        created () {
            this.refreshStudents()
            const self = this
            this.subscription = this.$subscribe(this.$channels.SELECT_STUDENT_POPUP, () => {
                self.$refs['popup'].open()
            })
        },
        beforeDestroy () {
            if (this.subscription) {
                this.$unsubscribe(this.subscription)
            }
        }
    }
</script>

