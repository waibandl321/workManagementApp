<template>
    <div class="list_inner">
        <h2>タスク</h2>
        <div class="filter">
            <v-row class="ma-0">
                <v-col cols="6" class="filter-box">
                    <v-select
                        :items="params.sort_status_options"
                        v-model="params.status"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
                    ></v-select>
                </v-col>
                <v-col cols="6" class="filter-box">
                    <v-select
                        :items="params.sort_date_options"
                        v-model="params.default_sort_item"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <!-- add task -->
        <div class="task-add">
            <v-btn
                color="primary"
                text
                @click="task_input = !task_input"
            >
                <v-icon>mdi-plus</v-icon>
                タスクを追加
            </v-btn>
        </div>
        <v-alert
            v-model="success"
            close-text="Close Alert"
            color="success"
            text
            dense
            dismissible
        >
            タスクを新規作成しました！
        </v-alert>
        <div class="mt-2 relative" v-show="task_input">
            <v-text-field
                label="タスク名を入力"
                outlined
                dense
                v-model="new_task_name"
            >
            </v-text-field>
            <v-btn
                depressed
                class="primary alt_submit"
                text
                @click="createTask()"
            >新規作成
            </v-btn>
        </div>
        <div v-if="loading">
            <v-progress-linear
                indeterminate
                color="primary"
            ></v-progress-linear>
        </div>
        <table class="task-list mt-4">
            <tbody>
            <tr
                v-for="task in task_data"
                :key="task.id"
                @click="record(task)"
            >
                <td class="py-2">
                    <v-avatar
                        color="teal"
                        size="32"
                    >
                        <span class="white--text">大純</span>
                    </v-avatar>
                </td>
                <td class="py-2">{{ task.task_name }}</td>
                <td class="py-2">{{ task.task_status.value }}</td>
                <td>
                    <v-btn
                        text
                        @click="del(task)"
                    >
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        recordClick: Function,
        params: Object
    },
    data: () => ({
        task_data: [],
        task_input: false,
        // create
        new_task_name: "",
        loading: false,
        success: false
    }),

    created() {
        this.init()
    },

    methods: {
        init() {
            console.log(this.params);
            this.task_data = this.params.tasks
        },

        record(task) {
            this.recordClick(task)
        },
        
        createTask() {
            this.loading = true
            const create = this.apiTaskCreate(this.new_task_name)
            if(create) {
                this.loading = false
                this.success = true
                this.new_task_name = ""
                this.refresh()
            }
        },

        refresh() {
            this.task_data = this.apiGetTaskList()
        },

        del(task) {
            this.apiDeleteTask(task)
            this.refresh()
        }
    }
}
</script>

<style scoped>
.list_inner >>> .v-text-field__details {
    display: none;
}
.filter-box {
    max-width: 300px;
}
select {
    border: 1px solid #ccc;
    height: 40px;
}
select:focus {
    outline: none;
}
.task-list {
    border-collapse: collapse;
    table-layout: unset;
    width: 100%;
}
.task-list tr {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
}
.task-list tr:hover {
    cursor: pointer;
    background-color: #f6f6f6;
}
.relative {
    position: relative;
}
.alt_submit {
    position: absolute;
    right: 8px;
    z-index: 2;
    top: 35%;
    transform: translateY(-35%);
}

</style>