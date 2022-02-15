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
        upload_done: false,
    }),
    methods: {
        // ファイルアップロード（StorageとDBへ）
        async apiUploadFile(file, id, app) {
            const db_id = this.createRandomId()
            const storage = getStorage();
            const storageRef = ref(storage, file.name);
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

        // Storageからファイルデータを取得してオブジェクトを返す
        apiGetFileFromStore(f_name) {
            const storage = getStorage();
            const imagesRef = ref(storage, f_name);
            let obj = new Object();
            // firebase Storageの戻り値(ファイルデータ)をセット
            obj.store_file_data = imagesRef
            // Primise関数 metadataの取得
            this.apiGetFileMetadata(f_name)
            .then((meta) => {
                obj.file_metadata = meta
            })
            .catch((error) => {
                console.log(error);
            })

            return obj
        },

        // ファイルのメタデータの取得
        async apiGetFileMetadata(f_name) {
            const storage = getStorage();
            const forestRef = ref(storage, f_name);
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

        // ダウンロードURLの作成
        async createDownloadURL(f_name) {
            const storage = await getStorage();
            const forestRef = ref(storage, f_name)
            let download_url = ""

            await getDownloadURL(forestRef)
            .then((url) => {
                download_url = url
            })
            .catch((error) => {
                console.log(error);
            })

            return download_url
        },

        // ストレージからファイルを削除
        apiDeleteFileStorage(file) {
            const storage = getStorage();
            const desertRef = ref(storage, file.name);
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
