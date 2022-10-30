<template>
  <div class="vipUserlist">
    <form action="/">
      <van-search
          v-model="vipUserQueryParam.searchParam"
          show-action
          placeholder="请输入会员名称、编号或者电话号码"
          @search="searchUser"
          @cancel="cancelSearch"
      />
    </form>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="200"
    >
      <van-cell-group  v-for="(user,index) in userList" inset :title="`${user.vipUserName}【${user.vipUserId}】`" :key="index" >
        <van-card>
          <template #tags>
            <van-cell title="性别" :value="user.sex==0?'男':'女'"/>
            <van-cell title="账户余额（元）" :value="user.accountAmount"/>
            <van-cell title="电话号码" :value="user.telephone"/>
            <van-cell title="发型师" :value="user.hairMasterName"/>
            <van-cell title="会员加入时间" :value="user.createTime"/>
            <van-cell>
              <van-button size="small" @click="editVipUser(user)" >修改会员</van-button>
              <van-button size="small" @click="chargeAccount(user)">会员充值</van-button>
              <van-button size="small" @click="consumerAccount(user)">美发消费</van-button>
              <van-button size="small" @click="jumpHistory(user)">消费历史</van-button>
            </van-cell>
          </template>
        </van-card>
      </van-cell-group>
    </van-list>
<!--    充值或者消费窗口-->
    <van-popup v-model="chargeVisible" class="van-popup" >
      <van-form>
        <van-field
            v-model="showAccountModel.userName"
            name="会员名"
            label="会员名"
            placeholder="会员名"
            readonly
        />
        <van-field
            v-model="showAccountModel.telephone"
            name="联系电话"
            label="联系电话"
            placeholder="联系电话"
            readonly
        />
        <van-field
            v-model="showAccountModel.account"
            name="账户余额"
            label="账户余额"
            placeholder="账户余额"
            readonly
        />
        <van-field
            v-model="chargeAccountParam.alterAmount"
            :name="this.operationContent"
            :label="this.operationContent"
            :placeholder="this.operationContent"
            :rules="[{ pattern, message: '请输入大于0的整数' }]"
        />
        <van-button hairline v-show="operationContent==='消费金额'"  block type="primary" @click="isSignVisible=true">签名</van-button>
        <div style="margin: 16px;">
          <van-button round block type="info" @click="submitMethod">{{operationContent}}</van-button>
        </div>
      </van-form>
    </van-popup>
<!--    签名-->
    <van-popup v-model="isSignVisible">
      <vue-esign ref="esign" :width="500" :height="500" :isCrop="isCrop" :lineWidth="lineWidth" :lineColor="lineColor" :bgColor.sync="bgColor" @close="resultImg=''" />
      <van-button @click="handleReset">重签</van-button>
      <van-button @click="handleGenerate">完成</van-button>
    </van-popup>
