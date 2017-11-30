<!--歌手列表组件-->
<template>
  <scroll class="singerList"
          :data="data"
          :probeType="probeType"
          @scroll="scroll"
          ref="singerList"
          :listenScroll="listenScroll"
  >
    <!--左侧歌手列表-->
    <ul>
      <li ref="singerLeft" class="list-group" v-for="item in data">
        <h2 class="list-group-title">{{item.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="group in item.items" @click="selectItem(group)">
            <img v-lazy="group.avatar" alt="" class="avatar">
            <span class="name">{{group.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--右侧的歌手字母列表-->
    <div class="list-shortcut"
         @touchstart="onShortcutTouchstart"
         @touchmove.stop.prevent="onShortcutTouchmove">   <!--阻止默认行为--> <!-- 监听 原生 DOM 事件-->
      <ul>
        <li class="item"
            v-for="(item ,index) in shortcut"
            :data-index="index"
            :class="{'current':currentIndex === index}"
        >{{item}}
        </li>
      </ul>
    </div>
    <!--滚动固定标题的实现-->
    <div class="list-fixed" ref="fixedBox" v-show="fixedTitle">
      <h1 class="fixed-title" ref="colorTitle">{{fixedTitle}}</h1>
    </div>
    <!-- loading 加载组件-->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import loading from 'base/loading/loading.vue'
  import scroll from 'base/scroll/scroll.vue'
  import {myDOM} from 'common/js/myutils'

  const RIGHT_ONEWORD_HEIGHT = 18  // 右侧字母列表每个字母的高度
  const TITLE_HEIGHT = 29          // 滚动时固定的标题栏的高度

  export default {
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1        // 标题上推y值（热门标题 - A 标题）
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    created() {
      this.touch = {}      // 共享touch
      this.listenScroll = true
      this.probeType = 3
      this.leftListHeight = []
    },
    methods: {
      selectItem(group) {           // 向上派发自定义select点击事件
        this.$emit('select', group)
      },
      _caclHeight() {  // 计算leftListHeight的高度
        let height = 0
        this.leftListHeight = []
        this.leftListHeight.push(height)
        let list = this.$refs.singerLeft
        for (let i = 0; i < list.length; i++) {         // 遍历每个区间的高度，把每个区间高度放到leftListHeight数组
          height += list[i].clientHeight
          this.leftListHeight.push(height)
         // console.log(this.leftListHeight)
        }
      },
      scroll(pos) {
        // console.log(pos)
        this.scrollY = pos.y         // 向上滚动时pos.y的值时负的，向下滚动时pos.y的值时正的
      },
      refresh() {
        this.$refs.singerList.refresh()
      },
      onShortcutTouchstart(e) {              // 手指触摸屏幕时
        let nowTouch = e.touches[0]
        this.touch.y1 = nowTouch.pageY
        let nowIndex = myDOM.customAttribute(e.target, 'index')   // data-index
        // console.log(nowIndex)
        this.touch.nowIndex = nowIndex
        this._scrollTo(nowIndex)
      },
      onShortcutTouchmove(e) {     // 滑动右侧，左侧联动，与左侧共享 touch 对象，手指在屏幕上滑动时
        let nowTouch = e.touches[0]
        this.touch.y2 = nowTouch.pageY
        // 两次touch y轴的偏移
        let offset = Math.floor((this.touch.y2 - this.touch.y1) / RIGHT_ONEWORD_HEIGHT)
        let nowIndex = Number(this.touch.nowIndex) + offset             // Number() 函数把对象的值转换为数字。
        this._scrollTo(nowIndex)
      },
      _scrollTo(index) {
        if (!index) {    // 超出范围不能点击和拖动
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.leftListHeight.length - 2) {
          index = this.leftListHeight.length - 2
        }
        this.currentIndex = Number(index)
        this.$refs.singerList.scrollToElement(this.$refs.singerLeft[index], 0)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._caclHeight()
        }, 20)
      },
      scrollY(newY) {    // 监听 scrollY 落在 leftListHeight 的哪个区间，实现高亮联动
        const leftListHeight = this.leftListHeight
        // 当滚动到顶部时，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < leftListHeight.length - 1; i++) {
          let height1 = leftListHeight[i]
          let height2 = leftListHeight[i + 1]
          if (-newY > height1 && -newY < height2) {    // 因为是向下滑动所以newY是负值
            this.currentIndex = i
            this.diff = height2 + newY   // 两个字母标题栏之间的距离
            //  console.log(this.diff)
            return
          }
        }
        // 当滚到底部，且-newY大于最后一个元素的上限
        this.currentIndex = leftListHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixedBox.style.transform = `translate3d(0,${fixedTop}px,0)`
        this.$refs.colorTitle.style.color = '#FFCD32'
      }
    },
    computed: {
      shortcut() {     // 字母列表快速入口排列数组
        return this.data.map((group) => {       // map()方法将调用的数组的每个元素传递给指定的函数，并返回一个数组，它包含该函数的返回值
          return group.title.substr(0, 1)      // substr() 方法可在字符串中抽取从 start 下标开始的指定数目的字符。
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    components: {
      loading,
      scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .singerList {
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background-color: #222
  }

  .list-group {
    padding-bottom 30px
  }

  .list-group .list-group-title {
    height: 30px
    line-height: 30px
    padding-left: 20px
    font-size 13px
    color #FFCD32
    background-color: #333
  }

  .list-group-item {
    display: flex
    align-items center
    padding: 20px 0 0 30px
  }

  .list-group-item .avatar {
    width: 50px
    height: 50px
    border-radius 50%
  }

  .list-group-item .name {
    margin-left 20px
    color hsla(0, 0%, 100%, .5)
    font-size 14px
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background-color: rgba(0, 0, 0, .3)
    font-family Helvetica
  }

  .list-shortcut .item {
    padding: 3px
    line-height: 1
    color hsla(0, 0%, 100%, .5)
    font-size: 12px
  }

  .list-shortcut .item.current {
    color #ffcd32
  }

  .list-fixed {
    position: absolute
    top: -1px
    left: 0
    width: 100%
  }

  .list-fixed .fixed-title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 13px;
    color: #FFCD32
    background: #333;
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
