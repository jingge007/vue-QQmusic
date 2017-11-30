<template>
  <div class="header">
    <div class="icon"></div>
    <h1 class="text">QQ Music</h1>
    <!--个人中心-->
    <router-link to="/user" class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import '../../common/stylus/mixin.scss';

  .header {
    position: relative;
    height: 44px;
    text-align: center;
    color: #ffcd32;
    font-size: 0;
  }

  .header .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 32px;
    height: 32px;
    margin-right: 9px;
    background-image: url('../../common/images/logo.png');
    background-size: 32px 32px;
  }

  .header .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size 19px
  }

  .header .mine {
    position: absolute;
    top: 0;
    right: 0;
  }

  .mine .icon-mine {
    display: block;
    padding: 12px;
    font-size: 20px;
    color: #ffcd32;
  }

</style>
