<template>
  <div class="box">
    <div class="list-head">
      <router-link to="/process/process-add">
        <el-button type="primary" plain>新增流程</el-button>
      </router-link>
      <el-button type="primary" @click="_del" plain>删除</el-button>
    </div>
    <div class="list-body">
      <el-table ref="multipleTable" v-loading="loading" :data="processList.list" tooltip-effect="dark" max-height="500" style="width: 100%" border @selection-change="_handleSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="流程名称"></el-table-column>
        <el-table-column prop="dept" label="所属部门" width="280" show-overflow-tooltip></el-table-column>
        <el-table-column prop="level" label="流程步骤数" width="110"></el-table-column>
        <el-table-column prop="creator" label="创建者" width="100"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="175"></el-table-column>
        <el-table-column prop="lastModifier" label="最后一次修改人" width="140"></el-table-column>
        <el-table-column prop="updateTime" label="最后一次修改时间" width="175"></el-table-column>
        <el-table-column prop="options" label="操作" width="80">
          <template slot-scope="scope">
            <router-link :to="'/process/process-edit/' + scope.row.id">
              <i class="el-icon-edit"></i>
            </router-link>
            <i class="el-icon-delete" @click="_del(scope.row.id)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="list-foot">
      <div class="pagination">
        <el-pagination @size-change="_handleSizeChange" @current-change="_handleCurrentChange" :current-page.sync="processList.page"
          :page-size="processList.listRow" layout="total, prev, pager, next" :total="processList.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getProcessList, del } from 'api/process.js'
export default {
  data () {
    return {
      multipleSelection: [],                         // 多选记录
      processList: {                                 // 流程
        list: [],                                     // 流程列表
        total: 0,                                     // 总记录数
        listRow: 12,                                  // 每页显示记录数
        page: 1                                       // 当前页码
      },
      loading: true,                                 // 加载中
      dd: ''
    }
  },
  mounted () {
    this._getProcessList()
  },
  methods: {
    _del (pId) {
      var ids = []
      if (typeof pId === 'number') {
        ids.push(pId)
      } else {
        if (this.multipleSelection.length === 0) {
          this.$message.error('请选择要删除的流程！')
          return
        }
        for (var item of this.multipleSelection) {
          ids.push(item.id)
        }
      }
      this.$confirm('此操作将删除流程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(ids).then((res) => {
          if (res.data.code === 1) {
            this.$message.success('删除流程成功！')
            this._getProcessList()
          } else {
            this.$message.error('删除流程失败！')
          }
        })
      }).catch(() => {})
    },
    _getProcessList () {
      this.loading = true
      getProcessList(this.processList.page, this.processList.listRow).then((res) => {
        if (res.data.code === 1) {
          this.processList = res.data.data
          this.loading = false
        }
      })
    },
    _toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    _handleSelectionChange (val) {
      this.multipleSelection = val
    },
    _handleSizeChange (val) {
      this.processList.listRow = val
    },
    _handleCurrentChange (val) {
      this.processList.page = val
      this._getProcessList()
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
.pagination {
  text-align: right;
  padding-top: 10px;
}
</style>

