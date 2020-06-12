import { playMode } from '@/utils/config'
import { loadSearch } from '@/utils/util'
const state = {
    singer: {},
    playing: false,//是否播放中
    fullScreen: false,//展开播放器
    playList: [],//播放列表
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    searchHistory: loadSearch()
}

export default state