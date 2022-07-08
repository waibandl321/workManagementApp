<template>
    <div class="list_inner">
        <div class="list_head">
            <div class="filter">
                <v-row class="my-0">
                    <v-col class="filter-box">
                        <v-text-field
                            label="タスク名をテキスト検索"
                            outlined
                            dense
                            color="primary"
                            v-model.trim="filter_text"
                            @input="filterList()"
                        ></v-text-field>
                    </v-col>
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
                    @click="new_task = !new_task"
                >
                    <v-icon>mdi-plus</v-icon>
                    タスクを追加
                </v-btn>
            </div>
            <div class="mt-2 relative" v-show="new_task">
                <v-text-field
                    label="タスク名を入力"
                    v-model="new_task_name"
                    @compositionstart="composing = true"
                    @compositionend="composing = false"
                    @keydown.prevent.enter.exact="createTask()"
                >
                </v-text-field>
                <v-btn
                    depressed
                    class="alt_submit px-4"
                    color="primary"
                    @click="createTask()"
                >新規作成
                </v-btn>
            </div>
        </div>
        
        <div class="list_body">
            <table
                class="basic-list mt-4"
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
                        @click.stop="recordClick(task)"
                    >
                        <td class="drag-icon-td">
                            <v-icon>mdi-drag</v-icon>
                        </td>
                        <td class="py-2">{{ task.task_name }}</td>
                        <td class="py-2">{{ extractTaskStatus(task.task_status) }}</td>
                        <td class="py-2">{{ extractTaskPriority(task.task_priority) }}</td>
                        <td class="py-2">{{ convertDatetimeFromUnixtime(task.task_deadline, "yyyy-mm-dd") }}</td>
                        <td class="py-2">{{ convertTaskPeriod(task.created, task.task_deadline) }}</td>
                        <td class="py-2">{{ convertDatetimeFromUnixtime(task.created, "yyyy-mm-dd") }}</td>
                        <td class="options-td">
                            <v-btn
                                text
                                @click.stop="clickDelete(task)"
                                color="primary"
                            >
                                <v-icon>mdi-trash-can-outline</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 削除確認モーダル -->
        <ConfirmDelete
            v-if="delete_modal" 
            :delete_title="delete_title"
            :delete_options="delete_options"
        />
        <!-- ローディング -->
        <ExecLoading
            v-if="params.loading"
        />
    </div>
</template>

<script>
import ConfirmDelete from "@/components/common/ConfirmDelete.vue"
import ExecLoading from "@/components/common/ExecLoading.vue"
import draggable from 'vuedraggable'
import myMixin from "./task.js"

export default {
    components: {
        draggable,
        ExecLoading,
        ConfirmDelete
    },
    mixins: [myMixin],
    props: {
        listRefresh: Function,
        closeDetail: Function,
        params: Object,
    },
    data: () => ({
        // 作成
        new_task: false,
        new_task_name: "",
        composing: false,
        
        // 削除
        delete_options: [],
        delete_title: "",
        delete_modal: false,
        
        // 絞り込み
        filter_items: [],
        filter_text: "",
        filter_status: null,
        filter_priority: null,

        // ソート
        sort_by_deadline: false,
        sort_by_created: true,
    }),

    created() {
        this.initItems()
    },

    methods: {
        async initItems() {
            this.params.loading = true;
            try {
                this.params.items = await this.readTaskList()
                this.filterList();
            } catch (error) {
                this.params.error = "タスクデータの読み込みに失敗しました。"
            }
            this.params.loading = false;
        },
        // 一覧クリック
        async recordClick(task) {
            this.params.success = ""
            this.params.error = ""
            this.params.subtask_list = await this.getSubtaskList(task)
            this.params.viewer = task
            this.params.files = this.getFileList()
            this.params.detail_mode = true
        },
        // リストの絞り込み
        filterList() {
            let result = this.convertObject(this.params.items)
            if(this.filter_text) {
                result = result.filter(x => x[1].task_name.includes(this.filter_text))
            }
            if(this.filter_status) {
                result = result.filter(x => x[1].task_status === this.filter_status)
            }
            if(this.filter_priority) {
                result = result.filter(
                    x => x[1].task_priority === this.filter_priority
                )
            }
            result = this.convertArray(result);
            this.filter_items = result
        },
        sortByDeadline() {
            this.sort_by_deadline = !this.sort_by_deadline
            let result = this.convertObject(this.params.items)
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
            let result = this.convertObject(this.params.items)
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
        
        // 削除
        clickDelete(task) {
            this.delete_options.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeModal },
                { function_cd: "delete", text: "削除する",   callback: this.execDeleteTask }
            )
            this.delete_title = `タスク「${task.task_name}」を削除します。`;
            this.params.delete_item = task;
            this.delete_modal = true;
        },
        closeModal() {
            this.delete_modal = false
        },

    }
}
</script>
<style scoped src="../../../assets/css/original.css"></style>
<style scoped src="./scoped.css"></style>