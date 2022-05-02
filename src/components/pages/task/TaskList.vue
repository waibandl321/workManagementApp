<template>
    <div class="list_inner">
        <div class="list_head">
            <div class="filter">
                <v-row class="my-0">
                    <v-col cols="6" class="filter-box">
                        <v-select
                            label="ステータスで絞り込む"
                            :items="params.task_status_list"
                            item-text="text"
                            item-value="key"
                            outlined
                            color="primary"
                            dense
                            v-model="filter_status"
                            @change="filterList()"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" class="filter-box">
                        <v-select
                            label="優先度で絞り込む"
                            :items="params.task_priorities"
                            item-text="text"
                            item-value="key"
                            outlined
                            color="primary"
                            dense
                            v-model="filter_priority"
                            @change="filterList()"
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
                    v-model="create_task_name"
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
                        v-for="(task, i) in filter_items"
                        :key="i"
                        @click.stop="listClick(task)"
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
                                @click.stop="deleteConfirm(task)"
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
            v-model="deleteModal"
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
                        @click="deleteModal = false"
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
import myMixin from "./task.js"

export default {
    components: {
        draggable
    },
    mixins: [myMixin],
    props: {
        recordClick: Function,
        listRefresh: Function,
        params: Object,
    },
    data: () => ({
        task_input: false,
        task_list: [],
        // create
        create_task_name: "",
        loading: false,
        // delete
        delete_task: {},
        deleteModal: false,
        // filter
        filter_items: [],
        filter_status: null,
        filter_priority: null
    }),

    created() {
        this.top_readTasklist()
    },
    watch: {
        // タスク一覧データ変更監視
        task_list: {
            handler: function(nObj, oObj) {
                console.log(nObj, oObj)
                this.filterList()
            },
            deep : true,
            immediate: true
        }
    },

    methods: {
        // リストの初期読み込み
        async top_readTasklist() {
            this.task_list = await this.readTasklist()
        },

        // リストの絞り込み
        filterList() {
            let result = Object.entries(this.task_list)
            if(this.filter_status) {
                result = result.filter(x => x[1].task_status.key === this.filter_status)
            }
            if(this.filter_priority) {
                result = result.filter(
                    x => x[1].task_priority.key === this.filter_priority
                )
            }
            result = Object.fromEntries(result);
            this.filter_items = result
        },
        listClick(task) {
            this.recordClick(task)
        },
        // タスク作成
        createTask() {
            if(this.apiTaskCreate(this.create_task_name)) {
                this.create_task_name = ""
                this.listRefresh("タスクを新規作成しました")
            }
        },
        // タスク削除
        deleteConfirm(task) {
            this.deleteModal = true
            this.delete_task = task
        },
        execDelete() {
            this.apiDeleteTask(this.delete_task)
            this.deleteSubtaskHasTask(this.delete_task)
            this.deleteAllFile(this.params.files)
            this.deleteModal = false
            this.listRefresh("タスクを削除しました。")
        }
    }
}
</script>

<style scoped src="./scoped.css"></style>