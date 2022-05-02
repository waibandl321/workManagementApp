<template>
    <div class="inner">
        <!-- タスク一覧 -->
        <div
            class="list"
            :class="{'list_mode': !detail_mode}"
        >
            <v-alert
                dense
                outlined
                dismissible
                type="error"
                v-if="message"
            >
                {{ message }}
            </v-alert>
            <TaskList
                :params="params"
                :recordClick="recordClick"
                :listRefresh="listRefresh"
                ref="taskList"
            />
        </div>
        <!-- タスク詳細 -->
        <div
            class="detail"
            v-if="detail_mode"
        >
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
      detail_mode: false,
      viewer: [],
      params: {
        task_list: [],
        task_status_list: {},
        task_priorities: {},
        subtask_list: {},
        status: { text: "全てのタスク", value: 1 },
        default_sort_item: { text: "作成日順", value: 2 },
        files: [],
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
            this.detail_mode = true
            this.initSubtaskList(task)
            this.viewer = task
            this.getFileList()
        },

        // 詳細閉じる
        closeDetail() {
            this.detail_mode = false
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