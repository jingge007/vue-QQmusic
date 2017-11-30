<!--loading加载组件-->
<template>
  <div class="loading">
    <img src="./loading.gif" alt="" height="25" width="25">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在加载中...'
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .loading {
    width: 100%
    text-align center
  }

  .loading .desc {
    line-height: 20px
    font-size 13px
    color #929290
  }
</style>
