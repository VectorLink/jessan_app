import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:localStorage.getItem("token"),
    userInfo:JSON.parse(sessionStorage.getItem("userInfo")),
    historyUserInfo:JSON.parse(sessionStorage.getItem("historyUserInfo"))
  },
  getters: {
    GET_USER: state => {
      return state.userInfo
    },
    GET_HISTORY_USER: (state)=>{
      return state.historyUserInfo
    }
  },
  mutations: {
    SET_TOKEN:(state,token)=>{
      state.token=token
      localStorage.setItem("token",token)
    },
    SET_USERINFO:(state,userInfo)=>{
      state.userInfo=userInfo
      sessionStorage.setItem("userInfo",JSON.stringify(userInfo))
    },
    REMOVE_INFO:(state)=>{
      state.token=''
      state.userInfo={}
      localStorage.setItem("token",'')
      sessionStorage.setItem("userInfo",JSON.stringify(""))
    },
    SET_HISTORY_USER_INFO:(state,user)=>{
      state.historyUserInfo=user
      sessionStorage.setItem("historyUserInfo",JSON.stringify(user))
    }
  },
  actions: {
  },
  modules: {
  }
})
