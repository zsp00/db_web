import {get} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

export function getMenu (pId) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/getMenu'
  return get(url, {pId: pId}, {headers: DB_API.headers})
}

export function getSubmenu (router) {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/getSubmenu'
  return get(url, {router: router}, {headers: DB_API.headers})
}
