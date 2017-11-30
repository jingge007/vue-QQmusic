<!--搜索页组件-->
<template>
  <div class="search">
    <!--搜索框-->
    <div class="search-box-wrapper">
      <searchbox ref="searchBoxRef" @query="onQueryChange"></searchbox>
    </div>
    <div class="shortcut-wrapper" ref="shortcutRef" v-show="!query">
      <scroll class="shortcut" ref="scrollRef" :data="scrollData" :refreshDelay="refreshDelay">
        <div>
          <!--热门搜索-->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!--搜索历史-->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <searchlist :searches="searchHistory" @select="addQuery" @delete="deleteHis"></searchlist>
          </div>
        </div>
      </scroll>
    </div>
    <!--搜索结果-->
    <div class="search-result" ref="resultRef" v-show="query">
      <suggestlist ref="suggestRef"
                   :query="query"
                   :zhida="zhida"
                   @beforeScroll="blurInput"
                   @select="savaHis"
      >
      </suggestlist>
    </div>
    <!--清空弹窗-->
    <confirm ref="confirnRef" @cancel="cancel" @confirm="confirm"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import searchbox from 'base/searchbox/searchbox.vue'
  import confirm from 'base/confirm/confirm.vue'
  import searchlist from 'base/searchlist/searchlist.vue'
  import scroll from 'base/scroll/scroll.vue'
  import {mapActions, mapGetters} from 'vuex'
  import {getHotKey} from 'api/search.js'
  import suggestlist from '../suggestlist/suggestlist.vue'
  import {playlistMixin} from 'common/js/mixin.js'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        hotKey: [],           // 热门搜索关键词
        query: '',           // 搜索字段 (my-search-box -> my-search -> my-suggest-List)
        zhida: true,        // 是否显示歌手
        refreshDelay: 100
      }
    },
    watch: {
      query(newVal) {     // 解决添加歌曲后不能滚动的问题
        if (!newVal) {
          setTimeout(() => {
            this.$refs.scrollRef.refresh()
          })
        }
      }
    },
    created() {
      this._getHotKey()
    },
    computed: {
      ...mapGetters(['searchHistory']),
      scrollData() {
        return this.hotKey.concat(this.searchHistory)       // concat() 方法用于连接两个或多个数组。
      }
    },
    methods: {
      // 当有迷你播放器时，调整滚动底部距离
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.shortcutRef.style.bottom = bottom
        this.$refs.scrollRef.refresh()
        this.$refs.resultRef.style.bottom = bottom
        this.$refs.suggestRef.refresh()
      },
      ...mapActions(['saveHistory', 'delHistory', 'clearHistory']),
      onQueryChange(query) {          // 当前检索值发生改变时调用
        this.query = query
      },
      _getHotKey() {           // 获取热搜的数据
        getHotKey().then((res) => {
          if (res.code === 0) {
            this.hotKey = res.data.hotkey.slice(0, 15)     // slice() 方法可从已有的数组中返回选定的元素。
          }
          // console.log(res.data.hotkey)
        })
      },
      savaHis() {       // 保存搜索结果历史到vuex和localStorage中
        this.saveHistory(this.query)
      },
      blurInput() {       // 滚动前触发事件
        this.$refs.searchBoxRef.blur()
      },
      addQuery(k) {     // 当点击热搜关键词时，将关键词的值自动添加到input的v-model中
        this.$refs.searchBoxRef.getQuery(k)
      },
      deleteHis(item) {
        this.delHistory(item)
      },
      showConfirm() {          // 点击搜索历史的垃圾桶就弹出弹窗
        this.$refs.confirnRef.show()
      },
      cancel() {       // 点击取消时，关闭弹窗返回
        this.$refs.confirnRef.hide()
      },
      confirm() {        // 点击确定，清空所有搜索历史记录
        this.clearHistory()
      }
    },
    components: {
      searchbox,
      scroll,
      confirm,
      searchlist,
      suggestlist
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .search .search-box-wrapper {
    margin: 20px
  }

  .shortcut-wrapper {
    position: fixed
    top: 178px
    bottom 0
    width: 100%
  }

  .shortcut-wrapper .shortcut {
    height: 100%
    overflow: hidden
  }

  .shortcut .hot-key {
    margin 0 20px 20px 20px
  }

  .hot-key .title {
    margin-bottom 20px
    font-size 14px
    color rgba(255, 255, 255, 0.5);
  }

  .hot-key .item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background-color: #333
    font-size 14px
    color rgba(255, 255, 255, 0.3);
  }

  .hot-key .item.special {
    color: rgba(255, 255, 255, 0.7);
  }

  .search-history {
    position: relative
    margin 0 20px
  }

  .search-history .title {
    display: flex
    align-items center
    height: 40px
    font-size 14px
    color rgba(255, 255, 255, 0.5)
  }

  .title .text {
    flex 1
  }

  .title .clear {
    position: relative;
  }

  .title .clear::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
  }

  .clear .icon-clear {
    font-size 14px
    color rgba(255, 255, 255, 0.3)
  }

  .search-result {
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
  }
</style>
