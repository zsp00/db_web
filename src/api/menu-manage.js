import {post} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

// 获取菜单列表
export function getMenuList () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/getMenuList'
  return post(url, {}, {headers: DB_API.headers})
}

// 添加菜单
export function addMenu (MenuInfo) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/addMenu'
  return post(url, {MenuInfo: MenuInfo}, {headers: DB_API.headers})
}

// 查询修改的菜单
export function editMenuId (MenuId) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/editMenuId'
  return post(url, {MenuId: MenuId}, {headers: DB_API.headers})
}

// 修改菜单
export function editMenu (Menu) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/editMenu'
  return post(url, {Menu: Menu}, {headers: DB_API.headers})
}

// 删除菜单
export function delMenu (MenuId) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/delMenu'
  return post(url, {MenuId: MenuId}, {headers: DB_API.headers})
}

// 菜单启用
export function enable (id) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/enable'
  return post(url, {id: id}, {headers: DB_API.headers})
}

// 菜单禁用
export function disable (id) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/disable'
  return post(url, {id: id}, {headers: DB_API.headers})
}

// 检查菜单名字是否重复
export function checkRepeat (menuName) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/checkRepeat'
  return post(url, { menuName: menuName }, {headers: DB_API.headers})
}

