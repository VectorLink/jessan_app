<template>
  <div>
    <van-form @submit="consumerAccountPost">
      <van-cell value="非会员入账：操作人为自己，消费金额必须大于0" size="large" class="cell-id" />
      <van-field
          v-model="chargeAccountParam.alterAmount"
          name="消费金额"
          label="消费金额"
          placeholder="消费金额"
          :rules="[{ pattern, message: '请输入大于0的整数' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
    <BottomMenu></BottomMenu>
  </div>
</template>

<script>
import BottomMenu from "@/components/BottomMenu";
export default {
  components:{BottomMenu},
  data(){
    return {
      hairMasters: [],
      hairMaster:{
        hairMasterId:null,
        hairMasterName:null
      },
      showPicker: false,
      chargeAccountParam: {
        consumerType: 0,
        alterAmount: 0.00,
        userId: 0
      },
      pattern: /^[0-9]*[1-9][0-9]*$/,
    }
  },
  methods:{
    onConfirm(value) {
      this.hairMaster = value;
      this.showPicker = false;
    },
    consumerAccountPost() {
      this.chargeAccountParam.consumerType = 0
      this.$axios.post("/vipUser/addBill", this.chargeAccountParam).then(res => {
        if (res.data.code === 0) {
          this.$toast.success(res.data.data)
          this.chargeAccountParam.alterAmount=0.00
        }
      })
    }
  }
}
</script>
<style>
 .cell-id{
   background-color: crimson;
 }
</style>
