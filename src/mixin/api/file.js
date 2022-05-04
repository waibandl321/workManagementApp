import { 
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    getMetadata,
    deleteObject
} from "firebase/storage";


export default {
    data: () => ({}),
    methods: {

        
        // ファイルアップロード（StorageとDBへ）
        async apiUploadFile(file, task_id) {
            const db_id = this.createRandomId()
            const storageRef = ref( this.firebaseStorageModule(), this.storeGetFirebaseUid() + '/' + file.name );
            const uploadTask = uploadBytesResumable(storageRef, file, customMetadata(db_id, task_id))
            
            uploadTask.on('state_changed',
                (snapshot) => {
                    console.log(snapshot);
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if(progress == 100) {
                        console.log("upload prosess : " + progress + "%");
                    }
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    let file_meta = await this.apiGetFileMetadata(file.name)
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        this.apiFileSaveDatabase(db_id, "task", file_meta, downloadURL)
                    })
                    .then(() => {
                        this.getFileList()
                        this.file_upload_done = true
                        this.file_loading = false
                    })
                },
            );

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
            const forestRef = ref( this.firebaseStorageModule(), this.storeGetFirebaseUid() + '/' + f_name );
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

        firebaseStorageModule() {
            return getStorage();
        }
    }
}
