<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="handleClose">
    <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input
          v-model="formData.name"
          placeholder="2-10个字符"
          style="width: 80%"
          size="mini"
        />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input
          v-model="formData.code"
          placeholder="2-10个字符"
          style="width: 80%"
          size="mini"
        />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <!-- 使用下拉菜单展示并选择内容 -->
        <el-select
          v-model="formData.managerId"
          placeholder="请选择负责人"
          style="width: 80%"
          size="mini"
        >
          <!-- v-model的值为当前被选中的el-option的 value 属性值 -->
          <el-option
            v-for="item in managerList"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input
          v-model="formData.introduce"
          placeholder="1-100个字符"
          type="textarea"
          size="mini"
          :rows="4"
          style="width: 80%"
        />
      </el-form-item>
      <el-form-item>
        <!-- 按钮 -->
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button
              size="mini"
              type="primary"
              @click="btnOk"
            >确定</el-button>
            <el-button size="mini" @click="handleClose">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getDepartment, getManagerList, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'
import { Message } from 'element-ui'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      managerList: [], // 存储负责人列表
      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      },
      rules: {
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '部门编码的长度为2-10个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              let res = await getDepartment()
              // 判断是不是编辑模式，新增模式的formData里面是没有id属性的
              if (this.formData.id) {
                // 排除自身 免于被校验
                res = res.filter(item => item.id !== this.formData.id)
              }
              if (res.some((item) => item.code === value)) {
                callback(new Error('已存在该编码！'))
              } else {
                callback()
              }
            }
          }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '部门介绍的长度为1-100个字符',
            trigger: 'blur'
          }
        ],
        managerId: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '部门名称的长度为2-10个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              const res = await getDepartment()
              if (res.some((item) => item.name === value)) {
                callback(new Error('已存在该名称！'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    // 关闭dialog
    handleClose() {
      this.formData = {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      }
      this.$refs.addDept.resetFields() // 重置表单
      this.$emit('update:showDialog', false)
    },
    // 获取部门负责人列表
    async getManagerList() {
      this.managerList = await getManagerList()
      // console.log('项目负责人列表', this.managerList)
    },
    // 确定按钮
    btnOk() {
      this.$refs.addDept.validate(async(isOk) => {
        if (isOk) {
          if (this.formData.id) {
            await updateDepartment(this.formData)
          } else {
            await addDepartment({ ...this.formData, pid: this.currentNodeId })
          }
          // 通知父组件更新
          this.$emit('updateDepartment')
          // 提示
          Message.success('操作成功!')
          // 关闭弹窗 重置表单
          this.handleClose()
        }
      })
    },
    // 获取组织的详情
    async getDepartmentDetail() {
      this.formData = await getDepartmentDetail(this.currentNodeId)
    }
  }
}
</script>
