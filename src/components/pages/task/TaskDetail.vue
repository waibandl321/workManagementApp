<template>
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
                @click="clickTaskDelete()"
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
                            @click="clickSubtaskNew()"
                        >
                            <v-icon >mdi-plus</v-icon>
                            サブタスクを追加
                    </v-btn>
                </v-card-actions>
                <v-divider />
                <div class="mt-4">
                    <div
                        v-for="(subtask, index) in params.subtask_list"
                        :key="index"
                        class="subtask-card__wrap"
                    >
                        <div class="subtask-card__icon">
                            <v-icon large>mdi-subdirectory-arrow-right</v-icon>
                        </div>
                        <v-card
                            @click="clickSubtaskRecord(subtask)"
                            class="subtask-card__body"
                            hove                            
                        >
                            <v-card-actions class="justify-space-between px-4">
                                <span>{{ subtask.subtask_name ? subtask.subtask_name : '' }}</span>
                                <span>
                                    <v-btn
                                        text
                                        @click.stop="deleteSubtask(subtask)"
                                        fab
                                        small
                                    >
                                        <v-icon>mdi-trash-can-outline</v-icon>
                                    </v-btn>
                                </span>
                            </v-card-actions>
                        </v-card>
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
                
                <div class="pt-4">
                    <div v-if="!params.files.length > 0">添付ファイルはありません。</div>
                    <div class="d-flex align-center" v-else>
                        <div>{{ params.files.length }} Files</div>
                        <v-spacer />
                        <v-btn
                            text
                            color="error"
                            @click="clickAllFile()"
                        >
                            <v-icon>mdi-trash-can-outline</v-icon>
                            全ファイル削除
                        </v-btn>
                    </div>
                </div>
                <!-- ローディング -->
                <template v-if="file_loading">
                    <div class="text-center py-6">
                        <v-progress-circular
                            :size="50"
                            color="primary"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </template>
                <template v-else>
                <!-- ファイル一覧 -->
                    <table class="file-table">
                        <tr v-for="(file, i) in params.files" :key="i">
                            <td>
                                <img :src="outputDownloadPath(file[1].name)" width="40">
                            </td>
                            <td>{{ file[1].name }}</td>
                            <td>{{ file[1].size }}</td>
                            <td>{{ file[1].contentType }}</td>
                            <td class="operation-td">
                                <v-btn
                                    link
                                    text
                                    :href="file[1].download_url"
                                    target="_blank" rel="noopener noreferrer"
                                    >
                                        <v-icon>mdi-open-in-new</v-icon>
                                </v-btn>
                                <v-btn
                                    @click="clickFileDeleteSingle(file[1])"
                                    text
                                    class="ml-2"
                                >
                                    <v-icon>mdi-trash-can-outline</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </table>
                </template>
            </div>

            <!-- 削除確認 -->
            <ConfirmDelete
                v-if="delete_modal"
                :delete_title="delete_title"
                :delete_options="delete_options"
            />

            <SubtaskView 
                :params="params"
                :subtask_option="subtask_option"
                v-if="subtask_mode == 'subtask_detail'"
            />

            <SubtaskEdit 
                :params="params"
                :subtask_option="subtask_option"
                v-if="subtask_mode == 'subtask_edit'"
            />
        </div>
    </v-dialog>
</template>

<script>
import ConfirmDelete from "@/components/common/ConfirmDelete.vue"
import MessageViewer from '@/components/common/MessageViewer.vue'

