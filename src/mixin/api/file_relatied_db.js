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
        firebaseSaveFile(data) {
            const obj = {
                    db_id: data.customMetadata.db_id,
                    name: data.name,
                    size: data.size,
                    contentType: data.contentType,
                    download_path: data.download_path,
                    task_id: data.customMetadata.task_id,
                }
            
            const db = getDatabase();
            set(ref(db, '/files/' + this.storeGetFirebaseUid() + '/' + data.customMetadata.db_id), obj);
        },

        // ファイルの一覧取得
        firebaseReadFile() {
            const db = getDatabase()
            const r = ref( db, '/files/' + this.storeGetFirebaseUid() )
            let result = ""
            onValue(r, (snapshot) => {
                result = snapshot.val()
            })
            return result
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