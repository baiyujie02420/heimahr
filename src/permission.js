import router from '@/router'
import { asyncRoutes } from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

/**
 *前置守卫
 *
*/
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 跳转到主页
      next('/') // 中转到主页
      // next（地址）并没有执行后置守卫
      nprogress.done()
    } else {
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // console.log(roles.menus)
        // 根据用户信息 筛选出用户的权限
        const filterRoutes = []
        for (let i = 0; i < asyncRoutes.length; i++) {
          asyncRoutes[i].children.forEach(item => {
            // console.log(item.name)
            if (roles.menus.includes(item.name)) {
              filterRoutes.push(asyncRoutes[i])
            }
          })
        }
        console.log('动态路由', filterRoutes)
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }]) // router添加动态路由
        // 路由的增加不是响应式的 所以我们还是要将路由放在vuex存起来
        store.commit('user/setRoutes', filterRoutes)
        next(to.path)
      }
      next() // 放行
      nprogress.done()
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
      nprogress.done()
    } else {
      next('/login') // 中转到登录页
      nprogress.done()
    }
  }
})
