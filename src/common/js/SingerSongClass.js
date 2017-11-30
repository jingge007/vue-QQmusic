import {getLyric} from 'api/song.js'
import {Base64} from 'js-base64'

// 处理 musicData.singer 数组，使其变为一个字符串
export function filterSinger(singer) {
  let result = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    result.push(item.name)
  })
  return result.join(' / ')      // join() 方法用于把数组中的所有元素放入一个字符串。元素是通过指定的分隔符进行分隔的。
}

export class SingerSong {
  constructor({id, mid, singer, name, album, duration, img, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.img = img
    this.url = url
  }

  getLyric() {           // 获取歌词的数据
    if (this.lyric) {
      return Promise.resolve(this.lyric)   // Promise.resolve(value)方法返回一个以给定值解析后的Promise对象。但如果这个值是个thenable（即带有then方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态,否则以该值为成功状态返回promise对象。
    }
    return new Promise((resolve) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === 0) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          alert('no lyric')
        }
      })
    })
  }
}

export function createSingerSong(musicData) {
  return new SingerSong({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}
