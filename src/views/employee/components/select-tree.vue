<template>
  <!-- element-ui级联组件 -->
  <el-cascader
    v-model="props.value"
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
    @change="changeValue"
  />
</template>
<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      treeData: [], // 赋值给 级联组件的options
      props: {
        label: 'name', // 要展示的字段
        value: 'id' // 要存储的字段
      }
    }
  },
  created() {
    this.getDepartment() // 获取部门详情
  },
  methods: {
    // 获取部门详情
    async getDepartment() {
      this.treeData = transListToTreeData(await getDepartment()) // 将组织架构的数据 转化树形赋值给treeData
    },
    changeValue(list) {
      console.log(list)
      // 取到数组的最后一次
      if (list.length > 0) {
        this.$emit('input', list[list.length - 1]) // 将最后一位的id取出来 传出去
      } else {
        this.$emit('input', null) // 如果长度为0 说明值为空
      }
    }
  }
}
</script>
