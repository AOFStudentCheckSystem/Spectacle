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
    <!--
      Searchbar to search thorugh VL Items
      List to search specified in "search-list" prop
    -->
    <f7-searchbar cancel-link="Cancel"
                  :params="{ searchList: '#student-list',
                  searchIn: '.item-title',
                  notFound: '.student-searchbar-not-found',
                  found: '.student-searchbar-found'
    }"></f7-searchbar>

    <!-- This block will become visible when there is nothing found -->
    <f7-list class="searchbar-not-found student-searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>

    <!-- Search through this list -->
    <f7-list
            id="student-list"
            class="student-searchbar-found searchbar-found"
            media-list
    >
      <f7-list-item media-item
                    v-for="e in students" :title="e.lastName + ', ' + e.firstName"
                    :subtitle="e.preferredName || e.firstName"
                    @click="onClick(e.idNumber)"
                    class="item-link"
                    :class="classObjForStudent(e)"
      >
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    export default {

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
            ])
        },
        created () {
            this.refreshStudents()
        }
    }
</script>

