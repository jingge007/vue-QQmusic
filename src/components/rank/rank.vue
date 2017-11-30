<!--排行页组件-->
<template>
  <div class="rank" ref="rank">
    <!--排行榜数据-->
    <scroll class="toplist" ref="scrollRef" :data="toplist">
      <ul>
        <!--左边图片-->
        <li class="item" v-for="item in toplist" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.picUrl" alt="" width="100" height="100" @load="loadImg">
          </div>
          <!--右边的歌曲-->
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}</span>
              <span class="singername">--{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- loading 组件 -->
      <div v-show="!toplist.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import loading from 'base/loading/loading.vue'
  import scroll from 'base/scroll/scroll.vue'
  import {getRankList} from 'api/rank.js'
  import {playlistMixin} from 'common/js/mixin.js'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        toplist: []
      }
    },
    created() {
      this._getRankList()
    },
    methods: {
      ...mapMutations({        // 将数据提交到mapMutations传到子组件中
        setrankList: 'SET_RANKLIST'
      }),
      handlePlaylist(playlist) {           // 当有迷你播放器时，调整滚动底部距离
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.scrollRef.refresh()
      },
      selectItem(item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setrankList(item)          // 将数据提交到mapMutations
      },
      _getRankList() {           // 排行页的数据
        getRankList().then((res) => {
          if (res.code === 0) {
            this.toplist = res.data.topList
          }
         // console.log(this.toplist)
        })
      },
      loadImg() {         // 当首次获取到图片时，Better-scroll 重新计算
        if (!this.flag) {
          this.$refs.scrollRef.refresh()
          this.flag = true
        }
      }
    },
    components: {
      loading,
      scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .rank {
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
  }

  .rank .toplist {
    height: 100%
    overflow: hidden
  }

  .rank .toplist .item {
    display: flex
    margin 0 20px
    padding-top: 20px
    height: 100px
  }

  .rank .toplist .item:last-child {
    padding-bottom 20px
  }

  .rank .toplist .icon {
    flex 0 0 100px
    width: 100px
    height: 100px
  }

  .songlist {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 20px;
    height: 100px;
    overflow: hidden;
    background: #333;
    color: #9E9E9C;
    font-size: 12px;
  }

  .songlist .song {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 26px;
  }

  .songlist .song .singername {
    /* color: rgba(255, 255, 255, 0.2);*/
    color #9E9E9C
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
