import Vue from 'vue'
import Router from 'vue-router'
import musicPlayer from '@/view/player/musicPlayer'
import playing from '@/view/player/playing'
import lastListened from '@/view/player/lastListened'
import lyric from '@/view/player/lyric'
import login from '@/view/manageSystem/login'
import songManage from '@/view/manageSystem/songManage'
import artistManage from '@/view/manageSystem/artistManage'
import albumManage from '@/view/manageSystem/albumManage'
import index_recommend from '@/view/manageSystem/index_recommend'
import playList from '@/view/player/songList'
import search from '@/view/player/search'
import artistList from '@/view/player/artistList'
import songDetail from '@/view/player/detail/song'
import artistDetail from '@/view/player/detail/artist'
import albumDetail from '@/view/player/detail/album'
import songListDetail from '@/view/player/detail/songList'
import home from '@/view/index'
import index from '@/view/player/index'
import personalCenter from '@/view/personal/personalCenter'
import personalSetting from '@/view/personal/personalSetting'
import myCollection from '@/view/personal/myCollection'
import mySongList from '@/view/personal/mySongList'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/music' },
    { path: '/personalCenter', redirect: '/personalCenter/myCollection' },
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
      path: '/',
      name: 'home',
      component: home,
      meta: {
        title:
          '17音乐'
      },
      children: [
        {
          path: '/songList',
          name: 'songList',
          component: playList,
          meta: {
            title:
              '17音乐-歌单'
          },
        }, {
          path: '/artist',
          name: 'artist',
          component: artistList,
          meta: {
            title:
              '17音乐-歌手'
          },
        }, {
          path: '/music',
          name: 'index',
          component: index,
          meta: {
            title:
              '17音乐'
          },
        }, {
          path: '/search/:type/:word',
          name: 'search',
          component: search,
          meta: {
            title:
              '17音乐'
          },
        }, {
          path: '/songList/:lid',
          name: 'songListDetail',
          component: songListDetail,
          meta: {
            title:
              '17音乐'
          },
        }, {
          path: '/artist/:aid',
          name: 'artistDetail',
          component: artistDetail,
          meta: {
            title:
              '17音乐'
          },
        }, {
          path: '/song/:sid',
          name: 'songDetail',
          component: songDetail,
          meta: {
            title:
              '17音乐'
          },
        }, {
          path: '/album/:aid',
          name: 'albumDetail',
          component: albumDetail,
          meta: {
            title:
              '17音乐'
          },
        },{
          path: '/personalCenter',
          name: 'personalCenter',
          component: personalCenter,
          meta: {
            title:
              '17音乐-个人中心',
            /*  needLogin: true, */
          },
          children: [{
            path: '/personalCenter/myCollection',
            name: 'myCollection',
            component: myCollection,
            meta: {
              title:
                '17音乐-个人中心',
              /*  needLogin: true, */
            },
          }, {
            path: '/personalCenter/mySongList',
            name: 'mySongList',
            component: mySongList,
            meta: {
              title:
                '17音乐-个人中心',
              /*  needLogin: true, */
            },
          },
          ]
        }, {
          path: '/personalCenter/setting',
          name: 'setting',
          component: personalSetting,
          meta: {
            title:
              '个人设置',
            /*  needLogin: true, */
          },
        },
      ]
    },
    {
      path: '/songManage',
      name: 'songManage',
      component: songManage,
      meta: {
        title:
          '歌曲管理',
        needLogin: true,
      },
    }, {
      path: '/artistManage',
      name: 'artistManage',
      component: artistManage,
      meta: {
        title:
          '歌手管理',
        needLogin: true,
      },
    }, {
      path: '/albumManage',
      name: 'albumManage',
      component: albumManage,
      meta: {
        title:
          '专辑管理',
        needLogin: true,
      },
    }, {
      path: '/index_recommend',
      name: 'index_recommend',
      component: index_recommend,
      meta: {
        title:
          '推荐设置',
        needLogin: true,
      },
    },
    {
      path: '/musicPlayer',
      name: 'musicPlayer',
      component: musicPlayer,
      meta: {
        title:
          'MusicPlayer',
      },

      children: [
        {
          path: '/musicPlayer/playing',
          name: 'playing',
          component: lyric,
          meta: {
            title:
              '正在播放',
          }
        },
        {
          path: '/musicPlayer/lastListened',
          name: 'lastListened',
          component: lastListened,
          meta: {
            title:
              '最近听过',
          }
        },
        {
          path: '/musicPlayer/playList',
          name: 'playList',
          component: playing,
          meta: {
            title:
              '播放列表',
          }
        },
        
      ]

    },
  ]
})
