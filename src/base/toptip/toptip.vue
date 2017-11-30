<!--添加歌曲成功的提示框组件-->
<template>
  <transition name="drop">
    <div class="toptip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showFlag: false
      }
    },
    props: {
      delay: {
        type: Number,
        default: 2000
      }
    },
    methods: {
      show() {
        this.showFlag = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.showFlag = false
        }, this.delay)
      },
      hide() {
        this.showFlag = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .toptip {
    position: fixed
    top: 0
    width: 100%
    z-index 500
    background-color: #666666
  }

  .drop-enter-active, .drop-leave-active {
    transition: all .3s
  }

  .drop-enter, .drop-leave-to {
    transfrom translate3d(0, -100%, 0)
  }
</style>
