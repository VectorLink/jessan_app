<template>
  <div>
    <van-form @submit="loginSubmit">
      <van-field
          v-model="loginData.username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="loginData.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>

export default {
  name: 'LoginView',
  data(){
    return  {
      loginData: {
        username: '',
        password: ''
      }
    };
  },
  methods:{
    loginSubmit(values) {
      console.log('submit', values);
      this.$axios.post("/login",this.loginData).then(res=>{
        const token=res.headers["authorization"]
        const userInfo=res.data.data
        this.$store.commit("SET_TOKEN",token)
        this.$store.commit("SET_USERINFO",userInfo)
        if (res.data.code===0){
          this.$router.push("/vipUser")
        }
      })
    },
  }
}
</script>
