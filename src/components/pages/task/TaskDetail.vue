<template>
    <div class="detail_inner">
        <v-alert
            v-model="success"
            close-text="Close Alert"
            color="success"
            text
            dense
            dismissible
        >
            サブタスクを新規作成しました！
        </v-alert>
        <v-alert
            dense
            outlined
            dismissible
            type="error"
            v-model="subtask_delete_alert"
        >
            サブタスクを削除しました。
        </v-alert>
        <div class="d-flex align-center">
            <h2>{{ taskDetail.task_name }}</h2>            
            <v-spacer />
            <div class="relative">
                <div>
                    <v-btn
                        text
                        class="ma-2"
                        @click="del()"
                    >
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                </div>
            </div>
            <div class="relative">
                <v-btn
                    class="ma-2"
                    text
                    @click="close()"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
        </div>
        <div>
            <div class="relative" v-if="!project">
                <v-btn
                    class="ma-2"
                    text
                    color="primary"
                    @click="select_projects = !select_projects"
                >
                    <v-icon>mdi-plus</v-icon>プロジェクトに紐付ける
                </v-btn>
                <div class="select_project" v-if="select_projects">
                    <div
                        v-for="(project, i) in projects"
                        :key="i">
                        <v-btn
                            text
                        >
                            <v-icon>mdi-timeline-check-outline</v-icon>
                            <span class="pl-2">{{ project.project_name }}</span>
                        </v-btn>
                    </div>
                </div>
            </div>
            <div v-else>
                <v-btn
                    class="ma-2"
                    text
                    outlined
                >プロジェクト名</v-btn>
            </div>
        </div>
        
        <v-divider />
            <div class="d-flex align-center py-4">
                <!-- status -->
                <div class="pr-6">
                    <v-select
                        label="ステータス"
                        :items="this.params.task_status_list"
                        item-text="text"
                        item-value="key"
                        outlined
                        color="primary"
                        dense
                        v-model="status"
                        @change="settingTaskStatus()"
                    ></v-select>
                </div>
                <!-- manager -->
                <div
                    v-if="taskDetail.task_manager"
                    class="d-flex align-center pl-6"
                    style="border-left: 1px solid #ccc;"
                >
                    <div class="pr-4">タスク担当者 : </div>
                        <v-btn text>
                            <v-avatar
                                color="primary"
                                size="32"
                            >
                                <span class="white--text">大純</span>
                            </v-avatar>
                        </v-btn>
                </div>
                <div
                    v-else
                    class="pl-4 relative"
                    style="border-left: 1px solid #ccc;"
                >
                    <v-btn
                        class="ma-2"
                        text
                        color="primary"
                        @click="select_manager = !select_manager"
                    ><v-icon>mdi-plus</v-icon>担当者を追加</v-btn>
                    <div 
                        class="select_manager"
                        v-if="select_manager"
                    >
                        <div
                            v-for="(account, i) in parents.accounts"
                            :key="i"
                            class="py-1"
                        >   
                            <v-btn
                                text
                                @click="selectManager()"
                            >
                                <v-avatar
                                    :color="account.account_avatar"
                                    size="32"
                                    class="mr-2"
                                >
                                    <span class="white--text">{{ account.account_initial }}</span>
                                </v-avatar>
                                {{ account.account_name }}
                            </v-btn>
                        </div>
                    </div>
                </div>
                <v-spacer />
                <ul style="font-size: 14px;">
                    <li>タスクID : {{ taskDetail.task_id }} </li>
                    <li>作成者 : {{ taskDetail.create_account }}</li>
                    <li>作成日 : {{ taskDetail.created }}</li>
                    <li>タスク担当者 : {{ taskDetail.task_manager }}</li>
                </ul>
            </div>
        <v-divider />
        <div class="relative">
            <v-btn
                @click="term = !term"
                text
                class="ma-2"
            >
                <v-icon>mdi-calendar-check-outline</v-icon>
                {{ taskDetail.task_start_date }} ~ {{ taskDetail.task_end_date }}
            </v-btn>
            <v-btn
                text
                class="ma-2"
                @click="file_select = !file_select"
            >
                <v-icon>mdi-paperclip</v-icon>
                ファイル添付
            </v-btn>
            <!-- file select -->
            <div class="file_select" v-if="file_select">
                <div>
                    <input
                        style="display: none"
                        ref="file"
                        type="file"
                        @change="onFileChange"
                    >
                    <v-btn
                        text
                        @click="$refs.file.click()"
                    >
                        <v-icon class="mr-2">mdi-desktop-mac</v-icon>
                        お使いのコンピューター
                    </v-btn>
                </div>
                <div>
                    <v-btn
                        text
                        class="my-2"
                        @click="file_select_modal = true"
                    >
                        <v-icon class="mr-2">mdi-folder-multiple-outline</v-icon>
                        ファイル管理
                    </v-btn>
                </div>
            </div>
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
        </div>
        <div v-if="loading">
            <v-progress-linear
                indeterminate
                color="primary"
            ></v-progress-linear>
        </div>
        <v-divider />
        <div class="subtask_list" v-if="params.subtask_list">
            <table class="task-list mt-4">
                <tbody>
                <tr
                    v-for="subtask in params.subtask_list"
                    :key="subtask.id"
                    @click="subtaskRecordClick(subtask)"
                >
                    <td class="py-2 avatar-td">
                        <v-avatar
                            color="teal"
                            size="32"
                        >
                            <span class="white--text">大純</span>
                        </v-avatar>
                    </td>
                    <td class="py-2">{{ subtask.subtask_name }}</td>
                    <td class="py-2">{{ subtask.subtask_status.value }}</td>
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
            <!-- subtask area -->
            <div class="task-add-form mt-2" v-if="subtask_input">
                <div class="relative">
                    <v-text-field
                        label="タスク名を入力"
                        outlined
                        dense
                        v-model="subtask_name"
                    >
                    </v-text-field>
                    <v-btn
                        depressed
                        class="primary alt_submit"
                        text
                        @click="createSubtask(taskDetail)"
                    >新規作成
                    </v-btn>
                </div>
            </div>
            <v-btn
                text
                class="ma-2"
                color="primary"
                @click="subtask_input = !subtask_input"
            >
                <v-icon >mdi-plus</v-icon>
                サブタスクを追加
            </v-btn>
        </div>
        <!-- task detail -->
        <div class="py-6">
            <p class="ma-0 pb-2">■ タスク詳細</p>
            <v-divider />
            <div v-if="edidor_settings.initialValue">
                <div v-html="edidor_settings.initialValue"></div>
            </div>
            <div v-else>タスク詳細は記載されていません。</div>
            <Editor
                v-if="editor_mode == 'edit'"
                ref="editor"
                :api-key="edidor_settings.apikey"
                :initialValue="edidor_settings.initialValue"
                :init="edidor_settings.init"
            />
        </div>
        
        <!-- file list -->
        <div v-if="params.files.length > 0">
            <p class="ma-0 pb-2">■ 添付ファイル</p>
            <v-divider />
            <div class="d-flex align-center">
                <div>{{ params.files.length }} Files</div>
                <v-spacer />
                <v-btn text color="primary">
                    <v-icon>mdi-trash-can-outline</v-icon>
                    全てのファイルを削除
                </v-btn>
            </div>
            <v-divider />
            <table class="file-table">
                <tr v-for="(file, i) in params.files" :key="i">
                    <td>
                        <img :src="file.download_url" width="40">
                    </td>
                    <td>
                        {{ file.name }}
                    </td>
                    <td>
                        {{ file.size }}
                    </td>
                    <td>
                        {{ file.contentType }}
                    </td>
                    <td>
                        <v-btn>
                            <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </table>
        </div>
        <v-divider />
        <!-- file select modal -->
        <v-row justify="center">
            <v-dialog
                v-model="file_select_modal"
                persistent
                max-width="600px"
            >
            <v-card>
                <v-card-title>
                <span class="text-h5">ファイル管理</span>
                </v-card-title>
                <v-card-text>
                    アップロードするファイルを選択してください
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        outlined
                        depressed
                        class="pa-4"
                        @click="file_select_modal = false, file_select = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        depressed
                        class="pa-4"
                        color="primary"
                        filled
                        @click="file_select_modal = false"
                    >
                        Save
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
                        @click="execDelete(taskDetail)"
                        
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
// tinymce
import Editor from "@tinymce/tinymce-vue"
import tinymceSettings from "@/config/settings/tinymce.js"
import project_json from "@/config/json/projects.json"

