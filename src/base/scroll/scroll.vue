<!--better-scroll 滚动组件-->
<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    data() {
      return {}
    },
    // 接收传入的数据
    props: {
      data: {
        type: Array,
        default: null
      },
      probeType: {       // 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
        type: Number,
        default: 1
      },
      click: {         // 是否派发click事件
        type: Boolean,
        default: true
      },
      listenScroll: {   // 是否监听滚动位置
        type: Boolean,
        default: false
      },
      pullup: {         // 是否开启上拉刷新
        type: Boolean,
        default: false
      },
      beforeScroll: {     // 滚动前是否触发事件
        type: Boolean,
        default: false
      },
      refreshDelay: {      // 延迟刷新
        type: Number,
        default: 20
      }
    },
    watch: {          // 用于观察Vue实例上的数据变动。对应一个对象，键是观察表达式，值是对应回调。值也可以是方法名，或者是对象，包含选项
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    },
    methods: {
      _initScroll() {        // 初始化滚动方法
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        // 派发监听滚动位置事件
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {         // scroll - 滚动时触发
            // 向父组件传值
            me.$emit('scroll', pos)      // $emit 触发当前实例上的事件。附加参数都会传给监听器回调。
          })
        }
        // 派发上拉刷新事件
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {          // scrollEnd - 滚动结束时触发
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              // 滑到底部
              this.$emit('scrollToEnd')
            }
          })
        }
        // 滚动前是否触发事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {          // beforeScrollStart - 滚动开始之前触发
            this.$emit('beforeScroll')
          })
        }
      },
      enable() {   // 启用 better-scroll，默认开启
        this.scroll && this.scroll.enable()
      },
      disable() {   // 禁用 better-scroll
        this.scroll && this.scroll.disable()
      },
      refresh() {   // 当 better-scroll 刷新时触发
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {   // 滚动到某个位置，x,y 代表坐标，time 表示动画时间，easing 表示缓动函数
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {   // 滚动到某个元素，el（必填）表示 dom 元素，time 表示动画时间，offsetX 和 offsetY 表示坐标偏移量，easing 表示缓动函数
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    created() {        // 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
    },
    mounted() {      // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
      setTimeout(() => {
        this._initScroll()
      }, 20)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

</style>
