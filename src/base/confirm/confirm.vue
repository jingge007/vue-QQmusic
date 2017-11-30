<!--历史搜索删除按钮 弹窗组件-->
<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
            <div class="operate-btn" @click="confirm">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showFlag: false       // 默认的情况下隐藏弹窗
      }
    },
    props: {
      text: {
        type: String,
        default: '是否清空所有搜索历史'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      }
    },
    methods: {
      show() {         // 对父组件提供显示弹窗的方法
        this.showFlag = true
      },
      hide() {       // 对父组件提供隐藏弹窗的方法
        this.showFlag = false
      },
      confirm() {
        this.showFlag = false
        this.$emit('confirm')
      },
      cancel() {
        this.showFlag = false
        this.$emit('cancel')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .confirm {
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index 998
    background-color: rgba(149, 147, 147, .6)
  }

  .confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;
  }

  .confirm-content {
    animation: confirm-zoom 0.3s;
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
  }

  .confirm-content {
    width: 270px
    border-radius 13px
    background-color: #fff
  }

  .confirm-content .text {
    padding: 19px 15px;
    line-height: 22px;
    text-align: center;
    font-size: 16px;
    color: #0AA72C;
  }

  .confirm-content .operate {
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 16px;
  }

  .operate .operate-btn {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    line-height: 22px;
    padding: 10px 0;
    border-top: 1px solid rgba(0, 0, 0, .3);
    color: #333;
  }

  .operate .operate-btn.left {
    border-right: 1px solid rgba(0, 0, 0, .3);
  }

  @keyframes confirm-fadein {
    0% {
      opacity 0
    }
    100% {
      opacity 1
    }
  }

  @keyframes confirm-zoom {
    0% {
      transform scale(0)
    }
    50% {
      transform scale(1.2)
    }
    100% {
      transform scale(1)
    }
  }
</style>
