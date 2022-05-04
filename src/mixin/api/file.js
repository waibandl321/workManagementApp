import { 
    getStorage,
    ref,
    // uploadBytesResumable,
    uploadBytes,
    // getDownloadURL,
    getMetadata,
    deleteObject
} from "firebase/storage";


export default {
    data: () => ({}),
    methods: {
        firebaseStorageModule() {
            return getStorage();
        },
        returnFilePath(file_name) {
            return this.storeGetFirebaseUid() + '/' + file_name
        },

        uploadFileToStorage(file, task_id) {
            const db_id = this.createRandomId()
            const storageRef = ref( this.firebaseStorageModule(), this.returnFilePath(file.name) );
            
            uploadBytes(storageRef, file, customMetadata(db_id, task_id))
            .then((snapshot) => {
                // アップロード成功
                console.log(snapshot);
            })
            .catch((error) => {
                // 失敗
                console.log(error);
            })
            
            function customMetadata(db_id, task_id) {
                return {
                    customMetadata: {
                        db_id: db_id,
                        task_id: task_id
                    }
                }
            }
        },
       
        // ファイルのメタデータの取得
        async apiGetFileMetadata(f_name) {

            const forestRef = ref( this.firebaseStorageModule(), this.returnFilePath(f_name) );
            let meta = ""

            await getMetadata(forestRef)
            .then((metadata) => {
                meta = metadata
            })
            .catch((error) => {
                console.log(error);
            })

            return meta
        },

        // ストレージからファイルを削除
        deleteFileOnStorage(file) {
            const desertRef = ref( this.firebaseStorageModule(), this.storeGetFirebaseUid() + '/' + file.name );
            deleteObject(desertRef)
            .then(() => {
                this.apiDeleteFileDatabase(file)
            })
            .catch((error) => {
                console.log(error);
            });
            return true
        },
    },
}
