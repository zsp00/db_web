<template>
  <div class="box">
    <div style="height:40px;">本月督办任务{{ taskList.number.allTotal }}个，已督办{{ taskList.number.supNum}}个</div>
    <div class="list-head">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form :inline="true">
            <!-- <el-form-item>
              <el-cascader :options="compDept" v-model="search.taskDeptNo" placeholder="部门名称"></el-cascader>
            </el-form-item> -->
            <!-- <el-form-item>
              <el-select v-model="search.taskLevel" filterable allow-create width="100%" placeholder="请选择等级配分">
                <el-option v-for="item in levelValue" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-select v-model="search.taskType" filterable placeholder="请选择分类">
                <el-option v-for="(item, key) in taskTypeValue" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="search.taskDataStauts" filterable placeholder="请选择状态">
                <el-option v-for="(item, key) in taskDataValue" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="search.keyword" placeholder="请输入搜索内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch" plain icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-button type="primary" @click="_supervice(taskList.list)" plain>全部督办</el-button>
    </div>
    <div class="list-body">
      <el-table ref="multipleTable" v-loading="loading" :data="taskList.list" tooltip-effect="dark" max-height="500" style="width: 100%" border>
        <el-table-column prop="content" label="任务名称"></el-table-column>
        <!-- <el-table-column prop="pId" label="所属流程" width="110"></el-table-column> -->
        <el-table-column prop="deptNo" label="所属部门" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="taskType" label="所属分类" width="240"></el-table-column>  
        <!-- <el-table-column prop="level" label="任务等级" width="80"></el-table-column>      
        <el-table-column prop="timeLimit" label="期限" width="100"></el-table-column> -->
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
import { getSuperviceList, taskSupervice, getTaskType } from 'api/task-management.js'
import { getCompDept } from 'api/process.js'
import {ERR_OK} from 'api/config.js'

export default {
  data () {
    return {
      taskList: {
        list: [],
        page: 1,
        listRow: 10,
        total: 0,
        number: []
      },
      loading: true,
      search: {
        taskLevel: '',                   // 任务的级别
        taskType: '',                    // 任务的分类
        taskDataStauts: '',              // 任务的状态（未开始，督办中）
        taskDeptNo: null                   // 选择部门下拉框的值
      },
      form: {
        compValue: ''
      },
      taskTypeValue: [],
      compDept: [],                      // 选择部门下拉框值
      taskDataValue: [
        {
          value: '',
          label: '全部状态'
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
      getSuperviceList(this.search.keyword, this.search.taskLevel, this.search.taskType, this.search.taskDeptNo, this.search.taskDataStauts, this.taskList.page, this.taskList.listRow).then((res) => {
        if (ERR_OK === res.data.code) {
          this.taskList.list = res.data.msg.list
          this.taskList.page = res.data.msg.page
          this.taskList.listRow = res.data.msg.listRow
          this.taskList.total = res.data.msg.total
          this.taskList.number = res.data.msg.number
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
            typeName: '全部分类'
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
    handleSizeChange (val) {
      this.taskList.listRow = val
    },
    handleCurrentChange (val) {
      this.taskList.page = val
      this._getSuperviceList()
    },
    // 督办任务按钮
    _supervice (id) {
      this.$confirm('此操作将开始督办, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        taskSupervice(id).then((res) => {
          if (res.data.code === ERR_OK) {
            this.$message.success(res.data.msg)
            this._getSuperviceList()
            this.loading = false
          } else {
            this.$message.error(res.data.msg)
            this._getSuperviceList()
            this.loading = false
          }
        })
      }).catch(() => {
        this.$message.warning('已取消！')
      })
    },
    // 条件筛选
    onSearch () {
      this._getSuperviceList()
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

