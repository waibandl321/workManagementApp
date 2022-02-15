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
        task_priorities: {},
        subtask_list: {},
        status: { text: "全てのタスク", value: 1 },
        default_sort_item: { text: "作成日順", value: 2 },
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
        init() {
            this.refreshTaskList() // list refresh
            this.params.task_status_list = this.getTaskStatus() // status
            this.params.task_priorities = this.getTaskPriorities() // priorities
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
.list,
.detail {
    box-sizing: border-box;
    padding: 24px 24px 10%;
    height: 100%;
    overflow-y: auto;
}
.list {
    border-right: 1px solid #ccc;
    width: 100%;
}
.flex .list {
    width: 35%;
}
.detail {
    width: 100%;
}
.list + .detail {
    width: 65%;
}
</style>