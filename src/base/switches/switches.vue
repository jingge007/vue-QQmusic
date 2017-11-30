<!--最近播放与我的收藏和搜索历史的切换组件-->
<template>
  <ul class="switches">
    <li class="switch-item" :class="{'active':currentIndex===index}" v-for="(item,index) in switches" @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .switches {
    display: flex;
    align-items: center;
    width: 240px;
    margin: 0 auto;
    border: 1px solid #333333;
    border-radius: 5px;
  }

  .switches .switch-item {
    flex: 1;
    padding: 8px;
    text-align: center;
    font-size: 14px;
    color: #75766F;
  }

  .switch-item.active {
    background-color: #333333
    color #fff
  }
</style>
