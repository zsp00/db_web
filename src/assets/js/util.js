import axios from 'axios'
import { Message } from 'element-ui'
export function post (url, data, config = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, config).then((res) => {
      if (res.data.code === 403) {
        reject(res)
        Message.warning('您未登录')
        toLogin()
      } else {
        resolve(res)
      }
    }).catch((res) => {
      Message.warning('网络错误')
      reject(res)
    })
  })
}
export function get (url, data, config = {}) {
  config.params = data
  return new Promise((resolve, reject) => {
    axios.get(url, config).then((res) => {
      if (res.data.code === 403) {
        reject(res)
        Message.warning('您未登录')
        toLogin()
      } else {
        resolve(res)
      }
    }).catch((res) => {
      Message.warning('网络错误')
      reject(res)
    })
  })
}

export function toLogin () {
  window.location.href = '/'
}
