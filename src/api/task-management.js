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
