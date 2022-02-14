import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata } from "firebase/storage";




export default {
    data: () => ({
        upload_done: false,
    }),
    methods: {
        // ファイルアップロード（StorageとDBへ）
        async apiUploadFile(file, id, app) {
            const storage = getStorage();
            const storageRef = ref(storage, file.name);
            const str = app + "_id"
            const custom_meta = {
                customMetadata: {
                    [str]: id
                }
            }
            
            const uploadTask = uploadBytesResumable(storageRef, file, custom_meta)
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if(progress == 100) {
                        console.log('Upload is ' + progress + '% done');
                    }
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    let file_meta = await this.apiGetFileMetadata(file.name)
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        this.apiFileSaveDatabase(app, file_meta, downloadURL)
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
        }
        
    }
}
