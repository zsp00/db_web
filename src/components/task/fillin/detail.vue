<template>
  <div>
    <el-form :model="form" label-width="120px">
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
      <el-col :span="10">
        <el-form-item label="等级配分">
          {{form.level}}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="任务">
          {{form.content}}
        </el-form-item>
      </el-col>
      <el-form-item label="月">
        <el-radio-group v-model="mouth" @change="chengeMouth">
          <el-radio-button v-for="(item, key) in form.taskDataList" :key="key" :label="item.mouth"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="完成情况">
        <el-input type="textarea" :disabled="!isEdit" v-model="update.completeSituation" class="my-textarea"></el-input>
      </el-form-item>
      <el-form-item label="实施过程中存在的问题及建议">
        <el-input type="textarea" :disabled="!isEdit" v-model="update.problemSuggestions" class="my-textarea"></el-input>
      </el-form-item>
      <el-form-item label="未按时限完成或进度滞后的项目原因分析及推进措施">
        <el-input type="textarea" :disabled="!isEdit" v-model="update.analysis" class="my-textarea"></el-input>
      </el-form-item>
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
        <el-button v-show="isSubmit" type="primary">提交</el-button>
        <el-button v-show="isConfirm" type="primary" @click="onConfirm">确认</el-button>
        <el-button v-show="isComplete" type="primary" @click="onComplete">完成</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-tabs type="border-card" v-model="mouth" @tab-click="handleClick">
      <el-tab-pane :label="item.mouth + '月'" :name="item.mouth + ''" v-for="(item,index) in form.taskDataList" :key="item.mouth">
          <div v-for="list in loglist">
            <div v-if="list.type == 'edit'">{{ list.createTime }} {{ list.empNo }}  进行了" 
              <el-popover
                placement="right"
                title="修改"
                width="200"
                trigger="hover"
                :content="popLog(list.logData)">
                <el-button slot="reference">编辑</el-button>
              </el-popover>"         
            </div>
            <p v-if="list.type == 'confirm'">时间：{{ list.createTime }}，操作人：{{ list.empNo }}  进行了: 确定</p>
            <p v-if="list.type == 'complete'">时间：{{ list.createTime }}，操作人：{{ list.empNo }}  进行了: 完成</p>
          </div> 
      </el-tab-pane>
    </el-tabs>
    <el-table :data="form.taskDataList" border>
      <el-table-column prop="mouth" label="月份" width="80"></el-table-column>
      <el-table-column prop="completeSituation" label="完成情况"></el-table-column>
      <el-table-column prop="problemSuggestions" label="实施过程中存在的问题及建议"></el-table-column>
      <el-table-column prop="analysis" label="未按时限完成或进度滞后的项目原因分析及推进措施"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getDetail, edit, complete, confirm, getLogs} from 'api/task.js'
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
        console.log(this.form.taskDataList)
      })
    },
    handleClick (tab, event) {
      this.logs(tab.name)
    },
    logs (mouth) {
      getLogs(this.form.id, mouth).then((res) => {
        if (ERR_OK === res.data.code) {
          this.loglist = res.data.msg
          console.log(this.loglist)
        }
      })
    },
    // 修改内容
    onEdit () {
      edit(this.update).then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onConfirm () {
      confirm(this.update).then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onComplete () {
      complete(this.update).then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].field)
        switch (data[i].field) {
          case 'problemSuggestions':
            str = '问题和建议'
            break
          case 'analysis':
            str = '原因分析'
            break
          case 'completeSituation':
            str = '完成情况'
            break
        }
      }
      return str
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .my-textarea
    width 300px
</style>
