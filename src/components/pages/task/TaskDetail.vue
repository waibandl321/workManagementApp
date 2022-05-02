<template>
    <div class="detail_inner">
        <div class="d-flex align-center">
            <div
                class="text-h5 font-weight-bold taskname"
            >
                <div v-if="tasknameEdit" class="taskname_edit">
                    <v-text-field
                        v-model="viewer.task_name"
                    >
                    </v-text-field>
                    <v-btn
                        color="primary"
                        @click="tasknameUpdate()"
                        class="taskname_edit_save px-2"
                    >
                        保存
                    </v-btn>
                </div>
                <div v-else>
                <v-btn
                    text
                    color="primary"
                    @click="tasknameEdit = true"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                {{ viewer.task_name ? viewer.task_name : '' }}
                </div>
            </div>
            <v-spacer></v-spacer>
            <div>
                <v-btn
                    text
                    @click="task_delete_confirm = true"
                >
                    <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
                <v-btn
                    text
                    @click="close()"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
        </div>
        <v-divider />
            <div class="d-flex align-center py-4">
                <!-- status -->
                <v-row>
                <v-col cols="4">
                    <v-select
                        label="ステータス"
                        :items="params.task_status_list"
                        item-text="text"
                        item-value="key"
                        outlined
                        color="primary"
                        dense
                        v-model="status"
                        @change="settingTaskStatus()"
                    ></v-select>
                </v-col>
                <!-- 優先度 -->
                <v-col cols="4">
                    <v-select
                        label="優先度"
                        :items="params.task_priorities"
                        item-text="text"
                        item-value="key"
                        v-model="priority"
                        outlined
                        color="primary"
                        dense
                        @change="settingTaskPriority()"
                    ></v-select>
                </v-col>
                <!-- 期日 -->
                <v-col cols="4" class="relative">
                    <v-btn
                        @click="term = !term" 
                        color="primary"
                        text
                    >
                        <v-icon class="mr-2">mdi-calendar-check-outline</v-icon>
                        {{ viewer.task_start_date }} ~ {{ viewer.task_end_date }}
                    </v-btn>
                    <!-- date picker -->
                    <div class="date_picker" v-if="term">
                        <v-text-field
                            v-model="dateRangeText"
                            label="期間を選択"
                            prepend-icon="mdi-calendar"
                            readonly
                        ></v-text-field>
                        <div>
                            <v-date-picker
                                v-model="term_dates"
                                no-title
                                range
                                color="primary"
                            ></v-date-picker>
                        </div>
                        <v-divider />
                        <div class="mt-2">
                            <v-btn
                                text
                                color="primary"
                                @click="taskTermSetting()"
                            >保存</v-btn>
                            <v-btn
                                text
                                @click="term_dates = [], term = false"
                            >キャンセル</v-btn>
                            <v-btn
                                text
                                color="red"
                                @click="deleteTaskTerm()"
                            >日付を消去</v-btn>
                        </div>
                    </div>
                </v-col>
                </v-row>
                <v-spacer />
            </div>
        <v-divider />
        <div class="subtask_list" v-if="params.subtask_list">
            <v-card-actions class="px-0">
                <p class="font-weight-bold my-0">■ サブタスク</p>
                <v-spacer />
                    <v-btn
                    text
                    color="primary"
                    @click="subtask_input = !subtask_input"
                >
                    <v-icon >mdi-plus</v-icon>
                    サブタスクを追加
                </v-btn>
            </v-card-actions>
            <v-divider />
            <table class="task-list subtask-list">
                <tbody>
                <tr
                    v-for="subtask in params.subtask_list"
                    :key="subtask.id"
                >
                    <td class="py-2">{{ subtask.subtask_name ? subtask.subtask_name : '' }}</td>
                    <td class="py-2">{{ subtask.subtask_status.value ? subtask.subtask_status.value : '' }}</td>
                    <td class="options-td">
                        <v-btn
                            text
                            @click.stop="deleteSubtask(subtask)"
                        >
                            <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                    </td>
                </tr>
                </tbody>
            </table>
            <v-alert
                v-model="success"
                close-text="Close Alert"
                color="success"
                class="mt-2"
                text
                dense
                dismissible
            >
                サブタスクを新規作成しました！
            </v-alert>
            <v-alert
                dense
                outlined
                class="mt-2"
                dismissible
                type="error"
                v-model="subtask_delete_alert"
            >
                サブタスクを削除しました。
            </v-alert>
            <!-- subtask area -->
            <div class="task-add-form mt-2" v-if="subtask_input">
                <div class="relative">
                    <v-text-field
                        label="サブタスク名を入力"
                        v-model="subtask_name"
                    >
                    </v-text-field>
                    <v-btn
                        depressed
                        class="primary alt_submit px-4"
                        text
                        @click="createSubtask(viewer)"
                    >新規作成
                    </v-btn>
                </div>
            </div>
        </div>
        <!-- task detail -->
        <div class="py-6">
            <v-card-actions class="px-0">
                <div class="font-weight-bold">■ タスク詳細</div>
                <v-spacer />
                <div v-if="!desc_edit">
                    <v-btn
                        color="primary"
                        text
                        @click="desc_edit = true"
                        class="px-4"
                    >
                    <v-icon class="mr-2">mdi-pencil-outline</v-icon>詳細を編集
                    </v-btn>
                </div>
                <div v-else>
                    <v-btn
                        color="primary"
                        @click="updateTaskDescription()"
                        class="px-4"
                    >
                    <v-icon class="mr-2">mdi-content-save-outline</v-icon>編集を保存
                    </v-btn>
                </div>
            </v-card-actions>
            <v-divider />
            <div v-if="desc_edit">
                <Editor
                    ref="editor"
                    :api-key="edidor_settings.apikey"
                    :init="edidor_settings.init"
                    v-model.trim="viewer.task_description"
                />
            </div>
            <div class="editor_body" v-else>
                <div v-if="viewer.task_description">
                    <div v-html="viewer.task_description"></div>
                </div>
                <div v-else>
                    タスクの詳細がありません
                </div>
            </div>
        </div>
        
        <!-- file list -->
        <div class="mt-6">
            <v-card-actions class="relative px-0">
                <p class="font-weight-bold mb-0">■ 添付ファイル</p>
                <v-spacer />
                <input
                    style="display: none"
                    ref="file"
                    type="file"
                    @change="onFileChange"
                >
                <v-btn
                    text
                    color="primary"
                    @click="$refs.file.click()"
                >
                    <v-icon>mdi-paperclip</v-icon>ファイルを添付する
                </v-btn>
            </v-card-actions>
            <v-divider />
            <div>
                <v-alert
                    v-model="file_upload_done"
                    close-text="Close Alert"
                    color="success"
                    text
                    dense
                    dismissible
                >
                    ファイルをアップロードしました。
                </v-alert>
                <v-alert
                    dense
                    outlined
                    dismissible
                    type="error"
                    v-model="file_delete_done"
                >
                    ファイルを削除しました。
                </v-alert>
            </div>
            
            <div class="pt-4">
                <div v-if="!params.files.length > 0">添付ファイルはありません。</div>
                <div class="d-flex align-center" v-else>
                    <div>{{ params.files.length }} Files</div>
                    <v-spacer />
                    <v-btn
                        text
                        color="error"
                        @click="delete_all_file_modal = true"
                    >
                        <v-icon>mdi-trash-can-outline</v-icon>
                        全ファイル削除
                    </v-btn>
                </div>
            </div>
            
            <div v-if="file_loading" class="text-center py-6">
                <v-progress-circular
                    :size="50"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </div>
            <table class="file-table" v-else>
                <tr v-for="(file, i) in params.files" :key="i">
                    <td>
                        <img :src="file.download_url" width="40">
                    </td>
                    <td>{{ file.name }}</td>
                    <td>{{ file.size }}</td>
                    <td>{{ file.contentType }}</td>
                    <td class="operation-td">
                        <v-btn
                            link
                            text
                            :href="file.download_url"
                            target="_blank" rel="noopener noreferrer"
                            >
                                <v-icon>mdi-open-in-new</v-icon>
                        </v-btn>
                        <v-btn
                            @click="deleteFileSelected(file)"
                            text
                            class="ml-2"
                        >
                            <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </table>
        </div>
        
        
        <!-- ファイル削除 -->
         <v-row justify="center">
            <v-dialog
            v-model="delete_file_modal"
            persistent
            max-width="600px"
            >
            <v-card>
                <v-card-title>
                <span class="text-h5">選択肢したファイルを削除します</span>
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
                        @click="delete_file_modal = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        depressed
                        class="pa-4"
                        color="red darken-4"
                        outlined
                        @click="execDeleteFile(file)"
                        
                    >
                        削除する
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-row>
        <!-- 全てのファイルを削除確認 -->
         <v-row justify="center">
            <v-dialog
            v-model="delete_all_file_modal"
            persistent
            max-width="600px"
            >
            <v-card>
                <v-card-title>
                <span class="text-h5">このタスクにアップされている全てのファイルを削除します</span>
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
                        @click="delete_all_file_modal = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        depressed
                        class="pa-4"
                        color="red darken-4"
                        outlined
                        @click="execDeleteAllFile(params.files)"
                    >
                        削除する
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-row>

        <!-- delete task confirm -->
        <v-row justify="center">
            <v-dialog
            v-model="task_delete_confirm"
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
                        @click="task_delete_confirm = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        depressed
                        class="pa-4"
                        color="red darken-4"
                        outlined
                        @click="execDeleteTask(viewer)"
                        
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
// エディタ
import Editor from "@tinymce/tinymce-vue"
import tinymceSettings from "@/config/settings/tinymce.js"
import myMixin from "./task.js"

