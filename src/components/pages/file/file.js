export default {
    methods: {
        async _readAllShareFiles() {
            try {
                return await this.firebaseReadShareFiles()
            } catch (error) {
                console.log(error);
            }
        },
        async readShareFiles(select_dir_id) {
            let result = []
            try {
                const files = await this.firebaseReadShareFiles()
                if(files) {
                    this.params.file_data = files
                    this.params.now_dir = "0"
                    if(select_dir_id) {
                        this.params.now_dir = select_dir_id
                        _matchParentDirectory(files, select_dir_id)
                    } else {
                        _matchParentDirectory(files, "0")
                    }
                }
            } catch (error) {
                console.log(error);
            }
            this.params.files = result
            // 親ディレクトリに一致するファイルデータを返す
            function _matchParentDirectory(files, dir_id) {
                Object.keys(files).forEach((key) =>  {
                    if(files[key].parent_dir_id == dir_id) {
                        result.push(files[key])
                    }
                });
            }
        },
        generateFolderObject() {
            return {
                "id"           : this.createRandomId(),
                "uid"          : this.storeGetFirebaseUid(),
                "type"         : 0,
                "name"         : this.folder_name,
                "size"         : "",
                "upload_at"    : this.getCurrentUnixtime(),
                "delete"       : 0,
                "parent_dir_id": this.params.now_dir,
            }
        },
        generateFileObject(file) {
            return {
                    "id"           : this.createRandomId(),
                    "uid"          : this.storeGetFirebaseUid(),
                    "type"         : 1,
                    "name"         : file.name,
                    "size"         : file.size,
                    "upload_at"    : this.getCurrentUnixtime(),
                    "delete"       : 0,
                    "parent_dir_id": this.params.now_dir,
            }
        },
    }
}