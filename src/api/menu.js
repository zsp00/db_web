import {get} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

export function getMenus () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/Menu/getMenus'
  return get(url, {}, {headers: DB_API.headers})
}
