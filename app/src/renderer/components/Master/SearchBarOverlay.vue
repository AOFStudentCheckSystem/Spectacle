/**
* Created by dummy on 4/19/17.
*/
<style scoped>

</style>

<template>
  <div class="searchbar-overlay" :class="searchBarOverlayClass"></div>
</template>

<script>
    export default {
        props: ['active'],
        computed: {
            searchBarOverlayClass () {
                return {
                    'searchbar-overlay-active': !!this.active
                }
            }
        }
    }
</script>

