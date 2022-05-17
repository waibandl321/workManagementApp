import Vue from 'vue'
import Router from 'vue-router'
import Route from './route/route.js'
import storeAuth from '@/mixin/store/auth.js'

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
  console.log(storeAuth.methods.storeGetFirebaseUid());
  if(!to.path.includes('/auth/')) {
    // ログインチェック
    if(!storeAuth.methods.storeGetFirebaseUid()) {
        window.location = "/auth/signin"
    }
  } else {
    next()
  }
  next()
})

export default router