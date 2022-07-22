import Signup from '@/components/pages/auth/Signup'
import Signin from '@/components/pages/auth/Signin'
import PasswordResetEmail from '@/components/pages/auth/PasswordResetEmail'
import Signout from '@/components/pages/auth/Signout'
import UserDelete from '@/components/pages/auth/UserDelete'

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
        path: '/auth/delete',
        component: UserDelete,
        meta: { title: 'アカウント削除'},
    },
]