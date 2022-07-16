// components
import Dashboard from '@/components/pages/dashboard/DashboardIndex'
import Task from '@/components/pages/task/TaskIndex'
import File from '@/components/pages/file/FileIndex'
import Signup from '@/components/pages/auth/Signup'
import Signin from '@/components/pages/auth/Signin'
import PasswordResetEmail from '@/components/pages/auth/PasswordResetEmail'
import Signout from '@/components/pages/auth/Signout'
import AccountIndex from '@/components/pages/account/AccountIndex'

export default 
    [
        {
          path: '/',
          component: Dashboard,
          name: 'dashboard',
          meta: { title: 'ダッシュボード', desc: 'ダッシュボードの説明文が入ります' }
        },
        {
          path: '/task/',
          name: 'task',
          component: Task,
          meta: { title: 'タスク管理', desc: 'タスク管理の説明文が入ります' }
        },
        {
          path: '/file',
          name: 'file',
          component: File,
          meta: { title: 'ファイル管理', desc: 'ファイル管理の説明文が入ります' }
        },
        {
          path: '/auth/signup',
          name: 'signup',
          component: Signup,
          meta: { title: 'サインアップ'}
        },
        {
          path: '/auth/signin',
          name: 'signin',
          component: Signin,
          meta: { title: 'サインイン'}
        },
        {
          path: '/auth/password_reset_email',
          name: 'password_reset_email',
          component: PasswordResetEmail,
          meta: { title: 'パスワード再設定'}
        },
        {
          path: '/auth/signout',
          name: 'signout',
          component: Signout,
          meta: { title: 'サインアウト'}
        },
        {
          path: '/account',
          name: 'account_setting',
          component: AccountIndex,
          meta: { title: 'アカウント情報'},
        }
    ]
