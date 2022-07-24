export default {
    data: () => ({
        
    }),
    methods: {
        // タスク一覧取得
        async readTaskList() {
            let result = await this.firebaseGetTaskList()
            if(!result) return []
            result = Object.keys(result)
                    .map( (key) => {return result[key]})
                    // .filter( v => v.task_status !== 5 )
                    .sort((a, b) => a.created - b.created)

            return result;
        },

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
        // タスク削除
        async execDeleteTask() {
            try {
                await this.firebaseDeleteTask(this.params.delete_item)
                this.deleteSubtaskHasTask(this.params.delete_item)
                this.execDeleteAllFile(this.params.files)
                this.params.success = "タスクを削除しました。"
            } catch (error) {
                this.params.error = "タスク削除に失敗しました。"
            }
            this.closeDetail();
            this.listRefresh()
            this.params.delete_item = {}
            this.delete_options = []
            this.delete_modal = false
        },
        // 一覧からタスク削除 MEMO: リストの場合詳細close処理なし
        async execDeleteTaskFromList() {
            try {
                await this.firebaseDeleteTask(this.params.delete_item)
                this.deleteSubtaskHasTask(this.params.delete_item)
                this.execDeleteAllFile(this.params.files)
                this.params.success = "タスクを削除しました。"
            } catch (error) {
                this.params.error = "タスク削除に失敗しました。"
            }
            this.listRefresh()
            this.params.delete_item = {}
            this.delete_options = []
            this.delete_modal = false
        },
        // サブタスク作成
        async createSubtask(new_subtask) {
            const subtask = this.generateSubtaskObject(new_subtask)
            try {
                await this.firebaseSubtaskCreate(subtask)
                this.params.success = "サブタスクを新規作成しました。";
                this.subtask_option = [];
                this.params.subtask_editor = {};
                this.params.subtask_list = await this.getSubtaskList(this.params.viewer)
            } catch (error) {
                this.params.error = "サブタスク作成中にエラーが発生しました。";
            }
            this.subtask_mode = "task";
        },
        generateSubtaskObject(new_subtask) {
            return {
                subtask_id: this.createRandomId(),
                task_id: this.params.viewer.task_id,
                subtask_name: new_subtask.subtask_name,
                subtask_description: new_subtask.subtask_description ? new_subtask.subtask_description : "",
                create_account: this.storeGetFirebaseUid(),
                created: this.getCurrentUnixtime(),
                finished_at: ""
            }
        },
        // サブタスク更新
        async updateSubtask(subtask, is_finished_flag) {
            if(is_finished_flag) {
                if(!subtask.finished_at) {
                    subtask.finished_at = this.getCurrentUnixtime()
                } else {
                    return; //MEMO: finishedの場合は何もしない
                }
            }
            const result = await this.firebaseUpdateSubtask(subtask)
            if(result) {
                this.params.success = "サブタスクを更新しました。"
            } else {
                this.params.error = "サブタスクの更新に失敗しました。"
            }
            this.params.subtask_editor = {};
            this.subtask_option = []
            this.params.subtask_list = await this.getSubtaskList(this.params.viewer);
            this.subtask_mode = "task";
        },
        // サブタスク削除
        async deleteSubtask(subtask) {
            const result = await this.firebaseDeleteSubtask(subtask);
            if(result) {
                this.params.success = "サブタスクを削除しました。"
            } else {
                this.params.error = "サブタスクの削除に失敗しました。"
            }
            this.params.subtask_list = await this.getSubtaskList(this.params.viewer);
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
        convertRemainingDays(end) {
            const days = this.judgeRemainingDays(end)
            
            switch (true) {
                case days < 0:
                    return "期限切れ";
                case days === 0:
                    return "本日期日";
                case days > 0:
                    return days + "日";
                default:
                    break;
            }
        },
        judgeRemainingDays(end) {
            if(!end) {
                return undefined
            }
            const today = new Date(this.convertDatetimeFromUnixtime(this.getCurrentUnixtime(), "yyyy-mm-dd")),
                  _end = new Date(this.convertDatetimeFromUnixtime(end, "yyyy-mm-dd"));
             return (_end - today) / 86400000;
        },
        
        
        // リスト削除 => 詳細情報の削除
        deleteTaskDetail(delete_item) {
            if(delete_item.task_id == this.task_detail.task_id) {
                this.task_detail = []
                this.detail_mode = false
            }
        },
        // サブタスクの削除
        deleteSubtaskHasTask(task_viewer) {
            this.params.subtask_list = this.getSubtaskList(task_viewer)
            if(this.params.subtask_list.length > 0) {
                this.firebaseDeleteSubtaskByTask(this.params.subtask_list)
            }
            return true
        },
        // タスク情報の更新
        async updateTaskDescription() {
            const result = await this.firebaseUpdateTaskDescription(this.params.viewer.task_id, this.params.viewer.task_description);
            if(result) {
                this.desc_editor = false
                this.params.success = "タスク概要説明を更新しました。"
            }
        },
        async updateTaskStatus() {
            const result = await this.firebaseUpdateTaskStatus(this.params.viewer)
            if(result) {
                this.params.success = "タスクのステータスを変更しました。"
            }
        },
        async updateTaskPriority() {
            const result = await this.firebaseUpdateTaskPriority(this.params.viewer.task_id, this.params.viewer.task_priority)
            if(result) {
                this.params.success = "タスクの優先度を変更しました。"
            }
        },
        async updateTaskTerm() {
            const deadline = this.convertUnixtimeFromDate(this.task_deadline)
            if(deadline === this.params.viewer.task_deadline){
                this.termSetting = false
                return
            }
            const result = await this.firebaseUpdateTaskDeadline(deadline, this.params.viewer.task_id)
            if(result) {
                this.params.viewer.task_deadline = deadline
                this.params.success = "タスク期日を変更しました"
            }
            this.task_deadline = null
            this.termSetting = false
            
        },
        // 優先度・ステータス文字列変換
        extractTaskStatus(status) {
            let result = this.params.task_status_list
            result = result.filter(v => v.key === status)
            return result[0].text
        },
        extractTaskPriority(priority) {
            let result = this.params.task_priorities
            result = result.filter(v => v.key === priority)
            return result[0].text
        },
        // タスク期日アラート
        outputTaskAlert() {
            if(!this.params.viewer.task_deadline) {
                return
            }
            const result = this.judgeRemainingDays(this.params.viewer.task_deadline)
            switch (true) {
                case result === 0:
                    return "本日期日です";
                case result < 0:
                    return "タスクが期日を過ぎています";
                default:
                    break;
            }
        },
        // ファイル一覧取得
        async getFileList() {
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
        async onFileChange(event) {
            this.file_loading = true
            const files = event.target.files || event.dataTransfer.files
            if(await this.judgeBinaryFileType(files)) {
                try {
                    await this.judgeSameTaskFile(...files)
                    await this.storageUploadTaskFile(...files, this.params.viewer.task_id)
                    .then((result) => {
                        const task_file_obj = this.generateTaskFileObject(result)
                        this.firebaseSaveFile(task_file_obj);
                    })
                    this.params.success = "ファイルをアップロードしました。";
                } catch (error) {
                    this.params.error = "ファイルアップロードに失敗しました。";
                    console.log(error);
                }
                this.params.files = await this.getFileList();
            } else {
                this.params.error = `
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
            return await this._executeDeleteSameTaskFile(...result)
        },
        async _executeDeleteSameTaskFile(file) {
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
                this.params.success = `ファイル${this.delete_file.name}を削除しました。`
            } else {
                this.params.success = `ファイル${this.delete_file.name}の削除に失敗しました。`
            }
            scrollTo(0,0)
            this.params.files = await this.getFileList()
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
                this.params.success = "全てのファイルを削除しました。";
                this.params.files = await this.getFileList()
            } catch (error) {
                console.log(error);
                this.params.error = `
                ファイル削除中にエラーが発生しました。
                時間をおいてもう一度やり直してください。`
            }
            scrollTo(0,0)
            this.delete_options = [];
            this.file_loading = false;
        },
    }
}