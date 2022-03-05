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
        apiFileSaveDatabase(db_id, app, file_meta, download_url) {
            const userId = this.getAuthUserId()
            const id_key = app + "_id"
            let arr = {}
            if(app == "task") {
                arr = {
                    db_id: db_id,
                    name: file_meta.name,
                    size: file_meta.size,
                    contentType: file_meta.contentType,
                    download_url: download_url,
                    [id_key]: file_meta.customMetadata.task_id,
                }
            }
            else if(app == "project") {
                arr = {
                    db_id: db_id,
                    name: file_meta.name,
                    size: file_meta.size,
                    contentType: file_meta.contentType,
                    download_url: download_url,
                    [id_key]: file_meta.customMetadata.project_id,
                }
            }
            const db = getDatabase();
            set(ref(db, '/files/' + userId + '/' + db_id), arr);
        },

        // ファイルの一覧取得
        apiGetFiles() {
            const db = getDatabase()
            const userId = this.getAuthUserId()
            const r = ref(db, '/files/' + userId)
            let d = ""
            onValue(r, (snapshot) => {
                d = snapshot.val()
            })
            return d
        },
        // データベースからファイルを削除
        apiDeleteFileDatabase(file) {
            const db = getDatabase();
            const userId = this.getAuthUserId()
            remove(ref(db, '/files/' + userId + '/' + file.db_id))
            .then(() => {
                this.getFileList()
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