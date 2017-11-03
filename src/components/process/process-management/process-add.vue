<template>
  <div class="box">
    <div class="title">新增流程</div>
    <div class="container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="流程名称">
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
        <el-form-item label="流程级次">
          <el-button @click="_addOne">添加一级</el-button>
          <el-button @click="_delOne">删除一级</el-button>
        </el-form-item>
        <div class="all-process">
          <div v-for="n in processCount" :key="n" class="process-one-border">
            <el-form-item :label="'第' + n + '级流程'">
              <el-form-item label="审核人" class="process-one">
                <el-input v-model="form.process[n].auditor"></el-input>
              </el-form-item>
              <el-form-item label="不包含" class="process-one">
                <el-input v-model="form.process[n].notIn"></el-input>
              </el-form-item>
              <el-form-item label="" class="process-one process-one-del">
                <el-button @click="_delThisOne(n)">DEL</el-button>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="form.process[n].describe" class="process-describe"></el-input>
              </el-form-item>
            </el-form-item>
          </div>
        </div>
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
import { trim } from 'api/public.js'
export default {
  data () {
    return {
      form: {
        name: '',
        compValue: '',                 // 选择公司下拉框的值，
        deptValue: '',                 // 选择部门下拉框的值
        process: [                     // 流程
          {},
          {
            auditor: '',
            notIn: '',
            describe: ''
          }
        ]
      },
      compDept: [],                    // 选择部门下拉框值
      processCount: 1                 // 流程级次数量
    }
  },
  mounted () {
    getCompDept().then((res) => {
      if (res.data.code === 1) {
        this.compDept = res.data.data
      }
    })
  },
  methods: {
    _addOne () {
      var newObj = {
        auditor: '',
        notIn: '',
        describe: ''
      }
      this.form.process.push(newObj)
      this.processCount++
    },
    _delOne () {
      this.form.process.splice(this.processCount)
      this.processCount--
    },
    _delThisOne (n) {
      this.form.process.splice(n, 1)
      this.processCount--
    },
    _onSubmit () {
      if (!this._checkData()) {
        return false
      }
      addProcess(this.form).then((res) => {
        if (res.data.code === 1) {
          this.$router.push('/process/process-list')
        }
      })
    },
    _cancel () {
      this.$router.push('/process/process-list')
    },
    _checkData () {
      if (trim(this.form.name) === '') {
        this.$message.error('流程名称不能为空！')
        return false
      }
      if (this.form.compValue === '' || this.form.deptValue === '') {
        this.$message.error('您必须选择一个部门！')
        return false
      }
      for (var i in this.form.process) {
        if (i === '0') {
          continue
        }
        if (trim(this.form.process[i].auditor) === '') {
          this.$message.error('步骤中' + i + '的审核人不能为空！')
          return false
        }
        if (trim(this.form.process[i].describe) === '') {
          this.$message.error('步骤中' + i + '的描述不能为空！')
          return false
        }
      }
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

