// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' // vuex
import VueLazyload from 'vue-lazyload'
import './common/stylus/index.styl'

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  error: require('./common/images/logo.png'),         // 这个是请求失败后显示的图片
  loading: require('./common/images/default.png')   // 这个是加载的loading过渡效果
  // try: 4                                            // 这个是加载图片数量
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
