<template>
  <div class="box">
    <div class="list-head">
      <router-link to="/process/process-add">
        <el-button type="primary">创建任务</el-button>
      </router-link>
      <el-button type="primary">删除</el-button>
      <el-button type="primary">下发任务</el-button>
    </div>
    <div class="list-body">
      <el-table ref="multipleTable" v-loading="loading" :data="processList" tooltip-effect="dark" max-height="700" style="width: 100%" border @selection-change="_handleSelectionChange">
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      multipleSelection: [],                         // 多选记录
      processList: [],                               // 流程列表
      loading: false                                  // 加载中
    }
  },
  mounted () {
  },
  methods: {
    _edit (pId) {
      console.log('edit   :' + pId)
    },
    _del (pId) {
      console.log('del   :' + pId)
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

