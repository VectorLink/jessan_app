<template>
  <van-row type="flex" justify="center">
    <van-col span="7"></van-col>
    <van-col span="10"><van-image
        :src="require('@/assets/log.jpg')"
        fit="fill"
        class="img"/></van-col>
    <van-col span="7"></van-col>
  </van-row>

</template>

<script>

export default {
  name: 'TopLog',
  props: {
    msg: String
  }
}
</script>

<style >

</style>
