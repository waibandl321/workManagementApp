<template>
    <div class="body">
        <Header :params="params" />
        <div class="list">
            <TaskList
                :params="params"
                :listRefresh="listRefresh"
                ref="taskList"
            />
        </div>
        <TaskDetail
            v-if="params.detail_mode"
            :params="params"
            :listRefresh="listRefresh"
        />
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import TaskDetail from "@/components/pages/task/TaskDetail"
import TaskList from "@/components/pages/task/TaskList"
import myMixin from "./task.js"

export default {
    components: {
        Header,
        TaskList,
        TaskDetail,
    },
    mixins: [myMixin],
    data: () => ({
        params: {
            viewer: {},
            detail_mode: false,
        },
    }),
    provide() {       
        const task_status_list = this.getTaskStatus()
        const task_priority_list = this.getTaskPriorities() 
        return {
            task_status_list,
            task_priority_list
        }
    },
    created() {
        this.setRoutetitle()
        this.params.user_info = this.storeGetAccountInfo()
        if(!this.params.user_info.first_name) {
            this.pageMove('/account/register')
        }
    },
    methods: {
        listRefresh() {
            this.$refs.taskList.initTaskListComponent()
        }
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