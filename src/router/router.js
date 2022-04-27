import Vue from 'vue'
import Router from 'vue-router'
import Route from './route/route.js'
import Utils from './utils.js'

Vue.use(Router)

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
    Utils.methods.isSignin(to, from, next)
  } else {
    next()
  }
  next()
})

export default router