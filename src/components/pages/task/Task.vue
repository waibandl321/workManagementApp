<template>
    <div class="inner" :class="{flex: detail_active}">
        <div class="list" v-if="task_list">
            <TaskList
                :recordClick="recordClick"
                :params="params"
                :parents="parents"
            />
        </div>
        <div class="detail" v-if="detail_active">
            <TaskDetail
                :parents="parents"
                :params="params"
                :taskDetail="task_detail"
                :closeDetail="closeDetail"
                :displayWidth="displayWidth"
            />
        </div>
    </div>
</template>
<script>
import TaskDetail from "@/components/pages/task/TaskDetail"
import TaskList from "@/components/pages/task/TaskList"
import subtask_list from "@/config/json/subtask.json"

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
      task_list: true,
      params: {
        tasks: [],
        subtasks: [],
        status: { text: "全てのタスク", value: 1 },
        sort_status_options: [],
        default_sort_item: { text: "作成日順", value: 2 },
        sort_date_options: [],
      },
    }),

    created() {
        this.init()
        this.params.tasks = this.apiGetTaskList()
    },

    methods: {
        init() {
            this.params.sort_status_options = this.getStatusOptions()
            this.params.sort_date_options = this.getSortOptions()
            this.params.subtasks = subtask_list.subtasks
        },
        recordClick(task) {
            this.detail_active = true
            this.task_detail = task
        },
        closeDetail() {
            this.detail_active = false
        },
        displayWidth(status) {
            if(status) {
                this.task_list = false
            } else {
                this.task_list = true
            }
        }
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