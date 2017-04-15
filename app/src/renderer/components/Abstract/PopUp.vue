/**
* Created by dummy on 4/14/17.
*/
<style scoped>

</style>

<template>
  <f7-popup :id="id" ref="popup">
    <f7-view navbar-fixed>
      <f7-pages>
        <f7-page>
          <f7-navbar :title="title">
            <f7-nav-right>
              <f7-link close-popup>Close</f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-block>
            {{ content }}
          </f7-block>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-popup>
</template>

<script>
    export default {
        props: {
            id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                default () {
                    return ''
                }
            },
            content: {
                type: String,
                required: true
            }
        },
        methods: {
            open () {
                this.$refs['popup'].open()
            },
            close () {
                this.$refs['popup'].close()
            }
        }
    }
</script>

