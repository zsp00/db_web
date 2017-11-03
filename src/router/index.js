import Vue from 'vue'
import Router from 'vue-router'
import Task from 'components/task/task.vue'
import Fillin from 'components/task/fillin/fillin.vue'
import FillinDetail from 'components/task/fillin/detail.vue'
import TaskList from 'components/task/list/list.vue'
import Login from 'components/login/login.vue'
import Setting from 'components/setting/setting.vue'
import Label from 'components/setting/label/label.vue'
import MenuManagement from 'components/setting/menu-management/menu-management.vue'
import TypeList from 'components/task/task-type/type-list'
import Process from 'components/process/process'
import ProcessList from 'components/process/process-management/process-list'
import AddProcess from 'components/process/process-management/process-add'
import EditProcess from 'components/process/process-management/process-edit'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      redirect: 'task'
    },
    {
      path: '/task',
      name: '任务',
      component: Task,
      children: [
        {
          path: '',
          redirect: 'fillin'
        },
        {
          path: 'fillin',
          name: '任务列表',
          component: Fillin,
          children: [
            {
              path: 'detail/:id',
              name: '修改',
              component: FillinDetail
            }
          ]
        },
        {
          path: 'list',
          name: '任务管理',
          component: TaskList
        },
        {
          path: 'type-list',
          name: '任务分类管理',
          component: TypeList
        }
      ]
    },
    {
      path: '/setting',
      name: '设置',
      component: Setting,
      children: [
        {
          path: 'label',
          name: '标签管理',
          component: Label
        },
        {
          path: 'menu-management',
          name: '菜单管理',
          component: MenuManagement
        }
      ]
    },
    {
      path: '/process',
      name: '流程',
      component: Process,
      children: [
        {
          path: '',
          redirect: 'process-list'
        },
        {
          path: 'process-list',
          name: '流程管理',
          component: ProcessList
        },
        {
          path: 'process-add',
          name: '新增流程',
          component: AddProcess
        },
        {
          path: 'process-edit/:pId',
          name: '编辑流程',
          component: EditProcess
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})