<!--    编辑会员信息-->
    <van-popup v-model="editUserVisible">
      <van-form @submit="addVipUser">
        <van-field
            v-model="userModel.userId"
            name="会员编号"
            label="会员编号"
            placeholder="会员编号"
            readonly
        />
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
            :rules="[{ required: true, message: '请填写会员联系电话' }]"
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
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </van-popup>
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
  components:{BottomMenu},
  data(){
    return {
      userList: [],
      hairMasters: [],
      hairMaster:{
        hairMasterId:null,
        hairMasterName:null
      },
      historyModel: [],
      loading: false,
      historyLoading:false,
      historyFinished:false,
      finished: false,
      chargeVisible: false,
      editUserVisible:false,
      isSignVisible:false,
      operationContent:'',
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
      },
      userConsumerParam: {
        userId: null,
        page: {
          current: 1,
          total: 10,
          size: 30,
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
      chargeAccountParam: {
        consumerType: 0,
        alterAmount: 0.00,
        userId: 0
      },
      userModel: {
        userId:null,
        userCode: null,
        userName: null,
        sex: null,
        telephone: null,
        hairMasterId: null
      },
      lineWidth: 6,
      lineColor: 'black',
      bgColor: 'white',
      resultImg: null,
      isCrop: false
    }
  },
  methods:{
    onLoad() {
      setTimeout(() => {
        const _this = this;
        this.$axios.post("/vipUser/listUser", this.vipUserQueryParam).then(res => {
          if (res.status!==200){
            this.finished = true;
          }
          if (res.data.data.data.length===0){
            this.finished = true;
          }
          res.data.data.data.forEach(
              function (val) {
                _this.userList.push(val)
              }
          )
          this.vipUserQueryParam.page = res.data.data.page
          this.vipUserQueryParam.page.current+=1;
        },error=>{
          this.loading=false
          this.finished=true
          this.$toast.fail(error)
        })
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成(最多加载40条数据)
        if (this.userList.length>=40) {
          this.finished = true;
        }
      }, 500);

    },
    handleReset () {
      this.$refs.esign.reset()
    },
    handleGenerate () {
      this.$refs.esign.generate().then(res => {
        this.resultImg=this.dataURLtoFile(res);
        this.isSignVisible=false;
      }).catch(() => {
        alert("请先签名！")
      })
    },
    // 将base64转换为file
    dataURLtoFile(dataurl) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bytes = atob(arr[1]); // 解码base64
      let n = bytes.length;
      let ia = new Uint8Array(n);
      while (n--) {
        ia[n] = bytes.charCodeAt(n);
      }
      return new File([ia], "easign.png", { type: mime });
    },
    onConfirm(value) {
      this.hairMaster = value;
      this.showPicker = false;
    },
    chargeAccount(val){
      this.chargeVisible = true
      this.operationContent='充值金额'
      this.showAccountModel.userName = val.vipUserName
      this.chargeAccountParam.userId = val.vipUserId
      this.showAccountModel.telephone = val.telephone
      this.showAccountModel.hairMasterId = val.hairMasterId
      this.showAccountModel.account = val.accountAmount
      this.showAccountModel.hairMaster = val.hairMasterName
    },
    submitMethod(){
      if (this.operationContent==='充值金额'){
        this.chargeAccountPost()
      }else if (this.operationContent === "消费金额"){
        this.consumerAccountPost()
      }
    },
    chargeAccountPost() {
      if (this.chargeAccountParam.alterAmount<=0||this.chargeAccountParam.alterAmount===undefined){
        this.$toast.fail("请输入大于0的金额")
        return
      }
      this.chargeAccountParam.consumerType = 1
      this.$axios.post('/vipUser/chargeAccount',this.chargeAccountParam).then(res => {
        if (res.data.code === 0) {
          this.$toast.success(res.data.data);
          this.chargeVisible = false;
          this.userList=[]
          this.vipUserQueryParam.page.current=1;
          this.onLoad();
          this.showAccountModel = {}
          this.chargeAccountParam = {}
          this.operationContent=''
        }else {
          this.$toast.fail(res.data.msg);
        }
      })
    },
    cancelSearch() {
      this.vipUserQueryParam.searchParam=''
      this.userList=[]
      this.vipUserQueryParam.page.current=1
      this.onLoad()
    },
    searchUser() {
      this.vipUserQueryParam.page.current = 1
      this.userList=[]
      this.$axios.post("/vipUser/listUser", this.vipUserQueryParam).then(res => {
        this.userList = res.data.data.data
        this.vipUserQueryParam.page = res.data.data.page
      })
    },
    jumpHistory(val) {
      this.$router.push({
        name: "history",
        params: {
          vipUserId: val.vipUserId.toString(),
          vipUserName: val.vipUserName,
          telephone:val.telephone
        }
      });
    },
    consumerAccount(val) {
      this.chargeVisible = true
      this.operationContent='消费金额'
      this.showAccountModel.userName = val.vipUserName
      this.chargeAccountParam.userId = val.vipUserId
      this.showAccountModel.telephone = val.telephone
      this.showAccountModel.hairMasterId = val.hairMasterId
      this.showAccountModel.account = val.accountAmount
      this.showAccountModel.hairMaster = val.hairMasterName
    },
    consumerAccountPost() {
      this.chargeAccountParam.consumerType = 0
      if (this.chargeAccountParam.alterAmount<=0||this.chargeAccountParam.alterAmount===undefined){
        this.$toast.fail("请输入大于0的金额")
        return
      }
      if (this.resultImg==null||this.resultImg.length===0){
        this.$toast.fail("请先签名")
        return
      }
      let formData = new FormData();
      formData.append('sign',this.resultImg)
      formData.append("consumerType",this.chargeAccountParam.consumerType)
      formData.append('alterAmount',this.chargeAccountParam.alterAmount)
      formData.append('userId',this.chargeAccountParam.userId)
      console.log(formData)
      this.$axios({
        url:'/vipUser/consumerAccount',
        method:'POST',
         data:formData
      }).then(res => {
        if (res.data.code === 0) {
          this.$toast.success(res.data.data)
          this.chargeVisible = false;
          this.userList=[]
          this.vipUserQueryParam.page.current=1;
          this.onLoad();
          this.showAccountModel = {}
          this.chargeAccountParam = {}
          this.operationContent=''
          this.$refs.esign.reset()
        }else {
          this.$toast.fail(res.data.msg)
        }
      })
    },
    editVipUser(val) {
      this.userModel.userName = val.vipUserName
      this.userModel.userId=val.vipUserId
      this.userModel.sex = val.sex
      this.userModel.telephone = val.telephone
      this.userModel.hairMasterId = val.hairMasterId
      this.editUserVisible=true
    },
    addVipUser() {
      this.userModel.hairMasterId=this.hairMaster.hairMasterId
      this.$axios.post("/vipUser/addUser", this.userModel).then(res => {
        if (res.data.code === 0) {
          this.$toast.success("更新信息成功")
          this.editUserVisible = false;
          this.userList=[]
          this.vipUserQueryParam.page.current=1
          this.onLoad()
        }
      })
    }
  },
  created() {
    this.$axios.post("/getHairMaster", "{}").then(res => {
      this.hairMasters = res.data.data
    })
    if (this.$route.params.userName!=null){
      this.vipUserQueryParam.searchParam=this.$route.params.userName
    }
  }
}
</script>

