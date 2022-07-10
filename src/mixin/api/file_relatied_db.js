import {
    getDatabase,
    ref,
    set,
    remove,
    onValue
} from "firebase/database";

export default {
    methods: {
        // ファイルデータをDBに保存
        firebaseSaveFile(task_file_obj) {
            const db = getDatabase();
            set(ref(db, '/files/' + this.storeGetFirebaseUid() + '/' + task_file_obj.db_id), task_file_obj);
        },

        // ファイルの一覧取得
        async firebaseReadFile() {
            const db = getDatabase()
            const r = ref( db, '/files/' + this.storeGetFirebaseUid() )
            return new Promise((resolve, reject) => {
                onValue(r, (snapshot) => {
                    resolve(snapshot.val())
                }, (err) => {
                    reject(err)
                })
            })
        },
        
        // データベースからファイルを削除
        async firebaseDeleteFile(file) {
            const db = getDatabase();
            const userId = this.storeGetFirebaseUid()
            return await remove(ref(db, '/files/' + userId + '/' + file.db_id))
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
        },
    }
}