<template>
  <div id="type-list" v-loading="loading">
    <div style="margin-top: 20px" id="btn">
      <el-button type="primary" @click="showAddDialog" plain>新增菜单</el-button>
      <el-button type="primary" @click="Enable(multipleSelection)" plain>启用</el-button>
      <el-button type="primary" @click="Disable(multipleSelection)" plain>禁用</el-button>
      <!--这是添加菜单的模态框-->
      <el-dialog title="新增菜单" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="菜单名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径" :label-width="formLabelWidth">
            <el-input v-model="form.router" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级菜单" :label-width="formLabelWidth">
            <el-select v-model="form.pId" filterable placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单排序" :label-width="formLabelWidth">
            <el-input v-model="form.sort" auto-complete="off" style="width:30%;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="_AddSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <!--这是修改菜单的模态框-->
      <el-dialog title="修改菜单" :visible.sync="dialogFormEdit">
        <el-form :model="editForm">
          <el-form-item label="菜单名称" :label-width="formLabelWidth">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径" :label-width="formLabelWidth">
            <el-input v-model="editForm.router" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" :label-width="formLabelWidth">
            <el-select v-model="editForm.pId" filterable placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单排序" :label-width="formLabelWidth">
            <el-input v-model="editForm.sort" auto-complete="off" style="width:30%;"></el-input>
          </el-form-item>          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormEdit = false">取 消</el-button>
          <el-button type="primary" @click="_editSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--这是菜单表格的展示框-->
    <el-table ref="multipleTable" :data="data" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="name" label="菜单名称">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'" close-transition>{{ scope.row.status == 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="options" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="text" size="small"  @click="showEditDialog(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="_del(scope.row.id)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getMenuList, addMenu, editMenuId, editMenu, delMenu, enable, disable, checkRepeat} from 'api/menu-manage.js'
  import {ERR_OK} from 'api/config.js'
  import { trim } from 'api/public.js'
  export default {
    data () {
      return {
        data: [],
        form: {
          name: '',
          router: '',
          pId: '0',
          status: '1'
        },
        editForm: {
          name: '',
          router: ''
        },
        options: [
          {
            label: '顶级分类',
            value: '0'
          }
        ],
        formLabelWidth: '80px',
        loading: false,
        dialogFormVisible: false,
        dialogFormEdit: false,
        multipleSelection: ''
      }
    },
    mounted () {
      this._getMenuList()
    },
    methods: {
      // 查询菜单列表
      _getMenuList () {
        getMenuList().then((res) => {
          this.data = res.data.msg
        })
      },
      // 多选按钮
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 启用按钮
      Enable (id) {
        enable(id).then((res) => {
          if (ERR_OK === res.data.code) {
            this.$message.success(res.data.msg)
            this._getMenuList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
     // 禁用按钮
      Disable (id) {
        disable(id).then((res) => {
          if (ERR_OK === res.data.code) {
            this.$message.success(res.data.msg)
            this._getMenuList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 删除分类
      _del (id) {
        this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delMenu(id).then((res) => {
            if (ERR_OK === res.data.code) {
              this.$message.success(res.data.msg)
              this._getMenuList()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message.warning('已取消删除！')
        })
      },
      // 添加菜单的模态框
      showAddDialog () {
        var tList = this.data
        this.options = [{label: '顶级分类', value: '0'}]
        for (var i of tList) {
          this.options.push({label: i.name, value: i.id})
        }
        this.dialogFormVisible = true
      },
      // 修改菜单的模态框
      showEditDialog (id) {
        var tList = this.data
        this.options = [{label: '顶级分类', value: '0'}]
        for (var i of tList) {
          this.options.push({label: i.name, value: i.id})
        }
        editMenuId(id).then((res) => {
          this.editForm = res.data.msg
        })
        this.dialogFormEdit = true
      },
      // 添加的数据提交
      _AddSubmit  () {
        this.form.name = trim(this.form.name)
        if (this.form.name === '') {
          this.$message.error('菜单名称不能为空')
          return
        }
        checkRepeat(this.form.name).then((res) => {
          return new Promise(function (resolve, reject) {
            if (res.data.code === ERR_OK) {
              resolve()
            } else {
              reject()
            }
          })
        }).then(() => {
          addMenu(this.form).then((res) => {
            if (ERR_OK === res.data.code) {
              this.$message.success(res.data.msg)
              this.dialogFormVisible = false
              this._getMenuList()
              this.form.name = ''
            }
          })
        }).catch(() => {
          this.$message.error('该名称已经存在！')
        })
      },
      // 修改的数据提交
      _editSubmit  () {
        this.editForm.name = trim(this.editForm.name)
        if (this.editForm.name === '') {
          this.$message.error('菜单名称不能为空')
          return
        }
        checkRepeat(this.editForm.name).then((res) => {
          return new Promise(function (resolve, reject) {
            if (res.data.code === ERR_OK) {
              resolve()
            } else {
              reject()
            }
          })
        }).then(() => {
          editMenu(this.editForm).then((res) => {
            if (ERR_OK === res.data.code) {
              this.$message.success(res.data.msg)
              this.dialogFormEdit = false
              this._getMenuList()
            } else {
              this.$message.error('请做出修改')
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

