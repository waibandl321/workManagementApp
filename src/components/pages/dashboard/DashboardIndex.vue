<template>
    <div class="body">
        <Header :parents="parents" />
        <div class="pa-4 dashbord">
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">タスク完了率（週間・月間）</v-card-title>
                        <v-card-subtitle class="pa-2">完了タスク数 / 作成タスク数 * 100</v-card-subtitle>
                        <v-row class="mx-0">
                            <v-col>
                                <v-card>
                                    <v-card-subtitle>直近7日間に作成されたタスクの完了率</v-card-subtitle>
                                </v-card>
                            </v-col>
                            <v-col>
                                <v-card>
                                    <v-card-subtitle>直近30日間に作成されたタスクの完了率</v-card-subtitle>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">期限切れ率（週間・月間）</v-card-title>
                        <v-card-subtitle class="pa-2">完了時の期限切れタスク数 / 作成タスク数 * 100</v-card-subtitle>
                        <v-row class="mx-0">
                            <v-col>
                                <v-card>
                                    <v-card-subtitle>直近7日間に作成されたタスクの未完了率</v-card-subtitle>
                                </v-card>
                            </v-col>
                            <v-col>
                                <v-card>
                                    <v-card-subtitle>直近30日間に作成されたタスクの未完了率</v-card-subtitle>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">アクティブタスク数</v-card-title>
                        <div class="px-4 pb-4">
                            <v-card>
                                <v-card-title class="justify-center task-number">
                                    {{ params.all_tasks.length - params.is_completed_tasks.length }}
                                </v-card-title>
                            </v-card>
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">期限切れタスク数</v-card-title>
                        <div class="px-4 pb-4">
                            <v-card>
                                <v-card-title class="justify-center task-number">
                                    {{ params.is_expired_tasks.length }}
                                </v-card-title>
                            </v-card>
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">完了タスク数</v-card-title>
                        <div class="px-4 pb-4">
                            <v-card>
                                <v-card-title class="justify-center task-number">
                                    {{ params.is_completed_tasks.length }}
                                </v-card-title>
                            </v-card>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card class="px-4 pb-10">
                        <v-card-title class="pt-4 pb-0 px-0">期限が１週間以内のタスク</v-card-title>
                        <v-card
                            v-for="(item, index) in params.near_deadline_tasks"
                            :key="index"
                            class="mb-4 mt-2"
                            hover
                        >
                            <v-card-text>
                                {{ item.task_name }}
                            </v-card-text>
                        </v-card>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="px-4 pb-10">
                        <v-card-title class="pt-4 pb-0 px-0">期限超過のタスク</v-card-title>
                        <v-card
                             v-for="(item, index) in params.is_expired_tasks"
                            :key="index"
                            class="mb-4 mt-2"
                            hover
                        >
                            <v-card-text>
                                {{ convertDatetimeFromUnixtime(item.task_deadline, "yyyy/mm/dd") }} : {{ item.task_name }}
                            </v-card-text>
                        </v-card>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="px-4 pb-10">
                        <v-card-title class="pt-4 pb-0 px-0">本日期限のタスク</v-card-title>
                        <v-card
                            v-for="(item, index) in params.today_deadline_tasks"
                            :key="index"
                            class="mb-4 mt-2"
                            hover
                        >
                            <v-card-text>
                                {{ convertDatetimeFromUnixtime(item.task_deadline, "yyyy/mm/dd") }} : {{ item.task_name }}
                            </v-card-text>
                        </v-card>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="px-4 pb-10">
                        <v-card-title class="pt-4 pb-0 px-0">完了したタスク</v-card-title>
                        <v-card
                            v-for="(item, index) in params.is_completed_tasks"
                            :key="index"
                            class="mb-4 mt-2"
                            hover
                        >
                            <v-card-text>
                                {{ item.task_id }} : {{ item.task_name }}
                            </v-card-text>
                        </v-card>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import dashboardMixin from './dashbord.js'
import taskMixin from '@/mixin/api/task.js'
export default {
    components: {
        Header,
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
            this.params.all_tasks = await this.getAllDashboardTask()
            this.params.is_completed_tasks = this.getCompletedTasks()
            this.params.today_deadline_tasks = this.getExpiredTasksToday();
            this.params.is_expired_tasks = this.getExpiredTasks();
            this.params.near_deadline_tasks = this.getNearDeadlineTasksByOneWeek()
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
.dashbord .task-number.v-card__title {
    font-size: 32px;
}
</style>