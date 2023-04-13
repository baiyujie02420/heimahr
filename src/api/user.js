import request from '@/utils/request'
// 用户登录
export function login(data) {
  return request({
    url: 'sys/login',
    method: 'post',
    data
  })
}
// 获取用户资料
export function getUserInfo() {
  return request({
    url: '/sys/profile'
  })
}
/**
 * 更新密码
 * **/
export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}

export function getUserDetailById() {
  return request({
    url: '/sys/profile'
  })
}
