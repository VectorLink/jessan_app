<template>
  <div >
    <van-sticky>
      <van-dropdown-menu >
        <van-dropdown-item @change="changeDevelop" :title="'请选择发型师：'+ hairMaster.text" :v-model="hairMaster" :options="hairMasters"/>
      </van-dropdown-menu>
    </van-sticky>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="hairMasterBillHistory"
        offset="200"
    >
      <van-row v-for="history in historyModel" >
        <van-card slot-scope="scope" thumb="">
          <template #tags>
            <van-cell title="会员名称" :value="history.vipUserName"/>
            <van-cell title="消费金额" :value="history.consumerAmount"/>
            <van-cell title="账户余额" :value="history.afterAccountAmount"/>
            <van-cell title="消费类型" :value="history.consumerType"/>
            <van-cell title="消费时间" :value="history.consumerTime"/>
            <van-cell title="发型师" :value="history.hairMasterName"/>
          </template>
        </van-card>
      </van-row>
    </van-list>
    <BottomMenu></BottomMenu>
  </div>
</template>

<script>
import BottomMenu from "@/components/BottomMenu";
import HairMaster from "@/views/HairMaster";
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
      userConsumerName:null,
      userConsumerTelephone:null,
      showAccountModel: {
        userId: null,
        userName: null,
        telephone: null,
        account: null,
        hairMasterId: null,
        hairMaster: null
      },
      hairMaster:{
        value:0,
        text:''
      },
      hairMasters:[]
    }
  },
  methods:{
    hairMasterBillHistory() {
      this.userConsumerParam.userId = this.hairMaster.value
      setTimeout(() => {
        this.$axios.post("/vipUser/listMasterBill", this.userConsumerParam).then(res => {
          console.log(JSON.stringify(res))
          const _this = this;
          if (res.data.code === 0) {
            if (res.data.data.data.length > 0) {
              res.data.data.data.forEach(
                  function (val) {
                    _this.historyModel.push(val)
                  }
              )
              this.userConsumerParam.page = res.data.data.page
              this.userConsumerParam.page.current += 1
              // 加载状态结束
              this.loading = false;
              // 数据全部加载完成(最多加载40条数据)
              if (this.historyModel.length >= 40) {
                this.finished = true;
              }
            } else {
              this.finished = true;
            }
          }
        })
      }, 1000)
    },
    changeDevelop (i) {
      this.hairMaster = this.hairMasters[i-1]
      this.historyModel=[]
      this.userConsumerParam.userId=this.hairMaster.value
      this.userConsumerParam.page.current=1
      this.hairMasterBillHistory()
    }
  },
  created() {
    this.$axios.post("/getHairMaster", "{}").then(res => {
      const _this=this
      res.data.data.forEach(
          function (val) {
            const one={};
            one.value=val.hairMasterId
            one.text=val.hairMasterName;
            _this.hairMasters.push(one)
          }
      )
    })
    this.hairMaster.value=this.$store.getters.GET_USER.hairMasterId
    this.hairMaster.text=this.$store.getters.GET_USER.hairMasterName
    this.userConsumerParam.userId=this.$store.getters.GET_USER.hairMasterId;
    if (this.$route.params.hairMasterId !=null) {
      this.hairMaster.value = this.$route.params.hairMasterId
    }
    if (this.$route.params.hairMasterName !=null) {
      this.hairMaster.text = this.$route.params.hairMasterName
    }
    console.log(JSON.stringify( this.hairMaster))
  }
}
</script>


