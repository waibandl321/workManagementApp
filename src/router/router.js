import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/pages/dashboard/Dashboard'
import Chat from '@/components/pages/chat/Chat'
import Board from '@/components/pages/board/Board'
import File from '@/components/pages/file/File'
import Project from '@/components/pages/project/Project'
import Task from '@/components/pages/task/Task'
import Signup from '@/components/pages/auth/Signup'
import Signin from '@/components/pages/auth/Signin'
import AccountSetting from '@/components/pages/auth/AccountSetting'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Dashboard
    },
    {
      path: '/file',
      name: 'file',
      component: File
    },
    {
      path: '/project',
      name: 'project',
      component: Project
    },
    {
      path: '/task',
      name: 'task',
      component: Task
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    },
    {
      path: '/board',
      name: 'board',
      component: Board
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