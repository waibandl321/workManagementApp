export default {
    data: () => ({
        
    }),
    methods: {
        getFileList() {
            let files = this.firebaseReadFile()
            if(files) {
                const obj = Object.entries(files)
                let arr = []
                obj.forEach(r => {                    
                    if(r[1].task_id == this.viewer.task_id) {
                        arr.push(r[1])
                    }
                })
                this.params.files = arr
            } else {
                this.params.files = []
            }
        },
        // 戻り値：タスク期日 - タスク作成日
        convertTaskPeriod(begin, end) {
            if(!end) {
                return "期日設定なし"
            }
            const _begin = new Date(this.convertDatetimeFromUnixtime(begin, "yyyy-mm-dd")),
                _end = new Date(end);
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
            const today = new Date(this.convertDatetimeFromUnixtime(this.getCurrentUnixtime(), "yyyy-mm-dd")),
                  _end = new Date(end);
             return (_end - today) / 86400000;
        },
        // 全ての添付ファイルを削除
        deleteAllFile(files) {
            files.forEach(r => {
                this.storageDeleteFile(r)
            })
        },
        // サブタスク一覧
        initSubtaskList(task) {
            if(task.task_id) {
                let subtasks = []
                let obj = this.apiGetSubtaskList()
                if(obj) {
                    let arr = Object.entries(obj)
                    arr.forEach(r => {
                        if(r[1].task_id == task.task_id) {
                            subtasks.push(r[1])
                        }
                    })
                    this.params.subtask_list = subtasks
                } else {
                    this.params.subtask_list = {}
                }
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
        deleteSubtaskHasTask(item) {
            this.initSubtaskList(item)
            if(this.params.subtask_list.length > 0) {
                this.apiDeleteSubtaskHasTask(this.params.subtask_list)
            }
            return true
        },
    }
}