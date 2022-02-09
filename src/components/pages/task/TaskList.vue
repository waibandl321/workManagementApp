<template>
    <div class="list_inner">
        <h2>タスク</h2>
        <div class="filter">
            <v-row class="ma-0">
                <v-col cols="6">
                    <v-select
                        :items="params.status_filter_items"
                        v-model="params.status"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
                    ></v-select>
                </v-col>
                <v-col cols="6">
                    <v-select
                        :items="params.date_filter_items"
                        v-model="params.date_filter"
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
        <div class="mt-2 relative" v-show="task_input">
            <v-text-field
                    label="タスク名を入力"
                    outlined
                    dense
                >
                </v-text-field>
            <v-btn
                depressed
                class="primary alt_submit"
                text
            >新規作成
            </v-btn>
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
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        tasks: Array,
        recordClick: Function,
        params: Object
    },
    data: () => ({
        task_data: [],
        task_input: false,
    }),
    created() {
        this.task_data = this.params.tasks
    },
    methods: {
        record(task) {
            this.recordClick(task)
        }
    }
}
</script>

<style scoped>
.list_inner >>> .v-text-field__details {
    display: none;
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