import SubtaskEdit from "./subtask/SubtaskEdit.vue"
import SubtaskView from "./subtask/SubtaskView.vue"
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
        quillEditor,
        SubtaskEdit,
        SubtaskView,
    },
    props: {
        closeDetail: Function,
        listRefresh: Function,
        params: Object,
        viewer: Object,
    },
    data: () => ({

        //タスク情報
        task_name_edit: false,
        status: null,
        priority: null,
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
        delete_all_file_modal: false,
        file_loading: false,
        delete_file: {},

        //サブタスク
        subtask_mode: "task",
        subtask_option: [],

        // タスク削除確認
        delete_options: [],
        delete_title: "",
        delete_modal: false,
    }),
    created() {
        this.editorOption.modules.toolbar = this.getEditorOptions();
        this.params.success = "";
        this.params.error = "";
    },

    methods: {
        // ファイルアップロード
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
                    this.params.files = this.getFileList()
                    this.params.success = "ファイルをアップロードしました。";
                })
                .catch((error) => {
                    this.params.error = "ファイルアップロードに失敗しました。";
                    console.log(error);
                })
            }
        },
        // 単ーファイル削除
        clickFileDeleteSingle(file) {
            this.delete_title = `ファイル「${file.name}」を削除します。`;
            this.delete_options.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeModal },
                { function_cd: "delete", text: "削除する",   callback: this.execDeleteFile }
            )
            this.delete_file = file;
            this.delete_modal = true;
        },
        // 物理削除
        async execDeleteFile() {
            this.file_loading = true;
            const storage_result = await this.storageDeleteFile(this.delete_file)
            if(storage_result) {
                await this.firebaseDeleteFile(this.delete_file)
                this.params.success = `ファイル${this.delete_file.name}を削除しました。`
            } else {
                this.params.success = `ファイル${this.delete_file.name}の削除に失敗しました。`
            }
            this.params.files = this.getFileList()
            this.delete_file = {}
            this.delete_options = []
            this.delete_modal = false;
            this.file_loading = false;
        },
        // 全てのファイルを削除
        clickAllFile() {
            this.delete_title = `このタスクにアップされている全てのファイルを削除します`;
            this.delete_options.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeModal },
                { function_cd: "delete", text: "削除する",   callback: this.execDeleteAllFile }
            )
            this.delete_modal = true;
        },

        // サブタスク
        clickSubtaskNew() {
            this.subtask_option.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeSubtask },
                { function_cd: "save", text: "保存", callback: this.createSubtask },
            )
            this.subtask_mode = "subtask_edit";
        },
        clickSubtaskRecord(subtask) {
            this.params.subtask_viewer = subtask;
            this.subtask_option.push(
                { function_cd: "cancel", text: "閉じる", callback: this.closeSubtask },
                { function_cd: "edit", text: "編集", callback: this.changeSubtaskMode },
            )
            this.subtask_mode = "subtask_detail";
        },
        changeSubtaskMode(mode) {
            this.subtask_option = [
                { function_cd: "cancel", text: "キャンセル", callback: this.closeSubtask },
                { function_cd: "save", text: "保存", callback: this.updateSubtask },
            ]
            this.subtask_mode = mode;
        },
        closeSubtask() {
            this.subtask_option = []
            this.subtask_mode = "task";
        },
        async createSubtask(new_subtask) {
            const result = await this.apiSubtaskCreate(new_subtask, this.params.viewer.task_id)
            if(result) {
                this.params.success = "サブタスクを新規作成しました。";
            } else {
                this.params.error = "サブタスク作成中にエラーが発生しました。";
            }
            this.subtask_option = [];    
            this.params.subtask_editor = {};
            this.params.subtask_list = await this.getSubtaskList(this.params.viewer)
            this.subtask_mode = "task";
        },
        async deleteSubtask(subtask) {
            const result = await this.apiDeleteSubtask(subtask);
            if(result) {
                this.params.success = "サブタスクを削除しました。"
            } else {
                this.params.error = "サブタスクの削除に失敗しました。"
            }
            this.params.subtask_list = await this.getSubtaskList(this.params.viewer);
        },
        async updateSubtask(subtask) {
            const result = await this.apiUpdateSubtask(subtask)
            if(result) {
                this.params.success = "サブタスクを更新しました。"
            } else {
                this.params.error = "サブタスクの更新に失敗しました。"
            }
            this.params.subtask_editor = {};
            this.subtask_option = []
            this.params.subtask_list = await this.getSubtaskList(this.params.viewer);
            this.subtask_mode = "task";
        },
        
        // タスク期間設定
        deleteTaskTerm() {
            this.task_deadline = null
            this.termSetting = false
            this.apiUpdateTaskTerm(this.task_deadline, this.params.viewer.task_id)
            this.params.viewer.task_deadline = null
        },
        
        
        // タスク削除
        clickTaskDelete() {
            this.delete_options.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeModal },
                { function_cd: "delete", text: "削除する",   callback: this.execDeleteTask }
            )
            this.delete_title = `タスク「${this.params.viewer.task_name}」を削除します。`;
            this.delete_modal = true;
        },
        execDeleteTask() {
            this.apiDeleteTask(this.params.viewer)
            this.deleteSubtaskHasTask(this.params.viewer)
            this.execDeleteAllFile(this.params.files)
            this.delete_modal = false
            this.delete_options = []
            this.closeDetail()
            this.params.error = "タスクを削除しました"
            this.listRefresh()
        },
        closeModal() {
            this.delete_options = []
            this.delete_modal = false
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
.subtask-card__wrap {
    display: flex;
    align-items: center;
}
.subtask-card__icon {
    width: 40px;
    text-align: center;
}
.subtask-card__body {
    width: calc(100% - 40px);
    margin-top: 8px;
}
</style>
