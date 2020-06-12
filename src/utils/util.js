
import storage from 'good-storage'


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0, i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
    }
    return _arr
}
/**
 * 节流 
 * @param 
 * @fun 回调
 * @delay  延迟
*/
export function debounce(fun,delay=200){
    let timer
    return function(...args) {
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            fun.apply(this, args)
        },delay)
    }
}


function inserArray(arr,val,compare,maxlen){
    const index = arr.findIndex(compare)
    if(index === 0) return
    if(index> 0 ){
        arr.splice(index,1)
    }
    arr.unshift(val)
    if(maxlen&&arr.length > maxlen){
        arr.pop()
    }
}

/**
 * @param 
 * @SEARCH_KEY  key
 * @SEARCH_MAX_LENGTH 最大存储数量
*/
const SEARCH_KEY = '_search'
const SEARCH_MAX_LENGTH = 15
export function savaSearch(query){
    let searches = storage.get(SEARCH_KEY,[])
    inserArray(searches,query,(item)=>{
        return item === query
    },SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY,searches)
    return searches
}

export function loadSearch(){
    return storage.get(SEARCH_KEY,[])
}