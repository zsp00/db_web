<template>
  <div>
    <template v-if="$route.path === '/task/fillin'">
    <el-row  class="header" >
      <el-col :span="24" >
        <transition name="el-fade-in">
          <div v-if="this.info.loaded">
            <span>{{this.info.date.currYear}}年{{this.info.date.currMouth}}月</span>
            <span>我的部门：{{info.deptName}}</span>
            <el-tag v-if="taskList.identitys.length === 0">员工</el-tag>
            <el-tag v-if="taskList.identitys.indexOf('1') > -1">部门负责人</el-tag>
            <el-tag v-if="taskList.identitys.indexOf('2') > -1">办公室负责人</el-tag>
          </div>
        </transition>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :inline="true" >
          <el-form-item label="等级配分">
            <el-select
              v-model="search.level"
              filterable
              allow-create
              width="100%"
              placeholder="请选择等级配分">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="搜索内容">
            <el-input
              v-model="search.keyword"
              placeholder="请输入搜索内容">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="taskList.list"
          border
          v-loading.body="taskList.loading"
          style="width: 100%"
          :row-style="tableRowStyle"
          max-height="500">
          <el-table-column
            fixed
            prop="content"
            label="任务"
            align="center"
            width="150">
            <template slot-scope="scope">
              <div class="task-content">{{scope.row.content}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="部门"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="serialNumber"
            label="序号"
            align="center"
            width="65">
          </el-table-column>
          <el-table-column
            prop="timeLimit"
            label="完成时限"
            align="center"
            width="95">
            <template  slot-scope="scope">
              <div class="task-time-limit">{{scope.row.timeLimit}}月</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="level"
            label="等级配分"
            align="center"
            width="95">
          </el-table-column>
          <el-table-column
            prop="completeSituation"
            label="完成情况"
            width="200">
          </el-table-column>
          <el-table-column
            prop="problemSuggestions"
            label="实施过程中存在的问题及建议"
            width="220">
          </el-table-column>
          <el-table-column
            prop="analysis"
            label="未按时限完成或进度滞后的项目原因分析及推进措施"
            width="380">
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="taskDataStatusMsg"
            label="状态"
            align="center"
            width="85">
            <template slot-scope="scope">
              <span v-if="scope.row.status === '1'"> 
                {{scope.row.taskDataStatusMsg}}
              </span>
              <span v-if="scope.row.status === '2'"> 
                {{scope.row.statusMsg}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <!--都有修改权限-->
              <el-button type="text" @click="onClickDetail(scope.row)" size="small">修改</el-button>
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
      </el-col>
    </el-row>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import {getInfo, getList} from 'api/task.js'
import {ERR_OK} from 'api/config.js'
import loading from 'base/loading/loading'
export default {
  data () {
    return {
      search: {
        keyword: null,
        level: ''
      },
      levelOptions: [
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
      tableData: [{
      }],
      options: [],
      info: {
        deptName: null,
        isParticipate: null,
        date: null,
        loaded: false
      },
      taskList: {
        loading: true,
        page: 1,
        listRow: 10,
        identitys: [],
        total: 0,
        list: []
      }
    }
  },
  mounted () {
    this._getInfo()
    this._getList()
  },
  methods: {
    onClickDetail (row) {
      this.$router.push({
        path: '/task/fillin/detail/' + row.id
      })
    },
    handleSizeChange (val) {
      this.taskList.listRow = val
      this._getList()
    },
    handleCurrentChange (val) {
      this.taskList.page = val
      this._getList()
    },
    tableRowStyle (row, index) {
      if (row.status === '2') {
        return 'background:#EFF2F7'
      }
    },
    onSearch () {
      this.taskList.page = 1
      this._getList()
    },
    _getInfo () {
      getInfo().then((res) => {
        if (ERR_OK === res.data.code) {
          this.info.loaded = true
          this.info.deptName = res.data.msg.deptName
          this.info.isParticipate = res.data.msg.isParticipate
          this.info.date = res.data.msg.date
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    _getList () {
      this.taskList.loading = true
      getList(this.taskList.page, this.taskList.listRow, this.search.keyword, this.search.level).then((res) => {
        if (ERR_OK === res.data.code) {
          this.taskList.loading = false
          this.taskList.identitys = res.data.msg.identitys
          this.taskList.total = res.data.msg.total
          this.taskList.list = res.data.msg.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  },
  components: {
    loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .header
    padding-bottom 20px
    height 40px
  .loading
    width 150px
    height 150px
    position relative
    left 50%
    margin-left -75px
    margin-top 50px
  .task-content
    text-align left
  .pagination
    text-align right
    padding-top 10px
</style>
