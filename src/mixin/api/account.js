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
        // アカウント取得
        authAccountGet(id) {
            const db = getDatabase();
            const userId = id
            onValue(ref(db, '/users/' + userId), (snapshot) => {
                const data = snapshot.val()
                this.accountData = data
                this.loading = false
            });
        },

        // アカウント登録
        authAccountRegister(firstName, lastName, status, color) {
            const userId = this.getAuthUserId()
            const db = getDatabase();
            set(ref(db, '/users/' + userId), {
                first_name: firstName,
                last_name: lastName,
                status: status,
                color: color
            });
        },

        // アカウント更新
        authAccountUpdate(accountData) {
            const db = getDatabase()
            const userId = this.getAuthUserId()
            const account = {
                first_name: accountData.first_name,
                last_name: accountData.last_name,
                status: accountData.status,
                color: accountData.color
            }

            const updates = {};
            updates['/users/' + userId] = account;
            
            update(ref(db), updates);
        },
    }
}