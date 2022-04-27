<template>
    <div class="inner">
        <!-- タスク一覧 -->
        <div
            class="list"
        >
            <TaskList
                :params="params"
                :recordClick="recordClick"
                :refreshTaskList="refreshTaskList"
                :refreshTaskDetail="refreshTaskDetail"
                :deleteSubtaskHasTask="deleteSubtaskHasTask"
                :filterListStatus="filterListStatus"
                :filterListPriority="filterListPriority"
                :deleteAllFile="deleteAllFile"
            />
        </div>
        <!-- タスク詳細 -->
        <div
            class="detail"
            v-if="detail_active"
        >
            <TaskDetail
                :params="params"
                :taskDetail="task_detail"
                :refreshTaskList="refreshTaskList"
                :refreshTaskDetail="refreshTaskDetail"
                :closeDetail="closeDetail"
                :deleteSubtaskHasTask="deleteSubtaskHasTask"
                :initSubtaskList="initSubtaskList"
                :getFileList="getFileList"
                :deleteAllFile="deleteAllFile"
            />
        </div>
    </div>
</template>
<script>
import TaskDetail from "@/components/pages/task/TaskDetail"
import TaskList from "@/components/pages/task/TaskList"
import myMixin from "./task.js"

export default {
    components: {
        TaskList,
        TaskDetail,
    },
    mixins: [myMixin],
    data: () => ({
      detail_active: false,
      task_detail: [],
      params: {
        task_list: [],
        task_status_list: {},
        task_priorities: {},
        subtask_list: {},
        status: { text: "全てのタスク", value: 1 },
        default_sort_item: { text: "作成日順", value: 2 },
        files: []
      },
    }),

    created() {
        this.params.task_status_list = this.getTaskStatus() // status
        this.params.task_priorities = this.getTaskPriorities() // priorities
        this.params.task_list = this.apiGetTaskList()
        this.getFileList()
        this.refreshTaskList()
    },
    
    methods: {
        // 一覧レコードクリック
        recordClick(task) {
            this.detail_active = true
            this.initSubtaskList(task)
            this.task_detail = task
            this.getFileList()
        },

        // 詳細閉じる
        closeDetail() {
            this.detail_active = false
            this.list_width = "100%"
        },
    }   
}
</script>
<style scoped src="./scoped.css"></style>