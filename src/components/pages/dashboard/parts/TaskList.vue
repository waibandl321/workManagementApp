<template>
    <v-row>
        <v-col>
            <v-card class="px-4 pb-10">
                <v-card-title class="pt-4 pb-0 px-0">期限が１週間以内のタスク</v-card-title>
                <v-card
                    v-for="item in params.near_deadline_tasks"
                    :key="item.task_id"
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
                        v-for="item in params.is_expired_tasks"
                    :key="item.task_id"
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
                    v-for="item in params.today_deadline_tasks"
                    :key="item.task_id"
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
                    v-for="item in params.is_completed_tasks"
                    :key="item.task_id"
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
</template>
<script>
import dashboardMixin from '../dashbord.js'
export default {
    props: ["params"],
    mixins: [dashboardMixin],
}
</script>