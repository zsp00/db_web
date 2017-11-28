<template>
  <div class="box">
    <div class="list-head">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form :inline="true">
            <!-- <el-form-item label="部门名称">
              <el-select id="choiceComp" v-model="form.compValue" filterable placeholder="请选择公司" @change="search.taskDeptNo = ''">
                <el-option v-for="(item, key, index) in compDept" :key="key" :label="item.name" :value="key"></el-option>
              </el-select>
              <el-select id="choiceDept" v-model="search.taskDeptNo" filterable placeholder="请选择部门">
                <template v-if="form.compValue != ''">
                  <el-option v-for="(item, key) in compDept[form.compValue].dept" :key="item.deptNo" :label="item.deptName" :value="item.deptNo"></el-option>
                </template>
              </el-select>
            </el-form-item> -->
            <el-form-item label="等级配分">
              <el-select v-model="search.taskLevel" filterable allow-create width="100%" placeholder="请选择等级配分">
                <el-option v-for="item in levelValue" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类选择">
              <el-select v-model="search.taskType" filterable placeholder="请选择分类">
                <el-option v-for="(item, key) in taskTypeValue" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态选择">
              <el-select v-model="search.taskLevel" filterable placeholder="请选择状态">
                <el-option v-for="(item, key) in taskDataValue" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="搜索内容">
              <el-input v-model="search.keyword" placeholder="请输入搜索内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="_reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-button type="primary" @click="_supervice(taskList)">全部督办</el-button>
    </div>
    <div class="list-body">
      <el-table ref="multipleTable" v-loading="loading" :data="taskList" tooltip-effect="dark" max-height="700" style="width: 100%" border>
        <el-table-column prop="content" label="任务名称"></el-table-column>
        <!-- <el-table-column prop="pId" label="所属流程" width="110"></el-table-column> -->
        <el-table-column prop="deptNo" label="所属部门" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="taskType" label="所属分类" width="240"></el-table-column>  
        <el-table-column prop="level" label="任务等级" width="80"></el-table-column>      
        <el-table-column prop="timeLimit" label="期限" width="100"></el-table-column>
        <el-table-column prop="taskDataValue" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.taskDataValue === true ? 'success' : 'danger'" close-transition>{{ scope.row.taskDataValue == true ? '督办中' : '未开始' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="options" label="操作" width="110">
          <template slot-scope="scope">
            <el-button v-if="scope.row.taskDataValue == false" type="text" size="small"  @click="_supervice(scope.row.id)">开始督办</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getSuperviceList, taskSupervice, getTaskType } from 'api/task-management.js'
import { getCompDept } from 'api/process.js'
import {ERR_OK} from 'api/config.js'

export default {
  data () {
    return {
      taskList: [],
      loading: true,
      search: {
        taskLevel: '',                   // 任务的级别
        taskType: '',                    // 任务的分类
        taskDataStauts: '',              // 任务的状态（未开始，督办中）
        taskDeptNo: ''                   // 选择部门下拉框的值
      },
      form: {
        compValue: ''
      },
      taskTypeValue: [],
      compDept: [],                      // 选择部门下拉框值
      taskDataValue: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'false',
          label: '未督办'
        },
        {
          value: 'true',
          label: '督办中'
        }
      ],
      levelValue: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'A',
          label: 'A'
        },
        {
          value: 'B',
          label: 'B'
        },
        {
          value: 'C',
          label: 'C'
        },
        {
          value: 'D',
          label: 'D'
        }
      ]
    }
  },
  mounted () {
    this._getSuperviceList()
    this._getInfo()
  },
  methods: {
    // 获取任务列表
    _getSuperviceList () {
      getSuperviceList(this.search.keyword, this.search.taskLevel, this.search.taskType, this.search.taskDeptNo, this.search.taskDataStauts).then((res) => {
        if (ERR_OK === res.data.code) {
          this.taskList = res.data.msg
          this.loading = false
        }
      })
    },
    _getInfo () {
      getTaskType().then((res) => {
        if (ERR_OK === res.data.code) {
          this.taskTypeValue = res.data.msg
          var allType = {
            id: '',
            typeName: '全部'
          }
          this.taskTypeValue.splice(0, 0, allType)
        }
      })
      getCompDept().then((res) => {
        if (res.data.code === ERR_OK) {
          this.compDept = res.data.data
        }
      })
    },
    // 督办任务按钮
    _supervice (id) {
      this.$confirm('此操作将开始督办, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        taskSupervice(id).then((res) => {
          if (res.data.code === ERR_OK) {
            this.$message.success(res.data.msg)
            this._getSuperviceList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.warning('已取消！')
      })
    },
    // 条件筛选
    onSearch () {
      this._getSuperviceList()
    },
    // 重置
    _reset () {
      this.form.compValue = ''
      for (var obj in this.search) {
        this.search[obj] = ''
      }
    }
  }
}
</script>

<style scoped>
.box {
  margin: 20px;
}
.list-body {
  margin-top: 20px;
}
.list-body i {
  margin-right: 5px;
  cursor: pointer;
}
</style>

