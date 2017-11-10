<template>
  <div class="box">
    <div class="title">新增任务</div>
    <div class="container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="任务名称">
          <el-input v-model="form.content" class="process-name"></el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-select id="choiceComp" v-model="form.compValue" filterable placeholder="请选择公司" @change="form.deptValue = ''">
            <el-option v-for="(item, key, index) in compDept" :key="key" :label="item.name" :value="key"></el-option>
          </el-select>
          <el-select id="choiceDept" v-model="form.deptValue" filterable placeholder="请选择部门">
            <template v-if="form.compValue != ''">
              <el-option v-for="(item, key) in compDept[form.compValue].dept" :key="item.deptNo" :label="item.deptName" :value="item.deptNo"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="任务分类">
          <el-select v-model="form.typeValue" filterable placeholder="请选择分类">
            <el-option v-for="(item, key) in typeId" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程选择">
          <el-select v-model="form.processValue" filterable placeholder="请选择流程">
            <el-option v-for="(item, key) in processId" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务等级">
          <el-select v-model="form.tasklevel" filterable placeholder="请选择等级">
            <el-option v-for="(item, key) in level" :key="item.label" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期限日期">
          <el-date-picker v-model="form.timeLimit" type="month" placeholder="选择日期"></el-date-picker>
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
import { getCompDept } from 'api/process.js'
import { getType, getProcess, addTask } from 'api/task-management.js'
import {ERR_OK} from 'api/config.js'
// import { trim } from 'api/public.js'
export default {
  data () {
    return {
      form: {
        content: '',
        compValue: '',
        deptValue: '',
        typeValue: '',
        processValue: '',
        tasklevel: '',
        timeLimit: ''
      },
      compDept: [],
      typeId: [],
      processId: [],
      level: [
        {
          label: 'A'
        },
        {
          label: 'B'
        },
        {
          label: 'C'
        },
        {
          label: 'D'
        }
      ]
    }
  },
  mounted () {
    this._getCompDept()
  },
  methods: {
    _getCompDept () {
      getCompDept().then((res) => {
        if (res.data.code === 1) {
          this.compDept = res.data.data
        }
      })
      getType().then((res) => {
        if (res.data.code === 1) {
          this.typeId = res.data.msg
        }
      })
      getProcess().then((res) => {
        if (res.data.code === 1) {
          this.processId = res.data.msg
        }
      })
    },
    _onSubmit () {
      console.log(this.form)
      addTask(this.form).then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
          this._getCompDept()
        }
      })
    },
    // 取消按钮
    _cancel () {
      this.$router.go(-1)
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

