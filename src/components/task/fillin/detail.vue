<template>
<transition name="detail">
  <div class="detail">
    <el-form :model="form" label-position="top" label-width="120px">
      <el-col :span="8">
        <el-form-item label="一级任务目标" style="margin-right:40px;">
          {{form.title1}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
         <el-form-item label="二级任务目标" style="margin-right:50px;">
          {{form.title2}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="三级任务目标">
          {{form.detail3}}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="任务">
          {{form.content}}
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item label="序号">
          {{form.serialNumber}}
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item label="部门">
          {{form.deptName}}
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="所属年份">
          {{form.releaseTime}}年
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="完成时限">
          {{form.timeLimit}}月
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="等级配分">
          {{form.level}}
        </el-form-item>
      </el-col>
      <el-row>
        <el-col :span="24">
          <el-form-item label="月份">
            <el-radio-group v-model="tDate">
              <el-radio-button v-for="(item, key) in form.taskDataList" :key="key" :label="item.tDate">{{item.tDate}}月</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>     
      <el-row>
        <el-col :span="24">
          <el-form-item label="完成情况">
            <el-input type="textarea" :disabled="!isEdit" v-model="update.completeSituation" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="实施过程中存在的问题及建议">
            <el-input type="textarea" :disabled="!isEdit" v-model="update.problemSuggestions" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>          
      <el-row>
        <el-col :span="24">
          <el-form-item label="未按时限完成或进度滞后的项目原因分析及推进措施">
            <el-input type="textarea" :disabled="!isEdit" v-model="update.analysis" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="是否完成任务">
            <el-switch v-model="update.taskSelect"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-col :span="24">
        <el-form-item>
          <el-button v-show="isEdit" type="primary" @click="onEdit" plain>保存</el-button>
          <el-button v-show="isSubmit" type="primary" @click="onSubmits" plain>提交</el-button>
          <el-button v-show="isConfirm" type="primary" @click="onConfirm" plain>确认</el-button>
          <el-button v-show="isReject" type="primary" @click="rejectShow" plain>驳回</el-button>
          <el-button v-show="isWithdraw" type="primary" @click="onWithdraw" plain>撤回</el-button>         
          <el-button @click="onCancel" plain>返回</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <!--这是添加驳回理由的模态框-->
    <el-dialog title="驳回理由" :visible.sync="dialogFormAdd" width="30%">
      <el-form>
        <el-form-item>
          <el-input type="textarea" v-model="rejectReason" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAdd = false">取 消</el-button>
        <el-button type="primary" @click="onReject" plain>确 定</el-button>
      </div>
    </el-dialog>
    <!--这是表格内容-->
    <el-table :data="form.taskDataList" border>
      <el-table-column prop="tDate" label="月份" width="80"></el-table-column>
      <el-table-column prop="completeSituation" label="完成情况"></el-table-column>
      <el-table-column prop="problemSuggestions" label="实施过程中存在的问题及建议"></el-table-column>
      <el-table-column prop="analysis" label="未按时限完成或进度滞后的项目原因分析及推进措施"></el-table-column>
    </el-table>
    <!--这是日志记录-->
    <el-tabs type="border-card" class="logList" v-model="tDate">
      <el-tab-pane :label="item.tDate + '月份'" :name="item.tDate + ''" v-for="(item,index) in form.taskDataList" :key="item.tDate">
          <template v-if="loglist === null || loglist.length === 0">
            没有修改记录
          </template>
          <div v-for="(list,x) in loglist" :key="list.id">
            <div>
              {{x+1}}. {{ list.createTime }} 由<b> {{ list.empNo }} </b>进行了
              <template v-if="list.type == 'submit'">
                <span style="" slot="reference"><b>提交</b></span>。
              </template>
              <template v-if="list.type == 'confirm'">
                <span style="" slot="reference"><b>确认</b></span>。
              </template>
              <template v-if="list.type == 'complete'">
                <span style="" slot="reference"><b>完成</b></span>。
              </template>
              <template v-if="list.type == 'reject'">
                <span style="" slot="reference"><b>驳回</b></span>。
                  <div v-for="logItem in list.logData" :key="logItem.id">
                    <div class="editLog" v-if="logItem.new != ''">
                    <template>
                      <b><i>驳回理由：</i></b>“{{logItem.new}}”。
                    </template>
                    </div>
                  </div>           
              </template>
              <template v-if="list.type == 'withdraw'">
                <span style="" slot="reference"><b>撤回</b></span>。
              </template>
              <template v-if="list.type == 'edit'">
                <span slot="reference"><b>编辑</b></span>。
                <div class="editLog" v-if="list.logData != ''">
                  <div v-for="logItem in list.logData" :key="logItem.id">
                    修改了
                    <template v-if="logItem.field === 'completeSituation'">
                      <b><i>完成情况</i></b>
                    </template>
                    <template v-if="logItem.field === 'problemSuggestions'">
                      <b><i>实施过程中存在的问题及建议</i></b>
                    </template>
                    <template v-if="logItem.field === 'analysis'">
                      <b><i>未按时限完成或进度滞后的项目原因分析及推进措施</i></b>
                    </template>
                    <template v-if="logItem.field === 'status'">
                      <b><i>任务完成状态</i></b>
                      ，由“{{logItem.old == '1' ? '未完成' : '已完成' }}”，改为“{{logItem.new == '1' ? '未完成' : '已完成'}}”。
                    </template>
                    <template v-else>
                      ，由“{{logItem.old}}”，改为“{{logItem.new}}”。
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div> 
      </el-tab-pane>
    </el-tabs>
    <!--这是步骤-->
    <div class="detail-steps">
      <el-steps direction="vertical" :active="form.taskDataList[monthIndex].status == 0 ? (form.stepsNum + 1) : form.taskDataList[monthIndex].currentLevel" space="100px">
        <!-- 第一步 -->
        <el-step>
          <el-tooltip slot="title" class="item" effect="dark" :content="form.taskDataList[monthIndex].stepFirst.fullName" placement="top-start">
            <el-button type="text">{{ form.taskDataList[monthIndex].stepFirst.name }}</el-button>
          </el-tooltip>
          <span slot="title" class="step-first-text">{{ form.taskDataList[monthIndex].stepFirst.text }}</span>
        </el-step>
        <!-- 循环展示剩余的步骤 -->
        <el-step :title="item.label" v-for="(item, index) in form.taskDataList[monthIndex].steps" :key="index">
          <!-- 展示参与者 -->
          <span slot="description">参与者：</span>
          <el-tooltip slot="description" class="item" effect="dark" :content="pp.fullName" placement="top-start" v-for="(pp, ii) in item.participate[0]" :key="ii">
            <el-button type="text">{{ pp.name }}</el-button>
          </el-tooltip>
          <!-- 如果有不包含的项，展示 -->
          <template v-if="item.participate[1].length > 0" slot="description">
            <span class="step-notin">不包含：</span>
            <el-tooltip slot="description" class="item" effect="dark" :content="pp.fullName" placement="top-start" v-for="(pp, ii) in item.participate[1]" :key="ii">
              <el-button type="text">{{ pp.name }}</el-button>
            </el-tooltip>
          </template>
        </el-step>
      </el-steps>
    </div>
  </div>
</transition>
</template>

<script>
import { getDetail, edit, confirm, getLogs, submits, withdraw, reject } from 'api/task.js'
import { ERR_OK } from 'api/config.js'
export default {
  data () {
    return {
      form: {
        id: '',
        deptNo: '',
        deptName: '',
        serialNumber: '',
        content: '',
        year: '',
        timeLimit: '',
        level: '',
        completeTime: '',
        status: '',
        taskDataList: [
          {
            tDate: 0,
            stepFirst: {},                 // 步骤条第一步
            steps: []                      // 步骤条剩下的步骤
          }
        ],
        stepsNum: 0                         // 流程步骤数量
      },
      update: {
        completeSituation: null,
        problemSuggestions: null,
        analysis: null,
        taskSelect: false                  // 任务是否完成
      },
      rejectReason: null,
      tDate: null,
      currTaskData: [],
      isEdit: false,
      isSubmit: false,
      isConfirm: false,
      isReject: false,
      isWithdraw: false,
      isComplete: false,
      loglist: null,
      tdDeptNo: '',              // 任务部门的Id
      monthIndex: 0,             // 该任务选择展示月份的索引
      dialogFormAdd: false       // 驳回理由的模态框
    }
  },
  mounted () {
    this.form.id = this.$route.params.id
    this.tdDeptNo = this.$route.params.tdDeptNo
    this._getDetail()
  },
  methods: {
    _getDetail () {
      this.tDate = '0'
      getDetail(this.form.id, this.tdDeptNo).then((res) => {
        if (ERR_OK === res.data.code) {
          this.form = res.data.msg
          var selected = null
          for (var i = 0; i < this.form.taskDataList.length; i++) {
            if (selected === null) {
              this.tDate = this.form.taskDataList[i].tDate
              this.currTaskData = this.form.taskDataList[i]
              selected = true
            }
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    logs (tDate) {
      getLogs(this.form.id, tDate).then((res) => {
        if (ERR_OK === res.data.code) {
          this.loglist = res.data.msg
        }
      })
    },
    // 修改内容按钮
    onEdit () {
      edit(this.update).then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
          this._getDetail()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 提交按钮
    onSubmits () {
      this.$confirm('是否要提交该任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._submit()
      }).catch(() => {})
    },
    _submit () {
      edit(this.update).then((result) => {
        if (ERR_OK === result.data.code) {
          submits(this.update).then((res) => {
            if (ERR_OK === res.data.code) {
              this.$message.success(res.data.msg)
              this._getDetail()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          this.$message.error(result.data.msg)
        }
      })
    },
    // 确认任务
    onConfirm () {
      this.$confirm('是否要确认任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirm(this.update.id, this.update.taskSelect).then((res) => {
          if (ERR_OK === res.data.code) {
            this.$message.success(res.data.msg)
            this.$router.push({
              path: '/'
            })
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }).catch(() => {})
    },
    // 驳回按钮
    rejectShow () {
      this.dialogFormAdd = true
    },
    // 驳回任务请求
    onReject () {
      reject(this.update, this.rejectReason).then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
          this._getDetail()
          this.dialogFormAdd = false
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 撤回按钮
    onWithdraw () {
      this.$confirm('是否要撤回该任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        withdraw(this.update).then((res) => {
          if (ERR_OK === res.data.code) {
            this.$message.success(res.data.msg)
            this._getDetail()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }).catch(() => {})
    },
    onCancel () {
      this.$router.go(-1)
    },
    contains (arr, obj) {
      var i = arr.length
      while (i--) {
        if (arr[i] === obj) {
          return true
        }
      }
      return false
    },
    chengeMouth (tDate) {
      var item
      // 赋值数据
      for (var i = 0; i < this.form.taskDataList.length; i++) {
        if (tDate.toString() === this.form.taskDataList[i].tDate) {
          item = this.form.taskDataList[i]
          this.monthIndex = i
          break
        }
      }
      this._initBtn()
      if (item.status === 1) {
        if (this.contains(this.form.identitys, item.currentLevel)) {
          this.isEdit = true
          if (this.form.identitys[0] !== this.form.stepsNum) {
            if (this.form.taskDataList[this.monthIndex].commitAll !== 1) {
              this.isSubmit = true
            }
            this.isConfirm = false
          } else {
            this.isSubmit = false
            this.isConfirm = true
          }
          if (this.form.identitys[0] !== 1) {
            this.isReject = true
          }
        } else if (item.currentLevel === this.form.identitys[this.form.identitys.length - 1] + 1) {
          if (this.form.identitys[this.form.identitys.length - 1] !== this.form.stepsNum) {
            this.isWithdraw = true
          }
        }
      } else if (item.status === 0) {
        this.isEdit = false
        this.isSubmit = false
        this.isConfirm = false
        this.isReject = false
        this.isWithdraw = false
      }
      this.update = item
      this.logs(this.tDate)
    },
    _initBtn () {
      this.isEdit = false
      this.isSubmit = false
      this.isConfirm = false
      this.isReject = false
      this.isWithdraw = false
    }
  },
  watch: {
    tDate: function (newVal, oldVal) {
      if (newVal !== null && newVal !== '0' && newVal !== 0) {
        this.chengeMouth(newVal)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .detail{
    z-index: 31;
    background: #ffffff;
  }
  .detail-enter-active,.document-leave-active{
    transition: all 0.3s
  }

  .document-enter, .document-leave-to{
    transform: translate3d(100%, 0, 0)
  }
.my-textarea{
  height:100px;
}
.logList{
  margin-top: 20px;
}
.logList div{
  line-height:25px;
  font-size: 13px;
}
.logList div span{
  cursor: pointer
}
.editLog{
  margin-left:20px;
  background: #f1f1f1;
  padding:10px;
}
.detail-steps {
  margin: 20px 0;
}
.step-first-text {
  margin-left: 5px;
}
.step-notin {
  margin-left: 10px;
}
</style>
