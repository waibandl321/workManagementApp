export default {
    data: () => ({
        
    }),
    methods: {
        // タスク読み込み
        async readTaskList() {
            let result = await this.apiGetTaskList()
            result = Object.keys(result)
            .map( (key) => {return result[key]})
            .filter( v => v.task_status !== 5 )

            return result;
        },
        
        // ファイル一覧取得
        getFileList() {
            let result = this.firebaseReadFile()
            if(result) {
                result = Object.entries(result)
                result = result.filter((v) => v[1].task_id == this.params.viewer.task_id)
            } else {
                result = []
            }
            return result;
        },
        // 戻り値：タスク期日 - タスク作成日
        convertTaskPeriod(begin, end) {
            if(!end) {
                return "未指定"
            }
            const _begin = new Date(this.convertDatetimeFromUnixtime(begin, "yyyy-mm-dd")),
                _end = new Date(this.convertDatetimeFromUnixtime(end, "yyyy-mm-dd"));
            return (_end - _begin) / 86400000 + " 日間"
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
        // 全ての添付ファイルを削除
        deleteAllFile(files) {
            for(const file of files) {
                this.storageDeleteFile(file)
            }
        },
        // サブタスク一覧
        async getSubtaskList(task_viewer) {
            if(task_viewer.task_id) {
                let result = await this.apiGetSubtaskList()
                result = Object.keys(result)
                        .map((key) => {
                            return result[key];
                        })
                        .filter(v => v.task_id === task_viewer.task_id)
                
                return result;
            }
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
                this.apiDeleteSubtaskHasTask(this.params.subtask_list)
            }
            return true
        },
        // タスク情報の更新
        async tasknameUpdate() {
            const result = await this.apiUpdateTaskname(this.params.viewer.task_id, this.params.viewer.task_name)
            if(result) {
                this.task_name_edit = false
                this.params.success = "タスク名を更新しました。"
            }
        },
        async updateTaskDescription() {
            const result = await this.apiUpdateTaskDescription(this.params.viewer.task_id, this.params.viewer.task_description);
            if(result) {
                this.desc_editor = false
                this.params.success = "タスク概要説明を更新しました。"
            }
        },
        async updateTaskStatus() {
            const result = await this.apiUpdateTaskStatus(this.params.viewer.task_id, this.params.viewer.task_status)
            if(result) {
                this.params.success = "タスクのステータスを変更しました。"
            }
        },
        async updateTaskPriority() {
            const result = await this.apiUpdateTaskPriority(this.params.viewer.task_id, this.params.viewer.task_priority)
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

            const result = await this.apiUpdateTaskTerm(deadline, this.params.viewer.task_id)
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
        // ファイルのダウンロードパスを返す
        async outputDownloadPath(filename) {
            return await this.storageDownloadPath( this.storeGetFirebaseUid() + '/' + filename )
        },
    }
}