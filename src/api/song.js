import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid) {
  let url = '/api/lyric'
  let data = Object.assign({}, commonParams, {
    songmid: mid,
    g_tk: 5381,
    uin: 0,
    platform: 'yqq',
    format: 'json',
    notice: 0,
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}