<!--搜索历史列表 组件-->
<template>
  <div class="searchlist" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" v-for="item in searches" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .searchlist .search-item {
    display: flex
    align-items center
    height: 40px
    overflow: hidden
  }

  .list-enter-active, .list-leave-active {
    transition: all .1s
  }

  .list-enter, .list-leave-to {
    height: 0
  }

  .text {
    flex 1
    color rgba(255, 255, 255, 0.5)
  }

  .search-item .icon {
    position: relative;
  }

  .search-item .icon::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
  }

  .icon-delete {
    font-size 12px
    color rgba(255, 255, 255, 0.3)
  }
</style>
