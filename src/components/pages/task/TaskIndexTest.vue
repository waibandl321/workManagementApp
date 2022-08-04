<template>
    <div class="body">
        <Header :params="params" />
        <div class="list">
            <MessageViewer :params="messages"/>
            <TaskList
                :listRefresh="listRefresh"
                v-on:set-task-detail="setTaskDetailItem"
                ref="taskList"
            />
        </div>
        <TaskDetail
            v-if="detail_mode"
            :detailMode="detail_mode"
            :detailItem="detail_item"
            v-on:close-detail-modal="closeDetailModal"
            :listRefresh="listRefresh"
        />
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import TaskDetail from "@/components/pages/task/TaskDetail"
import TaskList from "@/components/pages/task/TaskList"
import MessageViewer from '@/components/common/MessageViewer.vue'
import myMixin from "./task.js"

export default {
    components: {
        Header,
        TaskList,
        TaskDetail,
        MessageViewer
    },
    mixins: [myMixin],
    data: () => ({
        params: {
            user_info: {}
        },
        messages: {
            success: "",
            error: "",
        },
        detail_mode: false,
        detail_item: {},
    }),
    methods: {
        listRefresh() {
            this.$refs.taskList.initTaskListComponent()
        },
        async setTaskDetailItem(task){
            // MEMO: 一覧と詳細のデータは独立させる
            try {
                const result = await this.firebaseGetTaskDetail(task.task_id);
                if(!result) throw new Error();
                this.detail_item = result
                this.detail_mode = true;
            } catch (error) {
                console.log(error);
                this.messages.error = "データの読み込みに失敗しました。";
            }
        },
        closeDetailModal() {
            this.detail_mode = false;
        },
    }
}
</script>
<style scoped>
.list {
    box-sizing: border-box;
    padding: 24px 16px 10%;
}
.list {
    overflow: auto;
    width: 100%;
    height: calc(100vh - 70px);
}
</style>