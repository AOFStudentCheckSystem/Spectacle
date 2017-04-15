/**
* Created by dummy on 4/14/17.
*/
<style scoped>
  .remove-list-margin {
    margin: 0 !important;
  }
</style>

<template>
  <f7-page>
    <!--
      Searchbar to search thorugh VL Items
      List to search specified in "search-list" prop
    -->
    <f7-searchbar cancel-link="Cancel" search-list="#search-list"></f7-searchbar>

    <!-- This block will become visible when there is nothing found -->
    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>

    <!-- Search through this list -->
    <f7-list
            id="search-list"
            class="searchbar-found remove-list-margin"
            media-list
            virtual
            :virtual-items="items"
            :virtual-height="63"
            :virtual-search-all="searchAll"
    >
      <!-- Templte 7 Virtual List Item Template -->
      <t7-template>
        <f7-list-item media-item link="#" :title="'{{title}}'" :subtitle="'{{subtitle}}' "></f7-list-item>
      </t7-template>
    </f7-list>
  </f7-page>
</template>

<script>
    export default {
        data: function () {
            let items = []
            for (let i = 1; i <= 10000; i++) {
                items.push({
                    title: 'Item ' + i,
                    subtitle: 'Subtitle ' + i
                })
            }
            return {
                items: items
            }
        },
        methods: {
            addNewItem: function () {
                let self = this
                self.items.push({
                    title: 'Item ' + (self.items.length + 1),
                    subtitle: 'Subtitle ' + (self.items.length + 1)
                })
            },
            // Function to proceed search results
            searchAll: function (query) {
                let self = this
                let found = []
                for (let i = 0; i < self.items.length; i++) {
                    if (self.items[i].title.indexOf(query) >= 0 || query.trim() === '') found.push(i)
                }
                return found
            }
        }
    }
</script>

