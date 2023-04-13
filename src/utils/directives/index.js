import store from '@/store'

export default {
  install(Vue) {
    Vue.directive('permission', {
      // 会在指令作用的元素插入到页面完成以后触发
      inserted(el, binding) {
        // el 指令作用的元素的dom对象
        console.log(el)
        const points = store.state.user.userInfo?.roles?.points || [] // 当前用户信息的操作权
        if (!points.includes(binding.value)) {
          // 不存在就要删除或者禁用
          el.remove() // 删除元素
          // el.disabled = true
          // 线上的权限数据和线下的代码进行对应
        }
      }
    })
  }
}
