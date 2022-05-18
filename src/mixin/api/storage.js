import { 
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    getMetadata,
    deleteObject
} from "firebase/storage";


export default {
    data: () => ({}),
    methods: {
        readStorageModule() {
            return getStorage();
        },
        initStorageFilePath(file_name) {
            return this.storeGetFirebaseUid() + '/' + file_name
        },

        // 成功した場合、アップロードしたファイルのメタデータを返す
        async storageUploadFunctionFile(file, id) {
            console.log(file);
            const db_id = this.createRandomId()
            const storageRef = ref( getStorage(), this.initStorageFilePath(file.name) );
            
            return await uploadBytes(storageRef, file, customMetadata(db_id, id))
                .then((snapshot) => {
                    return this.storageFileMetadata(snapshot.ref)
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

        async storageFileMetadata(data) {
            const forestRef = ref( getStorage(), data.fullPath );
            return await getMetadata(forestRef)
            .then((metadata) => {
                return metadata
            })
            .catch((error) => {
                console.log(error);
            });
        },

        // ダウンロードpathを返す
        async storageDownloadPath(data) {
            const storage = getStorage()
            return getDownloadURL( ref(storage, data) )
            .then((url) => {
                return url
            })
            .catch((error) => {
                console.log(error);
            });
        },

        // 削除
        storageDeleteFile(file) {
            const desertRef = ref( getStorage(), this.storeGetFirebaseUid() + '/' + file.name );
            deleteObject(desertRef)
            .then(() => {
                this.firebaseDeleteFile(file)
            })
            .catch((error) => {
                console.log(error);
            });
            return true
        },
        async storageDeleteShareFile(file) {
            const desertRef = ref( getStorage(), this.storeGetFirebaseUid() + '/' + file.name );
            return await deleteObject(desertRef)
            .then(() => {
                return true
            })
            .catch((error) => {
                console.log(error);
            });
        },
    },
}
