<!--歌手页组件-->
<template>
  <div class="singer" ref="singerRef">
    <!--歌手列表组件-->
    <singerList ref="listRef" :data="singers" @select="selectSinger"></singerList>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'                             // 歌手列表数据api
  import {creatSinger} from 'common/js/SingerClass'                   // 歌手列表信息数据类的封装
  import singerList from 'base/singerList/singerList.vue'            // 歌手列表组件
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_TITLE = '热门'
  const HTO_NUM = 10

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      // 当有迷你播放器时，调整滚动底部距离
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singerRef.style.bottom = bottom
        this.$refs.listRef.refresh()
      },
      selectSinger(singer) {    // 歌手详情页子路由的分配
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        // console.log(singer)
        this.setSinger(singer)
      },
      _getSingerList() {         // 获取歌手列表的数据
        getSingerList().then((res) => {
          if (res.code === 0) {
            this.singers = this._formatSingers(res.data.list)
            // console.log(res.data.list)
          }
        })
      },
      _formatSingers(list) {    // 重组res.data.list数据
        let map = {   // 热门歌手
          hot: {
            title: HOT_TITLE,
            items: []
          }
        }
        list.forEach((item, index) => {    // 填充歌手数据
          if (index < HTO_NUM) {          // 填充热门歌手数据
            map.hot.items.push(creatSinger(item))       // 对list数据进行重组，获取我们需要的数据
          }
          let key = item.Findex     // 填充a-z字母的数据
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(creatSinger(item))     // 填充对应字母歌手的数据
        })
        // 得到有序列表
        let hot = []
        let others = []
        for (let key in map) {
          let value = map[key]
          if (value.title.match(/[a-zA-Z]/)) {     // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
            others.push(value)                    // 筛选字母列表数据，去掉不是字母数据的参数
           // console.log(others)
          } else if (value.title === HOT_TITLE) {
            hot.push(value)                       // 如果key等于'热门'就放到hot数组中
          }
        }
        others.sort((a, b) => {     // sort() 方法用于对数组的元素进行排序。
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)     // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
        })
       // console.log(hot.concat(others))
        return hot.concat(others)     // concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本
      },
      ...mapMutations({      // 映射
        'setSinger': 'SET_SINGER'
      })
    },
    components: {
      singerList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .singer {
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
  }
</style>
