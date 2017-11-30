<!--推荐页歌手详情页组件-->
<template>
  <transition name="slide">
    <musicList :songs="songs" :title="title" :bgImage="bgImage"></musicList>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import musicList from '../musicList/musicList.vue'
  import {getSongList} from 'api/recommend.js'
  import {createSingerSong} from 'common/js/SingerSongClass'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {          // 禁止直接刷新详情页（获取不到歌手 id）
        if (!this.songlist.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.songlist.dissid).then((res) => {    // 获取指定歌手详情页的数据
          if (res.code === 0) {
            this.songs = this._formatSongs(res.cdlist[0].songlist)
            console.log(res.cdlist)
          }
        })
      },
      _formatSongs(list) {
        let result = []
        list.forEach((item) => {
          // 解构赋值
          let {musicData} = item
          if (musicData.albummid && musicData.songid) {
            result.push(createSingerSong(musicData))
          }
        })
        // console.log(result)
        return result
      }
    },
    computed: {
      // vuex 使用对象展开运算符将getters 混入computed对象中
      ...mapGetters([
        'songlist'
      ]),
      title() {          // 把需要的数据传到子组件中
        return this.songlist.dissname
      },
      bgImage() {
        return this.songlist.imgurl
      }
    },
    components: {
      musicList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .slide-enter-active, .slide-leave-active {
    transition all .3s ease
  }

  .slide-enter, .slide-leave-to {
    opacity 0
    transform translate3d(100%, 0, 0)
  }
</style>
