/**
* Created by dummy on 11/13/16.
*/
<style scoped>
  .list-group-item-heading {
    text-align: left;
  }

  .list-group {
    overflow: auto;
    height: 70vh;
    max-width: 80vw;
  }

  .float-right {
    float: right;
  }

  .event-panel {
    height: 70vh
  }

  .input-search {
    margin-bottom: 3%;
  }

  .responsive-img {
    max-height: 55vh;
  }

</style>

<template>
  <div class="container">
    <div class="row event-panel">
      <div class="col-sm-5 hidden-xs">
        <div class="text-right">
          <img class="img-rounded responsive-img" v-bind:src="currentStudentImageAddr" alt="Missing Image"/>
          <h3>{{currentStudent.firstName}}</h3>
          <h3>{{currentStudent.lastName}}</h3>
          <h3>Total: {{totalStudents}}</h3>
        </div>
      </div>
      <div class="col-sm-7">
        <div class="input-search">
          <input type="text" class="form-control" placeholder="Search" v-model="searchText"/>
        </div>
        <div class="list-group">
          <!--<a class="list-group-item">-->
            <!--<div class="list-group-item-heading">-->
              <!--<input type="text" class="form-control" placeholder="Search" v-model="searchText"/>-->
            <!--</div>-->
          <!--</a>-->
          <a class="list-group-item" v-for="s in filteredStudents">
            <div class="list-group-item-heading">
              {{s.student.getDisplayName()}}
              <div class="list-group-item-text float-right">
                <button class="btn btn-sm btn-danger" v-if="s.checkedIn"
                        v-on:click="removeStudent(s.student.id)"><i class="fa fa-minus" aria-hidden="true"></i></button>
                <button class="btn btn-sm btn-primary" v-if="!s.checkedIn"
                        v-on:click="addStudent(s.student.id)"><i class="fa fa-plus" aria-hidden="true"></i></button>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {blankStudent} from '../models/Student'
  import {blankEvent} from '../models/Event'

  export default {
    data () {
      return {
        searchText: ''
      }
    },
    methods: {
      addStudent (id) {
        this.searchText = ''
        this.$store.dispatch('addStudent', {id})
      },
      removeStudent (id) {
        this.searchText = ''
        this.$store.dispatch('removeStudent', {id})
      }
    },
    computed: {
      currentEvent () {
        return this.$store.state.events.currentEvent
      },
      currentStudent () {
        return this.$store.state.events.currentStudent
      },
      allStudents () {
        return this.$store.state.students.students
      },
      currentStudentImageAddr () {
        if (this.currentStudent !== blankStudent) {
          return this.currentStudent.image
        } else {
          return 'http://placekitten.com/g/300/450'
        }
      },
      totalStudents () {
        if (this.currentEvent !== blankEvent) {
          return Object.keys(this.currentEvent.records).length
        } else {
          return -1
        }
      },
      students () {
        let self = this
        return Object.keys(this.currentEvent.records)
          .map((key) => self.currentEvent.records[key])
          .sort((a, b) => b.inTime - a.inTime)
          .map((record) => self.allStudents[record.id])
          .map((s) => {
            return {student: s, checkedIn: true}
          })
      },
      allStudentsArray () {
        let self = this
        return Object.keys(this.allStudents).map((key) => self.allStudents[key])
      },
      filteredStudents () {
        if (this.searchText !== '') {
          let self = this
          let records = this.currentEvent.records
          return this.allStudentsArray
            .filter((s) => s.getDisplayName().toLowerCase().includes(self.searchText.toLowerCase())).map((s) => {
              return {student: s, checkedIn: s.id in records}
            })
//          this.students
//            .filter((s) => s.getDisplayName().includes(self.searchText))
//            .map((s) => {
//              return {student: s, checkedIn: true}
//            })
//            .concat(.map((s) => {return { student: s, checkedIn: false }}))
        } else {
          return this.students
        }
      }
    },
    beforeDestroy () {
      this.$store.dispatch('setCurrentEvent', {id: null})
    }
  }
</script>

