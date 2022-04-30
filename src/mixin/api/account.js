import {
    getDatabase,
    ref,
    set,
    update,
    onValue
}
from "firebase/database";

import { getAuth } from "firebase/auth";

export default {
    methods: {
        getAuthUser() {
            const auth = getAuth();
            const current = auth.currentUser
            return current
        },

        // アカウント情報取得
        async apiGetAccount(uid) {
            return new Promise((resolve) => {
                console.log(uid);
                const db = getDatabase();
                onValue(ref(db, '/users/' + uid), (snapshot) => {
                    return resolve(snapshot.val());
                });
            })
            .catch((reason) => {
                console.log(reason.messege);
            });
        },

        dataLog(data) {
            console.log(data);
        },

        // アカウント登録
        async apiAccountCreate(account_info, uid) {
            const db = getDatabase();
            await set(ref(db, '/users/' + uid), {
                first_name: account_info.first_name,
                last_name: account_info.last_name,
                status: account_info.status,
                color: account_info.color
            });
        },

        // アカウント更新
        apiAccountUpdate(account_info) {
            const db = getDatabase()
            const user = this.getAuthUser()
            const account = {
                first_name: account_info.first_name,
                last_name: account_info.last_name,
                status: account_info.status,
                color: account_info.color
            }

            const updates = {};
            updates['/users/' + user.uid] = account;
            
            update(ref(db), updates);
        },
    }
}