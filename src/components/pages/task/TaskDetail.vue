<template>
    <v-dialog
        v-model="params.detail_mode"
        persistent
        max-width="1024px"
    >
        <v-toolbar class="grey lighten-3">
            <v-btn
                icon
                data-e2e-id="taskDetailClose"
                @click="closeDetail()"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <!-- タスク名・削除 -->
            <v-toolbar-title class="toolbar_title px-2" data-e2e-id="taskDetailToolbar">
                <div
                    v-if="task_name_edit"
                    class="taskname_edit"
                >
                <validation-observer v-slot="{ invalid }" ref="observer">
                    <validation-provider
                        name="タスク名"
                        rules="required"
                    >
                        <v-text-field
                            autofocus
                            hide-details
                            v-model="params.viewer.task_name"
                            outlined
                            dense
                            background-color="white"
                            data-e2e-id="taskNameInput"
                        ></v-text-field>
                    </validation-provider>
                    <v-btn
                        @click="tasknameUpdate()"
                        class="taskname_edit_save px-4"
                        :disabled="invalid"
                        data-e2e-id="taskNameSave"
                        color="primary"
                    >
                        保存
                    </v-btn>
                </validation-observer>
                </div>
                <div
                    v-else
                    class="d-flex align-center"
                >
                    {{ params.viewer.task_name ? params.viewer.task_name : '' }}
                    <v-btn
                        icon
                        @click="task_name_edit = true"
                        data-e2e-id="taskNameEdit"
                        color="primary"
                    >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </div>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
                icon
                color="primary"
                data-e2e-id="taskDetailDelete"
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
                data-e2e-id="alertDeadline"
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
                        data-e2e-id="taskDetailStatus"
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
                        data-e2e-id="taskDetailPriority"
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
                        data-e2e-id="taskDeadlineOpen"
                    >
                        <v-icon>mdi-calendar-check-outline</v-icon>
                    </v-btn>
                    <span
                        class="ml-2"
                        style="color: #C62828; font-size: 14px;"
                        data-e2e-id="taskDeadlineText"
                    >
                        {{ this.convertDatetimeFromUnixtime(params.viewer.task_deadline, "yyyy-mm-dd") }}
                    </span>
                    <!-- date picker -->
                    <div class="date_picker" v-if="termSetting">
                        <v-text-field
                            v-model="task_deadline"
                            label="日付を選択"
                            prepend-icon="mdi-calendar"
                            readonly
                            data-e2e-id="taskDeadlineValue"
                        ></v-text-field>
                        <div>
                            <v-date-picker
                                v-model="task_deadline"
                                no-title
                                color="primary"
                                data-e2e-id="taskDeadlinePicker"
                            ></v-date-picker>
                        </div>
                        <v-divider />
                        <div class="mt-2">
                            <v-btn
                                text
                                color="primary"
                                @click="updateTaskTerm()"
                                data-e2e-id="taskDeadlineSave"
                            >
                                保存
                            </v-btn>
                            <v-btn
                                text
                                @click="task_deadline = [], termSetting = false"
                                data-e2e-id="taskDeadlineCancel"
                            >
                                キャンセル
                            </v-btn>
                            <v-btn
                                text
                                color="red"
                                @click="deleteTaskTerm()"
                                data-e2e-id="taskDeadlineDelete"
                            >
                                日付を消去
                            </v-btn>
                        </div>
                    </div>
                </div>
                <v-spacer />
                <div class="fs-sm" data-e2e-id="taskCreatedText">
                    タスク作成日: {{ convertDatetimeFromUnixtime(params.viewer.created, "yyyy-mm-dd") }}
                </div>
                <div class="ml-4 fs-sm" data-e2e-id="taskTermText">
                    タスク実施期間：{{ convertTaskPeriod(params.viewer.created, params.viewer.task_deadline) }}
                </div>
                <div class="ml-4 fs-sm" data-e2e-id="taskDaysLeft">
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
                            data-e2e-id="subtaskCreateButton"
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
                        data-e2e-id="subtaskList"
                    >
                        <div class="subtask-card__icon">
                            <v-icon large>mdi-subdirectory-arrow-right</v-icon>
                        </div>
                        <v-card
                            @click="clickSubtaskRecord(subtask)"
                            class="subtask-card__body"
                            hove
                            data-e2e-id="subtaskCard"                    
                        >
                            <v-card-actions class="justify-space-between px-4">
                                <span data-e2e-id="subtaskName">{{ subtask.subtask_name ? subtask.subtask_name : '' }}</span>
                                <span>
                                    <v-btn 
                                        fab
                                        small
                                        class="mr-2"
                                        @click.stop="updateSubtask(subtask, true)"
                                        :color="subtask.finished_at ? 'primary' : null"
                                        data-e2e-id="subtaskCheckButton"
                                    >
                                        <v-icon>mdi-check-bold</v-icon>
                                    </v-btn>
                                    <v-btn
                                        @click.stop="deleteSubtask(subtask)"
                                        fab
                                        small
                                        data-e2e-id="subtaskDeleteButton"
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
                            data-e2e-id="taskDescriptionEdit"
                        >
                        <v-icon class="mr-2">mdi-pencil-outline</v-icon>概要を編集
                        </v-btn>
                    </div>
                    <div v-else>
                        <v-btn
                            color="primary"
                            @click="updateTaskDescription()"
                            class="px-4"
                            data-e2e-id="taskDescriptionSave"
                        >
                        <v-icon class="mr-2">mdi-close</v-icon>編集内容を保存
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
                        data-e2e-id="taskDescriptionEditor"
                    />
                </div>
                <div class="editor_body" v-else>
                    <div v-if="params.viewer.task_description">
                        <div
                            v-html="params.viewer.task_description"
                            data-e2e-id="taskDescriptionText"
                        ></div>
                    </div>
                    <div
                        v-else
                        data-e2e-id="taskDescriptionNothing"
                    >
                        タスクの詳細がありません
                    </div>
                </div>
            </div>
            <!-- 添付ファイル -->
            <div class="mt-6">
                <v-card-actions class="relative px-0">
                    <p class="font-weight-bold mb-0">■ 添付ファイル</p>
                    <v-spacer />
                    <v-btn
                        text
                        color="primary"
                        @click="clickUploadButton()"
                        data-e2e-id="taskAttachmentButton"
                    >
                        <v-icon>mdi-paperclip</v-icon>ファイルを添付する
                    </v-btn>
                </v-card-actions>
                <v-divider />
                
                <div class="pt-4">
                    <div
                        v-if="!params.files.length > 0"
                        data-e2e-id="taskAttachmentNothing"
                    >
                        添付ファイルはありません。
                    </div>
                    <div
                        v-else
                        class="d-flex align-center"
                    >
                        <div data-e2e-id="taskAttachmentLength">{{ params.files.length }} Files</div>
                        <v-spacer />
                        <v-btn
                            text
                            color="error"
                            @click="clickAllFileDelete()"
                            data-e2e-id="taskAttachmentAllDelete"
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
                <!-- ファイル一覧 -->
                <template v-else>
                    <table class="file-table" data-e2e-id="taskAttachmentList">
                        <tr v-for="(file, i) in params.files" :key="i">
                            <td>
                                <img
                                    :src="file.download_path"
                                    width="40"
                                    data-e2e-id="taskAttachmentView"
                                >
                            </td>
                            <td data-e2e-id="taskAttachmentName">{{ file.name }}</td>
                            <td data-e2e-id="taskAttachmentSize">{{ convertUnitSize(file.size) }}</td>
                            <td data-e2e-id="taskAttachmentType">{{ file.contentType }}</td>
                            <td class="operation-td">
                                <v-btn
                                    link
                                    text
                                    :href="file.download_path"
                                    target="_blank" rel="noopener noreferrer"
                                    data-e2e-id="taskAttachmentPreviewButton"
                                >
                                        <v-icon>mdi-open-in-new</v-icon>
                                </v-btn>
                                <v-btn
                                    @click="clickFileDeleteSingle(file)"
                                    text
                                    class="ml-2"
                                    data-e2e-id="taskAttachmentDelete"
                                >
                                    <v-icon>mdi-trash-can-outline</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </table>
                    <input
                        style="display: none"
                        ref="fileUploadButton"
                        type="file"
                        @change="onFileChange"
                        data-e2e-id="taskAttachmentInput"
                    >
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
        subtask_list: [],
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
        // finder explore起動
        clickUploadButton() {
            this.params.success = "";
            this.params.error = "";
            this.$refs.fileUploadButton.click()
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
        // 全てのファイルを削除
        clickAllFileDelete() {
            this.delete_title = `このタスクにアップされている全てのファイルを削除します`;
            this.delete_options.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeModal },
                { function_cd: "delete", text: "削除する",   callback: this.execDeleteAllFile }
            )
            this.delete_modal = true;
        },
        // サブタスク作成
        clickSubtaskNew() {
            this.subtask_option.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeSubtask },
                { function_cd: "save", text: "保存", callback: this.createSubtask },
            )
            this.subtask_mode = "subtask_edit";
        },
        // サブタスク詳細
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
        async closeSubtask() {
            this.params.subtask_list = await this.getSubtaskList(this.params.viewer)
            this.subtask_option = [];
            this.params.subtask_viewer =  {}
            this.params.subtask_editor =  {}
            this.subtask_mode = "task";
        },
        // タスク期間設定消去
        deleteTaskTerm() {
            this.task_deadline = null
            this.termSetting = false
            this.firebaseUpdateTaskDeadline(this.task_deadline, this.params.viewer.task_id)
            this.params.viewer.task_deadline = null
        },
        // タスク削除
        clickTaskDelete() {
            this.delete_options.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeModal },
                { function_cd: "delete", text: "削除する",   callback: this.execDeleteTask }
            )
            this.delete_title = `タスク「${this.params.viewer.task_name}」を削除します。`;
            this.params.delete_item = this.params.viewer;
            this.delete_modal = true;
        },
        closeModal() {
            this.delete_options = []
            this.delete_modal = false;
            this.file_loading = false;
        },
        // 詳細閉じる
        closeDetail() {
            this.listRefresh()
            this.params.success = ""
            this.params.error = ""
            this.task_name_edit = false
            this.desc_editor = false
            this.params.detail_mode = false
        },
    }
}
</script>

<style scoped src="../../../assets/css/original.css"></style>
<style scoped src="./scoped.css"></style>
<style>
.ql-container.ql-snow {
    min-height: 200px;
    font-size: medium;
}
</style>
