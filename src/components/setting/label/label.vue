<template>
  <div id="container">
    <el-row :gutter="30">
      <el-col :span="9">
        <!-- 添加用的标签Dialog框 -->
        <el-dialog title="添加标签" :visible.sync="addDialogVisible" width="30%">
          <el-form label-position="top" label-width="80px" :model="form">
            <el-form-item label="标签名称：">
              <el-input autofocus v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false" plain>取 消</el-button>
            <el-button type="primary" @click="_add" plain>确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改用的标签Dialog框 -->
        <el-dialog title="修改标签" :visible.sync="editDialogVisible" width="30%">
          <el-form label-position="top" label-width="80px" :model="labelInfo">
            <el-form-item label="标签名称：">
              <el-input autofocus v-model="labelInfo.name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false" plain>取 消</el-button>
            <el-button type="primary" @click="_saveEdit" plain>确 定</el-button>
          </span>
        </el-dialog>
        <!-- 左侧标签列表 -->
        <el-card>
          <div slot="header" class="label-list-header">
            <span>标签列表</span>
            <el-button type="primary" size="small" icon="el-icon-plus" plain @click="addDialogVisible = true"></el-button>
          </div>
          <div class="label-list-container">
            <ul id="asdasdasd">
              <li v-for="(item, index) in labelList" :key="item.id" :class="(labelId == item.id) ? 'label-selected' : ''" @click="labelId = item.id">
                <span>{{ item.name }}</span>
                <i class="el-icon-delete" @click="_del(item.id, index)"></i>
                <i class="el-icon-edit" @click="_edit(item.id, index)"></i>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <!-- 右侧label-value -->
      <el-col :span="15">
        <label-value :labelId="labelId"></label-value>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LabelValue from 'components/setting/label/label-value'
import { checkRepeat, add, getLabelList, edit, saveEdit, del } from 'api/label.js'
import { trim } from 'api/public.js'
export default {
  data () {
    return {
      addDialogVisible: false,     // 是否打开新增标签框
      editDialogVisible: false,    // 是否打开编辑标签框
      form: {                      // 新增标签时，标签名称
        name: ''
      },
      labelList: [],               // 标签列表
      labelInfo: {                 // 编辑标签时，标签的值
        id: '',
        name: ''
      },
      index: null,                 // 编辑标签时，所修改的标签的索引值
      labelId: null                // 选中的或者默认的标签Id
    }
  },
  components: {
    LabelValue
  },
  mounted () {
    this._getLabelList()
  },
  watch: {
    labelId: function (newVal, oldVal) {
      if (newVal !== null && newVal !== '' && newVal !== oldVal) {
        // this._selectLabel()
      }
    }
  },
  methods: {
    _add () {
      this.form.name = trim(this.form.name)
      if (this.form.name === '') {
        this.$message.error('标签名称不能为空！')
        return
      }
      checkRepeat(this.form.name).then((res) => {
        return new Promise(function (resolve, reject) {
          if (res.data.code === 1) {
            resolve()            // 没有重复
          } else {
            reject()             // 有相同的标签名
          }
        })
      }).then(() => {
        add(this.form.name).then((res) => {
          if (res.data.code === 1) {
            // 添加标签成功
            this.$message.success('添加标签成功！')
            this.labelList.push(res.data.data)    // 在标签列表中添加新增的标签
            this.addDialogVisible = false
            this.form.name = ''
          } else {
            // 添加失败
            this.$message.error('添加标签失败！')
          }
        })
      }).catch(() => {
        // 有重复的标签名称
        this.$message.error('该标签名称已经存在！')
      })
    },
    _getLabelList () {
      getLabelList().then((res) => {
        if (res.data.code === 1) {
          this.labelList = res.data.data
          if (this.labelList.length > 0) {
            this.labelId = this.labelList[0].id
          }
        } else {
          this.$message.warning('暂无标签！')
        }
      })
    },
    _edit (lid, index) {
      this.index = index
      edit(lid).then((res) => {
        if (res.data.code === 1) {
          this.labelInfo.id = res.data.data.id
          this.labelInfo.name = res.data.data.name
          this.editDialogVisible = true
        } else {
          this.$message.error('获取该标签信息失败！')
        }
      })
    },
    _saveEdit () {
      this.labelInfo.name = trim(this.labelInfo.name)
      if (this.labelInfo.name === '') {
        this.$message.error('标签名称不能为空！')
        return
      }
      checkRepeat(this.labelInfo.name).then((res) => {
        return new Promise(function (resolve, reject) {
          if (res.data.code === 1) {
            resolve()     // 没有重复
          } else {
            reject()      // 有相同的标签名
          }
        })
      }).then(() => {
        saveEdit(this.labelInfo.id, this.labelInfo.name).then((res) => {
          if (res.data.code === 1) {
            this.$message.success('修改标签成功！')
            this.labelList[this.index].name = this.labelInfo.name
            this.editDialogVisible = false
          } else {
            this.$message.error('修改标签失败！')
          }
        })
      }).catch(() => {
        // 有重复的标签名称
        this.$message.error('该标签名称已经存在！')
      })
    },
    _del (lid, index) {
      this.$confirm('此操作将删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(lid).then((res) => {
          if (res.data.code === 1) {
            this.$message.success('删除标签成功！')
            this.labelList.splice(index, 1)
          } else {
            this.$message.error('删除标签失败！')
          }
        })
      }).catch(() => {
        this.$message.warning('已取消删除！')
      })
    }
  }
}
</script>

<style scoped>
#container {
  padding: 20px;
}
/* 左侧标签列表 */
.label-list {
  height: 800px;
  padding: 20px;
  border: solid 1px #cccccc;
}
.label-list-header {
  height: 28px;
}
.label-list-header span{
  font-size: 20px;
  display: inline;
  line-height: 28px;
}
.label-list-header button{
  float: right;
}
.label-list-container {
  margin-top: 10px;
  width: 100%;
  height: 700px;
  overflow-y: scroll;
}
.label-list-container ul li {
  margin: 0 20px 0 0;
  height: 30px;
  line-height: 30px;
  margin-bottom: 18px;
}
.label-list-container ul li span {
  margin-left: 20px;
}
.label-list-container ul li i {
  float: right;
  line-height: 30px;
  margin-left: 10px;
  cursor: pointer;
  width: 30px;
  height: 30px;
}
.label-selected {
  background-color: #eee;
}
</style>