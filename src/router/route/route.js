// components
import Dashboard from '@/components/pages/dashboard/DashboardIndex'
import Task from '@/components/pages/task/TaskIndex'
import Signup from '@/components/pages/auth/Signup'
import Signin from '@/components/pages/auth/Signin'
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
          path: '/account',
          name: 'account_setting',
          component: AccountIndex
        }
    ]
