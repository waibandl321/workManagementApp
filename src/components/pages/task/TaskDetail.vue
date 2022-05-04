<template>
    <v-row
        justify="center"
    >
        <v-dialog
            v-model="params.detail_mode"
            persistent
            max-width="1024px"
        >
            <v-toolbar
                flat
                dark
                color="primary"
            >
                <v-btn
                    icon
                    dark
                    @click="params.detail_mode = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <!-- タスク名・削除 -->
                <v-toolbar-title>
                    <div
                        v-if="task_name_edit"
                        class="taskname_edit"
                    >
                        <input
                            v-model="viewer.task_name"
                            type="text"
                            class="taskname_edit_input"
                        >
                        <v-btn
                            color="primary"
                            @click="tasknameUpdate()"
                            class="taskname_edit_save px-2"
                        >
                            保存
                        </v-btn>
                    </div>
                    <div
                        v-else
                        class="d-flex align-center"
                    >
                        {{ viewer.task_name ? viewer.task_name : '' }}
                        <v-btn
                            icon
                            dark
                            @click="task_name_edit = true"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </div>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    dark
                    icon
                    @click="task_delete_modal = true"
                >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card class="pa-6 detail">
                <!-- ステータス・優先度設定 -->
                <div class="d-flex">
                    <div class="pr-2" style="width: 50%">
                        <div class="font-weight-bold pb-4">■ ステータス</div>
                        <v-select
                            label="ステータス"
                            :items="params.task_status_list"
                            item-text="text"
                            item-value="key"
                            outlined
                            color="primary"
                            dense
                            v-model="viewer.task_status"
                            @change="updateTaskStatus()"
                        ></v-select>
                    </div>
                    <div class="pl-2" style="width: 50%">
                        <div class="font-weight-bold pb-4">■ 優先度</div>
                        <v-select
                            label="優先度"
                            :items="params.task_priorities"
                            item-text="text"
                            item-value="key"
                            v-model="viewer.task_priority"
                            outlined
                            color="primary"
                            dense
                            @change="updateTaskPriority()"
                        ></v-select>
                    </div>
                </div>
                <v-divider />
                <!-- 期日設定 -->
                <div class="py-2 d-flex align-center">
                    <div class="font-weight-bold">■ タスク期日</div>
                    <div class="ml-4 relative">
                        <v-btn
                            @click="term = !term" 
                            color="primary"
                            text
                        >
                            <v-icon class="mr-2">mdi-calendar-check-outline</v-icon>
                            <span class="ml-2">{{ viewer.task_deadline }}</span>
                        </v-btn>
                        <!-- date picker -->
                        <div class="date_picker" v-if="term">
                            <v-text-field
                                v-model="task_deadline"
                                label="日付を選択"
                                prepend-icon="mdi-calendar"
                                readonly
                            ></v-text-field>
                            <div>
                                <v-date-picker
                                    v-model="task_deadline"
                                    no-title
                                    color="primary"
                                ></v-date-picker>
                            </div>
                            <v-divider />
                            <div class="mt-2">
                                <v-btn
                                    text
                                    color="primary"
                                    @click="updateTaskTerm()"
                                >保存</v-btn>
                                <v-btn
                                    text
                                    @click="task_deadline = [], term = false"
                                >キャンセル</v-btn>
                                <v-btn
                                    text
                                    color="red"
                                    @click="deleteTaskTerm()"
                                >日付を消去</v-btn>
                            </div>
                        </div>
                    </div>
                    <v-spacer />
                </div>
                <v-divider />
                <!-- サブタスク一覧 -->
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
                <!-- 概要 -->
                <div class="py-4">
                    <v-card-actions class="px-0">
                        <div class="font-weight-bold">■ タスク概要</div>
                        <v-spacer />
                        <div v-if="!desc_editor">
                            <v-btn
                                color="primary"
                                text
                                @click="desc_editor = true"
                                class="px-4"
                            >
                            <v-icon class="mr-2">mdi-pencil-outline</v-icon>概要を編集
                            </v-btn>
                        </div>
                        <div v-else>
                            <v-btn
                                color="primary"
                                @click="updateTaskDescription()"
                                class="px-4"
                            >
                            <v-icon class="mr-2">mdi-content-save-outline</v-icon>編集内容を保存
                            </v-btn>
                        </div>
                    </v-card-actions>
                    <v-divider />
                    <div v-if="desc_editor">
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
                <!-- 添付ファイル -->
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

                <!-- タスク削除モーダル -->
                <v-row justify="center">
                    <v-dialog
                        persistent
                        max-width="600px"
                        v-model="task_delete_modal"
                    >
                        <ConfirmDelete
                            :closeModal="closeModal"
                            :item="viewer"
                            :execDeleteTask="execDeleteTask"
                        />
                    </v-dialog>
                </v-row>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import ConfirmDelete from "@/components/common/ConfirmDelete.vue"
