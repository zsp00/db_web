<template>
  <div class="box">
    <el-row>
      <el-col :span="18">
        <el-form ref="form" :model="form" label-width="80px" label-position="top">
          <el-form-item label="拥有查看所有任务列表的人员Id">
            <el-input type="textarea" v-model="form.empNo" :rows="5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="_save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { save, getAuthorityEmpList } from 'api/tasklist-authority.js'
export default {
  data () {
    return {
      form: {
        empNo: ''
      }
    }
  },
  mounted () {
    this._getAuthorityEmpList()
  },
  methods: {
    _save () {
      save(this.form.empNo).then((res) => {
        if (res.data.code === 1) {
          this.$message.success('保存成功！')
        } else {
          this.$message.error('保存失败！')
        }
      })
    },
    _getAuthorityEmpList () {
      getAuthorityEmpList().then((res) => {
        if (res.data.code === 1) {
          this.form.empNo = res.data.data
        } else {
          this.form.empNo = ''
          this.$message.error('获取人员列表失败！')
        }
      })
    }
  }
}
</script>

<style scoped>
.box {
  margin: 60px 20px 20px 20px;
}
</style>

