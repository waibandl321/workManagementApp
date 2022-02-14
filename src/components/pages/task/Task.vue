<template>
    <div class="inner" :class="{flex: detail_active}">
        <div class="list" v-if="task_list_layout">
            <TaskList
                :recordClick="recordClick"
                :params="params"
                :parents="parents"
                :refreshTaskList="refreshTaskList"
                :refreshTaskDetail="refreshTaskDetail"
                :deleteSubtaskHasTask="deleteSubtaskHasTask"
            />
        </div>
        <div class="detail" v-if="detail_active">
            <TaskDetail
                :parents="parents"
                :params="params"
                :taskDetail="task_detail"
                :refreshTaskList="refreshTaskList"
                :refreshTaskDetail="refreshTaskDetail"
                :closeDetail="closeDetail"
                :deleteSubtaskHasTask="deleteSubtaskHasTask"
                :initSubtaskList="initSubtaskList"
                :getFileList="getFileList"
            />
        </div>
    </div>
</template>
<script>
import TaskDetail from "@/components/pages/task/TaskDetail"
import TaskList from "@/components/pages/task/TaskList"

export default {
    components: {
        TaskList,
        TaskDetail,
    },

    props: {
        parents: Object
    },

    data: () => ({
      detail_active: false,
      task_detail: [],
      task_list_layout: true,
      params: {
        task_list: {},
        task_status_list: {},
        subtask_list: {},
        status: { text: "全てのタスク", value: 1 },
        sort_status_options: [],
        default_sort_item: { text: "作成日順", value: 2 },
        sort_date_options: [],
        files: []
      },
    }),

    created() {
        this.init()
    },
    mounted() {
        this.getFileList()
    },
    updated() {},

    methods: {
        // ファイルデータの取得
        getFileList() {
            const files = this.apiGetFiles()
            if(files) {
                const obj = Object.entries(files)
                let arr = []
                obj.forEach(r => {
                    let file_name = r[1].file_name
                    let task_id = r[1].task_id
                    if(task_id == this.task_detail.task_id) {
                        arr.push(this.apiGetFileFromStore(file_name))
                    }
                })
                this.params.files = arr
            }
        },
        init() {
            this.refreshTaskList() // list refresh
            this.params.sort_status_options = this.getSortStatusOptions() // sort status
            this.params.sort_date_options = this.getSortDateOptions() // sort date
            this.params.task_status_list = this.getTaskStatus() // status
        },
        // タスク詳細へ
        recordClick(task) {
            this.detail_active = true
            this.initSubtaskList(task)
            this.task_detail = task
            this.getFileList()
        },
        // サブタスク一覧
        initSubtaskList(task) {
            if(task.task_id) {
                let subtasks = []
                let obj = this.apiGetsubTaskList()
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
        

        // 詳細画面close
        closeDetail() {
            this.detail_active = false
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
        // タスク詳細の更新
        refreshTaskDetail() {
            this.task_detail = this.apiGetTaskDetail(this.task_detail.task_id)
        },
    }
}
</script>
<style scoped>
.inner {
    display: flex;
    height: 100%;
}
.list {
    border-right: 1px solid #ccc;
    width: 100%;
    padding: 0 24px;
}
.flex .list {
    width: 35%;
}
.detail {
    padding: 0 24px;
    width: 100%;
}
.list + .detail {
    width: 65%;
}
</style>