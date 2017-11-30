<!--搜索结果列表页-->
<template>
  <scroll class="suggestlist"
          ref="scrollRef"
          :data="result"
          :beforeScroll="beforeScrollData"
          @beforeScroll="beforeScroll"
          :pullup="pullup"
          @scrollToEnd="scrollToEnd"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getSingername(item)"></p>
        </div>
      </li>
      <loading v-if="hasMore"></loading>
      <p class="end" v-else>{{end}}</p>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll.vue'
  import loading from 'base/loading/loading.vue'
  import {search} from 'api/search.js'
  import {createSingerSong} from 'common/js/SingerSongClass.js'
  import {Singer} from 'common/js/SingerClass.js'
  import {mapMutations, mapActions} from 'vuex'

  const TYPE_SINGER = 'singer'

  export default {
    data() {
      return {
        page: 1,         // 当前检索页数，用于下拉加载
        perpage: 20,     // 每一页加载的列表数据的数量
        result: [],      // 接收检索的结果数据
        hasMore: true,    // 标志位，是否加载完成
        end: '没有更多的数据啦',
        beforeScrollData: true,
        pullup: true
      }
    },
    props: {
      query: {         // 接收的检索值
        type: String,
        default: ''
      },
      zhida: {             // 是否显示歌手
        type: Boolean,
        default: true
      }
    },
    watch: {
      query(newVal) {
        this.search()
      }
    },
    methods: {
      ...mapMutations({
        'setSinger': 'SET_SINGER'
      }),
      ...mapActions(['insertSong']),
      search() {
        this.page = 1
        this.hasMore = true
        this.$refs.scrollRef.scrollTo(0, 0)
        search(this.query, this.page, this.perpage, this.zhida).then((res) => {
          if (res.code === 0) {
            this.result = this._formatSearch(res.data)
            this._checkMore(res.data)
          }
          // console.log(res.data)
          console.log(this._formatSearch(res.data))
        })
      },
      _formatSearch(data) {         // 重组res.data的数据
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {         // 格式化歌手的信息
        let ret = []
        list.forEach((item) => {
          if (item.songid && item.albummid) {
            ret.push(createSingerSong(item))
          }
        })
        return ret
      },
      getIconCls(item) {           // 获取搜索结果列表的图标
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getSingername(item) {       // 获取搜索结果的列表歌曲
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}—${item.singer}`
        }
      },
      scrollToEnd() {              // 滚动结束时触发
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.perpage, this.zhida).then((res) => {
          if (res.code === 0) {
            this.result = this.result.concat(this._formatSearch(res.data))
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data) {        // 判断当没有数据的时候，禁止上拉刷新数据
        let song = data.song
        if (!song.list.length || (song.curnum + song.curpage * this.perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      beforeScroll() {       // 滚动前触发事件
        this.$emit('beforeScroll')
      },
      refresh() {     // 给父组件调用的刷新滚动条的方法
        this.$refs.scrollRef.refresh()
      },
      selectItem(item) {           // 点击搜索结果的歌曲列表歌曲就播放歌曲
        if (item.type === TYPE_SINGER) {
          let singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      }
    },
    components: {
      scroll,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import '~@/common/stylus/mixin.styl'

  .suggestlist {
    height: 100%
    overflow: hidden
  }

  .suggest-list {
    padding 0 30px
  }

  .suggest-list .suggest-item {
    display: flex
    align-items center
    padding-bottom 20px
    line-height: 20px
  }

  .suggest-item .icon {
    flex 0 0 30px
    color #F9CD18
    font-size 16px
  }

  .suggest-item .name {
    flex 1
    color #AFB0AE
    font-size 15px
    overflow: hidden
  }

  .suggest-item .name .text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .suggest-list .end {
    height: 35px
    line-height: 35px
    font-size 13px
    color #F9CD18
    text-align center
  }
</style>
