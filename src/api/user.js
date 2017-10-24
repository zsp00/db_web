import {get} from 'assets/js/util.js'
import {DB_API} from 'api/config.js'

export function getUserInfo () {
  var url = DB_API['protocol'] + '://' + DB_API['hostname'] + '/index/User/getUserInfo'
  return get(url, {}, {headers: DB_API.headers})
}
