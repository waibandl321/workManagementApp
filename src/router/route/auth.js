import Signup from '@/components/pages/auth/Signup'
import Signin from '@/components/pages/auth/Signin'
import PasswordReset from '@/components/pages/auth/password_reset/PasswordReset'
import Signout from '@/components/pages/auth/Signout'
import UserDelete from '@/components/pages/auth/UserDelete'
import UserDeleteConfirm from '@/components/pages/auth/UserDeleteConfirm'

export default [
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
        meta: { title: 'サインイン'},
    },
    {
        path: '/auth/password_reset',
        name: 'password_reset',
        component: PasswordReset,
        meta: { title: 'パスワード再設定'}
    },
    {
        path: '/auth/signout',
        name: 'signout',
        component: Signout,
        meta: { title: 'サインアウト'}
    },
    {
        path: '/auth/delete',
        component: UserDelete,
        meta: { title: 'アカウント削除'},
    },
    {
        path: '/auth/delete_confirm',
        component: UserDeleteConfirm, 
    },
]