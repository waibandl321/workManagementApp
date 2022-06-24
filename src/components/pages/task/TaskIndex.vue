<template>
    <div class="body">
        <Header
            :parents="parents"
        />
        <div class="main">
            <div class="inner">
                <div class="list">
                    <MessageViewer
                        :params="params"
                    />
                    <TaskList
                        :params="params"
                        :recordClick="recordClick"
                        :listRefresh="listRefresh"
                        :closeDetail="closeDetail"
                        ref="taskList"
                    />
                </div>
                <TaskDetail
                    :params="params"
                    :closeDetail="closeDetail"
                    :listRefresh="listRefresh"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import TaskDetail from "@/components/pages/task/TaskDetail"
import TaskList from "@/components/pages/task/TaskList"
import MessageViewer from '@/components/common/MessageViewer.vue'
import myMixin from "./task.js"

export default {
    components: {
        Header,
        TaskList,
        TaskDetail,
        MessageViewer
    },
    mixins: [myMixin],
    data: () => ({
        parents: {
            user_info: {}
        },
        
        params: {
            loading: false,
            error: "",
            success: "",

            viewer: {},

            task_list: [],
            task_status_list: {},
            task_priorities: {},
            subtask_list: {},
            status: { text: "全てのタスク", value: 1 },
            default_sort_item: { text: "作成日順", value: 2 },
            files: [],
            detail_mode: false,
        },
    }),
    created() {
        this.parents.user_info = this.storeGetAccountInfo()
        this.params.task_status_list = this.getTaskStatus()
        this.params.task_priorities = this.getTaskPriorities()
        this.getFileList()
    },
    methods: {
        // 一覧レコードクリック
        recordClick(task) {
            this.params.success = ""
            this.params.error = ""
            this.params.detail_mode = true
            this.getSubtaskList(task)
            this.params.viewer = task
            this.getFileList()
        },

        // 詳細閉じる
        closeDetail() {
            this.listRefresh()
            this.params.success = ""
            this.params.error = ""
            this.params.detail_mode = false
        },

        listRefresh() {
            this.$refs.taskList.readTaskList()
        }
    }
}
</script>
<style scoped src="./scoped.css"></style>
<style scoped>
.body {
  width: 100%;
}
.header {
  border-bottom: 1px solid #ccc;
  height: 70px;
  line-height: 70px;
  padding: 0 16px;
}
</style>