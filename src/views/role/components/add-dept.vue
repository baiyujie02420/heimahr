<template>
  <el-dialog width="500px" title="新增角色" :visible="showDialog" @close="btnCancel">
    <!-- 表单内容 -->
    <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name" style="width:300px" size="mini" />
      </el-form-item>
      <el-form-item label="启用" prop="state">
        <el-switch v-model="roleForm.state" size="mini" />
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width:300px" size="mini" />
      </el-form-item>
      <!-- 自定义 start -->
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="btnOk">确定</el-button>
            <el-button size="mini" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- end -->
    </el-form>
  </el-dialog>
</template>

<script>
import { addRole } from '@/api/role'
import { Message } from 'element-ui'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: '',
        state: 0 // 默认未1启用 关闭 0 打开1
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    btnOk() {
      this.$refs.roleForm.validate(async(isOk) => {
        if (isOk) {
          await addRole(this.roleForm)
          Message.success('操作成功!')
          this.btnCancel()
          this.$parent.getRoleList()
        }
      })
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: '',
        state: 0 // 默认未1启用 关闭 0 打开1
      }
      this.$refs.roleForm.resetFields() // 重置表单数据
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
