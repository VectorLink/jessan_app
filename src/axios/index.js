import axios from "axios"
import router from '../router'
import store from '../store'
import {Toast} from "vant";

//
// axios.defaults.baseURL = "http://124.220.161.241:8080"
axios.defaults.baseURL = "http://192.168.3.80:8080"
//前置拦截

axios.interceptors.request.use(request => {
    if (store.state.token!==null) {
        request.headers['authorization'] = store.state.token
    }
    return request;
})
//后置拦截
axios.interceptors.response.use(response => {
        const res = response.data;
        if (res.code === 0) {
            return response
        } else if (res.code===401){
            store.commit("REMOVE_INFO")
            router.push("/login")
            res.msg='未授权，请重新登录'
        }else {
            Toast.fail(res.msg)
            return Promise.reject(res.msg)
        }
    }, error => {
        if (error.response.data) {
            error.message = error.response.data.error
        }
        if (error.response.status === 401) {
            store.commit("REMOVE_INFO")
            router.push("/login")
            error.message='未授权，请重新登录'
        }
        Toast.fail(error.message)
        return Promise.reject(error.message)
    }
)
