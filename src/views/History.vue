<template>
  <div >
    <van-sticky>
      <van-cell title="会员姓名" v-model="historyUserInfo.userConsumerName"></van-cell>
      <van-cell title="手机号码" v-model="historyUserInfo.userConsumerTelephone"></van-cell>
    </van-sticky>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="checkHistory"
        offset="200"
    >
      <van-row v-for="(history,index) in historyModel" :key="index" >
        <van-card slot-scope="scope">
          <template #tags>
            <van-cell title="消费时间" :value="history.consumerTime"/>
            <van-cell title="消费类型" :value="history.consumerType"/>
            <van-cell title="消费金额" :value="history.consumerAmount"/>
            <van-cell title="账户余额" :value="history.afterAccountAmount"/>
            <van-cell title="操作人" :value="history.hairMasterName"/>
            <van-button v-show="history.consumerType!=='客户充值'" hairline plain block type="primary" @click="checkSignImg(history.id)">查看签名</van-button>
          </template>
        </van-card>
      </van-row>
    </van-list>
    <van-popup v-model="isImgShow" >
      <van-image
          width="50%"
          height="50%"
          lazy-load
          :src=this.img
          alt="66"
      />
    </van-popup>
    <BottomMenu></BottomMenu>
  </div>
</template>

<script>
import BottomMenu from "@/components/BottomMenu";
export default {
  components:{BottomMenu},
  data(){
    return {
      historyModel: [],
      loading: false,
      finished: false,
      userConsumerParam: {
        userId: null,
        page: {
          current: 1,
          total: 10,
          size: 20,
          pages: 0
        }
      },

      showAccountModel: {
        userId: null,
        userName: null,
        telephone: null,
        account: null,
        hairMasterId: null,
        hairMaster: null
      },
      img: null,
      isImgShow:false,
      historyUserInfo:{
        userId:'',
        userConsumerName:null,
        userConsumerTelephone:null,
      }
    }
  },
  methods:{
    checkHistory(val) {
      if (this.userConsumerParam.userId == null) {
        this.userConsumerParam.userId = val.vipUserId
      }
      setTimeout(()=>{
        this.$axios.post("/vipUser/listUserConsumer", this.userConsumerParam).then(res => {
          const _this=this;
          if (res.data.code === 0) {
            res.data.data.data.forEach(
                function (val) {
                  _this.historyModel.push(val)
                }
            )
            this.userConsumerParam.page = res.data.data.page
            this.userConsumerParam.page.current+=1
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成(最多加载40条数据)
            if (this.historyModel.length>=40) {
              this.finished = true;
            }
          }
        })
      },1000)
    },
    checkSignImg(consumerId){
      this.isImgShow=true
      this.img=this.$axios.defaults.baseURL+'/vipUser/getConsumerImg?consumerId='+consumerId;
    }
  },
  created() {
    if (Object.keys(this.$route.params).length!==0) {
      this.userConsumerParam.userId = this.$route.params.vipUserId
      this.historyUserInfo.userId = this.$route.params.vipUserId
      this.historyUserInfo.userConsumerName = this.$route.params.vipUserName
      this.historyUserInfo.userConsumerTelephone = this.$route.params.telephone
      this.$store.commit('SET_HISTORY_USER_INFO', this.historyUserInfo)
    }else {
      this.historyUserInfo=this.$store.getters.GET_HISTORY_USER
      this.userConsumerParam.userId=this.historyUserInfo.userId
    }
  }
}
</script>
<style>
  .van-cell{
    color: darkblue;
  }
</style>

