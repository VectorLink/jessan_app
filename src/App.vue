<template>
  <div id="app">
    <TopLog></TopLog>
    <router-view></router-view>
  </div>
</template>
<script>
import TopLog from "@/components/TopLog";
export default {
  components:{
    TopLog
  }
}
</script>
<style>
.van-cell{
  color: darkblue;
}
.van-popup{
  width: 80%;
}
.van-card{
  background-color: #ede3e3 !important
}
</style>
