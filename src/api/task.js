import {get, post} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

export function getInfo () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/info'
  return get(url, {}, {headers: DB_API.headers})
}

export function getList (page, listRow, keyword, level) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/getList'
  return get(url, {page: page, listRow: listRow, keyword: keyword, level: level}, {headers: DB_API.headers})
}

export function getDetail (id) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/detail'
  return get(url, {id: id}, {headers: DB_API.headers})
}

export function edit (data) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/edit'
  return post(url, data, {headers: DB_API.headers})
}

export function confirm (data) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/confirm'
  return post(url, data, {headers: DB_API.headers})
}

export function complete (data) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/complete'
  return post(url, data, {headers: DB_API.headers})
}

export function getLogs (tId, mouth) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Task/getLogs'
  return post(url, { tId: tId, mouth: mouth }, {headers: DB_API.headers})
}