// エディタ
import Editor from "@tinymce/tinymce-vue"
import tinymceSettings from "@/config/settings/tinymce.js"

import myMixin from "./task.js"

export default {
    mixins: [myMixin],
    components: {
        Editor,
        ConfirmDelete
    },
    props: {
        closeDetail: Function,
        listRefresh: Function,
        params: Object,
        viewer: Object,
    },
    data: () => ({
        //タスク情報
        status: null,
        priority: null,
        task_name_edit: false,
        desc_editor: false,
        term: false,
        task_deadline: null,

        // テキストエディタ
        edidor_settings: tinymceSettings.edidor_settings,

        // ファイル
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

        // タスク削除確認
        task_delete_modal: false,
    }),

    methods: {
        // ファイルアップロード
        onFileChange(e) {
            // this.file_loading = true
            this.file_select = false
            const files = e.target.files || e.dataTransfer.files

            if(files.length > 0) {
                const promise = new Promise((resolve, reject) => {
                    resolve();
                    reject()
                });
                
                promise
                .then(() => {
                    this.uploadFileToStorage(files[0], this.viewer.task_id)
                })
                .catch((error) => {
                    console.log(error);
                })
            }
            


            
        },
        // ファイル削除
        deleteFileSelected(file_data) {
            this.delete_file_modal = true
            this.delete_file = file_data
        },
        execDeleteFile() {
            this.file_loading = true
            this.deleteFileOnStorage(this.delete_file)
        },
        execDeleteAllFile(files) {
            this.delete_all_file_modal = false
            this.file_loading = true
            this.deleteAllFile(files)
        },

        // タスク情報の更新
        tasknameUpdate() {
            this.apiUpdateTaskname(this.viewer.task_id, this.viewer.task_name)
            this.task_name_edit = false
            this.listRefresh()
        },
        updateTaskDescription() {
            this.apiUpdateTaskDescription(this.viewer.task_id, this.viewer.task_description);
            this.desc_editor = false

        },
        updateTaskStatus() {
            this.apiUpdateTaskStatus(this.viewer.task_id, this.viewer.task_status)
        },
        updateTaskPriority() {
            this.apiUpdateTaskPriority(this.viewer.task_id, this.viewer.task_priority)
        },
        updateTaskTerm() {
            this.term = false
            this.apiUpdateTaskTerm(this.task_deadline, this.viewer.task_id)
            this.viewer.task_deadline = this.task_deadline
            this.listRefresh()
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
        
        // タスク期間設定
        
        deleteTaskTerm() {
            this.task_deadline = null
            this.term = false
            this.apiDeleteTaskTerm(this.viewer.task_id)
            this.viewer.task_deadline = null
        },
        
        // タスク削除
        execDeleteTask(delete_item) {
            this.apiDeleteTask(delete_item)
            this.deleteSubtaskHasTask(delete_item)
            this.execDeleteAllFile(this.params.files)
            this.task_delete_modal = false
            this.close()
            this.listRefresh("タスクを削除しました。")
        },
        closeModal() {
            this.task_delete_modal = false
        },

        // 詳細画面閉じる
        close() {
            this.closeDetail()
        },
    }
}
</script>

<style scoped src="./scoped.css"></style>
