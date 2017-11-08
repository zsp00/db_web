<template>
  <div class="box">
    <div class="title">新增任务</div>
    <div class="container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="任务名称">
          <el-input v-model="form.name" class="process-name"></el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-select id="choiceComp" v-model="form.compValue" filterable placeholder="请选择公司">
            <el-option v-for="(item, key, index) in compDept" :key="key" :label="item.name" :value="key"></el-option>
          </el-select>
          <el-select id="choiceDept" v-model="form.deptValue" filterable placeholder="请选择部门">
            <template v-if="form.compValue != ''">
              <el-option v-for="(item, key) in compDept[form.compValue].dept" :key="item.deptNo" :label="item.deptName" :value="item.deptNo"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="_onSubmit">立即创建</el-button>
          <el-button @click="_cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>  
  </div>
</template>

<script>
import { getCompDept, addProcess } from 'api/process.js'
// import { trim } from 'api/public.js'
export default {
  data () {
    return {
      form: {
        name: '',
        compValue: '',
        deptValue: ''
      },
      compDept: []
    }
  },
  mounted () {
    this._getCompDept
  },
  methods: {
    _getCompDept () {
      getCompDept().then((res) => {
        if (res.data.code === 1) {
          this.compDept = res.data.data
        }
      })
    },
    _onSubmit () {
      if (!this._checkData()) {
        return false
      }
      addProcess(this.form).then((res) => {
        if (res.data.code === 1) {
          this.$message.success('新增流程成功！')
          this.$router.push('/process/process-list')
        } else {
          this.$message.error('新增流程失败！')
          console.log(res.data.msg)
        }
      })
    },
    // 取消按钮
    _cancel () {
      this.$router.push('/task/list/task-list')
    }
  }
}
</script>

<style scoped>
.box {
  margin: 20px;
}
.title {
  padding-bottom: 20px;
  border-bottom: solid 2px #ccc;
  margin-bottom: 30px;
}
.container {
  margin-left: 20px;
}
#choiceDept {
  margin-left: 20px;
}
.process-name {
  width: 50%;
}
.all-process {
  border: solid 1px #ccc;
  margin-bottom: 20px;
}
.process-one-border {
  border-bottom: solid 1px #eee;
  padding-top: 20px;
}
.process-one {
  display: inline-block;
  width: 30%;
  margin-bottom: 20px;
}
.process-one-del {
  margin-left: 15px;
}
.process-describe {
  width: 50%;
}
</style>

