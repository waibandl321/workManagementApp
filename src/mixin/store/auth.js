import store from '@/store'

export default {
    methods: {
        // ユーザーID取得
        storeGetFirebaseUid() {
            return store.state.auth.uid
        },
        // ユーザーIDセット
        storeSetFirebaseUid(uid) {
            store.dispatch("setUid", uid)
        },
        // ユーザーIDの破棄
        storeDeleteFirebaseUid() {
            store.dispatch("destroyUid")
        },
        // アカウント削除結果
        storeSetDeleteResult(result) {
            store.dispatch("setAccountDeleteResult", result)
        },
        setDeleteAccountDeleteResult() {
            store.dispatch("deleteAccountDeleteResult")
        },
        storeGetDeleteResult() {
            return store.state.auth.delete_result
        },
    }
}



