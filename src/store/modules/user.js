import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 实现token的Vuex数据持久化
const state = {
  token: getToken() || null,
  userInfo: {} // 这里有一个空对象，为了放置后面取数据报错
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
  }
}
const actions = {
  // 登录
  async login(context, data) {
    const token = await login(data)
    console.log(token)
    context.commit('setToken', token)
  },
  // 获取用户资料
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
  },
  // 退出登录的action
  logout(context) {
    context.commit('removeToken') // 删除token
    context.commit('setUserInfo', {}) // 设置用户信息为空对象
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

