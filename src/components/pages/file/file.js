export default {
    data: () => ({
        files: [],
    }),
    methods: {
        readShareFiles(select_dir_id) {
            // TODO:Firebase読み込みに変更
            let items = this.params.file_data
            this.params.now_dir = "0"
            if(select_dir_id) {
                this.params.now_dir = select_dir_id
                items = items.filter((v) => v.parent_dir_id == select_dir_id)
            } else {
                items = items.filter((v) => v.parent_dir_id == "0")
            }
            this.params.filter_items = items
        },
        uploadChange() {
            this.params.dragging = false
            this.params.loading  = true
            this.files           =  [...event.dataTransfer.files]
            let formdata         = []

            for (let i = 0; i < this.files.length; i++) {
                const data = {
                    "id"           : this.createRandomId(),
                    "uid"          : this.storeGetFirebaseUid(),
                    "type"         : 1,
                    "name"         : this.files[i].name,
                    "size"         : this.files[i].size,
                    "upload_at"    : this.getCurrentUnixtime(),
                    "delete"       : 0,
                    "parent_dir_id": this.params.now_dir,
                }
                formdata.push(data)
            }

            // 保存処理
            
            this.params.loading = false
        },
    }
}