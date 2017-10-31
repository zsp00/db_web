<template>
  <div class="label-value">
    <div class="value-head">
      <el-button type="primary">添加部门/成员</el-button>
      <el-button type="primary">删除</el-button>
    </div>
    <div class="value-table">
      <el-table ref="multipleTable" v-loading="loading" :data="valueList" tooltip-effect="dark" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="名称" width="120"></el-table-column>
        <el-table-column prop="valueName" label="组织成员"></el-table-column>
        <el-table-column prop="type" label="类型" width="120"></el-table-column>
        <el-table-column prop="option" label="操作" width="80">
          <template slot-scope="scope">
            <i class="el-icon-delete"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getLabelValue } from 'api/label.js'
export default {
  data () {
    return {
      loading: true,              // 加载中
      multipleSelection: [],      // 多选的行
      valueList: []               // 标签内容列表
    }
  },
  props: [
    'labelId'
  ],
  watch: {
    labelId: function (newVal, oldVal) {
      if (newVal !== null && newVal !== '') {
        this._getLabelValue()
      }
    }
  },
  methods: {
    _getLabelValue: function () {
      getLabelValue(this.labelId).then((res) => {
        this.valueList = []
        if (res.data.code === 1) {
          this.valueList = res.data.data
          this.loading = false
        }
      })
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
.label-value {
  height: 820px;
}
.value-head {
  margin: 3px;
}
.value-table {
  margin-top: 20px;
  width: 100%;
}
.value-table i {
  cursor: pointer;
}
</style>
