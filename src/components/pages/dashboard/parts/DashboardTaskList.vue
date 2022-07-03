<template>
    <v-row>
        <v-col>
            <v-card class="dashboard-list-card" max-height="500">
                <v-card-title class="dashboard-list-title">期限が１週間以内のタスク</v-card-title>
                <div 
                    v-if="params.near_deadline_tasks.length == 0"
                    class="pa-4"
                >
                    期限が１週間以内のタスクはありません。
                </div>
                <div
                    v-else
                    class="dashboard-list-wrap"
                >
                    <v-card
                        v-for="item in params.near_deadline_tasks"
                        :key="item.task_id"
                        @click="clickTaskList(item)"
                        class="mb-4 mt-2"
                        hover
                    >
                        <v-card-text>
                            {{ item.task_name }}
                        </v-card-text>
                    </v-card>
                </div>
            </v-card>
        </v-col>
        <v-col>
            <v-card class="dashboard-list-card" max-height="500">
                <v-card-title class="dashboard-list-title">期限超過のタスク</v-card-title>
                <div 
                    v-if="params.is_expired_tasks.length == 0"
                    class="pa-4"
                >
                    期限超過のタスクはありません。
                </div>
                <div
                    v-else
                    class="dashboard-list-wrap"
                >
                    <v-card
                        v-for="item in params.is_expired_tasks"
                        :key="item.task_id"
                        @click="clickTaskList(item)"
                        class="mb-4 mt-2"
                        hover
                    >
                        <v-card-text>
                            {{ convertDatetimeFromUnixtime(item.task_deadline, "yyyy/mm/dd") }} : {{ item.task_name }}
                        </v-card-text>
                    </v-card>
                </div>
            </v-card>
        </v-col>
        <v-col>
            <v-card class="dashboard-list-card" max-height="500">
                <v-card-title class="dashboard-list-title">本日期限のタスク</v-card-title>
                <div 
                    v-if="params.today_deadline_tasks.length == 0"
                    class="pa-4"
                >
                    本日期限のタスクはありません。
                </div>
                <div class="dashboard-list-wrap">
                    <v-card
                        v-for="item in params.today_deadline_tasks"
                        :key="item.task_id"
                        class="mb-4 mt-2"
                        hover
                        @click="clickTaskList(item)"
                    >
                        <v-card-text>
                            {{ convertDatetimeFromUnixtime(item.task_deadline, "yyyy/mm/dd") }} : {{ item.task_name }}
                        </v-card-text>
                    </v-card>
                </div>
            </v-card>
        </v-col>
        <v-col>
            <v-card class="dashboard-list-card" max-height="500">
                <v-card-title class="dashboard-list-title">完了したタスク</v-card-title>
                <div 
                    v-if="params.is_completed_tasks.length == 0"
                    class="pa-4"
                >
                    データがありません。
                </div>
                <div
                    v-else
                    class="dashboard-list-wrap"
                >
                    <v-card
                        v-for="item in params.is_completed_tasks"
                        :key="item.task_id"
                        class="mb-4 mt-2"
                        hover
                        @click="clickTaskList(item)"
                    >
                        <v-card-text>
                            {{ item.task_id }} : {{ item.task_name }}
                        </v-card-text>
                    </v-card>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import dashboardMixin from '../dashbord.js'
export default {
    props: {
        params: Object,
        clickTaskList: Function
    },
    mixins: [dashboardMixin],
}
</script>

<style scoped>
.dashboard-list-card {
    overflow-y: auto;
}
.dashboard-list-title {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 2;
    border-bottom: 1px solid #ccc;
}
.dashboard-list-wrap {
    padding: 16px;
}
</style>