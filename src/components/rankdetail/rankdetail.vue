<!--排行歌曲的详情页组件-->
<template>
  <transition name="slide">
    <musicList :songs="songs" :title="title" :bgImage="bgImage" :rank="true"></musicList>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import musicList from '../musicList/musicList.vue'
  import {getRankDetail} from 'api/rank.js'
  import {createSingerSong} from 'common/js/SingerSongClass'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getRankDetail()
    },
    methods: {
      _getRankDetail() {          // 禁止直接刷新详情页（获取不到歌手 id）
        if (!this.rankList.id) {
          this.$router.push('/rank')
          return
        }
        getRankDetail(this.rankList.id).then((res) => {    // 获取指定歌手详情页的数据
          if (res.code === 0) {
            this.songs = this._formatSongs(res.songlist)
            // console.log(res.songlist[0].data)
          }
        })
      },
      _formatSongs(list) {    // 重构res.songlist的数据
        let result = []
        list.forEach((item) => {
          if (item.data.albummid && item.data.songid) {
            result.push(createSingerSong(item.data))
          }
        })
        // console.log(result)
        return result
      }
    },
    computed: {
      // vuex 使用对象展开运算符将getters 混入computed对象中
      ...mapGetters([
        'rankList'
      ]),
      title() {          // 把需要的数据传到子组件中
        return this.rankList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].img
        }
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

