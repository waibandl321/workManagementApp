import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata } from "firebase/storage";




export default {
    data: () => ({
        upload_done: false,
    }),
    methods: {
        // ファイルアップロード（StorageとDBへ）
        apiUploadFile(file, id, app) {
            console.log(file);
            const storage = getStorage();
            const storageRef = ref(storage, file.name);
            const str = app + "_id"
            const metadata = {
                customMetadata: {
                    [str]: id
                }
            }
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);
            // アップロード状況の監視
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if(progress == 100) {
                        this.upload_done = true
                        const metadata = uploadTask.snapshot.metadata
                        this.apiFileSaveDatabase(metadata, app)
                        console.log("アップロード完了")
                    }
                },
                (error) => {
                    console.log('error!!!' + error)
                },
            );
            this.upload_done = false
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
            });

            return meta
        },

        // ファイルのダウンロードURLの取得
        async createDownloadURL(f_name) {
            const storage = getStorage();
            let u = ""

            await getDownloadURL(ref(storage, f_name))
            .then((url) => {
                u = url
            })
            .catch((error) => {
                console.log(error);
            });
            
            return u
        }
    }
}
