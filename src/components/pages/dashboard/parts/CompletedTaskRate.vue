<template>
    <v-col>
        <v-card>
            <v-card-title class="pa-2">タスク完了率（週間・月間）</v-card-title>
            <v-card-subtitle class="pa-2">完了タスク数 / 作成タスク数 * 100</v-card-subtitle>
            <v-row class="mx-0">
                <v-col>
                    <v-card>
                        <v-card-subtitle>直近１週間に作成されたタスクの完了率</v-card-subtitle>
                        {{ calcCompletedTaskRateBySevenDays() }} %
                        <div>
                            完了したタスク：{{ getDashboardCompletedTasksByOneWeek().length }}
                        </div>
                        <div v-for="item in getDashboardCompletedTasksByOneWeek()" :key="item.task_id + 'aaaa'" style="font-size: 10px;">
                            {{ convertDatetimeFromUnixtime(item.created, "yyyy/mm/dd") }} | {{ item.task_name }}
                        </div>
                        <v-divider></v-divider>
                        <div>
                            タスク数：{{ getDashboardTasksByCreatedOneWeek().length }}
                        </div>
                        <div v-for="item in getDashboardTasksByCreatedOneWeek()" :key="item.task_id + 'bbbb'" style="font-size: 10px;">
                            {{ convertDatetimeFromUnixtime(item.created, "yyyy/mm/dd") }} | {{ item.task_name }}
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-subtitle>直近1ヶ月間に作成されたタスクの完了率</v-card-subtitle>
                            {{ calcCompletedTaskRateByOneMonth() }} %
                        <div>
                            完了したタスク：{{ getDashboardCompletedTasksByOneMonth().length }}
                        </div>
                        <div style="font-size: 10px;" v-for="item in getDashboardCompletedTasksByOneMonth()" :key="item.task_id + 'cccc'">
                            {{ convertDatetimeFromUnixtime(item.created, "yyyy/mm/dd") }} | {{ item.task_name }}
                        </div>
                        <v-divider></v-divider>
                        <div>
                            タスク数：{{ getDashboardTasksByCreatedOneMonth().length }}
                        </div>
                        <div style="font-size: 10px;" v-for="item in getDashboardTasksByCreatedOneMonth()" :key="item.task_id + 'dddd'">
                            {{ convertDatetimeFromUnixtime(item.created, "yyyy/mm/dd") }} | {{ item.task_name }}
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