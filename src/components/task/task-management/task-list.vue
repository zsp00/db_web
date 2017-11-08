<template>
  <div class="box">
    <div class="list-head">
      <router-link to="/task/list/task-add">
        <el-button type="primary">创建任务</el-button>
      </router-link>
      <el-button type="primary" @click="_del(multipleSelection)">删除</el-button>
      <el-button type="primary">下发任务</el-button>
    </div>
    <div class="list-body">
      <el-table ref="multipleTable" v-loading="loading" :data="taskList" tooltip-effect="dark" max-height="700" style="width: 100%" border @selection-change="_handleSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="content" label="任务名称"></el-table-column>
        <el-table-column prop="pId" label="所属流程" width="150"></el-table-column>
        <el-table-column prop="deptNo" label="所属部门" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="typeId" label="所属分类" width="110"></el-table-column>        
        <el-table-column prop="releaseTime" label="创建时间" width="175"></el-table-column>
        <el-table-column prop="timeLimit" label="期限" width="140"></el-table-column>
        <el-table-column prop="completeTime" label="完成时间" width="175"></el-table-column>
        <el-table-column prop="options" label="操作" width="80">
          <template slot-scope="scope">
            <router-link :to="'/task/list/task-edit/' + scope.row.id">
              <i class="el-icon-edit"></i>
            </router-link>
            <i class="el-icon-delete" @click="_del(scope.row.id)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {getTaskList, delTask} from 'api/task-management.js'
import {ERR_OK} from 'api/config.js'

export default {
  data () {
    return {
      multipleSelection: [],                         // 多选记录
      taskList: [],                               // 任务列表
      loading: false                                  // 加载中
    }
  },
  mounted () {
    this._getTaskList()
  },
  methods: {
    _getTaskList () {
      getTaskList().then((res) => {
        if (ERR_OK === res.data.code) {
          this.taskList = res.data.msg
        }
      })
    },
    _edit (pId) {
      console.log('edit   :' + pId)
    },
    _del (id) {
      this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTask(id).then((res) => {
          if (res.data.code === ERR_OK) {
            this.$message.success(res.data.msg)
            this._getTaskList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.warning('已取消删除！')
      })
    },
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

