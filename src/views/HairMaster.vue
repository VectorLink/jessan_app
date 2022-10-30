<template>
  <div>
    <form action="/">
      <van-search
          v-model="HairMasterParam.searchParam"
          show-action
          placeholder="请输入发型师名称或者登录名"
          @search="listMasters"
          @cancel="cancelSearch"
      />
    </form>
    <van-list ref="listContainer">
      <van-sticky container="listContainer">
        <van-button type="primary" @click="addHairMasterVisible=true" v-show="isEditBillButtonShow">添加发型师</van-button>
      </van-sticky>
      <van-cell-group  v-for="(master,index) in hairMaster" inset :title="master.hairMasterName" :key="index" >
        <van-card >
          <template #tags>
            <van-cell title="发型师ID" :value="master.hairMasterId"/>
            <van-cell title="登录名" :value="master.hairMasterCode"/>
            <van-cell title="类型" :value="master.type===0?'管理员':'发型师'"/>
            <van-cell title="状态" :value="master.status===0?'禁用':'启用'"/>
            <van-cell title="创建时间" :value="master.createTime"/>
            <van-cell title="更新时间" :value="master.updateTime"/>
            <van-cell>
              <van-button type="primary" size="small"  @click="editHairMaster(master)" v-show="isEditBillButtonShow">更改信息</van-button>
              <van-button type="primary" size="small" @click="jumpToBill(master)">查看账目</van-button>
            </van-cell>
          </template>
        </van-card>
      </van-cell-group>
    </van-list>
    <van-popup v-model="editHairMasterVisible" >
      <van-form @submit="updateHairMaster">
        <van-field
            v-model="hairMasterModel.hairMasterId"
            name="发型师编号"
            label="发型师编号"
            placeholder="发型师编号"
            readonly
        />
        <van-field
            v-model="hairMasterModel.hairMasterName"
            name="发型师姓名"
            label="发型师姓名"
            placeholder="发型师姓名"
            :rules="[{ required: true, message: '请填写发型师姓名',trigger:'blur' }]"
        />
        <van-field
            v-model="hairMasterModel.hairMasterCode"
            name="发型师登录名"
            label="发型师登录名"
            placeholder="发型师登录名"
            readonly
        />
        <van-field name="radio" label="角色">
          <template #input>
            <van-radio-group v-model="hairMasterModel.type" direction="horizontal" @change>
              <van-radio name=0>店长</van-radio>
              <van-radio name=1>发型师</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field name="radio" label="状态">
          <template #input>
            <van-radio-group v-model="hairMasterModel.status" direction="horizontal" @change>
              <van-radio name=0>禁用</van-radio>
              <van-radio name=1>启用</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-model="hairMasterModel.password" type="password" label="密码"
        :rules="[{required:true,message:'请填写密码'},{min:6,max:20,message: '请填写大于6位数小于20位的密码',trigger:'blur'}]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </van-popup>
    <van-popup v-model="addHairMasterVisible" >
      <van-form @submit="updateHairMaster">
        <van-field
            v-model="hairMasterModel.hairMasterName"
            name="发型师姓名"
            label="发型师姓名"
            placeholder="发型师姓名"
            :rules="[{ required: true, message: '请填写发型师姓名' ,trigger:'blur'}]"
        />
        <van-field
            v-model="hairMasterModel.hairMasterCode"
            name="发型师登录名"
            label="发型师登录名"
            placeholder="发型师登录名"
        />
        <van-field name="radio" label="角色">
          <template #input>
            <van-radio-group v-model="hairMasterModel.type" direction="horizontal" @change>
              <van-radio name=0>店长</van-radio>
              <van-radio name=1>发型师</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field name="radio" label="状态">
          <template #input>
            <van-radio-group v-model="hairMasterModel.status" direction="horizontal" @change>
              <van-radio name=1>启用</van-radio>
              <van-radio name=0>禁用</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-model="hairMasterModel.password" type="password" label="密码"
                   :rules="[{required:true,message:'请填写密码',trigger:'blur'}
                   ,{ min: 6, max: 20,message: '请填写大于6位数小于20位的密码',trigger:'blur'}]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
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
      hairMaster: [],
      HairMasterParam: {
        searchParam: null,
        page: {
          current: 1,
          total: 10,
          size: 10,
          pages: 0
        }
      },
      editHairMasterVisible:false,
      addHairMasterVisible:false,
      hairMasterModel:{
        type:null,
        status:null,
        hairMasterId:null,
        hairMasterName:null,
        hairMasterCode:null,
        password:null
      },
      isEditBillButtonShow:false
    }
  },
  methods: {
    cancelSearch() {
      this.HairMasterParam.searchParam=''
      this.hairMaster=[]
      this.HairMasterParam.page.current=1
      this.listMasters()
    },
    listMasters() {
        this.$axios.post("/listHairMaster", this.HairMasterParam).then(res => {
          if (res.data.code === 0) {
            this.hairMaster = res.data.data.data
            this.HairMasterParam.page=res.data.data.page
          }else {
            this.$toast.fail("获取数据失败··")
          }
        })
    },
    editHairMaster(val) {
      this.hairMasterModel.status=val.status.toString()
      this.hairMasterModel.type=val.type.toString()
      this.hairMasterModel.hairMasterName=val.hairMasterName
      this.hairMasterModel.hairMasterCode=val.hairMasterCode
      this.hairMasterModel.hairMasterId=val.hairMasterId
      this.editHairMasterVisible=true
    },
    jumpToBill(val){
      this.$router.push({
        name: "hairMasterBill",
        params: {
          hairMasterId: val.hairMasterId.toString(),
          hairMasterName:val.hairMasterName
        }
      });
    },
    updateHairMaster(){
      this.$axios.post("/saveOrderUpdateMaster",this.hairMasterModel).then(resp=>{
        if (resp.data.code===0){
          this.$toast.success("操作成功")
          this.editHairMasterVisible = false;
          this.listMasters();
          this.hairMasterModel.status=null
          this.hairMasterModel.hairMasterId=null
          this.hairMasterModel.type=null
          this.hairMasterModel.password=null
          this.hairMasterModel.hairMasterCode=null
          this.hairMasterModel.hairMasterName=null
          if (this.addHairMasterVisible){
            this.addHairMasterVisible=false
          }
          if (this.editHairMasterVisible){
            this.editHairMasterVisible=false;
          }
        }
      })
    }
  },
  created() {
    this.listMasters()
    this.isEditBillButtonShow=this.$store.getters.GET_USER.type === 0
  }
}
</script>

