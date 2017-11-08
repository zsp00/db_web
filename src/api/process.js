import { post } from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

// 获取公司、一级部门
export function getCompDept () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Process/getCompDept'
  return post(url, {}, {headers: DB_API.headers})
}

// 新增流程
export function addProcess (data) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Process/addProcess'
  return post(url, { data: data }, {headers: DB_API.headers})
}

// 获取流程列表
export function getProcessList (page, listRow) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Process/getProcessList'
  return post(url, { page: page, listRow: listRow }, {headers: DB_API.headers})
}

// 删除流程
export function del (ids) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Process/del'
  return post(url, { ids: ids }, {headers: DB_API.headers})
}

// 获取流程信息
export function getProcessInfo (pId) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Process/getProcessInfo'
  return post(url, { pId: pId }, {headers: DB_API.headers})
}

// 执行编辑流程
export function edit (data) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Process/edit'
  return post(url, { data: data }, {headers: DB_API.headers})
}
