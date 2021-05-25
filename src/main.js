// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'vue-beauty/package/style/vue-beauty.min.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import LyricScroll from 'vue-lyric-scroll'
Vue.use(LyricScroll)
Vue.prototype.$axios = axios
Vue.use(router)
Vue.use(ElementUI);
Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
  if(to.meta.needLogin){//页面是否需要登录
    if (window.sessionStorage.token!=""&&window.sessionStorage.token!=undefined) {
      if (to.meta.title) {
        document.title = to.meta.title
      }
      next()
    } else {
      //如果没有，让页面进入登录页
      ElementUI.Message({
        message: '请登录',
        type: 'error'
      });
      router.replace({
        path: '/login'
      })
    }
    }else{
      if (to.meta.title) {
        document.title = to.meta.title
      }
      next()
    }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
