<template>
    <div class="body">
        <Header :parents="parents" />
        <div class="pa-4 dashbord">
            <v-row>
                <CompletedTaskRate :params="params" />    
                <ExpiredTaskRate :params="params" />
            </v-row>
            <TaskLength :params="params" />
            <TaskList :params="params" />
        </div>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import CompletedTaskRate from './parts/CompletedTaskRate.vue'
import ExpiredTaskRate from './parts/ExpiredTaskRate.vue'
import TaskLength from './parts/TaskLength.vue'
import TaskList from './parts/TaskList.vue'
import dashboardMixin from './dashbord.js'
import taskMixin from '@/mixin/api/task.js'

export default {
    components: {
        Header,
        CompletedTaskRate,
        ExpiredTaskRate,
        TaskLength,
        TaskList,
    },
    mixins: [dashboardMixin, taskMixin],
    data: () => ({
        parents: {
            user_info: {}
        },
        params: {
            all_tasks: [],
            is_completed_tasks: [],
            is_expired_tasks: [],
            is_active_tasks: [],
            is_updated_tasks: [],
            near_deadline_tasks: [],
            today_deadline_tasks: [],

            is_created_tasks_week: [],
            is_created_tasks_month: [],
        }
    }),
    created() {
        this.parents.user_info = this.storeGetAccountInfo()
        this.initTaskList()
    },
    methods: {
        async initTaskList() {
            this.params.all_tasks = await this.getAllDashboardTask();
            this.params.is_completed_tasks = this.getCompletedTasks();
            this.params.today_deadline_tasks = this.getExpiredTasksToday();
            this.params.is_expired_tasks = this.getExpiredTasks();
            this.params.near_deadline_tasks = this.getNearDeadlineTasksByOneWeek();

            this.params.is_created_tasks_week = this.getDashboardTasksByCreatedOneWeek()
        }
    }
}
</script>
<style src="../../../assets/css/original.css"></style>
<style scoped>
.body {
  width: 100%;
}
.dashbord >>> .v-card__title {
    font-size: 16px;
}

</style>