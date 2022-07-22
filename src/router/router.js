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
    // アカウント初期設定が完了している場合は新規登録画面には遷移できないように
    if(to.path.includes('/account/register') && Utils.routerAccountExists()) {
      window.location = "/account/update"
      return;
    }
    // ログインチェック
    if(!Utils.isSignin()) {
        window.location = "/auth/signin"
        return;
    }
  } else {
    next()
  }
  next()
})

export default router