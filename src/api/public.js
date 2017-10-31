import {post, get} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

export function login (username, password, remember) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/login'
  return post(url, {username: username, password: password, remember: remember}, {headers: DB_API.headers})
}
export function logout () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/login/logout'
  return post(url, {}, {headers: DB_API.headers})
}

export function checkLogin () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/login/checkLogin'
  return get(url, {}, {headers: DB_API.headers})
}

// 删除左右两端的空格
export function trim (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
