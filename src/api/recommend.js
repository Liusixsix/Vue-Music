/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-04 02:31:14
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-13 18:55:08
 */
import axios from 'axios'
import jsonp from './jsonp'
import { commonParams, options } from '@/api/config'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platfrom: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// 歌单推荐
export function getDiscList() {
  const url = 'http://localhost:3000/top/playlist'
  return axios.get(url, {
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e.message)
  })
}

// 获取歌单详情
export function getDisdetail(id) {
  const url = 'http://localhost:3000/playlist/detail'
  return axios.get(url, {
    params: { id }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e.message)
  })
}

export function getSongList(disstid) {
  const url = 'http://localhost:3002/api/getSongList'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    notice: 0,
    needNewCode: 1,
    new_format: 1,
    pic: 500,
    disstid, // 关键数据
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    picmid: 1,
    nosign: 1,
    song_begin: 0,
    platform: 'h5',
    song_num: 100,
    _: +new Date()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
