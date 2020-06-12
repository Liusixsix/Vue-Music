/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-04 02:31:14
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-14 09:30:44
 */
import jsonp from './jsonp'
import { commonParams, options } from '@/api/config'
import axios from 'axios'

// 歌手列表
export function getSingerList() {
  const url = 'http://localhost:3000/artist/list?type=-1&area=7&limit=100'
  return axios.get(url, {
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail(id) {
  const url = 'http://localhost:3000/artists/'
  return axios.get(url, {
    params: {
      id,
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getMusic(songmid) {
  const url = 'http://localhost:3002/api/music'
  const data = Object.assign({}, commonParams, {
    songmid: songmid,
    filename: 'C400' + songmid + '.m4a',
    guid: 4866459368, // 会变，以实时抓取的数据为准
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
