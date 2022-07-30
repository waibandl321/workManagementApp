// import AccountIndex from '@/components/pages/account/AccountIndex'
import AccountIndex from '@/components/pages/account/AccountIndexCopy'
import AccountRegister from '@/components/pages/account/AccountRegister'
import AccountUpdate from '@/components/pages/account/AccountUpdate'

export default [
    {
        path: '/account',
        name: 'account_setting',
        component: AccountIndex,
        children: [
            {
                path: 'register',
                component: AccountRegister,
                meta: { title: '初期設定'},
            },
            {
                path: 'update',
                component: AccountUpdate,
                name: "account-update",
                meta: { title: 'アカウント更新'},
            },
        ]
    },
]