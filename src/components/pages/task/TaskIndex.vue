<template>
    <div class="body">
        <Header
            :parents="parents"
        />
        <div class="list">
            <MessageViewer
                :params="params"
                v-if="!params.detail_mode"
            />
            <TaskList
                :params="params"
                :listRefresh="listRefresh"
                ref="taskList"
            />
        </div>
        <TaskDetail
            :params="params"
            :listRefresh="listRefresh"
        />
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
            items: [],
            subtask_viewer: {},
            subtask_editor: {},
            delete_item: {},

            task_status_list: {},
            task_priorities: {},
            subtask_list: {},
            files: [],
            detail_mode: false,
        },
    }),
    created() {
        this.setRoutetitle()
        this.parents.user_info = this.storeGetAccountInfo()
        if(!this.parents.user_info.first_name) {
            this.pageMove('/account/register')
        }
        this.init()
    },
    methods: {
        async init() {
            this.params.task_status_list = this.getTaskStatus()
            this.params.task_priorities = this.getTaskPriorities()
        },
        listRefresh() {
            this.$refs.taskList.initTaskListComponent()
        }
    }
}
</script>
<style scoped src="./scoped.css"></style>