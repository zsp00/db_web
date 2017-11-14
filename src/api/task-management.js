import {post} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

// 获取所有任务列表
export function getTaskList () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/getTaskList'
  return post(url, {}, {headers: DB_API.headers})
}

// 添加任务
export function addTask (taskInfo) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/addTask'
  return post(url, { taskInfo: taskInfo }, {headers: DB_API.headers})
}

// 删除任务
export function delTask (id) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/delTask'
  return post(url, { id: id }, {headers: DB_API.headers})
}

// 获取所有分类
export function getTaskType () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/getTaskType'
  return post(url, {}, {headers: DB_API.headers})
}

// 获取所有流程
export function getProcess () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/getProcess'
  return post(url, {}, {headers: DB_API.headers})
}

// 督办任务列表
export function getSuperviceList (keyword, level, typeId, deptNo, taskdataStatus) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/getSuperviceList'
  return post(url, { keyword: keyword, level: level, typeId: typeId, deptNo: deptNo, taskdataStatus: taskdataStatus }, {headers: DB_API.headers})
}

// 全部督办任务
export function taskSupervice (id) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/taskSupervice'
  return post(url, { id: id }, {headers: DB_API.headers})
}

// 获取督办列表的部门
export function getTaskDeptNo () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskManage/getTaskDeptNo'
  return post(url, {}, {headers: DB_API.headers})
}
