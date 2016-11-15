/**
* Created by dummy on 11/13/16.
*/
<style scoped>
  a {
    color:inherit;
    text-decoration: none;
  }

  a:active{
    color: inherit;
    text-decoration: none;
  }

  a:visited{
    color: inherit;
    text-decoration: none;
  }

  a:hover{
    color: #00b3ee;
    text-decoration: none;
  }

  @media screen and (max-width: 300px){
    .fa-icon{
      font-size: 2em;
    }
    .control-size {
      font-size: 1em
    }
  }

  @media screen and (max-width: 768px) and (min-width: 300px){
    .fa-icon{
      font-size: 4em;
    }
    .control-size {
      font-size: 1.5em
    }
  }

  @media screen and (min-width: 768px){
    .fa-icon{
      font-size: 5em;
    }
    .control-size {
      font-size: 2em
    }
  }

  .control-square {
    padding: 5%;
  }
</style>

<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-6 col-sm-4">
        <router-link to="/events" class="thumbnail">
          <div class="control-square">
            <i class="fa fa-bus fa-icon" aria-label="hidden"></i>
            <p class="control-size">Check-in</p>
          </div>
        </router-link>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="#" class="thumbnail">
          <div class="control-square">
            <i class="fa fa-calendar fa-icon" aria-label="hidden"></i>
            <p class="control-size">Events</p>
          </div>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="#" class="thumbnail">
          <div class="control-square">
            <i class="fa fa-users fa-icon" aria-label="hidden"></i>
            <p class="control-size">Students</p>
          </div>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="#" class="thumbnail">
          <div class="control-square">
            <i class="fa fa-chain-broken fa-icon" aria-label="hidden"></i>
            <p class="control-size">Offline</p>
          </div>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="#" class="thumbnail">
          <div class="control-square">
            <i class="fa fa-sliders fa-icon" aria-label="hidden"></i>
            <p class="control-size">Preferences</p>
          </div>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="#" class="thumbnail">
          <div class="control-square">
            <i class="fa fa-code fa-icon" aria-label="hidden"></i>
            <p class="control-size">Advanced</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    created () {
      this.$store.dispatch('refreshStudents')
    }
  }
</script>

