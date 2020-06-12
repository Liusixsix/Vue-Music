import axios from 'axios'

export const toplist = () =>{
    const url = 'http://localhost:3000/toplist/detail'
    return axios.get(url).then(res=>{
        return Promise.resolve(res.data)
    })
}