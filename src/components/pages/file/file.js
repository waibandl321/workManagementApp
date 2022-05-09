export default {
    created() {

    },
    methods: {
        async readShareFiles(select_dir_id) {
            const promise = new Promise((resolve) => {
                resolve();
            });
            
            promise
            .then( async () => {
                return await this.firebaseReadShareFiles()
            })
            .then((files) => {
                this.params.file_data = files
                let result = []
                this.params.now_dir = "0"

                if(select_dir_id) {
                    this.params.now_dir = select_dir_id
                    Object.keys(files).forEach((key) =>  {
                        if(files[key].parent_dir_id == select_dir_id) {
                            result.push(files[key])
                        }
                    });
                } else {
                    Object.keys(files).forEach((key) =>  {
                        if(files[key].parent_dir_id == "0") {
                            result.push(files[key])
                        }
                    });
                }
                this.params.filter_items = result
            })
            .catch((error) => {
                console.log(error);
            })
        },
        
        uploadChange() {
            this.params.dragging = false
            this.params.loading  = true
            let files           =  event.target.files

            for (let i = 0; i < files.length; i++) {
                const data = {
                    "id"           : this.createRandomId(),
                    "uid"          : this.storeGetFirebaseUid(),
                    "type"         : 1,
                    "name"         : files[i].name,
                    "size"         : files[i].size,
                    "upload_at"    : this.getCurrentUnixtime(),
                    "delete"       : 0,
                    "parent_dir_id": this.params.now_dir,
                }
                // 保存処理
                this.firebaseCreateShareFiles(data)
                this.params.filter_items.push(data)
            }
            this.params.success    = `「フォルダ : ${this.folder_name}」を作成しました。`
            this.params.loading = false
        },
    }
}