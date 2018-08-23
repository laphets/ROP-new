<template>
  <div class="index">
    <div>Welcome to 2018 QSC Autumn Recruit DashBoard</div>
    <img class='banner' src='https://sea.zjuqsc.com/thumbnail/6787bde0-e4c0-4392-8429-621c43e0a0e4/1024/583334920.jpg'>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Home extends Vue {}
</script>

<style>

.index{
  margin-top: 60px;
  text-align: center;
  font-weight: bold;
  font-size: 40px
}

.banner{
  margin-top: 60px
}
</style>
