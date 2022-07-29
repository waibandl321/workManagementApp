<template>
    <div>
        <MessageViewer
            :params="messages"
            class="mt-4"
        />
        <v-row>
            <v-col>
                <v-card class="dashboard-list-card" max-height="500">
                    <v-card-title class="dashboard-list-title">期限が7日以内のタスク</v-card-title>
                    <div 
                        v-if="params.near_deadline_tasks.length == 0"
                        class="pa-4"
                    >
                        期限が7日以内のタスクはありません。
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
                    <v-card-title class="dashboard-list-title">期限切れのタスク</v-card-title>
                    <div 
                        v-if="params.is_expired_tasks.length == 0"
                        class="pa-4"
                    >
                        期限切れのタスクはありません。
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
                                {{ toDatetime(item.task_deadline, "yyyy/mm/dd") }} : {{ item.task_name }}
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
                    <div
                        v-else
                        class="dashboard-list-wrap"
                    >
                        <v-card
                            v-for="item in params.today_deadline_tasks"
                            :key="item.task_id"
                            class="mb-4 mt-2"
                            hover
                            @click="clickTaskList(item)"
                        >
                            <v-card-text>
                                {{ toDatetime(item.task_deadline, "yyyy/mm/dd") }} : {{ item.task_name }}
                            </v-card-text>
                        </v-card>
                    </div>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="dashboard-list-card" max-height="500">
                    <v-card-title class="dashboard-list-title">完了タスク</v-card-title>
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
        <DashboardTaskDetail
            v-if="detail_mode"
            :detailMode="detail_mode"
            :detailItem="detail_item"
            v-on:close-detail-modal="closeDetailModal"
            :listRefresh="listRefresh"
        />
    </div>
</template>
<script>
import MessageViewer from '@/components/common/MessageViewer.vue'
// import dashboardMixin from '../dashbord.js'
import DashboardTaskDetail from '@/components/pages/task/TaskDetail.vue'
import taskGlobalMixin from '@/mixin/firebase/task.js'
import taskLocalMixin from '@/components/pages/task/task.js'
export default {
    components: {
        DashboardTaskDetail,
        MessageViewer
    },
    props: {
        params: Object,
        initTaskList: Function
    },
    mixins: [taskGlobalMixin, taskLocalMixin],
    data() {
        return {
            detail_mode: false,
            detail_item: {},
            messages: {
                success: "",
                error: "",
            }
        }
    },
    provide() {       
        const task_status_list = this.getTaskStatus()
        const task_priority_list = this.getTaskPriorities() 
        return {
            task_status_list,
            task_priority_list
        }
    },
    methods: {
        // ダッシュボード→タスク一詳細へ
        async clickTaskList(task) {
            this.messages.success = "";
            this.messages.error = "";
            try {
                const result = await this.firebaseGetTaskDetail(task.task_id);
                if(!result) throw new Error();
                this.detail_item = result;
                this.detail_mode = true;
            } catch (error) {
                console.log(error);
                this.messages.error = "データの読み込みに失敗しました。";
            }
        },
        closeDetailModal() {
            this.detail_mode = false;
            this.initTaskList();
        },
        listRefresh() {
            this.initTaskList();
        }
    }
}
</script>

<style scoped>
.dashboard-list-card {
    overflow-y: auto;
}
.dashboard-list-title {
    font-weight: bold;
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