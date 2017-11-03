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
export function getProcessList () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Process/getProcessList'
  return post(url, {}, {headers: DB_API.headers})
}
