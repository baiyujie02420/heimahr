<template>
  <div class="container">
    <div class="app-container">
      <el-tree
        default-expand-all
        :data="depts"
        :props="defaultProps"
        :expand-on-click-node="false"
      >
        <!-- 节点结构 -->
        <!-- v-slot="{ node, data }" 只能作用在template -->
        <template v-slot="{ data }">
          <el-row
            style="width: 100%; height: 40px"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <el-col>{{ data.name }}</el-col>
            <el-col :span="8">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- $event 实参 表示类型 -->
              <el-dropdown @command="handleCommand($event, data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <add-dept
      ref="dialog"
      :show-dialog.sync="showDialog"
      :current-node-id="currentNodeId"
      @updateDepartment="getDepartment()"
    />
  </div>
</template>
<script>
import { getDepartment, delDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'

export default {
  name: 'Department',
  components: {
    AddDept
  },
  data() {
    return {
      // depts: [{
      //   name: '传智教育',
      //   children: [
      //     { name: '总裁办' },
      //     { name: '行政部' },
      //     { name: '财务部' }
      //   ]
      // }],
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false,
      currentNodeId: null // 存储当前点击的id
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    // 获取组织架构数据
    async getDepartment() {
      const res = await getDepartment()
      // console.log(res)
      // 将数据转换为树形结构
      this.depts = transListToTreeData(res)
    },
    // 点击菜单项后会触发事件
    handleCommand(type, id) {
      if (type === 'add') {
        this.showDialog = true
        this.currentNodeId = id
      } else if (type === 'edit') {
        // 编辑部门场景
        this.showDialog = true
        this.currentNodeId = id // 记录id 要用它获取数据
        this.$nextTick(() => {
          // 父组件调用子组件的方法
          this.$refs.dialog.getDepartmentDetail()
        })
      } else {
        // 删除部门
        this.$confirm('你确定要删除该部门吗？').then(async() => {
          await delDepartment(id) // 提示消息
          this.$message.success('删除部门成功')
          this.getDepartment()
        })
      }
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}
.tree-manager {
  width: 50px;
  display: inline-block;
  margin: 10px;
}
</style>
