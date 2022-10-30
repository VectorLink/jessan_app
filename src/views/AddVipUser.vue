<template>
  <div>
    <van-form @submit="addVipUser">
      <van-field
          v-model="userModel.userName"
          name="会员姓名"
          label="会员姓名"
          placeholder="会员姓名"
          :rules="[{ required: true, message: '请填写会员姓名' }]"
      />
      <van-field name="radio" label="性别">
        <template #input>
          <van-radio-group v-model="userModel.sex" direction="horizontal" @change>
            <van-radio name=0>男</van-radio>
            <van-radio name=1>女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
          v-model="userModel.telephone"
          name="联系电话"
          label="联系电话"
          placeholder="联系电话"
          :rules="[{ required: true, message: '请填写会员联系电话' },
          {pattern:/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,message: '请输入正确的电话号码'}]"
      />
      <van-field
           v-model="userModel.accountAmount"
           name="充值金额"
           label="充值金额"
           placeholder="充值金额"
           :rules="[{ pattern, message: '请输入正确内容' }]"
      />
      <van-field
          readonly
          clickable
          name="picker"
          :value="hairMaster.hairMasterName"
          label="发型师"
          placeholder="点击选择发型师"
          @click="showPicker = true"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">添加会员</van-button>
      </div>
    </van-form>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
          show-toolbar
          :columns="hairMasters"
          value-key="hairMasterName"
          @confirm="onConfirm"
          @cancel="showPicker = false"
      />
    </van-popup>
    <BottomMenu></BottomMenu>
  </div>
</template>

<script>

import BottomMenu from "@/components/BottomMenu";

export default {
  name: 'HairMaster',
  components: {
    BottomMenu
  },
  data() {
    return {
      userModel: {
        userName: null,
        sex: null,
        telephone: null,
        hairMasterId: null,
        accountAmount:null
      },
      hairMasters: [],
      hairMaster:{
        hairMasterId:null,
        hairMasterName:null
      },
      showPicker: false,
      pattern: /^[0-9]*[1-9][0-9]*$/,
      vipUserQueryParam: {
        searchParam: '',
        page: {
          current: 1,
          total: 1,
          size: 3,
          pages: 0
        }
      }
    }
  },
  methods: {
    addVipUser() {
      this.userModel.hairMasterId = this.hairMaster.hairMasterId
      this.$axios.post("/vipUser/addUser", this.userModel).then(res => {
        if (res.data.code === 0) {
          this.$toast.success("会员添加成功")
          this.vipUserQueryParam.searchParam = this.userModel.telephone
          this.$router.push({
            name: "vipUser",
            params: {
              userName: this.userModel.userName
            }
          })
          setTimeout(() => {
            this.userModel.userName = null;
            this.userModel.hairMasterId = null;
            this.userModel.telephone = null;
            this.userModel.sex = null;
            this.hairMaster.hairMasterId = null;
            this.hairMaster.hairMasterName = null;
          }, 10000)

        }
      })
    },
    onConfirm(value) {
      this.hairMaster = value;
      this.showPicker = false;
    },
  },
  created() {
    this.$axios.post("/getHairMaster", "{}").then(res => {
      this.hairMasters = res.data.data
    })
  }
}
</script>
