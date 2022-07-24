<template>
    <div>
        <v-row>
            <v-col>
                <v-text-field
                    label="タスク名で検索"
                    outlined
                    dense
                    color="primary"
                    hide-details
                    v-model.trim="filter_text"
                    @input="filterList()"
                    data-test-id="filterText"
                ></v-text-field>
            </v-col>
            <v-col data-test-id="filterStatus">
                <v-select
                    label="ステータスで絞り込み"
                    :items="params.task_status_list"
                    item-text="text"
                    item-value="key"
                    outlined
                    hide-details
                    color="primary"
                    dense
                    v-model="filter_status"
                    @change="filterList()"
                ></v-select>
            </v-col>
            <v-col data-test-id="filterPriority">
                <v-select
                    label="優先度で絞り込み"
                    :items="params.task_priorities"
                    item-text="text"
                    item-value="key"
                    outlined
                    hide-details
                    color="primary"
                    dense
                    v-model="filter_priority"
                    @change="filterList()"
                ></v-select>
            </v-col>
        </v-row>
        
        <!-- add task -->
        <div class="mt-4" data-test-id="taskAddButtonWrap">
            <v-btn
                color="primary"
                text
                @click="clickTaskInput()"
                data-test-id="taskAddButton"
            >
                <v-icon>{{ new_task ? 'mdi-close' : 'mdi-plus' }}</v-icon>
                <span>タスク追加</span>
            </v-btn>
        </div>
        <div
            v-if="new_task"
            class="mt-2 relative"
            data-test-id="taskAddInputWrap"
        >
            <validation-observer v-slot="{ invalid }" ref="observer">
                <validation-provider
                    name="タスク名"
                    rules="required"
                    class="mt-6"
                    v-slot="{ errors }"
                >
                    <div class="relative">
                        <v-text-field
                            placeholder="タスク名を入力してください"
                            autofocus
                            hide-details
                            outlined
                            v-model.trim="new_task_name"
                            data-test-id="taskAddInput"
                        ></v-text-field>
                        <v-btn
                            depressed
                            class="alt_submit px-4"
                            color="primary"
                            :disabled="invalid"
                            data-test-id="taskAddSubmit"
                            @click="execCreateTask()"
                        >
                            新規作成
                        </v-btn>
                    </div>
                    <div
                        v-if="errors.length > 0"
                        class="input-error-message mb-2"
                    >
                        {{ errors[0] }}
                    </div>
                </validation-provider>
            </validation-observer>
        </div>
        
        <div class="list_body">
            <table class="basic-list mt-4" data-test-id="taskList">
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
                                data-test-id="taskSortPriority"
                                @click="sortByDeadline"
                                class="px-1"
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
                                data-test-id="taskSortCreated"
                                @click="sortByCreated()"
                                class="px-1"
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
                        data-test-id="taskListRecord"
                    >
                        <td class="drag-icon-td">
                            <v-icon>mdi-drag</v-icon>
                        </td>
                        <td class="py-2" data-test-id="tdTaskName">
                            {{ task.task_name }}
                        </td>
                        <td class="py-2" data-test-id="tdStatus">
                            {{ extractTaskStatus(task.task_status) }}
                        </td>
                        <td class="py-2" data-test-id="tdPriority">
                            {{ extractTaskPriority(task.task_priority) }}
                        </td>
                        <td class="py-2" data-test-id="tdDeadline">
                            {{ convertDatetimeFromUnixtime(task.task_deadline, "yyyy-mm-dd") }}
                        </td>
                        <td class="py-2" data-test-id="tdTerm">
                            {{ convertTaskPeriod(task.created, task.task_deadline) }}
                        </td>
                        <td class="py-2" data-test-id="tdCreated">
                            {{ convertDatetimeFromUnixtime(task.created, "yyyy-mm-dd") }}
                        </td>
                        <td class="options-td">
                            <v-btn
                                text
                                @click.stop="clickDelete(task)"
                                color="primary"
                                data-test-id="taskListDeleteButton"
                            >
                                <v-icon>mdi-trash-can-outline</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div
                v-if="!params.loading && filter_items.length === 0"
                class="pa-4 text-center"
                data-test-id="noItem"
            >
                <span style="font-size: 18px;">アイテムがありません</span>
            </div>
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
        params: Object,
    },
    data: () => ({
        // 作成
        new_task: false,
        new_task_name: "",
        
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
        this.initTaskListComponent()
    },

    methods: {
        async initTaskListComponent() {
            this.params.loading = true;
            try {
                let result = await this.readTaskList()
                if(result.length === 0) {
                    this.params.items = []
                    this.params.loading = false;
                    this.filterList();
                    return;
                }
                result = result.filter(v => v.task_status !== 5)
                this.params.items = result
                this.filterList();
            } catch (error) {
                this.params.error = "タスクデータの読み込みに失敗しました。"
            }
            this.params.loading = false;
        },
        // リストの絞り込み
        async filterList() {
            let result = this.params.items
            if(this.filter_status) {
                // 完了の場合は全タスク取得してからフィルタ
                if(this.filter_status === 5) {
                    result = await this.readTaskList()
                    result = result.filter(v => v.task_status === 5)
                } else {
                    result = result.filter(v => v.task_status === this.filter_status)
                }
            }
            if(this.filter_priority) {
                result = result.filter(v => v.task_priority === this.filter_priority)
            }
            if(this.filter_text) {
                result = result.filter(v => v.task_name.includes(this.filter_text))
            }
            this.filter_items = result
        },
        // ソート
        sortByDeadline() {
            this.sort_by_deadline = !this.sort_by_deadline
            let result = this.params.items
            if(this.sort_by_deadline) {
                result.sort((a, b) => {
                    if(!a.task_deadline) return 1
                    if(!b.task_deadline) return -1
                    return a.task_deadline - b.task_deadline;
                })
            } else {
                result.sort((a, b) => {
                    if(!a.task_deadline) return 1
                    if(!b.task_deadline) return -1
                    return b.task_deadline - a.task_deadline
                })
            }
            this.filter_items = result
        },
        sortByCreated() {
            this.sort_by_created = !this.sort_by_created
            let result = this.params.items
            if(this.sort_by_created) {
                result.sort((a, b) => {
                    return (a.created - b.created)
                })
            } else {
                result.sort((a, b) => {
                    return (b.created - a.created)
                })
            }
            this.filter_items = result
        },
        // 一覧クリック
        async recordClick(task) {
            this.params.success = ""
            this.params.error = "";
            this.params.viewer = task
            try {
                this.params.subtask_list = await this.getSubtaskList(task)
                this.params.files = await this.getFileList();
                this.params.detail_mode = true
            } catch (error) {
                this.params.error = `
                データの読み込みに失敗しました。ブラウザを再読み込みしていただくか、
                しばらく時間を置いてから操作してください。`;
                this.params.viewer = {}
            }
        },
        // タスク作成
        clickTaskInput() {
            this.new_task = !this.new_task
            this.new_task_name = "";
        },
        
        // 削除
        clickDelete(task) {
            this.params.success = ""
            this.params.error = ""
            this.delete_options.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeModal },
                { function_cd: "delete", text: "削除する",   callback: this.execDeleteTaskFromList }
            )
            this.delete_title = `タスク「${task.task_name}」を削除します。`;
            this.params.delete_item = task;
            this.delete_modal = true;
        },
        closeModal() {
            this.params.delete_item = {}
            this.delete_options = []
            this.delete_modal = false
        },

    }
}
</script>
<style scoped>
.basic-list {
    border-collapse: collapse;
    table-layout: unset;
    width: 100%;
}
.basic-list thead {
    background-color: #eee;
}
.basic-list tbody tr {
    border-bottom: 1px solid #ccc;
}
.basic-list tbody tr:hover {
    cursor: pointer;
    background-color: #f6f6f6;
}
.basic-list td {
    font-size: 14px;
    padding: 4px;
}
.options-td {
    text-align: right;
}
.drag-icon-td {
    width: 32px;
}
.relative {
    position: relative;
}
.alt_submit {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
}
.input-error-message {
    font-size: 14px;
    color: #ff5252;
    margin-top: 4px;
}
</style>