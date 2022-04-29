import { 
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    getMetadata,
    deleteObject
} from "firebase/storage";




export default {
    data: () => ({
        // upload_done: false,
    }),
    methods: {
        // ファイルアップロード（StorageとDBへ）
        async apiUploadFile(file, id, app) {
            const userId = this.storeGetFirebaseUid()
            const db_id = this.createRandomId()
            const storage = getStorage();
            const storageRef = ref(storage, userId + '/' + file.name);
            const str = app + "_id"
            const custom_meta = {
                customMetadata: {
                    db_id: db_id,
                    [str]: id
                }
            }
            const uploadTask = uploadBytesResumable(storageRef, file, custom_meta)
            uploadTask.on('state_changed',
                (snapshot) => {
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
                        this.apiFileSaveDatabase(db_id, app, file_meta, downloadURL)
                    })
                    .then(() => {
                        this.getFileList()
                        this.file_upload_done = true
                        this.file_loading = false
                    })
                },
            );
        },


        // ファイルのメタデータの取得
        async apiGetFileMetadata(f_name) {
            const storage = getStorage()
            const userId = this.storeGetFirebaseUid()
            const forestRef = ref(storage, userId + '/' + f_name);
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
        apiDeleteFileStorage(file) {
            const storage = getStorage();
            const userId = this.storeGetFirebaseUid()
            const desertRef = ref(storage, userId + '/' + file.name);
            deleteObject(desertRef)
            .then(() => {
                this.apiDeleteFileDatabase(file)
            })
            .catch((error) => {
                console.log(error);
            });
            return true
        },
    }
}
