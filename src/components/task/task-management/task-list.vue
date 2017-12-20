<template>
  <div class="box">
    <div class="list-head">
      <router-link to="/task/list/task-add">
        <el-button type="primary" plain>创建任务</el-button>
      </router-link>
      <el-button type="primary" @click="_del(multipleSelection)" plain>删除</el-button>
    </div>
    <div class="list-body">
      <el-table ref="multipleTable" v-loading="loading" :data="taskList.list" tooltip-effect="dark" max-height="500" style="width: 100%" border @selection-change="_handleSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="content" label="任务名称"></el-table-column>
        <el-table-column prop="deptNo" label="所属部门" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptNo" label="所属分类" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="options" label="操作" width="80">
          <template slot-scope="scope">
            <router-link :to="'/task/list/task-edit/' + scope.row.id">
              <i class="el-icon-edit"></i>
            </router-link>
            <i class="el-icon-delete" @click="_del(scope.row.id)"></i>
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
import {getTaskList, delTask} from 'api/task-management.js'
import {ERR_OK} from 'api/config.js'

export default {
  data () {
    return {
      multipleSelection: [],
      taskList: {
        list: [],
        page: 1,
        listRow: 10,
        total: 0
      },
      loading: false
    }
  },
  mounted () {
    this._getTaskList()
  },
  methods: {
    // 获取任务列表
    _getTaskList () {
      this.loading = true
      getTaskList(this.taskList.page, this.taskList.listRow).then((res) => {
        if (ERR_OK === res.data.code) {
          this.taskList.list = res.data.msg.list
          this.taskList.page = res.data.msg.page
          this.taskList.listRow = res.data.msg.listRow
          this.taskList.total = res.data.msg.total
          this.loading = false
        }
      })
    },
    handleSizeChange (val) {
      this.taskList.listRow = val
    },
    handleCurrentChange (val) {
      this.taskList.page = val
      this._getTaskList()
    },
    // 修改按钮触发
    _edit (pId) {
      console.log('edit   :' + pId)
    },
    // 删除按钮触发
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
    // 删除多选
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

