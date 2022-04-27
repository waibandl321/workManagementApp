// modules
import Vue from 'vue'
import Router from 'vue-router'

// components
import Dashboard from '@/components/pages/dashboard/DashboardIndex'
import Task from '@/components/pages/task/TaskIndex'
import Signup from '@/components/pages/auth/Signup'
import Signin from '@/components/pages/auth/Signin'
import AccountSetting from '@/components/pages/auth/AccountSetting'

// mixins
import Auth from '@/mixin/auth/auth.js'

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
  routes: [
    {
      path: '/',
      component: Dashboard
    },
    {
      path: '/task',
      name: 'task',
      component: Task
    },
    {
      path: '/auth/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/auth/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/auth/account',
      name: 'account_setting',
      component: AccountSetting
    }
  ]
})

// ナビゲーションガード
router.beforeEach((to, from, next) => {
  if(!to.path.includes('/auth/')) {
    // 認証チェック
    if(!Auth.methods.routeAuthCheck()) {
      next({
        path: '/auth/signin',
      })
    } else {
        next()
      }
  } else {
    next()
  }
  next()
})

export default router