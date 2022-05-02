<template>
    <div class="list_inner">
        <div class="list_head">
            <div class="filter">
                <div>
                    <v-text-field
                        label="タスク名をテキスト検索"
                        outlined
                        dense
                        color="primary"
                        v-model.trim="filter_text"
                        @change="filterList()"
                    ></v-text-field>
                </div>
                <v-row class="my-0">
                    <v-col class="filter-box">
                        <v-select
                            label="ステータスで絞り込み"
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
                    <v-col class="filter-box">
                        <v-select
                            label="優先度で絞り込み"
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
                        <td>ステータス</td>
                        <td>優先度</td>
                        <td>
                            <v-btn
                                text
                                @click="sortByDeadline"
                            >
                                締切日
                                <v-icon small>
                                    {{ sort_by_deadline ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                                </v-icon>
                            </v-btn>
                        </td>
                        <td>タスク実施期間</td>
                        <td>
                            <v-btn
                                text
                                @click="sortByCreated"
                            >
                                作成日時
                                <v-icon small>
                                    {{ sort_by_created ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                                </v-icon>
                            </v-btn>
                        </td>
                        <td class="options-td"></td>
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
                        <td class="py-2">{{ extractTaskStatus(task.task_status.key) }}</td>
                        <td class="py-2">{{ extractTaskPriority(task.task_priority.key) }}</td>
                        <td class="py-2">{{ task.task_deadline }}</td>
                        <td class="py-2">実施期間が入ります</td>
                        <td class="py-2">{{ convertDatetimeFromUnixtime(task.created) }}</td>
                        <td class="options-td">
                            <v-btn
                                text
                                @click.stop="deleteConfirm(task)"
                                color="primary"
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
                v-model="task_delete_modal"
                persistent
                max-width="600px"
            >
                <ConfirmDelete
                    :closeModal="closeModal"
                    :item="delete_item"
                    :execDeleteTask="execDeleteTask"
                />
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import ConfirmDelete from "@/components/common/ConfirmDelete.vue"

import draggable from 'vuedraggable'
import myMixin from "./task.js"

export default {
    components: {
        draggable,
        ConfirmDelete
    },
    mixins: [myMixin],
    props: {
        recordClick: Function,
        listRefresh: Function,
        closeDetail: Function,
        params: Object,
    },
    data: () => ({
        task_input: false,
        task_list: [],
        
        // 作成
        create_task_name: "",
        loading: false,
        
        // 削除
        delete_item: {},
        task_delete_modal: false,
        
        // 絞り込み
        filter_items: [],
        filter_text: "",
        filter_status: null,
        filter_priority: null,
        sort_by_deadline: false,
        sort_by_created: true,
    }),

    created() {
        this.top_readTasklist()
    },

    watch: {
        // タスク一覧データ変更監視
        task_list: {
            handler: function() {
                this.filterList()
                this.sortByCreated()
            },
            deep : true,
            immediate: true
        }
    },

    methods: {
        // リストの初期読み込み
        async top_readTasklist() {
            this.task_list = await this.apiGetTaskList()
        },

        // リストの絞り込み
        filterList() {
            let result = this.convertObject(this.task_list)
            if(this.filter_text) {
                result = result.filter(x => x[1].task_name.includes(this.filter_text))
            }
            if(this.filter_status) {
                result = result.filter(x => x[1].task_status.key === this.filter_status)
            }
            if(this.filter_priority) {
                result = result.filter(
                    x => x[1].task_priority.key === this.filter_priority
                )
            }
            result = this.convertArray(result);
            this.filter_items = result
        },
        sortByDeadline() {
            this.sort_by_deadline = !this.sort_by_deadline
            let result = this.convertObject(this.task_list)
            if(this.sort_by_deadline) {
                result = result.sort((a, b) => {
                    return (a[1].task_deadline > b[1].task_deadline) ? 1 : -1;
                })
            } else {
                result = result.sort((a, b) => {
                    return (a[1].task_deadline < b[1].task_deadline) ? 1 : -1;
                })
            }
            result = this.convertArray(result);
            this.filter_items = result
        },
        sortByCreated() {
            this.sort_by_created = !this.sort_by_created
            let result = this.convertObject(this.task_list)
            if(this.sort_by_created) {
                result = result.sort((a, b) => {
                    return (a[1].created > b[1].created) ? 1 : -1;
                })
            } else {
                result = result.sort((a, b) => {
                    return (a[1].created < b[1].created) ? 1 : -1;
                })
            }
            result = this.convertArray(result);
            this.filter_items = result
        },
        listClick(task) {
            this.recordClick(task)
        },

        // 優先度・ステータス文字列変換
        extractTaskStatus(status_key) {
            let result = this.params.task_status_list
            result = result.filter(v => v.key === status_key)
            result = result[0].text
            return result
        },
        extractTaskPriority(priority_key) {
            let result = this.params.task_priorities
            result = result.filter(v => v.key === priority_key)
            result = result[0].text
            return result
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
            this.task_delete_modal = true
            this.delete_item = task
        },
        execDeleteTask() {
            this.apiDeleteTask(this.delete_item)
            this.deleteSubtaskHasTask(this.delete_item)
            this.deleteAllFile(this.params.files)
            this.task_delete_modal = false
            this.closeDetail()
            this.listRefresh("タスクを削除しました。")
        },
        closeModal() {
            this.task_delete_modal = false
        },

    }
}
</script>

<style scoped src="./scoped.css"></style>