import {
    getDatabase,
    ref,
    set,
    update,
    onValue,
    remove
}
from "firebase/database";

export default {
    methods: {
        // アカウント情報取得
        async firebaseGetAccount(uid) {
            return new Promise((resolve, reject) => {
                const db = getDatabase();
                onValue(ref(db, '/users/' + uid), (snapshot) => {
                    resolve(snapshot.val());
                }, (err) => {
                    reject(err)
                });
            })
        },
        // アカウント登録
        async firebaseAccountCreate(account) {
            const db = getDatabase();
            await set(ref(db, '/users/' + this.storeGetFirebaseUid()), account);
        },
        // アカウント更新
        async firebaseAccountUpdate(account) {
            const db = getDatabase()
            const updates = {};
            updates['/users/' + this.storeGetFirebaseUid()] = account;
            
            return await update(ref(db), updates)
            .then(() => {
                return true;
            })
            .catch((err) => {
                console.log(err);
                return false;
            })
        },

        // アカウント削除
        async firebaseDeleteAccount() {
            const db = getDatabase()
            return await remove(ref(db, '/users/' + this.storeGetFirebaseUid()));
        },
    }
}