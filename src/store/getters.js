// 映射及计算

export const singer = state => state.singer                         // 歌手信息

export const playing = state => state.playing                      // 播放器播放状态

export const fullScreen = state => state.fullScreen                // 播放器展开状态

export const playlist = state => state.playlist                   // 播放歌曲列表

export const sequenceList = state => state.sequenceList          // 顺序播放列表

export const mode = state => state.mode                         // 播放模式

export const currentIndex = state => state.currentIndex        // 当前播放的歌曲的索引

export const currentSong = (state) => state.playlist[state.currentIndex] || {}       // 当前播放的歌曲

export const songlist = state => state.songlist               // 推荐页歌手列表

export const rankList = state => state.rankList               // 歌曲排行的数据列表

export const searchHistory = state => state.searchHistory      // 搜索结果数据

export const playHistory = state => state.playHistory         // 播放历史（最近播放）

export const favoriteList = state => state.favoriteList         // 我的收藏
