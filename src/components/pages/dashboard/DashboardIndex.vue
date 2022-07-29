<template>
    <div class="body">
        <Header :params="params" />
        <div class="pa-4 dashbord">
            <v-row class="dashboard-graph-wrap">
                <CompletedTaskRate :params="params" />    
                <ExpiredTaskRate :params="params" />
            </v-row>
            <v-row>
                <v-col>
                    <v-card class="pa-4">
                        <v-card-title class="pt-0 px-0 font-weight-bold justify-center">
                            アクティブタスク数
                        </v-card-title>
                        <div>
                            <v-card
                                color="#359EFA"
                                dark
                                link
                                hover
                                to="/task"
                            >
                                <v-card-title class="justify-center" style="font-size: 32px;">
                                    {{ activate }}
                                </v-card-title>
                            </v-card>
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="pa-4">
                        <v-card-title class="pt-0 px-0 font-weight-bold justify-center">
                            期限切れタスク数
                        </v-card-title>
                        <div>
                            <v-card
                                color="#EB3E79"
                                dark
                                link
                                hover
                                to="/task"
                            >
                                <v-card-title class="justify-center" style="font-size: 32px;">
                                    {{ expired }}
                                </v-card-title>
                            </v-card>
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="pa-4">
                        <v-card-title class="pt-0 px-0 font-weight-bold justify-center">
                            完了タスク数
                        </v-card-title>
                        <div>
                            <v-card
                                color="#31A85C"
                                dark
                            >
                                <v-card-title class="justify-center" style="font-size: 32px;">
                                    {{ completed }}
                                </v-card-title>
                            </v-card>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
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
// import TaskLength from './parts/DashboardTaskLength.vue'
import DashboardTaskList from './parts/DashboardTaskList.vue'
import ExecLoading from "@/components/common/ExecLoading.vue"
import dashboardMixin from './dashbord.js'

export default {
    components: {
        Header,
        CompletedTaskRate,
        ExpiredTaskRate,
        DashboardTaskList,
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
    computed: {
        activate: function() {
            return this.params.all_tasks.length - this.params.is_completed_tasks.length;
        },
        expired: function() {
            return this.params.is_expired_tasks.length;
        },
        completed: function() {
            return this.params.is_completed_tasks.length;
        },
    },
    created() {
        this.setRoutetitle()
        this.params.user_info = this.storeGetAccountInfo()
        if(!this.params.user_info.first_name) {
            this.pageMove('/account/register')
        }
        this.initTaskList()
    },
    mounted() {
        this.setRoutetitle()
    },
    methods: {
        async initTaskList() {
            this.params.loading = true;
            try {
                this.params.all_tasks = await this.getAllDashboardTask();
                this.params.is_completed_tasks = this.getCompletedTasks();
                this.params.is_expired_tasks = this.getExpiredTasks();
                this.params.today_deadline_tasks = this.getExpiredTasksToday();
                this.params.near_deadline_tasks = this.getNearDeadlineTasksByOneWeek();
                this.storeSetDashboardTasks(this.params.all_tasks)
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