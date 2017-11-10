import { post } from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

// 保存查看全部列表权限的人员Id
export function save (empNo) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TasklistAuthority/save'
  return post(url, { empNo: empNo }, {headers: DB_API.headers})
}

// 获取人员Id
export function getAuthorityEmpList () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TasklistAuthority/getAuthorityEmpList'
  return post(url, {}, {headers: DB_API.headers})
}
