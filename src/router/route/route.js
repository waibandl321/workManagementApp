// components
import Dashboard from '@/components/pages/dashboard/DashboardIndex'
import Task from '@/components/pages/task/TaskIndex'
import File from '@/components/pages/file/FileIndex'
import Signup from '@/components/pages/auth/Signup'
import Signin from '@/components/pages/auth/Signin'
import Signout from '@/components/pages/auth/Signout'
import AccountIndex from '@/components/pages/account/AccountIndex'

export default 
    [
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
          path: '/file',
          name: 'file',
          component: File
        },
        {
          path: '/auth/signup',
          name: 'signup',
          component: Signup
        },
        {
          path: '/auth/signin',
          name: 'signin',
          component: Signin
        },
        {
          path: '/auth/signout',
          name: 'signout',
          component: Signout
        },
        {
          path: '/account',
          name: 'account_setting',
          component: AccountIndex
        }
    ]
