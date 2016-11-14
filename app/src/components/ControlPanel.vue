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
            <i class="fa fa-ban fa-icon" aria-label="hidden"></i>
            <p class="control-size">Lorem Ipsum</p>
          </div>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="#" class="thumbnail">
          <div class="control-square">
            <i class="fa fa-ban fa-icon" aria-label="hidden"></i>
            <p class="control-size">Lorem Ipsum</p>
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
      <!--<div class="col-xs-5 col-sm-6 col-md-4">-->
        <!--<a href="#/event">-->
          <!--<div class="panel panel-default">-->
            <!--<div class="panel-body text-center">-->
              <!--<i class="fa fa-bus fa-icon" aria-label="hidden"></i>-->
              <!--<h1>Start Check-in</h1>-->
            <!--</div>-->
          <!--</div>-->
        <!--</a>-->
      <!--</div>-->
      <!--<div class="col-xs-5 col-sm-6 col-md-4">-->
        <!--<div class="panel panel-default">-->
          <!--<div class="panel-body text-center">-->
            <!--<i class="fa fa-sign-out fa-icon"></i>-->
            <!--<h1>2</h1>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="col-xs-5 col-sm-6 col-md-4">-->
        <!--<div class="panel panel-default">-->
          <!--<div class="panel-body text-center">-->
            <!--<i class="fa fa-id-card fa-icon"></i>-->
            <!--<h1>3</h1>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="col-xs-5 col-sm-6 col-md-4">-->
        <!--<div class="panel panel-default">-->
          <!--<div class="panel-body text-center">-->
            <!--<i class="fa fa-refresh fa-icon"></i>-->
            <!--<h1>4</h1>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="col-xs-5 col-sm-6 col-md-4">-->
        <!--<div class="panel panel-default">-->
          <!--<div class="panel-body text-center">-->
            <!--<i class="fa fa-ambulance fa-icon"></i>-->
            <!--<h1>Restart</h1>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="col-xs-5 col-sm-6 col-md-4">-->
        <!--<a href="#/advanced">-->
          <!--<div class="panel panel-default">-->
            <!--<div class="panel-body text-center">-->
              <!--<i class="fa fa-code fa-icon"></i>-->
              <!--<h1>Advanced</h1>-->
            <!--</div>-->
          <!--</div>-->
        <!--</a>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  export default {}
</script>

