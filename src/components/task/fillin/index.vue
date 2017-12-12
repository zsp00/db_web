<template>
  <div>
    <template v-show="$route.path === '/task/fillin'">
    <el-row  class="header" >
      <el-col :span="24" >
        <transition name="el-fade-in">
          <div v-if="this.info.loaded">
            <span>{{this.info.date.currYear}}年{{this.info.date.currMouth}}月</span>
            <span>我的部门：{{info.deptName}}</span>
            <span class="task-record" v-if="taskList.flag == true">本月督办任务{{ taskList.dbCount }}个，已提交{{ taskList.commitNum }}个</span>
          </div>
        </transition>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :inline="true" >
          <!-- <el-form-item label="等级配分">
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
          </el-form-item> -->
          <el-form-item label="任务分类">
            <el-select
              v-model="search.typeId"
              filterable
              allow-create
              width="100%"
              :value="search.typeId"
              placeholder="请选择任务分类">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态查询" v-if="taskList.flag == true">
            <el-select v-model="search.ifStatus" filterable width="100%" placeholder="">
              <el-option v-for="item in ifStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门名称" v-if="taskList.flag == true">
              <el-cascader :options="compDept" v-model="search.dept"></el-cascader>
            </el-form-item>
          <el-form-item label="搜索内容">
            <el-input
              v-model="search.keyword"
              placeholder="请输入搜索内容">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch" plain icon="el-icon-search">搜索</el-button>
            <a @click="beforeExport" id="export_a" class="export-btn" href="" target="_blank">导出</a>
          </el-form-item>
          <el-form-item class="need-to-do">
            <el-switch v-model="search.needToDo" active-text="待办任务" inactive-text="全部任务" @change="_getList"></el-switch>
          </el-form-item>
          <el-form-item class="commit-all" v-if="taskList.list.length > 0 && search.needToDo == true && taskList.list[0].commitAll == 1">
            <el-button type="primary" @click="_commitAll" plain>全部提交</el-button>
          </el-form-item>
          <el-form-item class="commit-all" v-if="taskList.list.length > 0 && search.needToDo == true && taskList.list[0].confirmAll == 1">
            <el-button type="primary" @click="_confirmAll">全部确认</el-button>
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
          :cell-style="tableCellStyle"         
          max-height="500">
            <el-table-column fixed prop="id" label="序号" align="center" width="65"></el-table-column>
            <el-table-column prop="title1" label="一级目标任务(目标)" align="center" width="150"></el-table-column>
            <el-table-column prop="detail1" label="一级目标任务(目标)" align="center" width="220"></el-table-column>
            <el-table-column prop="leader1" label="牵头领导" align="center"></el-table-column>

            <el-table-column prop="title2" label="二级目标任务(任务)" align="center" width="150"></el-table-column>
            <el-table-column prop="detail2" label="二级目标任务(任务)" align="center" width="220"></el-table-column>
            <el-table-column prop="leader2" label="责任领导" align="center"></el-table-column>
            <el-table-column prop="deptNo2" label="责任部室" align="center"></el-table-column>

            <el-table-column prop="detail3" label="三级目标任务(目标)" align="center" width="180"></el-table-column>
            <el-table-column prop="duty3" label="三级目标任务(举措)" align="center" width="150"></el-table-column>
            <el-table-column prop="leader3" label="责任领导" align="center"></el-table-column>

            <el-table-column prop="deptNo" label="责任部室、二级单位" align="center" width="150"></el-table-column>
            <el-table-column prop="duty" label="目标任务" align="center"></el-table-column>
            <el-table-column prop="content" label="2017年度实施计划" align="center" width="300"></el-table-column>

            <!-- <el-table-column prop="level" label="等级配分" align="center" width="95"></el-table-column>
            <el-table-column prop="timeLimit" label="完成时限" align="center" width="115"></el-table-column> -->
            <el-table-column prop="completeSituation" label="完成情况" align="center" width="380" style="background-color:white"></el-table-column>
            <el-table-column prop="problemSuggestions" label="实施过程中存在的问题及建议" align="center" width="220"></el-table-column>
            <el-table-column prop="analysis" label="未按时限完成或进度滞后的项目原因分析及推进措施" align="center" width="380"></el-table-column>
            <el-table-column prop="typeName" label="任务分类"  align="center" width="100"></el-table-column>

            <el-table-column prop="getTaskStatusMsg" fixed="right" label="状态" align="center" width="110">
              <template slot-scope="scope">
                <el-tag :type="scope.row.getTaskStatusMsg !== 0 ? 'success' : 'danger'" close-transition>
                  <template v-if="scope.row.getTaskStatusMsg === 0">驳回</template>
                  <template v-if="scope.row.getTaskStatusMsg === 1">填报中</template>
                  <template v-if="scope.row.getTaskStatusMsg === 2">审核中</template>
                  <template v-if="scope.row.getTaskStatusMsg === 3">审核完成</template>                                                                      
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="statusMsg" label="步骤" align="center" width="120"></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="onClickDetail(scope.row)" size="small">{{ scope.row.taskDataStatus == scope.row.getStepIds && scope.row.currMonthStatus != 0 ? '修改' : '查看'}}</el-button>
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
    <template v-show="$route.path !== '/task/fillin'">
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import { getInfo, getList, getTypeList, commitAll, checkCount, confirm } from 'api/task.js'
import { getTaskDeptNo } from 'api/task-management.js'
import { getCompDept } from 'api/process.js'
import {ERR_OK} from 'api/config.js'
import loading from 'base/loading/loading'
export default {
  data () {
    return {
      search: {
        keyword: null,
        level: '',
        typeId: '',
        ifStatus: '',
        dept: [],
        needToDo: true                          // 是否待办的开关按钮，默认选择待办
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
      ifStatus: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '驳回'
        },
        {
          value: '1',
          label: '填报中'
        },
        {
          value: '2',
          label: '审核中'
        },
        {
          value: '3',
          label: '审核完成'
        }
      ],
      typeList: [],
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
        total: 0,
        list: [],
        flag: true,                           // 是否能查看所有任务列表
        commitNum: 0,                        // 针对于当前登录用户，统计提交了多少个任务
        compValue: '',
        deptValue: '',
        dbCount: 0                           // 本月督办任务数量
      },
      deptList: [],                          // 按部门筛选用的部门列表
      compDept: []
    }
  },
  activated () {
    this._getTypeList()
  },
  mounted () {
    this._getInfo()
    this._getList()
    this._getTypeList()
    this._getDeptList()
    this._getCompDept()
  },
  methods: {
    onClickDetail (row) {
      this.$router.push({
        path: '/task/fillin/detail/' + row.tdDeptNo + '/' + row.id
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
    onSearch () {
      this.taskList.page = 1
      this._getList()
    },
    tableCellStyle (row, rowIndex) {
      if (row.columnIndex === 14 || row.columnIndex === 15 || row.columnIndex === 16) {
        return 'background:white'
      } else {
        return 'background:#fafafa'
      }
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
      getList(this.taskList.page, this.taskList.listRow, this.search.keyword, this.search.level, this.search.typeId, this.search.ifStatus, this.search.dept, this.search.needToDo).then((res) => {
        if (ERR_OK === res.data.code) {
          this.taskList.loading = false
          this.taskList.total = res.data.msg.total
          this.taskList.list = res.data.msg.data
          this.taskList.flag = res.data.msg.flag
          this.taskList.commitNum = res.data.msg.commitNum
          this.taskList.dbCount = res.data.msg.dbCount
        } else {
          this.$message.error(res.data.msg)
          this.taskList.list = []
          this.taskList.loading = false
        }
      })
    },
    _getTypeList () {
      getTypeList().then((res) => {
        if (res.data.code === 1) {
          this.typeList = res.data.msg
          var allType = {
            id: '',
            typeName: '全部分类'
          }
          this.typeList.splice(0, 0, allType)
        }
      })
    },
    _getDeptList () {
      getTaskDeptNo().then((res) => {
        if (res.data.code === 1) {
          this.deptList = res.data.msg
          var all = {
            deptNo: '',
            deptName: '全部'
          }
          this.deptList.splice(0, 0, all)
        }
      })
    },
    _getCompDept () {
      getCompDept().then((res) => {
        if (res.data.code === 1) {
          this.compDept = res.data.data
        }
      })
    },
    _commitAll () {
      this.$confirm('该操作将提交所有待办任务，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkCount().then((res) => {
          if (res.data.code === 1) {
            commitAll().then((res) => {
              if (res.data.code === 1) {
                this.$message.success(res.data.msg)
                this._getList()
              } else {
                this.$message.error('全部提交失败！')
              }
            })
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }).catch(() => {})
    },
    _confirmAll () {
      this.$confirm('该操作将确认所有待办任务，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirm(this.taskList.list).then((res) => {
          if (ERR_OK === res.data.code) {
            this.$message.success(res.data.msg)
            this._getList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }).catch(() => {})
    },
    beforeExport (obj) {
      var condition = JSON.stringify(this.search)
      document.getElementById('export_a').href = '/api/index/Task/exportFillinList/condition/' + condition
    }
  },
  components: {
    loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .header
    margin-top 20px
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
  .task-record
    margin-left 20px;
  .need-to-do
    margin-left 20px;
  .commit-all
    float right;
  .export-btn
    margin-left: 10px;
    width: 70px;
    height: 40px;
    display: inline-block;
    border: solid 1px rgb(153, 184, 217);
    text-align: center;
    background-color: rgb(230, 237, 246);
    border-radius: 4px;
    color: #004DA0;
</style>
