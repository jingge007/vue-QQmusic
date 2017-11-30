<!--启动页组件-->
<template>
  <transition name="get">
    <div class="Startup" ref="Startup">
      <div class="time">广告剩余{{timer}}秒</div>
      <span class="text-item" @click="getto">跳过</span>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        timer: 5,          // 默认倒计时5秒
        stop: false,       // 倒计时默认是停止
        interval: null
      }
    },
    created() {
      this.startTimer()
    },
    methods: {
      getto() {
        this.$router.push({
          path: `/recommend`
        })
      },
      update() {
        if (this.timer < 2) {
          this.$router.push({
            path: `/recommend`
          })
          clearInterval(this.interval)    // 清掉倒计时
        } else {
          this.timer--
        }
      },
      startTimer() {
        if (this.stop === false) {
          this.interval = setInterval(this.update, 1000)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .Startup {
    width: 100%
    height: 100%
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background url("../../common/images/qq_logo.jpg") no-repeat center center
    background-size cover
  }

  .get-enter-active, .get-leave-active {
    transition: all 0.3s;
  }

  .get-enter, .get-leave-to {
    /*transform translate3d(100%, 0, 0)*/
    animation move .3s ease
  }

  .Startup .time {
    position absolute
    top 20px
    right 90px
    font-size 15px
    height: 30px
    line-height: 30px
  }

  .Startup .text-item {
    text-align: center;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 55px;
    height: 28px;
    line-height: 28px;
    font-size: 15px;
    border-radius: 15px;
    border: 1px solid #f1f1f1;
    color #fff
  }

  @keyframes move {
    0% {
      opacity 1
    }
    50% {
      opacity 0.6
    }
    100% {
      opacity 0
    }
  }
</style>
