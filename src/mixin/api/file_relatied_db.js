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
        firebaseDeleteFile(file) {
            const db = getDatabase();
            const userId = this.storeGetFirebaseUid()
            remove(ref(db, '/files/' + userId + '/' + file.db_id))
            .then(() => {
                this.params.files = this.getFileList()
                this.delete_file_modal = false
                this.file_loading = false
                this.file_delete_done = true
            })
            .catch((error) => {
                console.log(error);
            });
        },
    }
}