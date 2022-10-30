<template>
  <div>
    <van-cell title="选择日期区间" :value="date" @click="show = true" />
    <van-calendar v-model="show" type="range" @confirm="onConfirm" :min-date="minDate" allow-same-day/>

      <van-sticky >
        <div class="class-van-sticky">
        <van-cell-group inset :title="this.date+'营业总额信息'">
          <van-cell title="充值总金额（元）" :value="totalStatistic.chargeAmount"></van-cell>
          <van-cell title="消费总金额（元）" :value="totalStatistic.consumerAmount"></van-cell>
          <van-cell title="非会员消费次数（次）" :value="totalStatistic.noVipTotal"></van-cell>
        </van-cell-group>
        </div>
      </van-sticky>
    <van-cell v-for="(master,index) in hairMasterStatistic" :key="index">
      <van-card :title="master.hairMasterName">
        <template #tags>
         <van-cell-group title="会员信息">
           <van-cell title="会员充值金额（元）"  :value="master.vipStatistic.chargeAmount"></van-cell>
           <van-cell title="会员消费金额（元）"  :value="master.vipStatistic.consumerAmount"></van-cell>
           <van-cell title="会员进店数量（人）"  :value="master.vipStatistic.userTotal"></van-cell>
         </van-cell-group>
          <van-cell-group title="非会员信息">
            <van-cell title="非会员消费（元）"  :value="master.notVipStatistic.consumerAmount"></van-cell>
            <van-cell title="非会员消费次数（次）"  :value="master.notVipStatistic.userTotal"></van-cell>
          </van-cell-group>
        </template>
      </van-card>
    </van-cell>
    <BottomMenu></BottomMenu>
  </div>
</template>
<script>

import BottomMenu from "@/components/BottomMenu";
export default {
  components: {BottomMenu},
  data() {
   return {
     show: false,
     minDate: new Date(2022,1,1),
     statisticParam:{
       start:null,
       end:null
     },
     date: '',
     totalStatistic:{
       chargeAmount:0.00,
       consumerAmount:0.00,
       noVipTotal:0
     },
     hairMasterStatistic:[]
   }
  }, methods: {
    formatDate(date) {
      return `${date.getFullYear()}`+`-`+this.formatMonthOfDay(`${date.getMonth() + 1}`)+`-`+this.formatMonthOfDay(`${date.getDate()}`);
    },
    formatMonthOfDay(date){
      return  String(date).length < 2 ? (date = "0" + date): date;
    },
    onConfirm(date) {
      const [start, end] = date;
      this.show = false;
      this.statisticParam.start = `${this.formatDate(start)}`
      this.statisticParam.end = `${this.formatDate(end)}`
      this.date=`${this.formatDate(start)} 至 ${this.formatDate(end)}`;
      this.hairMasterStatistic=[]
      this.listAllStatistic()
    },
    getCurrentDateLastMonth(){
      const date = new Date();
      const month = `${date.getMonth()}`;
      const year = `${date.getFullYear()}`;
      const day = `${date.getDay()}`;
      this.minDate=new Date(year,month-1,day)
    },
    getCurrentDateLastWeek(){
      const date = new Date();
      const month = `${date.getMonth()}`;
      const year = `${date.getFullYear()}`;
      const day = `${date.getDay()}`;
      return  new Date(year,month,day-7)
    },
    listAllStatistic(){
      const _this=this;
      this.$axios.post("/getAllStatistic",this.statisticParam).then(res=>{
        if (res.data.code===0){
          this.hairMasterStatistic=res.data.data;
          this.hairMasterStatistic.forEach(function (val) {
            _this.totalStatistic.chargeAmount+=val.vipStatistic.chargeAmount
            _this.totalStatistic.consumerAmount+=val.vipStatistic.consumerAmount
            _this.totalStatistic.consumerAmount+=val.notVipStatistic.consumerAmount
            _this.totalStatistic.noVipTotal+=val.notVipStatistic.userTotal
          })
        }else {
          this.$toast.fail("请求数据出错！");
        }
      })
    }
  },
  created() {
    this.statisticParam.start=this.formatDate(this.getCurrentDateLastWeek())
    this.statisticParam.end=this.formatDate(new Date())
    this.date=this.formatDate(this.getCurrentDateLastWeek())+` 至 `+this.formatDate(new Date())
    this.getCurrentDateLastMonth();
    this.listAllStatistic();
  }
}
</script>
<style>
.van-card__title{
  font-weight: 900
}
.van-cell-group__title{
  font-weight: 900
}
.class-van-sticky{
  background-color: antiquewhite;
}
</style>
