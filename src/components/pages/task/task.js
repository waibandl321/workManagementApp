export default {
    methods: {
        // タスク一覧読み込み
        async readTasklist() {
            this.params.task_list = await this.apiGetTaskList()
        },
        // タスク一覧更新
        refreshTaskList(delete_item, from_delete) {
            if(delete_item) {
                this.deleteTaskDetail(delete_item)
            }
            if(from_delete) {
                this.task_detail = []
                this.detail_active = false
            }
            this.params.task_list = this.apiGetTaskList()
        },
         // タスク詳細の更新
        refreshTaskDetail() {
            this.task_detail = this.apiGetTaskDetail(this.task_detail.task_id)
        },
        // ファイルデータの取得
        getFileList() {
            let files = this.apiGetFiles()
            if(files) {
                const obj = Object.entries(files)
                let arr = []
                obj.forEach(r => {
                    if(r[1].task_id == this.task_detail.task_id) {
                        arr.push(r[1])
                    }
                })
                this.params.files = arr
            } else {
                this.params.files = []
            }
        },
        // 全ての添付ファイルを削除
        deleteAllFile(files) {
            files.forEach(r => {
                this.apiDeleteFileStorage(r)
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
        // タスクリストの絞り込み
        // filterListStatus(filter_key, priority) {
        //     this.refreshTaskList()
        //     if(filter_key != 0) {
        //         this.filter(filter_key, "task_status")
        //     }
        //     if(priority) {
        //         this.filter(priority, "task_priority")
        //     }
        // },
        // filterListPriority(filter_key, status) {
        //     this.refreshTaskList()
        //     if(filter_key != 0) {
        //         this.filter(filter_key, "task_priority")
        //     }
        //     if(status) {
        //         this.filter(status, "task_status")
        //     }
        // },
        // filter(filter_key, filter_text) {
        //     let arr = []
        //     let obj = {}
        //     if( filter_text == "task_status" ) {
        //         Object.entries(this.params.task_list).forEach(r => {
        //             if(r[1].task_status.key == filter_key) {
        //                 arr.push(r)
        //             }
        //         })
        //         obj = Object.fromEntries(arr)
        //         this.params.task_list = obj
        //     }
        //     else if( filter_text == "task_priority" ) {
        //         Object.entries(this.params.task_list).forEach(r => {
        //             if(r[1].task_priority.key == filter_key) {
        //                 arr.push(r)
        //             }
        //         })
        //         obj = Object.fromEntries(arr)
        //         this.params.task_list = obj
        //     }
        // },
        // リスト削除 => 詳細情報の削除
        deleteTaskDetail(delete_item) {
            if(delete_item.task_id == this.task_detail.task_id) {
                this.task_detail = []
                this.detail_active = false
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