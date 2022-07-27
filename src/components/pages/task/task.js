export default {
    data: () => ({
        
    }),
    methods: {
        // サブタスク一覧取得
        async getSubtaskList(task_viewer) {
            if(task_viewer.task_id) {
                let result = await this.firebaseGetSubtaskList()
                if(!result) return {}
                result = Object.keys(result)
                        .map((key) => {
                            return result[key];
                        })
                        .filter(v => v.task_id === task_viewer.task_id)
                
                return result;
            }
        },
        // 戻り値：タスク期日 - タスク作成日
        convertTaskPeriod(begin, end) {            
            if(!end) {
                return "未設定"
            }
            const _begin = Number(this.convertDatetimeFromUnixtime(begin, "yyyymmdd")),
                _end = Number(this.convertDatetimeFromUnixtime(end, "yyyymmdd"));
            return ((_end - _begin) + 1) + "日間"
        },
        
        
        // タスクに紐付くサブタスクの削除
        deleteSubtaskHasTask(task_viewer) {
            this.params.subtask_list = this.getSubtaskList(task_viewer)
            if(this.params.subtask_list.length > 0) {
                this.firebaseDeleteSubtaskByTask(this.params.subtask_list)
            }
            return true
        },
        
        // ファイル一覧取得
        async getTaskFileList() {
            let result = await this.firebaseReadFile()
            if(!result) return []
            result = Object.keys(result)
                    .map((key) => {
                        return result[key]
                    })
                    .filter((v) => v.task_id == this.params.viewer.task_id)
            
            return result;
        },
        // ファイルアップロード
        async taskFileInputChange(event) {
            this.file_loading = true
            const files = event.target.files || event.dataTransfer.files
            if(await this.judgeBinaryFileType(files)) { //util
                try {
                    await this.judgeSameTaskFile(...files)
                    await this.storageUploadTaskFile(...files, this.params.viewer.task_id) //mixin
                    .then((result) => {
                        const task_file_obj = this.generateTaskFileObject(result)
                        this.firebaseSaveFile(task_file_obj); //mixin
                    })
                    this.messages.success = "ファイルをアップロードしました。";
                } catch (error) {
                    this.messages.error = "ファイルアップロードに失敗しました。";
                    console.log(error);
                }
                this.params.files = await this.getTaskFileList(); //mixin
            } else {
                this.messages.error = `
                    許可されていないファイル形式または、ファイルの元データが改ざんされています。\n
                    アップロード可能なファイル形式はjpg, png, gif, pdfです
                `;
            }
            scrollTo(0,0)
            this.file_loading = false;
        },
        generateTaskFileObject(result) {
            return {
                db_id: result.customMetadata.db_id,
                name: result.name,
                size: result.size,
                contentType: result.contentType,
                download_path: result.download_path,
                task_id: result.customMetadata.task_id,
            }
        },
        // 同名ファイルの上書き
        async judgeSameTaskFile(upload_file) {
            let result = this.params.files;
            result = result.filter((v) => v.name === upload_file.name)
            if(result.length === 0) return;
            console.log("same file name: " + result[0].name);
            return await this.executeDeleteSameTaskFile(...result)
        },
        async executeDeleteSameTaskFile(file) {
            try {
                const result = await this.firebaseDeleteFile(file)
                if(result) {
                    await this.storageDeleteFile(file)
                }
            } catch (error) {
                console.log(error);
            }
            return;
        },
         // ファイル物理削除
        async execDeleteFile() {
            this.file_loading = true;
            this.delete_modal = false;
            const storage_result = await this.storageDeleteFile(this.delete_file)
            if(storage_result) {
                await this.firebaseDeleteFile(this.delete_file)
                this.messages.success = `ファイル${this.delete_file.name}を削除しました。`
            } else {
                this.messages.success = `ファイル${this.delete_file.name}の削除に失敗しました。`
            }
            scrollTo(0,0)
            this.params.files = await this.getTaskFileList()
            this.delete_file = {}
            this.delete_options = []
            this.file_loading = false;
        },
        // 全てのファイル物理削除
        async execDeleteAllFile() {
            this.delete_modal = false;
            this.file_loading = true;
            try {
                for(const file of this.params.files) {
                    const result = await this.storageDeleteFile(file)
                    if(result) {
                        await this.firebaseDeleteFile(file)
                    }
                }
                this.messages.success = "全てのファイルを削除しました。";
                this.params.files = await this.getTaskFileList()
            } catch (error) {
                console.log(error);
                this.messages.error = `
                ファイル削除中にエラーが発生しました。
                時間をおいてもう一度やり直してください。`
            }
            scrollTo(0,0)
            this.delete_options = [];
            this.file_loading = false;
        },
    }
}