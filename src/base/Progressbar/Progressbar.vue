<!--进度条组件-->
<template>
  <div class="Progressbar" ref="barRef" @click.stop="progressClick">
    <div class="bar-inner">
      <!--已经播放的进度-->
      <div class="progress" ref="progressRef"></div>
      <!--进度条的小球-->
      <div class="progress-btn-wrapper"
           ref="btnRef"
           @touchstart.prevent="progressTouchstart"
           @touchmove.prevent="progressTouchmove"
           @touchend="progressTouchend"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const BTN_WIDTH = 16    // 定义进度条小球的宽度

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}    // 共享touch状态
    },
    watch: {      // 监控播放的进度
      percent(newVal) {
        if (newVal >= 0 && !this.touch.init) {    // 拖动的时候不要 watch
          let barWidth = this.$refs.barRef.clientWidth - BTN_WIDTH
          let offsetWidth = newVal * barWidth
          this._move(offsetWidth)
        }
      }
    },
    methods: {
      progressClick(e) {        // 点击进度条改变播放的进度
        let rectLeft = this.$refs.barRef.getBoundingClientRect().left         // getBoundingClientRect()这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
        let offsetWidth = e.pageX - rectLeft
        this._move(offsetWidth)
        this._percentChange()
      },
      progressTouchstart(e) {        // 拖动小球改变播放进度，小球滑动开始位置
        this.touch.init = true
        this.touch.startX = e.touches[0].pageX   // 开始滑动的位置
        this.touch.left = this.$refs.progressRef.clientWidth       // 当前偏移
      },
      progressTouchmove(e) {         // 拖动小球改变播放进度，小球滑动过程中
        if (!this.touch.init) return
        let deltaX = e.touches[0].pageX - this.touch.startX   // 滑动的差值
        let offsetWidth = Math.min(this.$refs.barRef.clientWidth - BTN_WIDTH, Math.max(0, this.touch.left + deltaX))     // 进度条的差值，大于0，小于总长度
        this._move(offsetWidth)
      },
      progressTouchend() {    // 拖动小球改变播放进度，小球滑动结束
        this.touch.init = false
        this._percentChange()
      },
      _move(offsetWidth) {   // 进度条前进+小球前进
        this.$refs.progressRef.style.width = `${offsetWidth}px`
        this.$refs.btnRef.style['webkitTransform'] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.btnRef.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
      },
      _percentChange() {
        let barWidth = this.$refs.barRef.clientWidth - BTN_WIDTH
        let newPercent = this.$refs.progressRef.clientWidth / barWidth
        this.$emit('percentChange', newPercent)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .Progressbar {
    height: 30px
  }

  .Progressbar .bar-inner {
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3);
  }

  .bar-inner .progress {
    position: absolute;
    height: 100%;
    background: #FFCD32
  }

  .progress-btn-wrapper {
    position: absolute;
    left: -8px;
    top: -13px;
    width: 30px;
    height: 30px;
  }

  .progress-btn {
    position: relative;
    top: 7px;
    left: 7px;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border: 3px solid #FFFFFF;
    border-radius: 50%;
    background: #FFCD32;
  }
</style>
