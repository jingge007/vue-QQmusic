<!--轮播图组件-->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <!--轮播图的小圆点分页-->
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {myDOM} from 'common/js/myutils'

  export default {
    data() {
      return {
        loop: true, // 是否为循环播放
        dots: [], // 存放轮播小圆点
        currentPageIndex: 0, // 当前是哪个
        autoPlay: true, // 是否自动轮播
        interval: 3000  // 设置自动轮播的时间
      }
    },
    mounted() {
      // 设置20ms的延迟
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initScroll()
        // 设置自动轮播
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      // 监听窗口改变重置高度
      window.addEventListener('resize', () => {
        if (!this.scroll) {
          return false
        }
        this._setSliderWidth(true)
        this.scroll.refresh() // 强制刷新
      })
    },
    activated() {
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      // 定义一个计算宽度的方法
      _setSliderWidth(isResize) {
        // 获取到多少子元素
        this.children = this.$refs.sliderGroup.children
        let width = 0
        // 计算一个的宽度
        let wrapperWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          myDOM.addClass(child, 'slider-item')
          child.style.width = wrapperWidth + 'px'
          width += wrapperWidth
        }
        // 如果是循环播放的话
        if (this.loop && !isResize) {
          width += 2 * wrapperWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initScroll() {
        this.scroll = new BScroll(this.$refs.slider, {
          scrollX: true,            // true 滚动方向为 X 轴
          scrollY: false,          // true 滚动方向为 Y 轴
          momentum: false,        // true 当快速滑动时是否开启滑动惯性
          snap: {                // false 该属性是给 slider 组件使用的，普通的列表滚动不需要配置
            loop: this.loop,    // ture表示前后增加一张(是否可以无缝循环轮播)
            threshold: 0.3,    // 用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
            speed: 400        // 轮播图切换的动画时间
          },
          snapThreshold: 0.3,
          snapSpeed: 400,
          click: true           // 是否派发click事件
        })

        // 监听滚动结束后,小圆点+1
        this.scroll.on('scrollEnd', () => {
          let pageIndex = this.scroll.getCurrentPage().pageX   // pageX，pageY 表示横向和纵向的页面索引
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            this._play()
          }
        })

        // 手指滑动就停止自动轮播
        this.scroll.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      // 初始化添加小圆点
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      // 设置自动轮播
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.scroll.goToPage(pageIndex, 0, 400)   // goToPage() 滚动到对应的页面，x 表示横向页面索引，y 表示纵向页面索引， time 表示动画，easing 表示缓动函数（可省略不写）
        }, this.interval)
      }
    },
    // 组件销毁的时候清理定时器,仅仅是性能优化
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .slider {
    min-height: 1px
  }

  .slider-group {
    position: relative
    overflow: hidden
    white-space: nowrap
  }

  .slider-group .slider-item {
    float: left
    box-sizing: border-box
    overflow: hidden
    text-align: center
  }

  .slider-group .slider-item a {
    display: block
    width: 100%
    overflow: hidden
    text-decoration: none
  }

  .slider-group .slider-item img {
    display: block
    width: 100%
  }

  .dots {
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
  }

  .dot {
    display: inline-block
    margin: 0 4px
    width: 8px
    height: 8px
    border-radius: 50%
    background: #E5E5E5
  }

  .dot.active {
    width: 20px
    border-radius: 5px
    background: #B2B2B2
  }

</style>
