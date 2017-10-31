import {get} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

// 检查标签名字是否重复
export function checkRepeat (labelName) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Label/checkRepeat'
  return get(url, { labelName: labelName }, {headers: DB_API.headers})
}

// 添加标签
export function add (labelName) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Label/add'
  return get(url, { labelName: labelName }, {headers: DB_API.headers})
}

// 获取标签列表
export function getLabelList () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Label/getLabelList'
  return get(url, {}, {headers: DB_API.headers})
}

// 获取要编辑的标签的信息
export function edit (lid) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Label/edit'
  return get(url, { lid: lid }, {headers: DB_API.headers})
}

// 保存标签修改
export function saveEdit (lid, labelName) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Label/saveEdit'
  return get(url, { lid: lid, labelName: labelName }, {headers: DB_API.headers})
}

// 删除标签
export function del (lid) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Label/del'
  return get(url, { lid: lid }, {headers: DB_API.headers})
}

// 标签成员方法
// 获取当前标签的成员
export function getLabelValue (lid) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Label/getLabelValue'
  return get(url, { lid: lid }, {headers: DB_API.headers})
}
