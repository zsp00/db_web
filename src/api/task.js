import {get, post} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

export function getInfo () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/info'
  return get(url, {}, {headers: DB_API.headers})
}

export function getList (page, listRow, keyword, level, typeId, ifStatus, dept, needToDo, timeLimit) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/getList'
  return get(url, { page: page, listRow: listRow, keyword: keyword, level: level, typeId: typeId, ifStatus: ifStatus, dept: dept, needToDo: needToDo, timeLimit: timeLimit }, {headers: DB_API.headers})
}

export function getDetail (id, tdDeptNo) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/detail'
  return get(url, { id: id, tdDeptNo: tdDeptNo }, {headers: DB_API.headers})
}

// 任务内容修改
export function edit (id, completeSituation, problemSuggestions, analysis, taskSelect, submit) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/edit'
  return post(url, { id: id, completeSituation: completeSituation, problemSuggestions: problemSuggestions, analysis: analysis, taskSelect: taskSelect, submit: submit }, {headers: DB_API.headers})
}

// 提交任务
export function submits (data) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/submits'
  return post(url, data, {headers: DB_API.headers})
}

// 驳回任务请求
export function reject (data, reason) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/reject'
  return post(url, { data: data, reason: reason }, {headers: DB_API.headers})
}

// 撤回任务
export function withdraw (data) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/withdraw'
  return post(url, data, {headers: DB_API.headers})
}

// 完成任务
export function complete (data) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/complete'
  return post(url, data, {headers: DB_API.headers})
}

// 修改日志
export function getLogs (tId, mouth, tDeptNo) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/getLogs'
  return post(url, { tId: tId, mouth: mouth, tDeptNo: tDeptNo }, {headers: DB_API.headers})
}

// 获取分类列表
export function getTypeList () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/getTypeList'
  return post(url, {}, {headers: DB_API.headers})
}

// 添加分类
export function addType (typeInfo) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/addType'
  return post(url, {typeInfo: typeInfo}, {headers: DB_API.headers})
}

// 获取编辑的分类信息
export function editTypeSelt (typeId) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/editTypeSelt'
  return post(url, {typeId: typeId}, {headers: DB_API.headers})
}

// 编辑分类
export function editType (typeInfo) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/editType'
  return post(url, {typeInfo: typeInfo}, {headers: DB_API.headers})
}

// 删除分类
export function delType (typeId) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/delType'
  return post(url, {typeId: typeId}, {headers: DB_API.headers})
}

// 检查分类名字是否重复
export function checkRepeat (typeName) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/checkRepeat'
  return get(url, { typeName: typeName }, {headers: DB_API.headers})
}

// 禁用启用
export function oprationSta (typeId, status) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/oprationSta'
  return get(url, { typeId: typeId, status: status }, {headers: DB_API.headers})
}

// 全部提交
export function commitAll (timeLimit) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/commitAll'
  return get(url, { timeLimit: timeLimit }, {headers: DB_API.headers})
}

// 检查第三级用户提交时是否提交全部任务
export function checkCount (timeLimit) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/checkCount'
  return get(url, { timeLimit: timeLimit }, {headers: DB_API.headers})
}

// 全部确认任务
export function confirm (timeLimit) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/confirm'
  return post(url, { timeLimit: timeLimit }, {headers: DB_API.headers})
}

// 检查最后一级用户确认时是否确认全部任务
export function checkCountConfirm (timeLimit) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/checkCountConfirm'
  return get(url, { timeLimit: timeLimit }, {headers: DB_API.headers})
}

// 任务查询
export function getTaskList (condition, page, listRow) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskSearch/getTaskList'
  return get(url, { condition: condition, page: page, listRow: listRow }, {headers: DB_API.headers})
}

// 任务导出
export function exportList (condition) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/TaskSearch/exportList'
  return get(url, { condition: condition }, {headers: DB_API.headers})
}

// 任务导出
export function exportFillinList (condition) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/exportFillinList'
  return get(url, { condition: condition }, {headers: DB_API.headers})
}