export default {
    props: {
        closeDetail: Function,
        params: Object,
        parents: Object,
        taskDetail: Object,
        refreshTaskList: Function,
        deleteSubtaskHasTask: Function,
        initSubtaskList: Function,
        refreshTaskDetail: Function,
    },
    components: {
        Editor
    },
    data: () => ({
        editor_mode: "view",
        edidor_settings: tinymceSettings.edidor_settings,
        wide_display: false,
        status: null,
        //file
        file_select: false,
        file_select_modal: false,
        selected: [],
        //priject
        select_projects: false,
        projects: null,
        project: null,
        // menu
        task_delete_confirm: false,
        // manager
        select_manager: false,
        //subtask
        subtask_input: false,
        subtask_name: "",
        subtask_delete_alert: false,
        loading: false,
        success: false,
        // task date picker
        term: false,
        term_dates: [],
        // status
    }),
   
    created(){
        this.init()
        this.setTaskStatus()
    },

    mounted() {

    },

    updated() {
        this.setTaskStatus()
    },
    
    computed: {
        dateRangeText() {
            return this.taskDetail.task_start_date + " 〜 " + this.taskDetail.task_end_date
        },
    },

    methods: {
        // load data
        init() {
            this.projects = project_json.projects
        },
        // 添付ファイル追加
        onFileChange(e) {
            this.file_select = false
            const files = e.target.files || e.dataTransfer.files
            if(files.length > 0) {
                this.apiUploadFile(files[0], this.taskDetail.task_id, "task")
            }
        },
        // status
        setTaskStatus() {
            let task_status = this.taskDetail.task_status
            const list = this.params.task_status_list
            list.forEach(r => {
                r.key == task_status.key ? this.status = r : null
            })
        },
        // select task manager
        selectManager() {
            this.select_manager = false
        },

        // サブタスク
        createSubtask(task) {
            this.loading = true
            const create = this.apiSubtaskCreate(this.subtask_name, task.task_id)
            if(create) {
                this.loading = false
                this.success = true
                this.subtask_name = ""
            }
            this.initSubtaskList(task)
        },
        deleteSubtask(subtask) {
            this.apiDeleteSubtask(subtask)
            this.subtask_delete_alert = true
            this.initSubtaskList(this.taskDetail)
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
            this.apiSettingTaskTerm(this.term_dates, this.taskDetail.task_id)
            this.refreshTaskDetail()
        },
        deleteTaskTerm() {
            this.term_dates = [],
            this.term = false
            this.apiDeleteTaskTerm(this.taskDetail.task_id)
            this.refreshTaskDetail()
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
            this.apiSettingTaskStatus(this.taskDetail.task_id, status)
            this.refreshTaskDetail()
            this.refreshTaskList()
        },
        // タスク削除
        del() {
            this.task_delete_confirm = true
        },
        execDelete(taskDetail) {
            let from_detail = true
            this.apiDeleteTask(taskDetail)
            this.deleteSubtaskHasTask(taskDetail)
            this.task_delete_confirm = false
            this.refreshTaskList(null, from_detail)
        },
        // 詳細画面閉じる
        close() {
            this.closeDetail()
        },
    }
}
</script>

