<!--推荐页组件-->
<template>
  <transition name="slide">
    <div class="recommend" ref="recommend">
      <!--当请求到lists数据时， better-scroll 滚动组件才会渲染-->
      <scroll ref="scroll" class="recommend-content" :data="lists">
        <div>
          <!--当请求到recommends数据时，轮播图才会渲染-->
          <div class="slider-wrapper" v-if="recommends.length">
            <!--轮播图组件-->
            <slider>
              <div v-for="item in recommends">
                <a :href="item.linkUrl">
                  <img @load="loadImg" :src="item.picUrl" alt="" class="needclick">
                </a>
              </div>
            </slider>
          </div>
          <!--歌手推荐列表-->
          <div class="recommend-list">
            <span class="bottom_box left"></span>
            <h1 class="list-title">热门歌单推荐</h1>
            <span class="bottom_box right"></span>
            <ul>
              <li class="item" @click="selectItem(item)" v-for="item in lists">
                <div class="icon">
                  <img v-lazy="item.imgurl" width="70" height="70" alt="">
                </div>
                <div class="text">
                  <p class="name">{{item.creator.name}}</p>
                  <p class="desc">{{item.dissname}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- loading 组件 -->
        <div v-show="!lists.length" class="loading-container">
          <loading></loading>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
  import {getRecommend, getList} from 'api/recommend'        // 推荐页轮播图数据和列表数据api
  import scroll from 'base/scroll/scroll.vue'               // better-scroll 滚动组件
  import slider from 'base/slider/slider.vue'              // 轮播图组件
  import loading from 'base/loading/loading.vue'          // loading加载组件
  import {playlistMixin} from 'common/js/mixin.js'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        lists: []
      }
    },
    created() {
      this._getRecommend()
      this._getList()
    },
    methods: {
      ...mapMutations({
        setSonglist: 'SET_SONGLIST'
      }),
      // 当有迷你播放器时，调整滚动底部距离
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend() {                 // 获取轮播图的数据
        getRecommend().then((res) => {
          if (res.code === 0) {
            this.recommends = res.data.slider
          }
        })
      },
      _getList() {                    // 获取推荐歌单列表数据
        getList().then((res) => {
          if (res.code === 0) {
            this.lists = res.data.list
            // console.log(this.lists)
          }
        })
      },
      loadImg() {             // 当首次获取到图片时，better-scroll要重新计算
        if (!this.flag) {
          this.$refs.scroll.refresh()
          this.flag = true
        }
      },
      selectItem(item) {     // 从推荐页歌手列表进入歌手详情页
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setSonglist(item)      // 将所需要的数据提交到 mapMutations
      }
    },
    components: {
      scroll,
      slider,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .recommend {
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
  }

  /*.slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }*/

  .recommend-content {
    height: 100%
    overflow: hidden
  }

  .recommend-content .slider-wrapper {
    position: relative
    width: 100%
    overflow: hidden
  }

  .recommend-list {
    position: relative
  }

  .recommend-list .list-title {
    height: 65px
    line-height: 65px
    text-align: center
    font-size 15px
    color #ffcd32
  }

  .recommend-list .bottom_box {
    position: absolute
    top: 32px
    box-sizing border-box
    width: 25%
    height: 1px
    background-color: #F0F01D
  }

  .recommend-list .bottom_box.left {
    left: 20px
  }

  .recommend-list .bottom_box.right {
    right: 20px
  }

  .recommend-list .item {
    display: flex
    align-items center
    box-sizing border-box
    padding 0 20px 20px 20px
  }

  .item .icon {
    flex 0 0 60px
    width: 60px
    padding-right 20px
  }

  .recommend-list .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    font-size 14px
  }

  .text .name {
    margin-bottom 10px
    color #fff
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .text .desc {
    color hsla(0, 0%, 100%, .3)
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
