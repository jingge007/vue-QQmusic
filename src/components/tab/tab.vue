<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .tab {
    display: flex
    height: 44px
    line-height: 44px
    font-size 14px
  }

  .tab .tab-item {
    flex 1
    text-align: center
  }

  .tab-item .tab-link {
    padding-bottom 5px
    color hsla(0, 0%, 100%, .5)
  }

  .tab-item.active .tab-link {
    color #ffcd32
    border-bottom: 2px solid #ffcd32
  }
</style>