<style scoped>
.relative {
    position: relative;
}
.detail_inner {
    padding-bottom: 60px;
}
.detail_inner >>> .v-text-field__details {
    display: none;
}
.relative {
    position: relative;
}
.file_operation_wrap {
    position: relative;
}
.drawer {
    position: absolute;
    bottom: 50%;
    left: 100%;
    box-shadow: 0px 2px 8px #00000029;
    padding: 1rem;
    background-color: #fff;
    z-index: 2;
}
.message_send {
    position: relative;
}
.avatar {
    width: 40px;
}
.message_send_btn {
    width: 80px;
}
.message_send_textarea {
    width: calc(100% - 120px);
}
.icons {
    position: absolute;
    bottom: 8px;
    right: 10%;
}
.v-btn:not(.v-btn--round).v-size--default {
    min-width: unset;
    padding: 0 4px;
}
.message_send_textarea >>> .v-text-field__details {
    display: none;
}
.file_select,
.select_project,
.date_picker,
.task_link,
.select_manager {
    position: absolute;
    box-shadow: 0px 2px 8px #00000029;
    padding: 0.5rem 1rem;
    background-color: #fff;
    z-index: 2;
}
.date_picker,
.select_manager,
.select_project {
    left: 0;
    top: 100%;
}
.file_select {
    left: 20%;
    top: 100%;
}
.task_link {
    right: 0;
}
.alt_submit {
    position: absolute;
    right: 8px;
    z-index: 2;
    top: 35%;
    transform: translateY(-35%);
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
.options-td {
    width: 60px;
}
.options-td {
    text-align: right;
}
.file-table {
    width: 100%;
    border-collapse: collapse;
}
.file-table tr:not(:first-child) {
    border-top: 1px solid #ccc;
}
.file-table td,
.file-table th {
    text-align: left;
    font-size: 14px;
    padding: 8px;
    vertical-align: center;
}
</style>
