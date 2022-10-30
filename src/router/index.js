import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/LoginView.vue'

Vue.use(VueRouter)

const routes = [
  {
    // 登录
    path: '/',
    name: 'login',
    component: Login
  },
  {
    // 登录
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    // 会员管理
    path: '/vipUser',
    name: 'vipUser',
    component: () => import('@/views/VipUser.vue')
  },{
   // 发型师
  path: "/hairMaster",
    name: "hairMaster",
    component: ()=>import('@/views/HairMaster')
  }
  ,{
  // 添加会员
    path: "/addVipUser",
    name: "addVipUser",
    component: ()=>import('@/views/AddVipUser')
  }
  ,{
  // 个人信息
    path: "/personInfo",
    name: "personInfo",
    component: ()=>import('@/views/PersonInfo')
  },{
  // 消费记录
    path: "/history",
    name: "history",
    component: ()=>import('@/views/History')
  },
  {
    // 非会员入账
    path: "/inAccountBill",
    name: "inAccountBill",
    component: ()=>import('@/views/InAccountBill')
  },
  {
    // 统计信息
    path: "/statistic",
    name: "statistic",
    component: ()=>import('@/views/StoreStatistic')
  },{
     // 发型师账目
   path: "/hairMasterBill",
    name: "hairMasterBill",
    component: ()=>import('@/views/Bill')
  }
]

const router = new VueRouter({
  routes
})

export default router
