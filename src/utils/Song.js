import { getLyric } from "../api/song"
export default class Song {
    constructor({ id, name, picUrl, desc, singerName, duration }) {
        this.id = id
        this.name = name
        this.picUrl = picUrl
        this.desc = desc
        this.url = `https://music.163.com/song/media/outer/url?id=${this.id}.mp3`
        this.singerName = singerName,
        this.duration = duration

    }

    getLyric() {
        if (this.lyric) return Promise.resolve(this.lyric)
        return new Promise((resolve, reject) => {
            getLyric(this.id).then(res => {
                if (res.code === 200) {
                    this.lyric = res.lrc.lyric
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })

    }

}

export function createSong(Data, songVkey) {
    return new Song({
        id: Data.id,
        name: Data.name,
        picUrl: Data.picUrl,
        desc: Data.desc,
        singerName: Data.singerName,
        duration: Data.duration
    })
}

export function filterSinger(singer) {
    const ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}