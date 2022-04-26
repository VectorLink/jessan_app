<template>
  <div>
    <van-cell-group inset title="个人信息">
      <van-cell title="姓名" :value="this.$store.getters.GET_USER.hairMasterName"/>
      <van-cell title="登录名" :value="this.$store.getters.GET_USER.hairMasterCode"/>
      <van-cell title="编号" :value="this.$store.getters.GET_USER.hairMasterId"/>
      <van-cell title="角色" :value="this.$store.getters.GET_USER.type===0?'管理员':'发型师'"/>
    </van-cell-group>
    <van-cell title="选择日期区间" :value="date" @click="show = true"/>
    <van-calendar v-model="show" type="range" @confirm="onConfirm" :min-date="minDate" allow-same-day/>
    <van-card title="营业额信息" @click="jumpStatistic">
      <template #tags>
        <van-cell title="会员充值金额（元）" :value="todayStatistic.chargeAmount"></van-cell>
        <van-cell title="会员消费金额（元）" :value="todayStatistic.consumerAmount"></van-cell>
        <van-cell title="会员进店数量（人）" :value="todayStatistic.userTotal"></van-cell>
      </template>
    </van-card>
    <van-button type="primary" size="large" @click="logout" color="#1989fa">退出</van-button>

    <BottomMenu></BottomMenu>
  </div>
</template>

<script>

import BottomMenu from "@/components/BottomMenu";

export default {
  name: 'PersonInfo',
  components: {
    BottomMenu
  },
  data() {
    return {
      todayStatistic: {
        chargeAmount: 0.00,
        consumerAmount: 0.00,
        userTotal: 0
      },
      isButtonShow: true,
      date: '',
      show: false,
      statisticParam: {
        start: null,
        end: null
      },
      minDate: new Date(2022, 1, 1)
    }
  },
  methods: {
    logout() {
      const _this = this;
      _this.$axios.get("logout").then(res => {
        _this.$store.commit("REMOVE_INFO")
        _this.$router.push("/")
      })
    },
    formatDate(date) {
      return `${date.getFullYear()}` + `-` + this.formatMonthOfDay(`${date.getMonth() + 1}`) + `-` + this.formatMonthOfDay(`${date.getDate()}`);
    },
    formatMonthOfDay(date) {
      return String(date).length < 2 ? (date = "0" + date) : date;
    },
    onConfirm(date) {
      const [start, end] = date;
      this.show = false;
      this.statisticParam.start = `${this.formatDate(start)}`
      this.statisticParam.end = `${this.formatDate(end)}`
      this.date = `${this.formatDate(start)} 至 ${this.formatDate(end)}`;
      this.listStatistic()
    },
    getCurrentDateLastMonth() {
      const date = new Date();
      const month = `${date.getMonth()}`;
      const year = `${date.getFullYear()}`;
      const day = `${date.getDay()}`;
      this.minDate = new Date(year, month - 1, day)
    },
    listStatistic() {
      this.$axios.post("/getStatistic", this.statisticParam).then(res => {
        if (res.data.code === 0) {
          this.todayStatistic = res.data.data;
        } else {
          this.$toast.fail("请求数据出错！");
        }
      })
    },
    jumpStatistic() {
      if (this.isButtonShow) {
        this.$router.push("/statistic")
      }
    }
  },
  created() {
    this.listStatistic();
    this.date = this.formatDate(new Date())
    this.getCurrentDateLastMonth();
    this.isButtonShow = this.$store.getters.GET_USER.type === 0
  }
}
</script>
<style>

</style>
