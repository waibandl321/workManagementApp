<template>
    <v-col>
        <v-card>
            <v-card-title class="pa-2">期限切れ率（週間・月間）</v-card-title>
            <v-card-subtitle class="pa-2">完了時の期限切れタスク数 / 作成タスク数 * 100</v-card-subtitle>
            <v-row class="mx-0">
                <v-col>
                    <v-card>
                        <v-card-subtitle>直近１週間に作成されたタスクの未完了率</v-card-subtitle>
                        <v-card-subtitle>{{ calcExpiredTasksRateByOneWeek() }} %</v-card-subtitle>
                        <div>
                            期限切れタスク: {{ getExpiredTasksRateByOneWeek().length }}
                            <div v-for="item in getExpiredTasksRateByOneWeek()" :key="item.task_id + 'eeee'" style="font-size: 10px;">
                                {{ item.task_id }} | {{ item.task_name }}
                            </div>
                            タスク数：{{ getDashboardTasksByCreatedOneWeek().length }}
                            <div v-for="item in getDashboardTasksByCreatedOneWeek()" :key="item.task_id + 'gggg'" style="font-size: 10px;">
                                {{ item.task_id }} | {{ item.task_name }}
                            </div>
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-subtitle>直近1ヶ月間に作成されたタスクの未完了率</v-card-subtitle>
                        <v-card-subtitle>{{ calcExpiredTasksRateByOneMonth() }} %</v-card-subtitle>
                        <div>
                            期限切れタスク: {{ getExpiredTasksRateByOneMonth().length }}
                            <div v-for="item in getExpiredTasksRateByOneMonth()" :key="item.task_id + 'ffff'" style="font-size: 10px;">
                                {{ item.task_id }} | {{ item.task_name }}
                            </div>
                            タスク数：{{ getDashboardTasksByCreatedOneMonth().length }}
                            <div v-for="item in getDashboardTasksByCreatedOneMonth()" :key="item.task_id + 'hhhh'" style="font-size: 10px;">
                                {{ item.task_id }} | {{ item.task_name }}
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-col>
</template>
<script>
import dashboardMixin from '../dashbord.js'
export default {
    props: ["params"],
    mixins: [dashboardMixin],
}
</script>