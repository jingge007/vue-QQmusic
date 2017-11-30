<!--歌单列表组件-->
<template>
  <div class="musicList">
    <!--返回按钮-->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!--顶部歌手名字-->
    <h1 class="title" v-html="title"></h1>
    <div class="bgImage" ref="bgImage" :style="bgstyle">
      <!--随机播放全部-->
      <div class="play-wrapper" ref="playWrapper" v-show="songs.length>0" @click="playRandom">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!--蒙层-->
      <div class="filter" ref="filter"></div>
    </div>
    <!--推层-->
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll class="list"
            @scroll="scroll"
            ref="list"
            :data="songs"
            :probeType="probeType"
            :listenScroll="listenScroll"
    >
      <div class="song-list-wrapper">
        <songList @select="selectItem" :songs="songs" :rank="rank"></songList>
      </div>
      <!-- loading 组件 -->
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll.vue'
  import songList from 'base/songList/songList.vue'
  import loading from 'base/loading/loading.vue'
  import {mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const TRANSFORMY_RESERVED = 40
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        scrollY: 0           // 推层上移的距离
      }
    },
    props: {
      bgImage: {      // 背景图
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {            // 子组件排行奖杯的图片
        type: Boolean,
        default: false
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.bgImageHeight = this.$refs.bgImage.clientHeight
      this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    },
    watch: {
      scrollY(newVal) {          // 推层动画的逻辑
        let minscrollY = -this.bgImageHeight + TRANSFORMY_RESERVED
        let moveY = Math.max(minscrollY, newVal)
        let zIndex = 0
        this.$refs.bgLayer.style['transform'] = `translate3d(0,${moveY}px,0)`
        this.$refs.bgLayer.style['webkitTransform'] = `translate3d(0,${moveY}px,0)`
        // 下拉放大图片，上拉让图片模糊
        let scale = 1   // 缩放
        let blur = 0
        const formula = Math.abs(newVal / this.bgImageHeight)   // abs() 方法可返回数的绝对值,Math.abs()取得正数和负数的绝对值
        if (newVal > 0) {  // 下拉的时候，让图片放大
          zIndex = 10
          scale = 1 + formula
          this.$refs.bgImage.style['transform'] = `scale(${scale})`
          this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
        } else {
          blur = Math.min(20 * formula, 20)
          this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
          this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
        }
        // 不推到顶部，留一部分
        if (newVal < minscrollY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${TRANSFORMY_RESERVED}px`
          this.$refs.playWrapper.style.display = 'none'       // 隐藏随机播放全部按钮
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playWrapper.style.display = 'block'       // 显示随机播放全部按钮
        }
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
    computed: {
      bgstyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    methods: {
      ...mapActions(['selectPlay', 'randomPlay']),
      handlePlaylist(playlist) {                   // 当有迷你播放器时，调整滚动底部的距离
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      back() {       // 返回按钮
        this.$router.back()
      },
      scroll(pos) {          // 父组件的传值
        this.scrollY = pos.y
      },
      selectItem(item, index) {     // 告诉子组件这些数据都在vuex中管理
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      playRandom() {     // 随机播放全部按钮
        this.randomPlay({
          list: this.songs
        })
      }
    },
    components: {
      scroll,
      songList,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .musicList {
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom 0
    background-color: #222
  }

  .musicList .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 100;
  }

  .back .icon-back {
    display: block;
    padding: 10px;
    font-size: 22px;
    color: #ffcd32;
  }

  .musicList .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    line-height: 40px;
    font-size: 18px;
    color: #fff;
  }

  .musicList .bgImage {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
  }

  .bgImage .play-wrapper {
    position: absolute
    bottom: 20px
    z-index: 50
    width: 100%
  }

  .play-wrapper .play {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid #ffcd32;
    color: #ffcd32;
    border-radius: 100px;
    font-size: 0;
  }

  .play .icon-play {
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
    font-size: 16px;
  }

  .play .text {
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
  }

  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.4);
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: #222;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #222;
  }

  .list .song-list-wrapper {
    padding 20px 15px
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
