/**
* Created by dummy on 4/19/17.
*/
<style scoped>
  .cancel-active {
    display: block;
    margin-right: 0;
  }

  .searchbar {
    z-index: 101;
  }
</style>

<template>
  <div class="searchbar" :class="searchClass">
    <div class="searchbar-input">
      <input ref="searchBox" type="search" placeholder="Search" :value="value" @input="searchInput" @focus="gainFocus"
             @blur.prevent="loseFocus">
      <a href="#" class="searchbar-clear"></a>
    </div>
    <a href="#" class="searchbar-cancel" @click="clearInput" :class="clearClass">Cancel</a>
  </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: String,
                required: true
            }
        },
        data () {
            return {
                focused: false
            }
        },
        computed: {
            clearClass () {
                return {
                    'cancel-active': this.value !== '' || this.focused
                }
            },
            searchClass () {
                return {
                    'searchbar-active': this.value !== '' || this.focused
                }
            }
        },
        methods: {
            clearInput () {
                this.$emit('input', '')
                this.$refs['searchBox'].blur()
                this.$emit('refresh')
            },
            gainFocus () {
                this.focused = true
                this.$emit('overlayActive', true)
                this.$emit('refresh')
            },
            loseFocus () {
                this.focused = false
                this.$emit('overlayActive', false)
                this.$emit('refresh')
            },
            searchInput (event) {
                const trimmedInput = event.target.value.trim().toLowerCase()
                this.$emit('input', trimmedInput)
                this.$emit('refresh')
                this.$emit('overlayActive', trimmedInput === '')
            }
        }
    }
</script>

