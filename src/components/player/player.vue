<!--播放器组件 player-->
<template>
  <div class="player" v-show="playlist.length>0">
    <!--正常的播放器-->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <!--播放器的背景图-->
        <div class="background">
          <img :src="currentSong.img" alt="" width="100%" height="100%">
        </div>
        <!--播放器的头部区域-->
        <div class="top">
          <!--头部的返回按钮-->
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <p class="title" v-html="currentSong.name"></p>
          <p class="subtitle" v-html="currentSong.singer"></p>
        </div>
        <!--中间主体区域-->
        <div class="middle"
             @touchstart.prevent="middleTouchstart"
             @touchmove.prevent="middleTouchmove"
             @touchend="middleTouchend"
        >
          <!--唱片-->
          <div class="middle-l" ref="middleRef">
            <div class="cd-wrapper" ref="cdRef">
              <div class="cd" :class="playing?'play':'play pause'">
                <img :src="currentSong.img" alt="" class="image">
              </div>
            </div>
            <!-- cd页小段歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!--歌词-->
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   v-for="(line,index) in currentLyric.lines"
                   :class="{'current':currentLyricLine === index}"
                >{{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <!--底部操作区域-->
        <div class="bottom">
          <!--分页的小圆点-->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentDot ==='cd'}"></span>
            <span class="dot" :class="{'active':currentDot ==='lyric'}"></span>
          </div>
          <!--歌曲播放的进度条-->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <!--进度条组件-->
            <div class="progress-bar-wrapper">
              <Progressbar :percent="percent" @percentChange="percentChange"></Progressbar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <!-- 底部播放按钮操作区域 -->
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="songCanplay?'':'disable'">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" :class="songCanplay?'':'disable'">
              <i :class="playing?'icon-pause':'icon-play'" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="songCanplay?'':'disable'">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteCls(currentSong)" @click="toggleFavoriteCls(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--最小化的播放器-->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.img" width="40" height="40" :class="playing?'play':'play pause'">
        </div>
        <div class="text">
          <p class="name" v-html="currentSong.name"></p>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <!-- 圆形进度条 -->
          <progressCircle :percent="percent" :radius="32">
            <i @click.stop="togglePlaying" class="icon-mini" :class="playing? 'icon-pause-mini':'icon-play-mini'"></i>
          </progressCircle>
        </div>
        <!--迷你播放器列表控制器-->
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <myplaylist ref="myplaylistRef"></myplaylist>
    <!--音乐播放器-->
    <audio :src="currentSong.url"
           ref="audioRef"
           @play="canplay"
           @error="error"
           @timeupdate="timeupdate"
           @ended="ended">Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import Progressbar from 'base/Progressbar/Progressbar.vue'
  import progressCircle from 'base/progressCircle/progressCircle.vue'
  import {myArray} from 'common/js/myutils'
  import scroll from 'base/scroll/scroll.vue'
  import Lyric from 'lyric-parser'
  import myplaylist from 'components/myplaylist/myplaylist.vue'

  export default {
    data() {
      return {
        songCanplay: false,                   // 标志位。歌曲已缓存好，可以播放了
        currentTime: 0,                      // 当前播放时间
        currentLyric: null,                 // 当前的歌词
        currentLyricLine: 0,               // 当前的歌词在第几行
        currentDot: 'cd',                 // 当前在哪个分页
        playingLyric: '暂时无歌词数据',   // cd页小段歌词
        showList: false                 // 是否显示播放列表
      }
    },
    computed: {
      ...mapGetters([
        'fullScreen', 'playlist', 'currentSong', 'playing', 'currentIndex', 'mode', 'sequenceList', 'favoriteList'
      ]),
      percent() {      // props down 播放进度
        return this.currentTime / this.currentSong.duration
      },
      iconMode() {       // 播放器底部播放模式对应的图标字体
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
      }
    },
    created() {
      this.touch = {}          // 共享touch的状态变化
    },
    watch: {
      currentSong(newVal, oldVal) {   // 监控当前歌曲
        if (!newVal.id) {      // 播放列表没有歌曲就退出
          return
        }
        if (newVal.id === oldVal.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()      // 在lyric-parser解析歌词包中stop() 是暂停歌词
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {   // 页面加载后延迟一秒在播放歌曲
          this.$refs.audioRef.play()
          this._getLyric()                // 歌曲的歌词数据
          // this.currentSong.getLyric()
        }, 1000)
      },
      playing(newVal) {       // 播放或暂停
        const audio = this.$refs.audioRef
        this.$nextTick(() => {
          newVal ? audio.play() : audio.pause()
        })
      }
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',            // 播放器展开状态
        setPlayingState: 'SET_PLAYING_STATE',       // 播放器播放状态
        setCurrentIndex: 'SET_CURRENT_INDEX',      // 当前播放歌曲索引
        setMode: 'SET_MODE',                      // 播放模式
        setPlayList: 'SET_PLAYLIST'             // 播放歌曲列表
      }),
      ...mapActions(['saveplayHistory', 'savefavoriteList', 'delfavoriteList']),
      toggleFavoriteCls(song) {           // 收藏歌曲
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
      back() {         // 最小化播放器
        this.setFullScreen(false)
      },
      open() {         // 最大化播放器
        this.setFullScreen(true)
      },
      // 进入播放器和离开播放器的动画效果
      _getPosAndScale() {           // cd唱片动画定义参数的方法
        const targetWidth = 40       // 底部小唱片的宽度
        const paddingLeft = 40       // 底部小唱片的中心点到左边的距离
        const paddingBottom = 30     // 底部小唱片的中心点到底部的距离
        const paddingTop = 80        // 中部的cd唱片到顶部的距离
        const width = window.innerWidth * 0.8    // 中部的cd唱片的宽度
        const scale = targetWidth / width     // 定义缩放的大小
        const x = -(window.innerWidth / 2 - paddingLeft)         // 定义动画在X轴位移的距离
        const y = window.innerHeight - paddingBottom - paddingTop - width / 2
        return {x, y, scale}
      },
      enter(el, done) {           // 中部cd唱片的动画效果
        const {x, y, scale} = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.2)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        animations.registerAnimation({        // 定义动画的名称和动画效果
          name: 'move',
          animation,
          presets: {
            duration: 500,        // 动画持续时间
            easing: 'linear',     // 动画的效果
            delay: 100            // 动画的延迟时间
          }
        })
        animations.runAnimation(this.$refs.cdRef, 'move', done)    // 调用动画
      },
      afterEnter() {
        animations.unregisterAnimation('move')           // 移除动画
        this.$refs.cdRef.style.animation = ''
      },
      leave(el, done) {
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdRef.style.transition = `all 0.4s ease`
        this.$refs.cdRef.style['transform'] = `translate3d(${x}px, ${y}px, 0) scale(1)`
        this.$refs.cdRef.style['webkitTransform'] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        this.$refs.cdRef.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdRef.style.transition = ''
        this.$refs.cdRef.style['transform'] = ''
        this.$refs.cdRef.style['webkitTransform'] = ''
      },
      canplay() {             // audio 当浏览器可以播放音频时
        this.songCanplay = true
      },
      error() {         // audio 事件--> 当音频在加载期间发生错误时
        this.songCanplay = true
      },
      timeupdate(e) {     // audio事件--> timeupdate 当目前的播放位置已更改时触发。
        this.currentTime = e.target.currentTime      // audio事件--> currentTime 设置或返回音频/视频中的当前播放位置（以秒计）。
      },
      ended() {                 // audio事件--> 返回音频/视频的播放是否已结束。
        if (this.mode === 1) {
          this.loopSong()      // 单曲循环模式
        } else {
          this.nextSong()
        }
      },
      loopSong() {      // 单曲循环
        this.$refs.audioRef.currentTime = 0
        this.$refs.audioRef.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)     // 在lyric-parser解析歌词包中seek(startTime) 是歌词跳转
        }
      },
      togglePlaying() {    // 播放按钮
        if (!this.songCanplay) {
          return
        }
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()    // 在lyric-parser解析歌词包中togglePlay() 是切换播放/暂停状态
        }
      },
      prevSong() {      // 上一首
        if (!this.songCanplay) {
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songCanplay = false
      },
      nextSong() {   // 下一首
        if (!this.songCanplay) {
          return
        }
        if (this.playlist.length === 1) {       // 如果播放列表只有一条数据
          this.loopSong()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songCanplay = false
      },
      format(timestamp) {       // 歌曲播放的进度条的时间
        timestamp = Math.floor(timestamp)
        let minute = (Math.floor(timestamp / 60)).toString().padStart(1, '0')    // padStart()会用第二个参数中指定字符串，在当前字符串头部不断填充，直到达到第一个参数中指定的目标长度
        let second = (timestamp % 60).toString().padStart(2, '0')
        return `${minute}:${second}`
      },
      percentChange(newPercent) {         // props down  当进度条改变
        let currentTime = this.currentSong.duration * newPercent
        this.$refs.audioRef.currentTime = currentTime
        if (!this.playing) {            // 进度改变后自动播放
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      changeMode() {     // 改变歌曲的播放模式，实际是修改playlist
        let mode = (this.mode + 1) % 3
        this.setMode(mode)
        let newlist = null
        if (mode === 2) {     // 当歌曲是随机播放模式时
          newlist = myArray.shuffle(this.sequenceList)
        } else {
          newlist = this.sequenceList      // 歌曲为顺序播放和循环播放
        }
        let index = newlist.findIndex((item) => {          // findIndex() 方法为数组中的每个元素都调用一次函数执行
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
        this.setPlayList(newlist)
      },
      _getLyric() {       // 获取歌曲歌词的数据
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          // console.log(this.currentLyric)
          if (this.playing) {
            this.currentLyric.play()     // 在lyric-parser解析歌词包中 play()是播放歌词
          }
        }).catch(() => {             // 当获取不到歌词的时候
          this.currentLyric = null
          this.playingLyric = '暂无歌词数据'
          this.currentLyricLine = 0
        })
      },
      handleLyric({lineNum, txt}) {              // new Lyric的回调函数
        this.currentLyricLine = lineNum
        if (lineNum > 5) {           // 让当前的歌词在中间显示
          let el = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(el, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt         // 在播放器播放的当前歌词
      },
      middleTouchstart(e) {           // 播放器滑动翻页
        this.touch.init = true
        this.touch.startX = e.touches[0].pageX           // 记录手指触摸屏幕的坐标位置
        this.touch.startY = e.touches[0].pageY
      },
      middleTouchmove(e) {
        if (!this.touch.init) {
          return
        }
        // 记录手指在屏幕上滑动的距离
        let deltaX = e.touches[0].pageX - this.touch.startX
        let deltaY = e.touches[0].pageY - this.touch.startY
//        if (Math.abs(deltaX) < Math.abs(deltaY)) {   // 纵向滚动时，return
//          return
//        }
        let left = this.currentDot === 'cd' ? 0 : -window.innerWidth
        // 向左滑动
        let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        // 滑动效果
        this.$refs.lyricList.$el.style['webkitTransform'] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
        // 过渡效果坚持 0ms
        this.$refs.lyricList.$el.style['webkitTransition-duration'] = 0
        this.$refs.lyricList.$el.style['transition-duration'] = 0
        // 背景模糊
        this.$refs.middleRef.style.opacity = 1 - this.touch.percent
        this.$refs.middleRef.style['webkitTransition-duration'] = 0
        this.$refs.middleRef.style['transition-duration'] = 0
      },
      middleTouchend() {
        let offsetWidth = null
        let opacity = null
        if (this.currentDot === 'cd') {
          if (this.touch.percent > 0.1) {   // 向左滑动
            offsetWidth = -window.innerWidth
            this.currentDot = 'lyric'
            opacity = 0
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {      // 向右滑动
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentDot = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        let timers = 300
        this.$refs.lyricList.$el.style['webkitTransform'] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
        // 过渡效果坚持 300ms
        this.$refs.lyricList.$el.style['webkitTransition-duration'] = `${timers}ms`
        this.$refs.lyricList.$el.style['transition-duration'] = `${timers}ms`
        // 背景模糊
        this.$refs.middleRef.style.opacity = opacity
        this.$refs.middleRef.style['webkitTransition-duration'] = `${timers}ms`
        this.$refs.middleRef.style['transition-duration'] = `${timers}ms`
      },
      showPlaylist() {        // 显示迷你播放器的歌曲列表
        this.$refs.myplaylistRef.show()
      }
    },
    components: {
      Progressbar,
      progressCircle,
      scroll,
      myplaylist
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .player .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    background: #222;
  }

  .normal-player .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
  }

  .normal-player .top {
    position relative
    margin-bottom 25px
  }

  .top .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
  }

  .back .icon-back {
    display: block;
    padding: 9px;
    font-size: 22px;
    color: #ffcd32;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }

  .title {
    width: 70%;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 18px;
    color: #fff;
  }

  .subtitle {
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }

  .middle {
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;
  }

  .middle .middle-l {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;
  }

  .cd-wrapper {
    position: absolute;
    left: 10%;
    top: 0;
    width: 80%;
    height: 100%;
  }

  .cd-wrapper .cd {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 10px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .cd-wrapper .cd.play {
    animation: rotate 20s linear infinite;
  }

  .cd-wrapper .cd.pause { /* 暂停动画*/
    animation-play-state: paused;
    -webkit-animation-play-state: paused;
  }

  .cd .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .playing-lyric-wrapper {
    width: 80%;
    margin: 30px auto 0 auto;
    overflow: hidden;
    text-align: center;
  }

  .playing-lyric-wrapper .playing-lyric {
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    color: #FAC729;
  }

  .middle-r {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .middle-r .lyric-wrapper {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
  }

  .lyric-wrapper .text {
    line-height: 32px;
    color: hsla(0, 0%, 100%, .5);
    font-size: 14px;
  }

  .lyric-wrapper .text.current {
    color: #FFCD32
    font-size 16px
    font-family '微软雅黑'
  }

  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;
  }

  .dot-wrapper {
    text-align: center;
    font-size: 0;
  }

  .dot-wrapper .dot {
    display: inline-block;
    vertical-align: middle;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: hsla(0, 0%, 100%, .5);
  }

  .dot-wrapper .dot.active {
    width: 20px;
    border-radius: 5px;
    background: hsla(0, 0%, 100%, .8);
  }

  .progress-wrapper {
    display: flex;
    align-items: center;
    width: 80%;
    margin: 0px auto;
    padding: 10px 0;
  }

  .progress-bar-wrapper {
    flex 1
  }

  .progress-wrapper .time {
    color: #fff;
    font-size: 12px;
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;
  }

  .progress-wrapper .time.time-l {
    text-align: left;
    margin-right: 5px;
  }

  .progress-wrapper .time.time-r {
    text-align: right;
    margin-right: 5px;
  }

  .operators {
    display: flex;
    align-items: center;
  }

  .operators .icon {
    flex: 1;
    color: #ffcd32;
  }

  .operators .icon.disable {
    color #927929
  }

  .operators .icon i {
    font-size: 30px;
  }

  .operators .i-left {
    text-align right
  }

  .operators .i-center {
    padding 0 20px
    text-align: center
  }

  .operators .i-center i {
    font-size 40px
  }

  .operators .i-right {
    text-align: left;
  }

  .operators .icon-favorite {
    color #D93F30
  }

  .normal-enter-active, .normal-leave-active {
    transition: all .5s;
    .top, .bottom {
      transition: all .5s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }

  .normal-enter, .normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: #333;
  }

  mini-player.mini-enter-active, mini-player.mini-leave-active {
    transition: all 0.4s;
  }

  mini-player.mini-enter, mini-player.mini-leave-to {
    opacity: 0;
  }

  .mini-player .icon {
    flex: 0 0 40px;
    width: 40px;
    padding: 0 10px 0 20px;
  }

  .mini-player .icon img {
    border-radius: 50%;
  }

  .mini-player .icon img.play {
    animation: rotate 10s linear infinite;
  }

  .mini-player .icon img.pause {
    animation-play-state: paused;
  }

  .mini-player .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
  }

  .text .name {
    margin-bottom: 2px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    color: #fff;
  }

  .text .desc {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 12px;
    color: hsla(0, 0%, 100%, .3);
  }

  .mini-player .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
  }

  .icon-play-mini, .icon-pause-mini, .icon-playlist {
    font-size 30px
    color rgba(255, 205, 49, .5)
  }

  .control .icon-mini {
    font-size: 32px;
    position: absolute;
    left: 0;
    top: 0;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
