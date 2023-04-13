<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button v-permission="'add-employee'" size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar
                v-if="row.staffPhoto"
                :src="row.staffPhoto"
                :size="30"
              />
              <span v-else class="username">{{ row.username?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" align="center" />
          <el-table-column
            prop="mobile"
            label="手机号"
            sortable
            align="center"
          />
          <el-table-column
            prop="workNumber"
            label="工号"
            sortable
            align="center"
          />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
            align="center"
          >
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" align="center" />
          <el-table-column
            prop="timeOfEntry"
            label="入职时间"
            sortable
            align="center"
          />
          <el-table-column label="操作" width="280px" align="center">
            <template v-slot="{row}">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text">角色</el-button>
              <el-button size="mini" type="text" @click="delEmployee(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <import-excel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
import { getEmployeeList, exportEmployee, delEmployee } from '@/api/employee'
import { transListToTreeData } from '@/utils'
import ImportExcel from './components/import-excel.vue'
import FileSaver from 'file-saver'
import { Message } from 'element-ui'

export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      depts: [], // 组织数据
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 存储查询参数
      queryParams: {
        departmentId: null,
        page: 1, // 当前页码
        pagesize: 10,
        // 模糊搜索关键词
        keyWord: ''
      },
      total: 0, // 记录员工的总数
      // 员工列表
      list: [],
      // 是否展示excel上传dialog
      showExcelDialog: false
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    // 获取员工列表
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    // 部门信息
    async getDepartment() {
      this.depts = transListToTreeData(await getDepartment())
      this.queryParams.departmentId = this.depts[0].id
      // 做一下高亮处理
      this.$nextTick(() => {
        // 一开始高亮选中的节点
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      this.getEmployeeList()
    },
    // 切换节点时触发
    selectNode(node) {
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1 // 设置第一页
      this.getEmployeeList()
    },
    // 改变页数
    changePage(newPage) {
      this.queryParams.page = newPage
      this.getEmployeeList() // 查询数据
    },
    // 监听输入框进行模糊搜索
    changeValue() {
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 500)
    },
    // 导出员工列表
    async exportEmployee() {
      const result = await exportEmployee()
      console.log(result)
      // FileSaver.saveAs(blob对象,文件名称)
      FileSaver.saveAs(result, '员工信息表.xlsx') // 下载文件
    },
    // 删除员工
    delEmployee(row) {
      this.$confirm('删除后无法恢复,你还要继续吗?', '删除用户信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirm'
      }).then(async() => {
        await delEmployee(row.id)
        if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
        Message.success('删除成功!')
        this.getEmployeeList()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin: 10px;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04c9be;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
