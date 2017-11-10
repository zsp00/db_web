<template>
  <div id="type-list" v-loading="loading">
    <div style="margin-top: 20px" id="btn">
      <el-button type="primary" @click="showAddDialog">新增分类</el-button>
      <el-button type="primary" @click="_del(multipleSelection)">删除</el-button>
      <!--这是添加分类的模态框-->
      <el-dialog title="新增分类" :visible.sync="dialogFormAdd" width="30%">
        <el-form :model="form">
          <el-form-item label="分类名称">
            <el-input v-model="form.typeName" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormAdd = false">取 消</el-button>
          <el-button type="primary" @click="_AddSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <!--这是修改分类的模态框-->
       <el-dialog title="修改分类" :visible.sync="dialogFormEdit" width="30%">
        <el-form :model="editForm">
          <el-form-item label="分类名称">
            <el-input v-model="editForm.typeName" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormEdit = false">取 消</el-button>
          <el-button type="primary" @click="_editSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--这是分类表格的展示框-->
    <el-table ref="multipleTable" :data="typeList" border tooltip-effect="dark" style="width: 100%;margin-top:20px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="typeName" label="分类名称">
      </el-table-column>
      <el-table-column prop="creator" label="创建者" width="180">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" close-transition>{{ scope.row.status == 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="options" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="text" size="small"  @click="showEditDialog(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="_operation(scope.row.id, scope.row.status)" >{{ scope.row.status == 1 ? '禁用' : '启用' }}</el-button>
          <el-button type="text" size="small" @click="_del(scope.row.id)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getTypeList, addType, editType, editTypeSelt, delType, checkRepeat, oprationSta} from 'api/task.js'
  import {ERR_OK} from 'api/config.js'
  import { trim } from 'api/public.js'
  export default {
    data () {
      return {
        typeList: [],
        form: {
          typeName: '',
          status: '1'
        },
        editForm: {
          typeName: ''
        },
        loading: false,                 // 加载
        dialogFormAdd: false,           // 是否打开新增模态框
        dialogFormEdit: false,           // 是否修改新增模态框
        multipleSelection: '0'
      }
    },
    mounted () {
      this._getTypeList()
    },
    methods: {
      // 查询分类列表
      _getTypeList () {
        getTypeList().then((res) => {
          this.typeList = res.data.msg
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 删除分类
      _del (typeId) {
        this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delType(typeId).then((res) => {
            if (res.data.code === ERR_OK) {
              this.$message.success(res.data.msg)
              this._getTypeList()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message.warning('已取消删除！')
        })
      },
      _operation (typeId, status) {
        oprationSta(typeId, status).then((res) => {
          if (res.data.code === ERR_OK) {
            this.$message.success(res.data.msg)
            this._getTypeList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 添加分类的模态框
      showAddDialog () {
        this.dialogFormAdd = true
      },
      // 修改分类的模态框
      showEditDialog (id) {
        editTypeSelt(id).then((res) => {
          this.editForm = res.data.msg
        })
        this.dialogFormEdit = true
      },
      // 添加的数据提交
      _AddSubmit  () {
        this.form.typeName = trim(this.form.typeName)
        if (this.form.typeName === '') {
          this.$message.error('分类名称不能为空')
          return
        }
        checkRepeat(this.form.typeName).then((res) => {
          return new Promise(function (resolve, reject) {
            if (res.data.code === ERR_OK) {
              resolve()
            } else {
              reject()
            }
          })
        }).then(() => {
          addType(this.form).then((res) => {
            if (ERR_OK === res.data.code) {
              this.$message.success(res.data.msg)
              this.dialogFormAdd = false
              this._getTypeList()
              this.form.typeName = ''
            }
          })
        }).catch(() => {
          this.$message.error('该名称已经存在！')
        })
      },
      // 修改的数据提交
      _editSubmit  () {
        this.editForm.typeName = trim(this.editForm.typeName)
        if (this.editForm.typeName === '') {
          this.$message.error('分类名称不能为空')
          return
        }
        checkRepeat(this.editForm.typeName).then((res) => {
          return new Promise(function (resolve, reject) {
            if (res.data.code === ERR_OK) {
              resolve()
            } else {
              reject()
            }
          })
        }).then(() => {
          editType(this.editForm).then((res) => {
            if (ERR_OK === res.data.code) {
              this.$message.success(res.data.msg)
              this.dialogFormEdit = false
              this._getTypeList()
            }
          })
        }).catch(() => {
          this.$message.error('该名称已经存在！')
        })
      }
    }
  }
</script>

<style scoped>
#type-list {
  margin: 20px;
}
#btn {
  margin-bottom: 10px;
}
</style>

