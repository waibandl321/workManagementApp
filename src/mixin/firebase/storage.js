import { 
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    getMetadata,
    listAll,
    deleteObject
} from "firebase/storage";


export default {
    data: () => ({}),
    methods: {
        initStorageFilePath(file_name) {
            return this.storeGetFirebaseUid() + '/' + file_name
        },

        // 成功した場合、アップロードしたファイルのメタデータを返す
        async storageUploadTaskFile(file, id) {
            const db_id = this.createRandomId()
            const storageRef = ref( getStorage(), this.initStorageFilePath(file.name) );
            
            return await uploadBytes(storageRef, file, customMetadata(db_id, id))
                .then( async (snapshot) => {
                    // ダウンロードパスを取得
                    const download_path = await this.storageDownloadPath(snapshot.ref);
                    return this.storageFileMetadata(snapshot.ref, download_path)
                })
                .catch((error) => {
                    console.log(error);
                })
            
            function customMetadata(db_id, id) {
                return {
                    customMetadata: {
                        db_id: db_id,
                        task_id: id
                    }
                }
            }
        },

        async storageUploadShareFile(file) {
            const storageRef = ref( getStorage(), this.initStorageFilePath(file.name) );
            return await uploadBytes(storageRef, file)
                .then((snapshot) => {
                    return this.storageDownloadPath(snapshot.ref)
                })
                .catch((error) => {
                    console.log(error);
                })
        },

        async storageFileMetadata(data, download_path) {
            const forestRef = ref( getStorage(), data.fullPath );
            return await getMetadata(forestRef)
            .then((metadata) => {
                metadata.download_path = download_path
                return metadata
            })
            .catch((error) => {
                console.log(error);
            });
        },

        // ダウンロードpathを返す
        async storageDownloadPath(data) {
            const storage = getStorage()
            return await getDownloadURL( ref(storage, data) )
            .then((url) => {
                return url
            })
            .catch((error) => {
                console.log(error);
            });
        },

        // 削除
        async storageDeleteFile(file) {
            const desertRef = ref( getStorage(), this.storeGetFirebaseUid() + '/' + file.name );
            return await deleteObject(desertRef)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
        },
        // アカウント削除と連動して削除
        async storegeDeleteAccountFiles() {
            const results = await this.storageGetAccountFileList()
            if(results.length === 0) return;
            results.forEach(r => {
                const desertRef = ref( getStorage(), this.storeGetFirebaseUid() + '/' + r.name );
                return deleteObject(desertRef)
            })
        },
        // uidに紐づくファイルリストを取得
        async storageGetAccountFileList() {
            const listRef = ref(getStorage(), this.storeGetFirebaseUid());
            return await listAll(listRef)
            .then((res) => {
                return res.items
            })
            .catch((error) => {
                console.log(error);
            });
        },
        async storageDeleteShareFile(file) {
            const desertRef = ref( getStorage(), this.storeGetFirebaseUid() + '/' + file.name );
            return await deleteObject(desertRef)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
        },
    },
}
