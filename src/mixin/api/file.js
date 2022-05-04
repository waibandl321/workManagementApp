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
        firebaseStorageModule() {
            return getStorage();
        },
        returnFilePath(file_name) {
            return this.storeGetFirebaseUid() + '/' + file_name
        },

        // 成功した場合、アップロードしたファイルのメタデータを返す
        async uploadFileToStorage(file, task_id) {
            const db_id = this.createRandomId()
            const storageRef = ref( this.firebaseStorageModule(), this.returnFilePath(file.name) );
            
            return await uploadBytes(storageRef, file, customMetadata(db_id, task_id))
                .then((snapshot) => {
                    return this.returnFileMetadataOnStorage(snapshot.ref.fullPath)
                })
                .catch((error) => {
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

        async returnFileMetadataOnStorage(path) {
            const forestRef = ref( this.firebaseStorageModule(), path );
            return await getMetadata(forestRef)
            .then((metadata) => {
                return metadata
            })
            .catch((error) => {
                console.log(error);
            });

        },

        // ダウンロードpathを返す
        async downloadFilePath(fullPath) {
            const forestRef = ref(this.firebaseStorageModule(), fullPath);
            return await getDownloadURL( forestRef )
                .then((url) => {
                    return url
                })
                .catch((error) => {
                    console.log(error);
                });
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
