<template>
    <v-dialog
        v-model="params.detail_mode"
        persistent
        fullscreen
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
                @click="closeDetail()"
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
                        v-model="params.viewer.task_name"
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
                    {{ params.viewer.task_name ? params.viewer.task_name : '' }}
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
        <div class="pa-6 detail" style="background: #fff;">
            <MessageViewer
                :params="params"
            />
            <!-- 期限切れアラート -->
            <v-alert
                v-if="judgeRemainingDays(params.viewer.task_deadline) <= 0"
                type="error"
                color="red darken-3"
            >
                {{ outputTaskAlert() }}
            </v-alert>
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
                        v-model="params.viewer.task_status"
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
                        v-model="params.viewer.task_priority"
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
                        @click="termSetting = !termSetting" 
                        color="red darken-3"
                        fab
                        class="mr-2 white--text"
                        small
                    >
                        <v-icon>mdi-calendar-check-outline</v-icon>
                    </v-btn>
                    <span class="ml-2" style="color: #C62828; font-size: 14px;">{{ this.convertDatetimeFromUnixtime(params.viewer.task_deadline, "yyyy-mm-dd") }}</span>
                    <!-- date picker -->
                    <div class="date_picker" v-if="termSetting">
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
                            >
                                保存
                            </v-btn>
                            <v-btn
                                text
                                @click="task_deadline = [], termSetting = false"
                            >
                                キャンセル
                            </v-btn>
                            <v-btn
                                text
                                color="red"
                                @click="deleteTaskTerm()"
                            >
                                日付を消去
                            </v-btn>
                        </div>
                    </div>
                </div>
                <v-spacer />
                <div class="fs-sm">
                    タスク作成日: {{ convertDatetimeFromUnixtime(params.viewer.created, "yyyy-mm-dd") }}
                </div>
                <div class="ml-4 fs-sm">
                    タスク実施期間：{{ convertTaskPeriod(params.viewer.created, params.viewer.task_deadline) }}
                </div>
                <div class="ml-4 fs-sm">
                    期日までの残り日数：{{ convertRemainingDays(params.viewer.task_deadline) }}
                </div>
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
                <table class="basic-list underlayer-list">
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
                    <div class="font-weight-bold">■ タスク概要説明</div>
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
                <div
                    v-if="desc_editor"
                    class="detail-editor"
                >
                    <quillEditor
                        ref="myQuillEditor"
                        v-model="params.viewer.task_description"
                        :options="editorOption"
                    />
                </div>
                <div class="editor_body" v-else>
                    <div v-if="params.viewer.task_description">
                        <div v-html="params.viewer.task_description"></div>
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
                            <img :src="outputDownloadPath(file.name)" width="40">
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
        </div>
    </v-dialog>
</template>

<script>
import ConfirmDelete from "@/components/common/ConfirmDelete.vue"
import MessageViewer from '@/components/common/MessageViewer.vue'
// エディタ
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

import myMixin from "./task.js"

export default {
    mixins: [myMixin],
    components: {
        ConfirmDelete,
        MessageViewer,
        quillEditor
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
        termSetting: false,
        task_deadline: null,

        // テキストエディタ
        editorOption: {
            theme: 'snow',
            placeholder: 'タスク詳細を入力してください',
            modules: {
                toolbar: [],
            }
        },

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
        loading: false,

        // タスク削除確認
        task_delete_modal: false,
    }),
    created() {
        this.editorOption.modules.toolbar = this.getEditorOptions();
        this.params.success = "";
        this.params.error = "";
    },

    methods: {
        // ファイル
        async onFileChange(e) {
            this.file_loading = true
            this.file_select = false
            const files = e.target.files || e.dataTransfer.files

            if(files.length > 0) {
                const uploadPromise = new Promise((resolve, reject) => {
                    resolve();
                    reject()
                });
                
                uploadPromise
                .then(() => {
                    return this.storageUploadFunctionFile(files[0], this.params.viewer.task_id)
                })
                .then((res) => {
                    return this.firebaseSaveFile(res)
                })
                .then(() => {
                    this.file_loading = false
                    this.getFileList()
                })
                .catch((error) => {
                    console.log(error);
                })
            }
        },
        async outputDownloadPath(filename) {
            return await this.storageDownloadPath( this.storeGetFirebaseUid() + '/' + filename )
        },
        deleteFileSelected(file_data) {
            this.delete_file_modal = true
            this.delete_file = file_data
        },
        execDeleteFile() {
            this.file_loading = true
            this.storageDeleteFile(this.delete_file)
        },
        execDeleteAllFile(files) {
            this.delete_all_file_modal = false
            this.file_loading = true
            this.deleteAllFile(files)
        },
        
        // タスク期間設定
        deleteTaskTerm() {
            this.task_deadline = null
            this.termSetting = false
            this.apiUpdateTaskTerm(this.task_deadline, this.params.viewer.task_id)
            this.params.viewer.task_deadline = null
        },
        outputTaskAlert() {
            if(!this.params.viewer.task_deadline) {
                return
            }
            const result = this.judgeRemainingDays(this.params.viewer.task_deadline)
            switch (true) {
                case result === 0:
                    return "本日期日です";
                case result < 0:
                    return "タスクが期日を過ぎています";
                default:
                    break;
            }
        },
        
        // タスク削除
        execDeleteTask(delete_item) {
            this.apiDeleteTask(delete_item)
            this.deleteSubtaskHasTask(delete_item)
            this.execDeleteAllFile(this.params.files)
            this.task_delete_modal = false
            this.closeDetail()
            this.params.error = "タスクを削除しました"
            this.listRefresh()
        },
        closeModal() {
            this.task_delete_modal = false
        },
    }
}
</script>

<style scoped src="../../../assets/css/original.css"></style>
<style scoped src="./scoped.css"></style>
<style>
.ql-container.ql-snow {
    min-height: 200px;
}
.alt_submit {
    position: absolute;
    bottom: 40%;
    right: 0;
}
</style>
