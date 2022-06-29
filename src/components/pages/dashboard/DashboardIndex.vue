<template>
    <div class="body">
        <Header :parents="parents" />
        <div class="pa-4 dashbord">
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-actions class="pa-2">
                            <v-card-title class="pa-2">タスク完了率（週間・月間）</v-card-title>
                            <v-spacer></v-spacer>
                            <div>
                                <v-btn outlined class="ml-2">週間</v-btn>
                                <v-btn outlined class="ml-2">月間</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-actions class="pa-2">
                            <v-card-title class="pa-2">期限切れ率（週間・月間）</v-card-title>
                            <v-spacer></v-spacer>
                            <div>
                                <v-btn outlined class="ml-2">週間</v-btn>
                                <v-btn outlined class="ml-2">月間</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-actions class="pa-2">
                            <v-card-title class="pa-2">アクティブタスク数（週間、月間）</v-card-title>
                            <v-spacer></v-spacer>
                            <div>
                                <v-btn outlined class="ml-2">週間</v-btn>
                                <v-btn outlined class="ml-2">月間</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-actions class="pa-2">
                            <v-card-title class="pa-2">期限切れタスク数</v-card-title>
                            <v-spacer></v-spacer>
                            <div>
                                <v-btn outlined class="ml-2">週間</v-btn>
                                <v-btn outlined class="ml-2">月間</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-actions class="pa-2">
                            <v-card-title class="pa-2">完了タスク数</v-card-title>
                            <v-spacer></v-spacer>
                            <div>
                                <v-btn outlined class="ml-2">週間</v-btn>
                                <v-btn outlined class="ml-2">月間</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">期限が１週間のタスク</v-card-title>
                        <v-card-text
                            v-for="(item, index) in params.near_deadline_tasks"
                            :key="index"
                        >
                            {{ convertDatetimeFromUnixtime(item.task_deadline, "yyyy/mm/dd") }} : {{ item.task_name }}
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">期限超過のタスク（週間、月間）</v-card-title>
                        <v-card-text
                            v-for="(item, index) in params.is_expired_tasks"
                            :key="index"
                        >
                            {{ item.task_deadline }} : {{ item.task_name }}
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">本日期限のタスク（１週間以内）</v-card-title>
                        <v-card-text
                            v-for="(item, index) in params.today_deadline_tasks"
                            :key="index"
                        >
                            {{ item.task_id }} : {{ item.task_name }}
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">完了したタスク（週間、月間）</v-card-title>
                        <v-card-text
                            v-for="(item, index) in params.is_completed_tasks"
                            :key="index"
                        >
                            {{ item.task_id }} : {{ item.task_name }}
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import myMixin from './dashbord.js'
import taskMixin from '@/mixin/api/task.js'
export default {
    components: {
        Header,
    },
    mixins: [myMixin, taskMixin],
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

            task_status_list: []
        }
    }),
    created() {
        this.parents.user_info = this.storeGetAccountInfo()
        this.initTaskList()
        this.task_status_list = this.getTaskStatus();
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
</style>