export default {
    props: {
        closeDetail: Function,
        params: Object,
        viewer: Object,
    },
    mixins: [myMixin],
    components: {
        Editor
    },
    data: () => ({
        // layout
        status: null,

        // タスク名
        tasknameEdit: false,

        // タスク詳細テキスト
        desc_edit: false,
        edidor_settings: tinymceSettings.edidor_settings,

        //タスク優先度
        priority: null,

        //添付ファイル
        delete_file_modal: false,
        delete_all_file_modal: false,
        file_loading: false,
        file_upload_done: false,
        file_delete_done: false,
        delete_file: {},

        //サブタスク
        subtask_input: false,
        subtask_name: "",
        subtask_delete_alert: false,
        loading: false,
        success: false,
        
        // タスク期日
        term: false,
        term_dates: [],

        // タスク削除確認
        task_delete_confirm: false,
    }),
   
    created(){
        this.setTaskStatus()
        this.setTaskPriority()
    },
   
    updated() {
        this.setTaskStatus()
        this.setTaskPriority()
    },
    computed: {
        dateRangeText() {
            return this.viewer.task_start_date + " 〜 " + this.viewer.task_end_date
        },
    },
    methods: {
        // ファイルアップロード
        onFileChange(e) {
            this.file_loading = true
            this.file_select = false
            const files = e.target.files || e.dataTransfer.files
            if(files.length > 0) {
                this.apiUploadFile(files[0], this.viewer.task_id, "task")
            }
        },
        // ファイル削除
        deleteFileSelected(file_data) {
            this.delete_file_modal = true
            this.delete_file = file_data
        },
        execDeleteFile() {
            this.file_loading = true
            this.apiDeleteFileStorage(this.delete_file)
        },
        execDeleteAllFile(files) {
            this.delete_all_file_modal = false
            this.file_loading = true
            this.deleteAllFile(files)
        },
        // タスク名更新
        tasknameUpdate() {
            this.apiUpdateTaskname(this.viewer.task_id, this.viewer.task_name)
            this.tasknameEdit = false
            this.refreshTaskDetail()
            this.readTasklist()
        },
        // 概要
        updateTaskDescription() {
            this.apiUpdateTaskDescription(this.viewer.task_id, this.viewer.task_description);
            this.desc_edit = false
            this.refreshTaskDetail()

        },
        // 優先度
        setTaskPriority() {
            let task_priority = this.viewer.task_priority
            const list = this.params.task_priorities
            list.forEach(r => {
                r.key == task_priority.key ? this.priority = r : null
            })
        },
        //タスク優先度更新
        settingTaskPriority() {
            const list = this.params.task_priorities
            let priority = ""
            list.forEach(r => {
                if(this.priority == r.key) {
                   priority = r
                }
            })
            this.apiSettingTaskPriority(this.viewer.task_id, priority)
            this.refreshTaskDetail()
            this.readTasklist()
        },
        //タスクステータスセット
        setTaskStatus() {
            let task_status = this.viewer.task_status
            const list = this.params.task_status_list
            list.forEach(r => {
                r.key == task_status.key ? this.status = r : null
            })
        },
        //タスクステータス更新
        settingTaskStatus() {
            const status_list  = this.params.task_status_list
            let status = ""
            status_list.forEach(r => {
                if(this.status == r.key) {
                   status = r
                }
            })
            this.apiSettingTaskStatus(this.viewer.task_id, status)
            this.refreshTaskDetail()
            this.readTasklist()
        },

        // サブタスク
        createSubtask(task) {
            const create = this.apiSubtaskCreate(this.subtask_name, task.task_id)
            if(create) {
                this.success = true
                this.subtask_name = ""
            }
            this.initSubtaskList(task)
        },
        deleteSubtask(subtask) {
            this.apiDeleteSubtask(subtask)
            this.subtask_delete_alert = true
            this.initSubtaskList(this.viewer)
        },
        subtaskRecordClick(subtask) {
            console.log(subtask)
        },
        
        // タスク期間設定
        taskTermSetting() {
            this.term = false
            this.term_dates.sort(function(a, b){
                return (a > b ? 1 : -1);
            })
            this.apiSettingTaskTerm(this.term_dates, this.viewer.task_id)
            this.refreshTaskDetail()
            this.readTasklist()
        },
        deleteTaskTerm() {
            this.term_dates = [],
            this.term = false
            this.apiDeleteTaskTerm(this.viewer.task_id)
            this.refreshTaskDetail()
            this.readTasklist()
        },
        
        // タスク削除
        execDeleteTask(delete_item) {
            let from_detail = true
            this.apiDeleteTask(delete_item)
            this.deleteSubtaskHasTask(delete_item)
            this.execDeleteAllFile(this.params.files)
            this.task_delete_confirm = false
            this.readTasklist(null, from_detail)
        },
        // 詳細画面閉じる
        close() {
            this.closeDetail()
        },
    }
}
</script>

<style scoped src="./scoped.css"></style>
