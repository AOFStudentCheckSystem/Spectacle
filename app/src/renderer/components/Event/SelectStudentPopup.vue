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
          <f7-searchbar cancel-link="Cancel" ref="searchbar"
                        :params="{ searchList: '#empty-card-list',
                  searchIn: '.item-title, .item-subtitle',
                  notFound: '.empty-card-searchbar-not-found',
                  found: '.empty-card-searchbar-found'
    }"></f7-searchbar>

          <!-- This block will become visible when there is nothing found -->
          <f7-list class="searchbar-not-found empty-card-searchbar-not-found" tablet-inset>
            <f7-list-item title="Nothing found"></f7-list-item>
          </f7-list>

          <!-- Search through this list -->
          <f7-list
                  id="empty-card-list"
                  class="empty-card-searchbar-found remove-list-margin"
                  media-list
          >
            <f7-list-item media-item tablet-inset
                            v-for="e in students" :title="e.lastName + ', ' + e.firstName"
                            :subtitle="e.idNumber"
                            @click="onClick(e)"
                            :class="computedClass(e)"
            >
            </f7-list-item>
          </f7-list>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-popup>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import {EventBusMixin} from '../../mixins/event-bus'

    export default {
        mixins: [EventBusMixin],
        data () {
            return {
                selected: null,
                subscription: null
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
                    this.$refs['searchbar'].empty()
                } else {
                    this.cancelClicked()
                }
            },
            cancelClicked () {
                this.$publish(this.$channels.SELECTED_STUDENT, {
                    student: null
                })
                this.$refs['searchbar'].empty()
                this.selected = null
            }
        },
        computed: {
            ...mapGetters([
                'students'
            ])
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

