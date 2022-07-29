<template>
    <div class="body">
        <Header :params="params" />
        <div class="pa-4 dashbord">
            <v-row class="dashboard-graph-wrap">
                <CompletedTaskRate :params="params" />    
                <ExpiredTaskRate :params="params" />
            </v-row>
            <TaskLength :params="params" />
            <DashboardTaskList
                :params="params"
                :initTaskList="initTaskList"
            />
        </div>
        <ExecLoading v-if="params.loading"/>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import CompletedTaskRate from './parts/DashboardCompletedTaskRate.vue'
import ExpiredTaskRate from './parts/DashboardExpiredTaskRate.vue'
import TaskLength from './parts/DashboardTaskLength.vue'
import DashboardTaskList from './parts/DashboardTaskList.vue'
import ExecLoading from "@/components/common/ExecLoading.vue"
import dashboardMixin from './dashbord.js'

export default {
    components: {
        Header,
        CompletedTaskRate,
        ExpiredTaskRate,
        DashboardTaskList,
        TaskLength,
        ExecLoading,
    },
    mixins: [
        dashboardMixin,
    ],
    data: () => ({
        params: {
            loading: false,
            // ダッシュボード用タスクデータ
            all_tasks: [],
            is_completed_tasks: [],
            is_expired_tasks: [],
            is_active_tasks: [],
            is_updated_tasks: [],
            near_deadline_tasks: [],
            today_deadline_tasks: [],
        },
    }),
    created() {
        this.setRoutetitle()
        this.params.user_info = this.storeGetAccountInfo()
        if(!this.params.user_info.first_name) {
            this.pageMove('/account/register')
        }
        this.initTaskList()
    },
    methods: {
        async initTaskList() {
            this.params.loading = true;
            try {
                this.params.all_tasks = await this.getAllDashboardTask();
                this.storeSetDashboardTasks(this.params.all_tasks);
                this.params.is_completed_tasks = this.getCompletedTasks();
                this.params.is_expired_tasks = this.getExpiredTasks();
                this.params.today_deadline_tasks = this.getExpiredTasksToday();
                this.params.near_deadline_tasks = this.getNearDeadlineTasksByOneWeek();
                this.params.loading = false;
            } catch (error) {
                console.log(error);
                this.params.loading = false;
            }
        },
        // 本日期日のタスク
        getExpiredTasksToday() {
            let results = this.storeGetDashboardTasks();
            results = results.filter((v) => 
                v.task_status !== 5 &&
                this.judgeDateJustToday(v.task_deadline)
            )
            return results;
        },
        // 期限が7日以内のタスク
        getNearDeadlineTasksByOneWeek() {
            let results = this.storeGetDashboardTasks();
            results = results.filter((v) => 
                v.task_deadline
                && v.task_status !== 5
                && this.judgeDateAfterToday(v.task_deadline)
                && this.judgeDateRangeAfter7Days(v.task_deadline)
            )
            return results;
        },
    },
}
</script>
<style scoped>
.dashbord {
    background-color: #f8f5f5;
    height: calc(100vh - 70px);
    overflow-y: auto;
}
.dashboard-graph-wrap {
    flex-wrap: nowrap;
}
</style>