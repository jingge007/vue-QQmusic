// 根级别的 mutation

import * as types from './mutations-type'

const mutations = {
  [types.SET_SINGER](state, singer) {                     // 歌手信息
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {               // 播放器播放状态
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {                 // 播放器展开状态
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {                   // 播放歌曲列表
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {             // 顺序播放列表
    state.sequenceList = list
  },
  [types.SET_MODE](state, mode) {                       // 播放模式
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {            // 当前播放歌曲索引
    state.currentIndex = index
  },
  [types.SET_SONGLIST](state, songlist) {            // 推荐页歌手列表
    state.songlist = songlist
  },
  [types.SET_RANKLIST](state, rankList) {            // 歌曲排行的数据列表
    state.rankList = rankList
  },
  [types.SET_SEARCHHISTORY](state, searchHistory) {      // 搜索结果数据
    state.searchHistory = searchHistory
  },
  [types.SET_PLAYHISTORY](state, playHistory) {         // 播放历史（最近播放）
    state.playHistory = playHistory
  },
  [types.SET_FAVORITE_LIST](state, list) {             // 我的收藏
    state.favoriteList = list
  }
}
export default mutations
