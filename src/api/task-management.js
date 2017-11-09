import {post} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

// 获取任务列表
export function getTaskList () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/getTaskList'
  return post(url, {}, {headers: DB_API.headers})
}

// 删除任务
export function delTask (id) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/delTask'
  return post(url, { id: id }, {headers: DB_API.headers})
}

// 获取所有分类
export function getType () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/getType'
  return post(url, {}, {headers: DB_API.headers})
}

// 获取所有流程
export function getProcess () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/getProcess'
  return post(url, {}, {headers: DB_API.headers})
}

