import Vue from 'vue'
import Router from 'vue-router'
import VueHead from 'vue-head'
import Route from './route/route.js'
import Utils from './utils'


Vue.use(Router)
Vue.use(VueHead)

const router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [...Route]
})



// ナビゲーションガード
router.beforeEach((to, from, next) => {
  if(!to.path.includes('/auth/')) {
    // ログインチェック
    if(!Utils.isSignin()) {
        window.location = "/auth/signin"
        next()
    }
  } else {
    next()
  }
  next()
})

export default router