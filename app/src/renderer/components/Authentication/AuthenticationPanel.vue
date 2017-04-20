/**
* Created by dummy on 4/13/17.
*/
<style scoped>

</style>

<template>
  <f7-login-screen ref="login">
    <f7-view>
      <f7-pages>
        <f7-page login-screen>
          <f7-login-screen-title>Spectacle</f7-login-screen-title>
          <f7-list form>
            <f7-list-item>
              <f7-label>Account</f7-label>
              <f7-input name="account" type="text" placeholder="Account" v-model="account"></f7-input>
            </f7-list-item>
            <f7-list-item>
              <f7-label>Secret</f7-label>
              <f7-input name="secret" type="password" placeholder="Secret" v-model="secret"></f7-input>
            </f7-list-item>
          </f7-list>
          <f7-list>
            <f7-list-button title="Sign In" @click="signIn"></f7-list-button>
            <f7-list-label @click.native="close">Close</f7-list-label>
          </f7-list>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-login-screen>
</template>

<script>
    export default {
        data () {
            return {
                account: '',
                secret: ''
            }
        },
        methods: {
            signIn () {
                const self = this
                self.$f7.showIndicator()

                this.$store.dispatch('authenticate', {
                    email: this.account,
                    password: this.secret
                }).then(() => {
                    self.$f7.hideIndicator()
                    self.close()
                    self.secret = ''
                }).catch((e) => {
                    self.$f7.hideIndicator()
                    self.$f7.alert(e, 'Error', () => {
                        self.secret = ''
                    })
                })
            },
            close () {
                this.$refs['login'].close(true)
            }
        }
    }
</script>

