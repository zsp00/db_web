<template>
  <div class="box">
    <div class="list-head">
      <el-button type="primary" @click="_supervice(multipleSelection)">全部督办</el-button>
    </div>
    <div class="list-body">
      <el-table ref="multipleTable" v-loading="loading" :data="taskList" tooltip-effect="dark" max-height="800" style="width: 100%" border @selection-change="_handleSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="content" label="任务名称"></el-table-column>
        <el-table-column prop="pId" label="所属流程" width="150"></el-table-column>
        <el-table-column prop="deptNo" label="所属部门" width="180" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="taskType" label="所属分类" width="110"></el-table-column>         -->
        <el-table-column prop="timeLimit" label="期限" width="140"></el-table-column>
        <el-table-column prop="taskDataValue" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.taskDataValue === true ? 'success' : 'danger'" close-transition>{{ scope.row.taskDataValue == true ? '督办中' : '未开始' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="options" label="操作" width="240">
          <template slot-scope="scope">
            <el-button v-if="scope.row.taskDataValue == false" type="text" size="small"  @click="_supervice(scope.row.id)">开始督办</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {getSuperviceList, taskSupervice} from 'api/task-management.js'
import {ERR_OK} from 'api/config.js'

export default {
  data () {
    return {
      multipleSelection: [],
      taskList: [],
      loading: false
    }
  },
  mounted () {
    this._getSuperviceList()
  },
  methods: {
    // 获取任务列表
    _getSuperviceList () {
      getSuperviceList().then((res) => {
        if (ERR_OK === res.data.code) {
          this.taskList = res.data.msg
          console.log(this.taskList)
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
        this.$message.warning('已取消删除！')
      })
    },
    // 督办多选
    _handleSelectionChange (val) {
      this.multipleSelection = val
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

