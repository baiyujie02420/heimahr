/**
 *
 * 列表型数据转化树形
*/
export function transListToTreeData(list, rootValue = 0) {
  const arr = []
  list.forEach(item => {
    if (item.pid === rootValue) {
      // 找到了匹配的节点
      arr.push(item)
      // 当前节点的id 和 当前节点的子节点的pid是想等的
      const children = transListToTreeData(list, item.id) // 找到的节点的子节点
      item.children = children // 将子节点赋值给当前节点
    }
  })
  return arr
}
