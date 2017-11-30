<!--歌曲列表组件-->
<template>
  <div class="songList">
    <ul>
      <li class="item" @click="selectItem(item, index)" v-for="(item, index) in songs">
        <!--奖杯排行图片-->
        <div class="rank" v-show="rank">
          <span class="icon" :class="getRankCls(index)">{{ getRankTxt(index) }}</span>
        </div>
        <div class="content">
          <p class="name">{{item.name}}</p>
          <p class="desc">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {            // 奖杯排行图片
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDesc(item) {
        return `${item.singer} - ${item.album}`
      },
      selectItem(item, index) {           // 向父组件获取这些数据
        this.$emit('select', item, index)
      },
      getRankCls(index) {   // 奖杯排行图片
        if (index === 0) {
          return 'icon0'
        } else if (index === 1) {
          return 'icon1'
        } else if (index === 2) {
          return 'icon2'
        } else {
          return 'text'
        }
      },
      getRankTxt(index) {     // 奖杯排行文案
        if (index > 2) {
          return index + 1
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import '~@/common/stylus/mixin.styl'
  .songList .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size 14px
  }

  .item .rank {
    flex: 0 0 45px;
    width: 45px;
    margin-right: 15px;
    text-align: center;
    overflow: hidden
  }

  .rank .icon {
    display: inline-block;
    width: 45px;
    height: 24px;
    background-size: 25px 24px;
  }

  .icon.icon0 {
    bg-image('first');
    background-position: center center
    background-repeat no-repeat
  }

  .icon.icon1 {
    bg-image('second');
    background-position: center center
    background-repeat no-repeat
  }

  .icon.icon2 {
    bg-image('third');
    background-position: center center
    background-repeat no-repeat
  }

  .songList .item .rank .text {
    color #ffcd32
    font-size 18px
  }

  .content {
    flex 1
    line-height: 20px
    overflow: hidden
  }

  .name {
    color: #fff;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .desc {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.3);
  }
</style>
