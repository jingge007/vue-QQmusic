<!--搜索框组件-->
<template>
  <div class="searchbox">
    <i class="icon-search"></i>
    <input type="text" class="box" ref="queryRef" :placeholder="placeholder" v-model="query">
    <i class="icon-dismiss" v-show="query" @click="clearQuery"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {myDOM} from 'common/js/myutils.js'

  export default {
    data() {
      return {
        query: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    created() {     // 节流
      this.$watch('query', myDOM.debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 300))
    },
    methods: {
      blur() {
        this.$refs.queryRef.blur()         // 给父组件让输入框失去焦点，避免滚动搜索结果时移动端键盘遮挡
      },
      getQuery(k) {            // 给父组件传进搜索框的值
        this.query = k
      },
      clearQuery() {
        this.query = ''
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .searchbox {
    display: flex
    align-items center
    box-sizing border-box
    width: 100%
    padding 0 6px
    height: 40px
    background-color: #918F8F
    border-radius 6px
  }

  .searchbox .icon-search {
    font-size 24px
    color #fff
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background:#918F8F
    color: #fff;
    font-size: 14px;
    outline: 0;
    border 0
  }

  .box::placeholder {
    color #fff
  }

  .icon-dismiss {
    font-size: 16px;
    color: #333;
  }
</style>
