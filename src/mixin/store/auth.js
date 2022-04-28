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
        storeDestroyFirebaseUid() {
            store.dispatch("destroyUid")
        }
    }
}



