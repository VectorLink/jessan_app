import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import 'vant/lib/index.css'
import '@/vantui'
import '@/axios'
import vueSign from "vue-esign"


Vue.config.productionTip = false
Vue.prototype.$axios=axios
Vue.use(vueSign);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
