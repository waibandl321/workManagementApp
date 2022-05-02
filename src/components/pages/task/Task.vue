<template>
    <div class="inner">
        <div class="list">
            <v-alert
                dismissible
                outlined
                color="purple"
                v-if="message"
                dense
            >
                {{ message }}
            </v-alert>
            <TaskList
                :params="params"
                :recordClick="recordClick"
                :listRefresh="listRefresh"
                :closeDetail="closeDetail"
                ref="taskList"
            />
        </div>
        <div>
            <TaskDetail
                :params="params"
                :viewer="viewer"
                :closeDetail="closeDetail"
                :listRefresh="listRefresh"
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
      viewer: [],
      params: {
        task_list: [],
        task_status_list: {},
        task_priorities: {},
        subtask_list: {},
        status: { text: "全てのタスク", value: 1 },
        default_sort_item: { text: "作成日順", value: 2 },
        files: [],

        detail_mode: false,
      },

      message: "",
    }),

    created() {
        this.params.task_status_list = this.getTaskStatus()
        this.params.task_priorities = this.getTaskPriorities()
        this.getFileList()
    },
    
    methods: {
        // 一覧レコードクリック
        recordClick(task) {
            this.params.detail_mode = true
            this.initSubtaskList(task)
            this.viewer = task
            this.getFileList()
        },

        // 詳細閉じる
        closeDetail() {
            this.params.detail_mode = false
        },

        listRefresh(message) {
            this.message = ""
            this.$refs.taskList.top_readTasklist()
            this.message = message
        }
    }   
}
</script>

<style scoped src="./scoped.css"></style>