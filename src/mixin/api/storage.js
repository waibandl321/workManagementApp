import { 
    getStorage,
    ref,
    // uploadBytesResumable,
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
            const db_id = this.createRandomId()
            const storageRef = ref( this.readStorageModule(), this.initStorageFilePath(file.name) );
            
            return await uploadBytes(storageRef, file, customMetadata(db_id, id))
                .then((snapshot) => {
                    return this.storageFileMetadata(snapshot.ref.fullPath)
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
            const storageRef = ref( this.readStorageModule(), this.initStorageFilePath(file.name) );
            return await uploadBytes(storageRef, file)
                .then((snapshot) => {
                    return this.storageDownloadPath(snapshot.ref.fullPath)
                })
                .catch((error) => {
                    console.log(error);
                })
        },

        async storageFileMetadata(path) {
            const forestRef = ref( this.readStorageModule(), path );
            return await getMetadata(forestRef)
            .then((metadata) => {
                return metadata
            })
            .catch((error) => {
                console.log(error);
            });
        },

        // ダウンロードpathを返す
        async storageDownloadPath(fullPath) {
            return getDownloadURL( ref(this.readStorageModule(), fullPath) )
            .then((url) => {
                return url
            })
            .catch((error) => {
                console.log(error);
            });
        },

        // 削除
        storageDeleteFile(file) {
            const desertRef = ref( this.readStorageModule(), this.storeGetFirebaseUid() + '/' + file.name );
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
            const desertRef = ref( this.readStorageModule(), this.storeGetFirebaseUid() + '/' + file.name );
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
