import Vue from 'vue'
import Router from 'vue-router'
import Task from 'components/task/task.vue'
import Fillin from 'components/task/fillin/fillin.vue'
import FillinDetail from 'components/task/fillin/detail.vue'
import Record from 'components/task/record/record.vue'
import Login from 'components/login/login.vue'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/task',
      component: Task,
      children: [
        {
          path: '',
          redirect: 'fillin'
        },
        {
          path: 'fillin',
          component: Fillin
        },
        {
          path: 'fillin/detail/:id',
          component: FillinDetail
        },
        {
          path: 'record',
          component: Record
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

export const asyncRouterMap = [
  {
    path: '/aaa',
    component: Login
  }
]
