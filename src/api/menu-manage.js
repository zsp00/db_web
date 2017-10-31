import {post} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

export function addMenu (MenuInfo) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/addMenu'
  return post(url, {MenuInfo: MenuInfo}, {headers: DB_API.headers})
}

export function getMenuList () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/getMenuList'
  return post(url, {}, {headers: DB_API.headers})
}

export function editMenuId (MenuId) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/editMenuId'
  return post(url, {MenuId: MenuId}, {headers: DB_API.headers})
}

export function editMenu (Menu) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/editMenu'
  return post(url, {Menu: Menu}, {headers: DB_API.headers})
}

export function delMenu (MenuId) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/delMenu'
  return post(url, {MenuId: MenuId}, {headers: DB_API.headers})
}
