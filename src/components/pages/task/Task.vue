<template>
    <div class="inner">
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
        <div class="detail" v-else>
            <TaskDetailDammy />
        </div>
    </div>
</template>
<script>
import TaskDetail from "@/components/pages/task/TaskDetail"
import TaskDetailDammy from "@/components/pages/task/TaskDetailDammy"
import TaskList from "@/components/pages/task/TaskList"
import task_list from "@/config/json/task.json"
import subtask_list from "@/config/json/subtask.json"

export default {
    components: {
        TaskList,
        TaskDetail,
        TaskDetailDammy
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
        status_filter_items: [
            { text: "全てのタスク", value: 1 },
            { text: "有効なタスク", value: 2 },
            { text: "未着手のタスク", value: 3 },
            { text: "処理中のタスク", value: 4 },
            { text: "社内確認待ちタスク", value: 5 },
            { text: "期限切れタスク", value: 6 },
            { text: "完了したタスク", value: 7 },
        ],
        date_filter: { text: "優先度順", value: "1" },
        date_filter_items: [
            { text: "優先度順", value: "1" },
            { text: "期日が近い順", value: "2" },
            { text: "作成日順", value: "3" },
        ],
      },
    }),

    created() {
        this.init()
    },

    methods: {
        init() {
            this.params.tasks = task_list.tasks
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
    width: 30%;
    padding: 0 24px;
}
.detail {
    padding: 0 24px;
    width: 100%;
}
.list + .detail {
    width: 70%;
}
</style>