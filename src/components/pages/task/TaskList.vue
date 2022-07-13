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
            <div
                v-show="new_task"
                class="mt-2 relative"
            >
                <validation-observer v-slot="{ invalid }" ref="observer">
                    <validation-provider
                        name="新規タスク"
                        rules="required"
                        tag="div"
                        class="mt-6"
                    >
                        <v-text-field
                            label="タスク名を入力"
                            autofocus
                            hide-details
                            v-model="new_task_name"
                            @compositionstart="composing = true"
                            @compositionend="composing = false"
                            @keydown.prevent.enter.exact="createTask()"
                        ></v-text-field>
                    </validation-provider>
                    <v-btn
                        depressed
                        class="alt_submit px-4"
                        color="primary"
                        :disabled="invalid"
                        @click="createTask()"
                    >
                        新規作成
                    </v-btn>
                </validation-observer>
            </div>
        </div>
        
        <div class="list_body">
            <table
                class="basic-list mt-4"
                v-if="filter_items.length > 0"
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
                                @click="sortByCreated()"
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
            <div v-else class="mt-4">タスクが登録されていません。</div>
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

        // タスク作成
        async createTask() {
            if(!this.composing && this.new_task_name) {
                const task = this.generateTaskObject(this.new_task_name)
                try {
                    await this.apiTaskCreate(task)
                    this.params.success = "タスクを新規作成しました"
                } catch (error) {
                    this.params.error = "タスク作成に失敗しました。"
                    console.log(error);
                }
                this.listRefresh()
                this.new_task_name = ""
                this.composing = false
            }
        },
        generateTaskObject(new_task_name) {
            const id = this.createRandomId();
            return {
                task_id: id,
                project_id: "",
                task_name: new_task_name,
                task_description: "",
                task_message_content: "",
                task_message_post_account: "",
                task_status: 0,
                task_priority: 0,
                task_manager: "",
                task_deadline: null,
                create_account: this.storeGetFirebaseUid(),
                created: this.getCurrentUnixtime(),
                updated: "",
                finished_at: ""
            }
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