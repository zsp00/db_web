<template>
  <div class="box">
    <div class="list-head">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form :inline="true">
            <el-form-item label="等级配分">
              <el-select v-model="search.taskLevel" filterable allow-create width="100%" placeholder="请选择等级配分">
                <el-option v-for="item in levelValue" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="牵头领导">
              <el-input v-model="search.leaderFirst"></el-input>
            </el-form-item>
            <el-form-item label="二级任务责任领导">
              <el-input v-model="search.leaderSecond"></el-input>
            </el-form-item>
            <el-form-item label="三级任务责任领导">
              <el-input v-model="search.leaderThird"></el-input>
            </el-form-item>
            <el-form-item label="状态选择">
              <el-select v-model="search.taskDataStauts" filterable placeholder="请选择状态">
                <el-option v-for="(item, key) in taskDataValue" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门名称">
              <el-select id="choiceComp" v-model="form.compValue" filterable placeholder="请选择公司" @change="search.deptValue = ''">
                <el-option v-for="(item, key, index) in compDept" :key="key" :label="item.name" :value="key"></el-option>
              </el-select>
              <el-select id="choiceDept" v-model="search.deptValue" filterable placeholder="请选择部门">
                <template v-if="form.compValue != ''">
                  <el-option v-for="(item, key) in compDept[form.compValue].dept" :key="item.deptNo" :label="item.deptName" :value="item.deptNo"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="分类选择">
              <el-select v-model="search.taskType" filterable placeholder="请选择分类">
                <el-option v-for="(item, key) in taskType" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="期限">
              <el-date-picker type="month" placeholder="选择日期" v-model="search.timeLimit" style="width: 100%;"></el-date-picker>
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
    </div>
    <div class="list-body">
      <!-- <el-table ref="multipleTable" v-loading="loading" :data="taskList" :span-method="_cellMerge" tooltip-effect="dark" max-height="680" style="width: 100%" border> -->
      <el-table ref="multipleTable" v-loading="loading" :data="taskList" :cell-style="_hasBackground" tooltip-effect="dark" max-height="680" style="width: 100%" border>
        <el-table-column prop="serialNum" label="序号" fixed width="60"></el-table-column>
        <el-table-column prop="title1" label="一级目标任务(目标)" width="110"></el-table-column>
        <el-table-column prop="detail1" label="一级目标任务(目标)" width="150"></el-table-column>
        <el-table-column prop="leader1" label="牵头领导"></el-table-column>

        <el-table-column prop="title2" label="二级目标任务(任务)" width="110"></el-table-column>
        <el-table-column prop="detail2" label="二级目标任务(任务)" width="200"></el-table-column>
        <el-table-column prop="leader2" label="责任领导"></el-table-column>
        <el-table-column prop="deptNo2" label="责任部室"></el-table-column>

        <el-table-column prop="detail3" label="三级目标任务(举措)" width="180"></el-table-column>
        <el-table-column prop="duty3" label="三级目标任务(举措)" width="110"></el-table-column>
        <el-table-column prop="leader3" label="责任领导"></el-table-column>

        <el-table-column prop="deptNo" label="责任部室、二级单位" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="duty" label="目标任务"></el-table-column>
        <el-table-column prop="content" label="2017年度实施计划" width="300"></el-table-column>

        <el-table-column prop="complete" label="完成情况" width="220"></el-table-column>
        <el-table-column prop="problem" label="问题建议" width="220"></el-table-column>
        <el-table-column prop="analysis" label="原因分析" width="380"></el-table-column>
        <el-table-column prop="taskType" label="所属分类" width="240"></el-table-column>  
        <el-table-column label="状态" width="100" fixed="right">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 3 ? 'success' : 'danger'">{{ scope.row.status == 3 ? '已完成' : '未完成' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getTaskList, getTypeList } from 'api/task.js'
import { getCompDept } from 'api/process.js'
import {ERR_OK} from 'api/config.js'

export default {
  data () {
    return {
      search: {
        taskLevel: '',                   // 任务等级配分
        taskType: '',                    // 任务分类
        taskDataStauts: '',              // 任务状态
        deptValue: '',                   // 选择部门下拉框的值
        timeLimit: '',                   // 期限
        leaderFirst: '',                 // 牵头领导
        leaderSecond: '',                // 第二级责任领导
        leaderThird: ''                  // 第三级责任领导
      },
      form: {
        compValue: ''                    // 选择公司下拉框的值
      },
      compDept: [],                      // 选择部门下拉框值
      taskType: [],                      // 任务分类
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
      ],
      taskDataValue: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '已完成',
          value: '3'
        },
        {
          label: '未完成',
          value: '1'
        }
      ],
      multipleSelection: [],
      taskList: [],                 // 后台返回的任务列表
      loading: true
    }
  },
  mounted () {
    this._getTaskList()
    this._getInfo()
    this._getCompDept()
  },
  methods: {
    _getCompDept () {
      getCompDept().then((res) => {
        if (res.data.code === 1) {
          this.compDept = res.data.data
        }
      })
    },
    // 获取任务列表
    _getTaskList () {
      this.loading = true
      getTaskList(this.search).then((res) => {
        this.taskList = []
        if (ERR_OK === res.data.code) {
          this.taskList = res.data.data
          this.loading = false
        }
      })
    },
    _getInfo () {
      getTypeList().then((res) => {
        if (ERR_OK === res.data.code) {
          this.taskType = res.data.msg
          var allType = {
            id: '',
            typeName: '全部'
          }
          this.taskType.splice(0, 0, allType)
        }
      })
    },
    // 条件筛选
    onSearch () {
      this._getTaskList()
    },
    _reset () {
      this.form.compValue = ''
      for (var obj in this.search) {
        this.search[obj] = ''
      }
    },
    _cellMerge ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.serialNum[rowIndex] !== 0) {
          return [this.serialNum[rowIndex], 1]
        } else {
          return [0, 0]
        }
      } else if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
        if (this.title1[rowIndex] !== 0) {
          return [this.title1[rowIndex], 1]
        } else {
          return [0, 0]
        }
      } else if (columnIndex === 4) {
        if (this.title2[rowIndex] !== 0) {
          return [this.title2[rowIndex], 1]
        } else {
          return [0, 0]
        }
      } else if (columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
        if (this.detail2[rowIndex] !== 0) {
          return [this.detail2[rowIndex], 1]
        } else {
          return [0, 0]
        }
      } else if (columnIndex === 8) {
        if (this.detail3[rowIndex] !== 0) {
          return [this.detail3[rowIndex], 1]
        } else {
          return [0, 0]
        }
      } else if (columnIndex === 9) {
        if (this.duty3[rowIndex] !== 0) {
          return [this.duty3[rowIndex], 1]
        } else {
          return [0, 0]    // 不合并，需要保留该单元格占位则用[1, 1], 不需要保留单元格用[0, 0]
        }
      }
    },
    _hasBackground (row, rowIndex) {
      if (row.columnIndex === 15 || row.columnIndex === 16 || row.columnIndex === 14) {
        return 'background:white'
      } else {
        return 'background:#EEF1F6'
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
.has-background-color {
  background-color: #ccc;
}
</style>

