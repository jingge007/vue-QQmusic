<!--个人中心 组件-->
<template>
  <transition name="slide">
    <div class="user">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-warpper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" ref="platBtn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <!--两个列表-->
      <div class="list-wrapper" ref="listWrapper">
        <!--我的收藏-->
        <scroll class="list-scroll" ref="favoriteRef" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <songList :songs="favoriteList" @select="selectSong"></songList>
          </div>
        </scroll>
        <!--最近播放-->
        <scroll class="list-scroll" ref="playListRef" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <songList :songs="playHistory" @select="selectSong"></songList>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <div class="no-result-text">{{resultText}}</div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapActions, mapGetters} from 'vuex'
  import scroll from 'base/scroll/scroll.vue'
  import switches from 'base/switches/switches.vue'
  import songList from 'base/songList/songList.vue'
  import {SingerSong} from 'common/js/SingerSongClass.js'
  import {playlistMixin} from 'common/js/mixin.js'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        switches: [
          {name: '我的收藏'},
          {name: '最近播放'}
        ],
        currentIndex: 0,
        resultText: ''
      }
    },
    computed: {
      ...mapGetters(['playHistory', 'favoriteList']),
      noResult() {
        if (this.currentIndex === 0) {
          this.resultText = '暂无收藏歌曲'
          return !this.favoriteList.length           // 返回没有播放历史（最近播放）的数据
        } else {
          if (this.currentIndex === 1) {            // 返回没有我的收藏的数据
            this.resultText = '你还没有听过歌曲'
            return !this.playHistory.length
          }
        }
      }
    },
    methods: {
      ...mapActions(['savefavoriteList', 'delfavoriteList', 'insertSong', 'randomPlay']),
      toggleFavoriteCls(song) {
        if (this._isFavorite(song)) {
          this.delfavoriteList(song)
        } else {
          this.savefavoriteList(song)
        }
      },
      getFavoriteCls(song) {
        if (this._isFavorite(song)) {
          return 'icon-favorite'
        } else {
          return 'icon-not-favorite'
        }
      },
      _isFavorite(song) {
        let index = this.favoriteList.findIndex((item) => {
          return song.id === item.id
        })
        return index > -1
      },
      selectSong(song) {
        this.insertSong(new SingerSong(song))
      },
      back() {             // 返回上一层的按钮
        this.$router.back()
      },
      switchItem(index) {           // 最近播放和我的收藏的切换按钮
        this.currentIndex = index
      },
      random() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        list = list.map((song) => {
          return new SingerSong(song)
        })
        this.randomPlay({list})
      },
      // 当有迷你播放器时，调整滚动底部距离
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteRef && this.$refs.favoriteRef.refresh()
        this.$refs.playListRef && this.$refs.playListRef.refresh()
      }
    },
    components: {
      switches,
      scroll,
      songList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

  .user {
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background-color: #222222
  }

  .slide-enter-active, .slide-leave-active {
    transition all 0.3s
  }

  .slide-enter, .slide-leave-to {
    transform translate3d(100%, 0, 0)
  }

  .user .back {
    position: absolute
    top: 0
    left: 6px
    z-index: 50
  }

  .back .icon-back {
    display: block
    padding: 10px
    font-size 22px
    color #FFCD32
  }

  .switches-warpper {
    margin 10px 0 30px 0
  }

  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border 1px solid #929290
    color #929290
    border-radius 100px
    font-size 0
  }

  .play-btn .icon-play {
    display: inline-block
    vertical-align middle
    margin-right 6px
    font-size 13px
  }

  .play-btn .text {
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
  }

  .list-wrapper {
    position: absolute
    top: 110px
    bottom: 0
    width: 100%
  }

  .list-wrapper .list-scroll {
    height: 100%
    overflow: hidden
  }

  .list-wrapper .list-inner {
    padding 20px 30px
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  .no-result-wrapper .no-result-text {
    margin-top: 30px;
    font-size: 14px;
    color: #FFCD32;
    text-align: center
  }
</style>
