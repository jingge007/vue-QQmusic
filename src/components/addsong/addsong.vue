<!--添加歌曲队列 组件-->
<template>
  <transition name="slide">
    <div class="addsong" @click.stop v-show="showFlag">
      <!--头部-->
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!--搜索框-->
      <div class="search-box-wrapper">
        <searchbox ref="searchboxRef" placeholder="搜索歌曲" @query="onQueryChange"></searchbox>
      </div>
      <!--最近播放与搜索历史的切换-->
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <!--最近播放-->
          <scroll ref="songListRef" class="list-scroll" v-if="currentIndex===0" :data="playHistory">
            <div class="list-inner">
              <songList :songs="playHistory" @select="selectSong"></songList>
            </div>
          </scroll>
          <!--搜索历史-->
          <scroll class="list-scroll"
                  ref="searchListRef"
                  :refreshDelay="refreshDelay"
                  v-if="currentIndex===1"
                  :data="searchHistory"
          >
            <div class="list-inner">
              <searchlist @delete="delHistory" @select="addQuery" :searches="searchHistory"></searchlist>
            </div>
          </scroll>
        </div>
      </div>
      <!--搜索结果-->
      <div class="search-result" v-show="query">
        <suggestlist ref="suggestRef"
                     :query="query"
                     :zhida="zhida"
                     @beforeScroll="blurInput"
                     @select="savaHis"
        >
        </suggestlist>
      </div>
      <!--添加歌曲到队列的提示框组件-->
      <toptip ref="topTipRef">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌已经成功添加到播放列表</span>
        </div>
      </toptip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapActions, mapGetters} from 'vuex'
  import {SingerSong} from 'common/js/SingerSongClass.js'
  import searchbox from 'base/searchbox/searchbox.vue'
  import switches from 'base/switches/switches.vue'
  import songList from 'base/songList/songList.vue'
  import searchlist from 'base/searchlist/searchlist.vue'
  import suggestlist from 'components/suggestlist/suggestlist.vue'
  import scroll from 'base/scroll/scroll.vue'
  import toptip from 'base/toptip/toptip.vue'

  export default {
    data() {
      return {
        showFlag: false,
        query: '',            // 搜索词
        zhida: false,         // 不搜索歌手
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ],
        currentIndex: 0,        // 当前切换的开关
        refreshDelay: 100
      }
    },
    computed: {
      ...mapGetters(['searchHistory', 'playHistory'])
    },
    methods: {
      ...mapActions(['saveHistory', 'delHistory', 'insertSong']),      // 保存搜索结果历史到 vuex 和 localstorage 中
      hide() {              // 点击关闭按钮关闭
        this.showFlag = false
      },
      show() {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songListRef.refresh()
          } else {
            this.$refs.searchListRef.refresh()
          }
        }, 20)
      },
      onQueryChange(query) {         // 当检索值发生改变时
        this.query = query
      },
      switchItem(index) {
        this.currentIndex = index
      },
      selectSong(item, index) {
        if (index !== 0) {
          this.insertSong(new SingerSong(item))
        }
        this.$refs.topTipRef.show()
      },
      addQuery(k) {
        this.$refs.searchboxRef.getQuery(k)
      },
      // 滚动前触发事件
      blurInput() {
        this.$refs.searchboxRef.blur()
      },
      savaHis() {
        this.saveHistory(this.query)
        this.$refs.topTipRef.show()
      },
      deleteHis(item) {
        this.delHistory(item)
      }
    },
    components: {
      searchbox,
      scroll,
      songList,
      switches,
      searchlist,
      toptip,
      suggestlist
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .addsong {
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background-color: #222222
    animation move .3s ease
  }

  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(0, 100%, 0);
  }

  .header {
    position: relative
    height: 44px
    text-align center
  }

  .header .title {
    line-height: 44px
    font-size 18px
    color #fff
  }

  .header .close {
    position: absolute
    top: 0
    right: 8px
  }

  .close .icon-close {
    display: block
    padding: 12px
    color #FFCD32
    font-size 20px
  }

  .search-box-wrapper {
    margin: 20px;
  }

  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
  }

  .list-wrapper .list-scroll {
    height: 100%;
    overflow: hidden;
  }

  .list-scroll .list-inner {
    padding: 20px 30px;
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
  }

  .tip-title .icon-ok {
    font-size 14px
    color #FFCD32
    margin-right 4px
  }

  .tip-title .text {
    font-size 14px
    color #fff
  }

  @keyframes move {
    0% {
      transform: scale(0.2);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
