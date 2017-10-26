import Vue from 'vue'
import Router from 'vue-router'
import Task from 'components/task/task.vue'
import Fillin from 'components/task/fillin/fillin.vue'
import FillinDetail from 'components/task/fillin/detail.vue'
import taskList from 'components/task/list/list.vue'
import Login from 'components/login/login.vue'
import Setting from 'components/setting/setting.vue'
import Label from 'components/setting/label/label.vue'
import MenuManagement from 'components/setting/menu-management/menu-management.vue'

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
          name: '在线填报',
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
          name: '任务列表',
          component: taskList
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
      path: '/login',
      component: Login
    }
  ]
})
