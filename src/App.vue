<template>
  <div id="app">
    <v-header></v-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import header from './components/header/header.vue'
  import tab from './components/tab/tab.vue'
  import player from './components/player/player.vue'

  export default {
    components: {
      'v-header': header,
      tab,
      player
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

</style>
