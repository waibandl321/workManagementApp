import {
    getDatabase,
    ref,
    set,
    update,
    onValue
}
from "firebase/database";

export default {
    methods: {

        // アカウント情報取得
        async apiGetAccount(uid) {
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
        async apiAccountCreate(account) {
            const db = getDatabase();
            await set(ref(db, '/users/' + this.storeGetFirebaseUid()), account);
        },

        // アカウント更新
        async apiAccountUpdate(account) {
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
    }
}