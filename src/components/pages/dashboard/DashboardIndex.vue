<template>
    <div class="body">
        <Header :parents="parents" /> 
        <div
            class="pa-4 dashbord"
            v-if="!params.loading"
        >
            <v-row>
                <CompletedTaskRate :params="params" />    
                <ExpiredTaskRate :params="params" />
            </v-row>
            <TaskLength :params="params" />
            <DashboardTaskList
                :params="params" 
                :clickTaskList="clickTaskList"
            />
            <DashboardTaskDetail
                :params="params"
                :closeDetail="closeDetail"
            />
        </div>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import CompletedTaskRate from './parts/DashboardCompletedTaskRate.vue'
import ExpiredTaskRate from './parts/DashboardExpiredTaskRate.vue'
import TaskLength from './parts/DashboardTaskLength.vue'

import DashboardTaskList from './parts/DashboardTaskList.vue'
import DashboardTaskDetail from '@/components/pages/task/TaskDetail.vue'

import dashboardMixin from './dashbord.js'
import taskGlobalMixin from '@/mixin/api/task.js'
import taskLocalMixin from '@/components/pages/task/task.js'

export default {
    components: {
        Header,
        CompletedTaskRate,
        ExpiredTaskRate,
        TaskLength,
        DashboardTaskList,
        DashboardTaskDetail,
    },
    mixins: [dashboardMixin, taskGlobalMixin, taskLocalMixin],
    data: () => ({
        parents: {
            user_info: {}
        },
        params: {
            loading: false,
            success: "",
            error: "",
            // 詳細情報
            detail_mode: false,
            viewer: {},
            subtask_list: [],
            files: [],
            task_status_list: {},
            task_priorities: {},
            // ダッシュボード用タスクデータ
            all_tasks: [],
            is_completed_tasks: [],
            is_expired_tasks: [],
            is_active_tasks: [],
            is_updated_tasks: [],
            near_deadline_tasks: [],
            today_deadline_tasks: [],
            is_created_tasks_week: [],
            is_created_tasks_month: [],
        },
    }),
    created() {
        this.parents.user_info = this.storeGetAccountInfo()
        this.initTaskList()
    },
    methods: {
        async initTaskList() {
            this.params.loading = true;
            try {
                this.params.all_tasks = await this.getAllDashboardTask();
                this.params.is_completed_tasks = this.getCompletedTasks();
                this.params.today_deadline_tasks = this.getExpiredTasksToday();
                this.params.is_expired_tasks = this.getExpiredTasks();
                this.params.near_deadline_tasks = this.getNearDeadlineTasksByOneWeek();
                this.params.is_created_tasks_week = this.getDashboardTasksByCreatedOneWeek();
                this.params.loading = false;
            } catch (error) {
                console.log(error);
                this.params.loading = false;
            }
        },
        async clickTaskList(task) {
            this.params.viewer = task;
            this.params.subtask_list = await this.getSubtaskList(task)
            this.params.files = this.getFileList()
            this.params.detail_mode = true;
        },
        closeDetail() {
            this.initTaskList();
            this.params.error = "";
            this.params.success = "";
            this.params.detail_mode = false;
        },
    }
}
</script>
<style src="../../../assets/css/original.css"></style>
<style scoped>
.body {
  width: 100%;
}
.dashbord {
    background-color: #f8f5f5;
}
</style>