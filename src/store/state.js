import {getStorage, getPlayStorage, getFavorite} from 'common/js/store.js'

const playMode = {
  sequence: 0,         // 顺序播放
  loop: 1,            // 循环播放
  random: 2          // 随机播放
}

const state = {
  singer: {},                                       // 歌手信息
  playing: false,                                  // 播放器播放状态
  fullScreen: false,                              // 播放器展开状态
  playlist: [],                                  // 播放歌曲列表
  sequenceList: [],                             // 顺序播放列表
  mode: playMode.sequence,                     // 播放模式
  currentIndex: -1,                           // 当前播放歌曲索引
  songlist: {},                              // 推荐页歌手列表
  rankList: {},                             // 歌曲排行的数据列表
  searchHistory: getStorage(),             // 搜索结果数据
  playHistory: getPlayStorage(),          // 播放历史（最近播放）
  favoriteList: getFavorite()            // 我的收藏
}

export default state
