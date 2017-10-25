<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-col :span="24">
        <el-form-item label="任务">
          {{form.content}}
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="序号">
          {{form.serialNumber}}
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="部门">
          {{form.deptName}}
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="所属年份">
          {{form.year}}
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="完成时限">
          {{form.timeLimit}}月
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="等级配分">
          {{form.level}}
        </el-form-item>
      </el-col>
      <el-form-item label="月">
        <el-radio-group v-model="mouth" @change="chengeMouth">
          <el-radio-button v-for="(item, key) in form.taskDataList" :key="key" :label="item.mouth"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="完成情况">
            <el-input type="textarea" :disabled="!isEdit" v-model="update.completeSituation" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="实施过程中存在的问题及建议">
            <el-input type="textarea" :disabled="!isEdit" v-model="update.problemSuggestions" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>          
      <el-row>
        <el-col :span="12">
          <el-form-item label="未按时限完成或进度滞后的项目原因分析及推进措施">
            <el-input type="textarea" :disabled="!isEdit" v-model="update.analysis" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>            
      <el-col :span="24">
        <el-form-item label="状态">
          <template>
            <span v-if="form.status === '1'"> 
              {{form.taskDataStatusMsg[currTaskData.status]}}
            </span>
            <span v-if="form.status === '2'"> 
              {{form.statusMsg}}
            </span>
          </template>
        </el-form-item>
      </el-col>
      <el-form-item label="我的身份">
        <el-tag v-if="form.identitys.indexOf('1') > -1">部门负责人</el-tag>
        <el-tag v-if="form.identitys.indexOf('2') > -1">办公室负责人</el-tag>
      </el-form-item>
      <el-form-item>
        <el-button v-show="isEdit" type="primary" @click="onEdit">修改</el-button>
        <el-button v-show="isSubmit" type="primary" @click="onSubmits">提交</el-button>
        <el-button v-show="isConfirm" type="primary" @click="onConfirm">确认</el-button>
        <el-button v-show="isComplete" type="primary" @click="onComplete">完成</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    
    <el-table :data="form.taskDataList" border>
      <el-table-column prop="mouth" label="月份" width="80"></el-table-column>
      <el-table-column prop="completeSituation" label="完成情况"></el-table-column>
      <el-table-column prop="problemSuggestions" label="实施过程中存在的问题及建议"></el-table-column>
      <el-table-column prop="analysis" label="未按时限完成或进度滞后的项目原因分析及推进措施"></el-table-column>
    </el-table>
    <el-tabs type="border-card" class="logList" v-model="mouth" @tab-click="handleClick">
      <el-tab-pane :label="item.mouth + '月份'" :name="item.mouth + ''" v-for="(item,index) in form.taskDataList" :key="item.mouth">
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
              <template v-if="list.type == 'edit'">
                <span slot="reference"><b>编辑</b></span>。
                <div class="editLog">
                  <div v-for="logItem in list.logData">
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
                    ，旧值为“{{logItem.old}}”，新值为“{{logItem.new}}”。
                  </div>
                </div>
              </template>
            </div>
          </div> 
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getDetail, edit, complete, confirm, getLogs, submits} from 'api/task.js'
import {ERR_OK} from 'api/config.js'
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
            mouth: 0
          }
        ],
        identitys: []
      },
      update: {
        completeSituation: '',
        problemSuggestions: null,
        analysis: null
      },
      mouth: 0,
      currTaskData: [],
      isEdit: false,
      isSubmit: false,
      isConfirm: false,
      isComplete: false,
      loglist: null
    }
  },
  mounted () {
    this.form.id = this.$route.params.id
    this._getDetail()
  },
  methods: {
    _getDetail () {
      getDetail(this.form.id).then((res) => {
        if (ERR_OK === res.data.code) {
          this.form = res.data.msg
          var status = [1]
          for (var i = 0; i < this.form.identitys; i++) {
            // 如果是办公室
            if (this.form.identitys[i] === 1) {
              status.push(2)
            }
          }
          var selected = null
          for (i = 0; i < this.form.taskDataList.length; i++) {
            // 根据
            if (selected === null) {
              this.mouth = this.form.taskDataList[i].mouth
              this.currTaskData = this.form.taskDataList[i]
              this.chengeMouth(this.mouth)
              this.logs(this.mouth)
              selected = true
            }
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleClick (tab, event) {
      this.logs(tab.name)
    },
    logs (mouth) {
      getLogs(this.form.id, mouth).then((res) => {
        if (ERR_OK === res.data.code) {
          this.loglist = res.data.msg
        }
      })
    },
    // 修改内容
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
    onSubmits () {
      submits(this.update).then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
          this._getDetail()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onConfirm () {
      confirm(this.update).then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
          this._getDetail()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onComplete () {
      complete(this.update).then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
          this._getDetail()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onCancel () {
      this.$router.go(-1)
    },
    chengeMouth (mouth) {
      var item
      // 赋值数据
      for (var i = 0; i < this.form.taskDataList.length; i++) {
        if (mouth === this.form.taskDataList[i].mouth) {
          item = this.form.taskDataList[i]
          break
        }
      }
      if (this.form.status === '1') {
        // 检查是否有可以编辑
        switch (item.status) {
          // 部门领导未提交
          case '1':
            // 如果是部门负责人
            if (this.checkIdentitys('1')) {
              this.isEdit = true
              this.isSubmit = true
            } else if (this.checkIdentitys('2')) {  // 如果是办公室 那么可以修改
              this.isEdit = false
              this.isSubmit = false
            } else {  // 普通员工也没办法修改了
              this.isEdit = true
              this.isSubmit = false
            }
            this.isConfirm = false
            this.isComplete = false
            break
          // 部门领导提交了
          case '2':
            // 如果是部门领导 那么不能修改了
            if (this.checkIdentitys('1')) {
              this.isEdit = false
              this.isSubmit = false
              this.isConfirm = false
              this.isComplete = false
            } else if (this.checkIdentitys('2')) {  // 如果是办公室 那么可以修改
              this.isEdit = true
              this.isSubmit = false
              this.isConfirm = true
              this.isComplete = true
            } else {  // 普通员工也没办法修改了
              this.isEdit = false
              this.isSubmit = false
              this.isConfirm = false
              this.isComplete = false
            }
            break
          // 如果办公室也确认了
          case '3':
            this.isEdit = false
            this.isSubmit = false
            this.isConfirm = false
            this.isComplete = true
            break
        }
      } else if (this.form.status === '2') {
        this.isEdit = false
        this.isSubmit = false
        this.isConfirm = false
        this.isComplete = false
      }
      this.update = item
    },
    // 检查身份
    checkIdentitys (type) {
      switch (type) {
        // 检查是不是部门负责人
        case '1':
          if (this.form.identitys.indexOf('1') > -1) {
            return true
          }
          break
        // 检查是不是办公室负责人
        case '2':
          if (this.form.identitys.indexOf('2') > -1) {
            return true
          }
          break
      }
    },
    popLog (data) {
      var str = ''
      if (data !== 'false') {
        for (var item of data) {
          switch (item.field) {
            case 'problemSuggestions':
              str += '问题和建议:  旧值：' + item.old + ', 新值：' + item.new + '&lt;br&gt;'
              break
            case 'analysis':
              str += '原因分析: 旧值：' + item.old + ', 新值：' + item.new
              break
            case 'completeSituation':
              str += '完成情况: 旧值：' + item.old + ', 新值：' + item.new
          }
        }
        return str
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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
</style>
