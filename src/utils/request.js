import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
// 创建一个新的axios实例
const service = axios.create({
  // process是node的全局模块，可以通过它来获得node进程相关的信息
  baseURL: process.env.VUE_APP_BASE_API, // 请求基地址
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      // 统一携带请求头
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, message, success } = response.data
    // 判断是不是Blob
    if (response.data instanceof Blob) return response.data
    if (success) {
      return data
    } else {
      Message({ type: 'error', message })
      return Promise.reject(new Error(message))
    }
  },
  async(error) => {
    // 处理token过期的错误
    if (error.response.status === 401) {
      Message({ type: 'warning', message: 'token超时了' })
      await store.dispatch('user/logout')
      router.push('/login') // 跳转到登录页
      return Promise.reject(error)
    }
    Message({ type: 'error', message: error.message })
    return Promise.reject(error)
  }
)
export default service
