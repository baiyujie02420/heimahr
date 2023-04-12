
import request from '@/utils/request'
// 获取-权限点列表
/** *
 * 获取权限列表
 * **/

export function getPermissionList() {
  return request({
    url: '/sys/permission'
  })
}
