<template>
    <div class="list_inner">
        <div class="list_head">
            <div class="d-flex mb-4">
                <v-spacer />
                <v-btn color="success" filled @click="reload()" ref="loadList">
                    <v-icon>mdi-reload</v-icon>
                    再読み込み
                </v-btn>
            </div>
            <h2>タスク</h2>
            <div class="filter">
                <v-row class="my-0">
                    <v-col cols="6" class="filter-box">
                        <v-select
                            label="ステータスで絞り込む"
                            :items="this.params.task_status_list"
                            item-text="text"
                            item-value="key"
                            outlined
                            color="primary"
                            dense
                            v-model="status"
                            @change="filterStatus()"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" class="filter-box">
                        <v-select
                            label="優先度で絞り込む"
                            :items="this.params.task_priorities"
                            item-text="text"
                            item-value="key"
                            outlined
                            color="primary"
                            dense
                            v-model="priority"
                            @change="filterPriority()"
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
            <v-alert
                dense
                outlined
                dismissible
                type="error"
                v-model="task_delete_alert"
            >
                タスクを削除しました。
            </v-alert>
            <div class="mt-2 relative" v-show="task_input">
                <v-text-field
                    label="タスク名を入力"
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
        </div>
        
        <div class="list_body">
            <table
                class="task-list mt-4"
            >
                <thead>
                    <tr>
                        <td class="drag-icon-td">
                            <v-icon>mdi-drag</v-icon>
                        </td>
                        <td>タスク名</td>
                        <td>優先度</td>
                        <td>ステータス</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody is="draggable" tag="tbody">
                    <tr
                        v-for="task in params.task_list"
                        :key="task.id"
                        @click.stop="record(task)"
                    >
                        <td class="drag-icon-td">
                            <v-icon>mdi-drag</v-icon>
                        </td>
                        <td class="py-2">{{ task.task_name }}</td>
                        <td class="py-2">{{ task.task_priority.text }}</td>
                        <td class="py-2">{{ task.task_status.text }}</td>
                        <td class="options-td">
                            <v-btn
                                text
                                @click.stop="del(task)"
                            >
                                <v-icon>mdi-trash-can-outline</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- タスク削除確認モーダル -->
        <v-row justify="center">
            <v-dialog
            v-model="task_delete"
            persistent
            max-width="600px"
            >
            <v-card>
                <v-card-title>
                <span class="text-h5">タスクを削除します</span>
                </v-card-title>
                <v-card-text>
                    本当によろしいですか？
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        outlined
                        depressed
                        class="pa-4"
                        @click="task_delete = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        depressed
                        class="pa-4"
                        color="red darken-4"
                        outlined
                        @click="execDelete()"
                        
                    >
                        削除する
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
    components: {
        draggable
    },
    props: {
        recordClick: Function,
        params: Object,
        refreshTaskList: Function,
        refreshTaskDetail: Function,
        deleteSubtaskHasTask: Function,
        filterListStatus: Function,
        filterListPriority: Function,
        deleteAllFile: Function,
    },
    data: () => ({
        task_input: false,
        // create
        new_task_name: "",
        loading: false,
        success: false,
        // delete
        delete_task: {},
        task_delete: false,
        task_delete_alert: false,
        // filter
        priority: null,
        status: null
    }),

    created() {
        this.init()
    },

    methods: {
        reload() {
            this.refreshTaskList()
            if(this.task_detail) {
                this.refreshTaskDetail()
            }
        },
        init() {
            this.refreshTaskList(this.delete_task ? this.delete_task : {})
        },
        // 絞り込み
        filterStatus() {
            const list = this.params.task_status_list
            let filter_key = Number
            list.forEach(r => {
                if(r.key == this.status) {
                    filter_key = r.key
                }   
            });
            this.filterListStatus(filter_key, this.priority)
        },
        filterPriority() {
            const list = this.params.task_status_list
            let filter_key = Number
            list.forEach(r => {
                if(r.key == this.priority) {
                    filter_key = r.key
                }   
            });
            this.filterListPriority(filter_key, this.status)
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
                this.init()
            }
        },
        // delete
        del(task) {
            this.task_delete = true
            this.delete_task = task
        },
        execDelete() {
            this.apiDeleteTask(this.delete_task)
            this.deleteSubtaskHasTask(this.delete_task)
            this.deleteAllFile(this.params.files)
            this.task_delete_alert = true
            this.task_delete = false
            this.init()
        }
    }
}
</script>

<style scoped src="./scoped.css"></style>