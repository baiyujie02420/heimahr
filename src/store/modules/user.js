import { login, getUserInfo } from '@/api/user'
import { constantRoutes, resetRouter } from '@/router'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 实现token的Vuex数据持久化
const state = {
  token: getToken() || null,
  userInfo: {}, // 这里有一个空对象，为了放置后面取数据报错
  routes: constantRoutes // 路由信息
}
const mutations = {
  // 存token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 删token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 存用户资料
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 添加动态路由
  setRoutes(state, newRouters) {
    state.routes = [...constantRoutes, ...newRouters] // 静态路由+动态路由
  }
}
const actions = {
  // 登录
  async login(context, data) {
    const token = await login(data)
    console.log('token', token)
    context.commit('setToken', token)
  },
  // 获取用户资料
  async getUserInfo(context) {
    const result = await getUserInfo()
    console.log('用户资料', result)
    context.commit('setUserInfo', result)
    return result
  },
  // 退出登录的action
  logout(context) {
    context.commit('removeToken') // 删除token
    context.commit('setUserInfo', {}) // 设置用户信息为空对象
    resetRouter() // 重置路由
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

