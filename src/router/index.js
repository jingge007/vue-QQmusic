import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'components/recommend/recommend.vue'
import singer from 'components/singer/singer.vue'
import rank from 'components/rank/rank.vue'
import search from 'components/search/search.vue'
import singerdetail from 'components/singerdetail/singerdetail.vue'
import songlistdetail from 'components/songlistdetail/songlistdetail.vue'
import rankdetail from 'components/rankdetail/rankdetail.vue'
import user from 'components/user/user.vue'
import Startup from 'base/Startup/Startup.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {path: '/', component: Startup},
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: songlistdetail
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerdetail
        }
      ]
    },
    {
      path: '/rank',
      component: rank,
      children: [
        {
          path: ':id',
          component: rankdetail
        }
      ]
    },
    {
      path: '/search',
      component: search,
      children: [
        {
          path: ':id',
          component: singerdetail
        }
      ]
    },
    {path: '/user', component: user}
  ]
})
