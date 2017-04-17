<template>
    <f7-page>
        <f7-block-title>Events</f7-block-title>
        <f7-list tablet-inset>
            <f7-list-item title="Item 1"></f7-list-item>
            <f7-list-item title="Item 2"></f7-list-item>
        </f7-list>
        <f7-block-title>Students</f7-block-title>
        <f7-list tablet-inset>
            <f7-list-item title="Item 1"></f7-list-item>
            <f7-list-item title="Item 2"></f7-list-item>
        </f7-list>
        <f7-block-title>Authentication</f7-block-title>
        <f7-list tablet-inset>
            <f7-list-item link="#" @click="authenticationClicked" :title="authenticationTitle"></f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        computed: {
            ...mapGetters([
                'authenticated',
                'offline',
                'online'
            ]),
            authenticationClassObject () {
                return {
                    disabled: this.offline
                }
            },
            authenticationTitle () {
                return this.authenticated ? 'Sign Out' : 'Sign In'
            }
        },
        methods: {
            authenticationClicked () {
                if (this.authenticated) {
                    this.signOut()
                } else if (this.online) {
                    this.$f7.loginScreen()
                }
            },
            ...mapActions([
                'signOut'
            ])
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
