/**
* Created by dummy on 4/14/17.
*/
<style scoped>
  .sync {
    color: #000000;
  }

  .local {
    color: #4cd964;
  }

  .new {
    color: #ff3b30;
  }

  .active {
    color: #FFFFFF;
  }

  .active.sync {
    background-color: #007aff;
  }

  .active.local {
    background-color: #4cd964;
  }

  .active.new {
    background-color: #ff3b30;
  }

  .list-block {
    margin-top: 0 !important;
  }
</style>

<template>
  <f7-page pull-to-refresh @ptr:refresh="onRefresh">
    <f7-navbar>
      <!--<f7-nav-left v-if="currentEvent">-->
      <!--<f7-link href="/event/edit/">Edit</f7-link>-->
      <!--</f7-nav-left>-->
      <f7-nav-center>Subject</f7-nav-center>
    </f7-navbar>
    <!--
      Searchbar to search thorugh VL Items
      List to search specified in "search-list" prop
    -->
    <search-bar v-model="filter" @refresh="$refs['virtualscroller'].updateVisibleItems()" @overlayActive="overlayActive = $event"></search-bar>
    <search-bar-overlay :active="overlayActive"></search-bar-overlay>

    <!-- This block will become visible when there is nothing found -->
    <f7-list v-show="filteredStudents.length === 0">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>

    <virtual-scroller ref="virtualscroller" id="student-list" containerTag="ul" mainTag="div" :class="['list-block', 'media-list', 'student-searchbar-found']"
                      :items="filteredStudents" :itemHeight="63" keyField="idNumber" v-show="filteredStudents.length !== 0">
      <template scope="props">
        <li class="item-content media-item item-link"
            @click="onClick(props.item.idNumber)"
            :key="props.itemKey"
            :class="classObjForStudent(props.item)">
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
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import SearchBar from '../Master/SearchBar.vue'
    import SearchBarOverlay from '../Master/SearchBarOverlay.vue'

    export default {
        components: {SearchBar, SearchBarOverlay},
        data () {
            return {
                filter: '',
                overlayActive: false
            }
        },
        methods: {
            ...mapActions([
                'refreshStudents'
            ]),
            async pullCurrentStudent (id) {
                await this.$store.dispatch('pullCurrentStudent', {id})
            },
            onRefresh (event, done) {
                this.refreshStudents().then(() => {
                    done()
                    this.$forceUpdate()
                }).catch((e) => {
                    console.error(e)
                    done()
                })
            },
            onClick (id) {
                if (!this.currentStudent || this.currentStudent.idNumber !== id) {
                    this.pullCurrentStudent(id).then(() => {
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            },
            classObjForStudent (student) {
                return {
                    'active': this.currentStudent ? this.currentStudent.idNumber === student.idNumber : false,
                    'new': student.cardSecretUpdate,
                    'sync': !student.dirty && !student.cardSecretUpdate,
                    'local': student.dirty && !student.cardSecretUpdate
                }
            }
        },
        computed: {
            ...mapGetters([
                'students',
                'currentStudent'
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
        }
    }
</script>

