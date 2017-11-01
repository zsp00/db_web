<template>
  <div id="type-list" v-loading="loading">
    <div style="margin-top: 20px" id="btn">
      <el-button type="button" @click="showAddDialog">新增菜单</el-button>
      <el-button @click="toggleDelection()">禁用</el-button>
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
          <el-button type="primary" @click="onSubmit">确 定</el-button>
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
          <el-button type="primary" @click="editSubmit">确 定</el-button>
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
          <el-button type="text" size="small" @click="" >权限</el-button>
          <el-button type="text" size="small"  @click="showEditDialog(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="delMenu(scope.row.id)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {addMenu, getMenuList, editMenuId, editMenu, delMenu} from 'api/menu-manage.js'
  import {ERR_OK} from 'api/config.js'
  export default {
    data () {
      return {
        data: [],
        multipleSelection: [],
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
        formLabelWidth: '80px',
        options: [
          {
            label: '顶级分类',
            value: '0'
          }
        ],
        loading: false,
        dialogFormVisible: false,
        dialogFormEdit: false
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
      toggleDelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleDelection(row)
          })
        } else {
          this.$refs.multipleTable.clearDelection()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 删除菜单
      delMenu (id) {
        delMenu(id).then((res) => {
          if (ERR_OK === res.data.code) {
            this.$message.success(res.data.msg)
            this._getMenuList()
          } else {
            this.$message.error(res.data.msg)
          }
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
      onSubmit  () {
        if (this.form.name === '') {
          this.$message.error('菜单名称不能为空')
        } else if (this.form.router === '') {
          this.$message.error('路径不能为空')
        } else {
          addMenu(this.form).then((res) => {
            if (ERR_OK === res.data.code) {
              this.$message.success(res.data.msg)
              this.dialogFormVisible = false
              this._getMenuList()
            }
          })
        }
      },
      // 修改的数据提交
      editSubmit  () {
        if (this.editForm.name === '') {
          this.$message.error('菜单名称不能为空')
        } else if (this.editForm.router === '') {
          this.$message.error('路径不能为空')
        } else {
          editMenu(this.editForm).then((res) => {
            if (ERR_OK === res.data.code) {
              this.$message.success(res.data.msg)
              this.dialogFormEdit = false
              this._getMenuList()
            }
          })
        }
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

