<!--迷你播放器的播放列表组件-->
<template>
  <transition name="list-fade">
    <div class="playList" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <!--头部操作区域-->
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
            <i class="icon-clear"></i>
          </span>
          </h1>
        </div>
        <!--中部列表区域-->
        <scroll class="list-content" ref="scrollRef" :data="sequenceList" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li class="item" ref="listRef" :key="item.id" v-for="(item,index) in sequenceList" @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavoriteCls(item)">
                <i :class="getFavoriteCls(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <!--清空弹窗-->
      <confirm ref="confirmRef" @confirm="confirm" @cancel="cancel"></confirm>
      <addsong ref="addSongRef"></addsong>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import scroll from 'base/scroll/scroll.vue'
  import confirm from 'base/confirm/confirm.vue'
  import addsong from 'components/addsong/addsong.vue'
  import {myArray} from 'common/js/myutils.js'

  export default {
    data() {
      return {
        showFlag: false,         // 定义列表显示或隐藏的标志位
        refreshDelay: 100
      }
    },
    watch: {   // 切换歌曲后滚动至第一个
      currentSong(newVal, oldVal) {
        if (!newVal.id || !oldVal.id) {
          return
        }
        if (!this.showFlag || newVal.id === oldVal.id) {
          return
        }
        this.scrollToCurrent(newVal)
      }
    },
    computed: {
      ...mapGetters(['sequenceList', 'currentSong', 'mode', 'playlist', 'favoriteList']),
      iconMode() {          // 播放模式对应图标
        let cls = ''
        if (this.mode === 0) {
          cls = 'icon-sequence'
        } else if (this.mode === 1) {
          cls = 'icon-loop'
        } else if (this.mode === 2) {
          cls = 'icon-random'
        } else {
          cls = ''
        }
        return cls
      },
      modeText() {       // 播放模式对应的文案
        let mode = ''
        if (this.mode === 0) {
          mode = '顺序播放'
        } else if (this.mode === 1) {
          mode = '单曲循环'
        } else if (this.mode === 2) {
          mode = '随机播放'
        } else {
          mode = ''
        }
        return mode
      }
    },
    methods: {
      ...mapMutations({
        setMode: 'SET_MODE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayingState: 'SET_PLAYING_STATE',
        setPlayList: 'SET_PLAYLIST'
      }),
      ...mapActions(['deleteSong', 'deleteSongList', 'savefavoriteList', 'delfavoriteList']),
      toggleFavoriteCls(song) {
        if (this._isFavoritte(song)) {
          this.delfavoriteList(song)
        } else {
          this.savefavoriteList(song)
        }
      },
      getFavoriteCls(song) {
        if (this._isFavoritte(song)) {
          return 'icon-favorite'
        } else {
          return 'icon-not-favorite'
        }
      },
      _isFavoritte(song) {
        let index = this.favoriteList.findIndex((item) => {
          return song.id === item.id
        })
        return index > -1
      },
      show() {           // 显示迷你播放器的歌曲列表
        this.showFlag = true
        setTimeout(() => {
          this.$refs.scrollRef.refresh()
        }, 20)
        this.scrollToCurrent(this.currentSong)
      },
      hide() {           // 隐藏迷你播放器的歌曲列表
        this.showFlag = false
      },
      changeMode() {         // 点击改变歌曲的播放模式
        let mode = (this.mode + 1) % 3
        this.setMode(mode)
        let newList = null
        if (mode === 2) {         // 当歌曲是随机播放的时候
          newList = myArray.shuffle(this.sequenceList)       // 对数组中的歌曲顺序进行排乱
        } else {
          newList = this.sequenceList       // 顺序播放或单曲循环
        }
        let index = newList.findIndex((item) => {      // 调整当前歌曲的索引
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
        this.setPlayList(newList)
      },
      showConfirm() {           // 点击垃圾桶是显示弹窗
        this.$refs.confirmRef.show()
      },
      getCurrentIcon(item) {       // 当前播放歌曲的图标
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
      selectItem(item, index) {           // 在迷你播放器中切换歌曲时
        if (this.mode === 2) {     // 随机播放时
          index = this.playlist.findIndex((song) => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)          // 如果当前的歌曲时暂停播放，切换歌曲后就自动播放歌曲
      },
      deleteOne(item) {          // 在迷你播放器中点击关闭图标删除当前的这条数据
        this.deleteSong(item)
        if (!this.playlist.length) {
          this.showFlag = false
        }
      },
      showAddSong() {
        this.$refs.addSongRef.show()
      },
      confirm() {           // 清空对话框
        this.deleteSongList()
      },
      cancel() {
        return
      },
      scrollToCurrent(current) {            // 切换歌曲后滚动至第一个
        let index = this.sequenceList.findIndex((song) => {
          return song.id === current.id
        })
        this.$refs.scrollRef.scrollToElement(this.$refs.listRef[index], 300)
      }
    },
    components: {
      scroll,
      confirm,
      addsong
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .playList {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    background-color: rgba(0, 0, 0, .3);
  }

  .list-fade-enter-active, .list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }

  .list-fade-enter, .list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .playList .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #333333;
  }

  .list-wrapper .list-header {
    position: relative;
    padding: 20px 30px 10px 20px;
  }

  .list-header .title {
    display: flex
    align-items center
  }

  .list-header .title .icon {
    margin-right: 10px;
    font-size: 30px;
    color: #9D8431;
  }

  .list-header .title .text {
    flex: 1;
    font-size: 14px;
    color: hsla(0, 0%, 100%, .5);
  }

  .list-header .title .clear {
    position: relative
  }

  .list-header .title .clear::before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
  }

  .clear .icon-clear {
    font-size: 14px;
    color: hsla(0, 0%, 100%, .3);
  }

  .list-content {
    max-height: 240px;
    overflow: hidden;
  }

  .item {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 30px 0 20px;
    overflow: hidden;
  }

  .item.list-enter-active, .item.list-leave-active {
    transition: all 0.1s;
  }

  .item.list-enter, .item.list-leave-to {
    height: 0;
  }

  .item .current {
    flex: 0 0 20px;
    width: 20px;
    font-size: 12px;
    color: rgba(255, 205, 49, .5);
  }

  .item .text {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    color: hsla(0, 0%, 100%, .3);
  }

  .item .like {
    position: relative;
    margin-right: 15px;
    font-size: 12px;
    color: #ffcd32;
  }

  .item .like::before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
  }

  .item .delete {
    position: relative;
    font-size: 12px;
    color: #ffcd32;
  }

  .item .delete::before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
  }

  .list-operate {
    width: 140px;
    margin: 20px auto 30px auto;
  }

  .list-operate .add {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid hsla(0, 0%, 100%, .5);
    border-radius: 100px;
    color: hsla(0, 0%, 100%, .5);
  }

  .add .icon-add {
    margin-right: 5px;
    font-size: 10px;
  }

  .add .text {
    font-size: 12px;
  }

  .list-close {
    text-align: center;
    line-height: 50px;
    background: #222;
    font-size: 16px;
    color: hsla(0, 0%, 100%, .5);
  }
</style>
