<template>
  <van-tabbar v-model="active" active-color="#ee0a24" inactive-color="#000" :placeholder="true">
    <van-tabbar-item icon="friends-o" to="/vipUser">会员管理</van-tabbar-item>
    <van-tabbar-item icon="friends-o" to="/inAccountBill">非会员入账</van-tabbar-item>
    <van-tabbar-item icon="search" to="/hairMaster">发型师管理</van-tabbar-item>
    <van-tabbar-item icon="add-o" to="/addVipUser">添加会员</van-tabbar-item>
    <van-tabbar-item icon="manager-o" to="/personInfo">个人中心</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: "BottomMenu",
  data() {
    return {
      active: 'home',
    };
  },
}
</script>

<style scoped>

</style>
