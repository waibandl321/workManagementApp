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
        apiGetAccount(uid) {
            let account = {}
            const db = getDatabase();
            onValue(ref(db, '/users/' + uid), (snapshot) => {
                account = snapshot.val()
            });
            return account
        },

        // アカウント登録
        apiAccountRegister(account_info) {
            const user = this.getAuthUser()
            const db = getDatabase();
            set(ref(db, '/users/' + user.uid), {
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