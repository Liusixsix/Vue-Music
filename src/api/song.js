import axios from 'axios'
// 获取歌词
export const getLyric = (id) => {
    const url = 'http://localhost:3000/lyric'
    return axios.get(url, {
        params: { id }
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 热门搜索关键字
export const SearchHot = () => {
    const url = 'http://localhost:3000/search/hot/detail'
    return axios.get(url).then(res => {
        return Promise.resolve(res.data)
    })
}


// 搜索

export const search = (keywords,offset=1,limit=30,)=>{
    const url = 'http://localhost:3000/search'
    return axios.get(url ,{
        params: { keywords,limit,offset }
    }).then(res => {
        return Promise.resolve(res.data)
    })
}