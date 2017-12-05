<template>
  <div class="box">
    <div class="list-head">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form :inline="true">
            <!-- <el-form-item label="等级配分">
              <el-select v-model="search.taskLevel" filterable allow-create width="100%" placeholder="请选择等级配分">
                <el-option v-for="item in levelValue" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-input v-model="search.leaderFirst" placeholder="牵头领导"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="search.leaderSecond" placeholder="二级任务责任领导"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="search.leaderThird" placeholder="三级任务责任领导"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="search.taskDataStauts" filterable placeholder="状态选择">
                <el-option v-for="(item, key) in taskDataValue" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-cascader :options="compDept" v-model="search.deptValue" placeholder="部门名称"></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-select v-model="search.taskType" filterable placeholder="分类选择">
                <el-option v-for="(item, key) in taskType" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker type="month" placeholder="选择日期" v-model="search.timeLimit" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input v-model="search.keyword" placeholder="搜索内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain icon="el-icon-search" @click="onSearch">搜索</el-button>
              <el-button type="primary" plain icon="el-icon-delete" @click="_reset">重置</el-button>
              <el-button type="primary" plain icon="el-icon-upload2" @click="_export">导出</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="list-body">
      <el-table ref="multipleTable" v-loading="loading" :data="taskList.list" :cell-style="_hasBackground" tooltip-effect="dark" max-height="630" style="width: 100%" border>
        <el-table-column prop="serialNum" label="序号" fixed width="60" align="center"></el-table-column>
        <el-table-column prop="title1" label="一级目标任务(目标)" width="150" align="center"></el-table-column>
        <el-table-column prop="detail1" label="一级目标任务(目标)" width="220" align="center"></el-table-column>
        <el-table-column prop="leader1" label="牵头领导" align="center"></el-table-column>

        <el-table-column prop="title2" label="二级目标任务(任务)" width="150" align="center"></el-table-column>
        <el-table-column prop="detail2" label="二级目标任务(任务)" width="250" align="center"></el-table-column>
        <el-table-column prop="leader2" label="责任领导" align="center"></el-table-column>
        <el-table-column prop="deptNo2" label="责任部室" align="center"></el-table-column>

        <el-table-column prop="detail3" label="三级目标任务(举措)" width="180" align="center"></el-table-column>
        <el-table-column prop="duty3" label="三级目标任务(举措)" width="150" align="center"></el-table-column>
        <el-table-column prop="leader3" label="责任领导" align="center"></el-table-column>

        <el-table-column prop="deptNo" label="责任部室、二级单位" width="150" align="center"></el-table-column>
        <el-table-column prop="duty" label="目标任务" align="center"></el-table-column>
        <el-table-column prop="content" label="2017年度实施计划" width="300" align="center"></el-table-column>

        <el-table-column prop="complete" label="完成情况" width="220" align="center"></el-table-column>
        <el-table-column prop="problem" label="问题建议" width="220" align="center"></el-table-column>
        <el-table-column prop="analysis" label="原因分析" width="380" align="center"></el-table-column>
        <el-table-column prop="taskType" label="所属分类" width="240" align="center"></el-table-column>  
        <el-table-column label="状态" width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 3 ? 'success' : 'danger'">{{ scope.row.status == '3' ? '已完成' : '未完成' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="taskList.page"
          :page-size="taskList.listRow"
          layout="total, prev, pager, next"
          :total="taskList.total">
        </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import { getTaskList, getTypeList, exportList } from 'api/task.js'
import { getCompDept } from 'api/process.js'
import {ERR_OK} from 'api/config.js'

export default {
  data () {
    return {
      search: {
        keyword: '',
        taskLevel: '',                   // 任务等级配分
        taskType: '',                    // 任务分类
        taskDataStauts: '',              // 任务状态
        deptValue: [],                   // 选择部门下拉框的值
        timeLimit: '',                   // 期限
        leaderFirst: '',                 // 牵头领导
        leaderSecond: '',                // 第二级责任领导
        leaderThird: ''                  // 第三级责任领导
      },
      compDept: [],                      // 选择部门下拉框值
      taskType: [],                      // 任务分类
      levelValue: [
        {
          value: '',
          label: '全部等级'
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
      taskList: {                     // 后台返回的任务列表
        list: [],
        page: 1,
        listRow: 10,
        total: 0
      },
      loading: true
    }
  },
  mounted () {
    this._getTaskList()
    this._getInfo()
    this._getCompDept()
  },
  methods: {
    handleSizeChange (val) {
      this.taskList.listRow = val
      // this._getTaskList()
    },
    handleCurrentChange (val) {
      this.taskList.page = val
      this._getTaskList()
    },
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
      getTaskList(this.search, this.taskList.page, this.taskList.listRow).then((res) => {
        this.taskList = []
        if (ERR_OK === res.data.code) {
          this.taskList.list = res.data.data.list
          this.taskList.page = res.data.data.page
          this.taskList.listRow = res.data.data.listRow
          this.taskList.total = res.data.data.total
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
            typeName: '全部分类'
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
      this.search.keyword = ''
      this.search.taskLevel = ''
      this.search.taskType = ''
      this.search.taskDataStauts = ''
      this.search.deptValue = []
      this.search.timeLimit = ''
      this.search.leaderFirst = ''
      this.search.leaderSecond = ''
      this.search.leaderThird = ''
    },
    _export () {
      exportList(this.search).then((res) => {
      })
    },
    _hasBackground (row, rowIndex) {
      if (row.columnIndex === 15 || row.columnIndex === 16 || row.columnIndex === 14) {
        return 'background:white'
      } else {
        return 'background:#fafafa'
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
.pagination {
  text-align: right;
  padding-top: 10px;
}
</style>

