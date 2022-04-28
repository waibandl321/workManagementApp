import store from '@/store'

export default {
    methods: {
        // アカウント情報取得
        storeGetAccountInfo() {
            return store.state.account.account
        },
        // アカウント情報登録
        storeSetAccountInfo(account_info) {
            store.dispatch("setAccountData", account_info)
        },
        // アカウント情報更新
        storeUpdateAccountInfo(account_info) {
            store.dispatch("updateAccountData", account_info)
        },
        // アカウント情報破棄
        storeDeleteAccountInfo() {
            store.dispatch("deleteAccountData", {})
        },
    }
}