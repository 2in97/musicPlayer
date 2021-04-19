import Vue from 'vue'
import Router from 'vue-router'
import musicPlayer from '@/view/player/musicPlayer'
import allMusic from '@/view/player/allMusic'
import lastListened from '@/view/player/lastListened'
import searchMusic from '@/view/player/searchMusic'
import login from '@/view/manageSystem/login'
import uploadMusic from '@/view/manageSystem/uploadMusic'
import index from '@/view/index'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: 'allMusic' },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title:
          'login'
      },
    },
    {
      path: '/music',
      name: 'index',
      component: index,
      meta: {
        title:
          'hello'
      },
    },
    {
      path: '/uploadMusic',
      name: 'uploadMusic',
      component: uploadMusic,
      meta: {
        title:
          'uploadMusic',
        needLogin: true,
      },
    }, 
    {
      path: '/',
      name: 'musicPlayer',
      component: musicPlayer,
      meta: {
        title:
          'MusicPlayer',
      },
     
      children: [
        {
          path: '/allMusic',
          name: 'allMusic',
          component: allMusic,
          meta: {
            title:
              '所有音乐',
          }
        },
        {
          path: '/lastListened',
          name: 'lastListened',
          component: lastListened,
          meta: {
            title:
              '最近听过',
          }
        },
        {
          path: '/searchMusic',
          name: 'searchMusic',
          component: searchMusic,
          meta: {
            title:
              '搜索音乐',
          }
        },
      ]

    },
  ]
})
