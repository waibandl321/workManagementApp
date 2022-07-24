<template>
    <v-dialog
        v-model="params.detail_mode"
        persistent
        max-width="1024px"
    >
    <TaskDetailToolbar 
        :closeDetail="closeDetail"
        :clickTaskDelete="clickTaskDelete"
        :params="params"
    ></TaskDetailToolbar>
    <div class="pa-6 detail">
        <MessageViewer
            :params="params"
        />
        <!-- 期限切れアラート -->
        <TaskDeadlineAlert :params="params"></TaskDeadlineAlert>
        <!-- ステータス・優先度設定 -->
        <v-row>
            <v-col data-test-id="taskDetailStatus">
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
            </v-col>
            <v-col data-test-id="taskDetailPriority">
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
            </v-col>
        </v-row>
        <v-divider />
        <!-- 期日設定 -->
        <TaskTerm
            :params="params"
        ></TaskTerm>
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
                        data-test-id="subtaskCreateButton"
                    >
                        <v-icon >mdi-plus</v-icon>
                        サブタスクを追加
                </v-btn>
            </v-card-actions>
            <v-divider />
            <div class="mt-4">
                <div
                    v-if="!params.subtask_list.length"
                    data-test-id="noSubtask"
                >
                    サブタスクはありません
                </div>
                <div
                    v-for="(subtask, index) in params.subtask_list"
                    :key="index"
                    class="subtask-card__wrap"
                    data-test-id="subtaskList"
                >
                    <div class="subtask-card__icon">
                        <v-icon large>mdi-subdirectory-arrow-right</v-icon>
                    </div>
                    <v-card
                        @click="clickSubtaskRecord(subtask)"
                        class="subtask-card__body"
                        hove
                        data-test-id="subtaskCard"                    
                    >
                        <v-card-actions class="justify-space-between px-4">
                            <span data-test-id="subtaskName">{{ subtask.subtask_name ? subtask.subtask_name : '' }}</span>
                            <span>
                                <v-btn 
                                    fab
                                    small
                                    class="mr-2"
                                    @click.stop="updateSubtask(subtask, true)"
                                    :color="subtask.finished_at ? 'primary' : null"
                                    data-test-id="subtaskCheckButton"
                                >
                                    <v-icon>mdi-check-bold</v-icon>
                                </v-btn>
                                <v-btn
                                    @click.stop="deleteSubtask(subtask)"
                                    fab
                                    small
                                    data-test-id="subtaskDeleteButton"
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
        <TaskDescription :params="params"></TaskDescription>
        <!-- 添付ファイル -->
        <div class="mt-6">
            <v-card-actions class="relative px-0">
                <p class="font-weight-bold mb-0">■ 添付ファイル</p>
                <v-spacer />
                <v-btn
                    text
                    color="primary"
                    @click="clickUploadButton()"
                    data-test-id="taskAttachmentButton"
                >
                    <v-icon>mdi-paperclip</v-icon>ファイルを添付する
                </v-btn>
            </v-card-actions>
            <v-divider />
            
            <div class="pt-4">
                <div
                    v-if="!params.files.length > 0"
                    data-test-id="taskAttachmentNothing"
                >
                    添付ファイルはありません。
                </div>
                <div
                    v-else
                    class="d-flex align-center"
                >
                    <div data-test-id="taskAttachmentLength">{{ params.files.length }} Files</div>
                    <v-spacer />
                    <v-btn
                        text
                        color="error"
                        @click="clickAllFileDelete()"
                        data-test-id="taskAttachmentAllDelete"
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
                <table class="file-table" data-test-id="taskAttachmentList">
                    <tr v-for="(file, i) in params.files" :key="i">
                        <td>
                            <img
                                :src="file.download_path"
                                width="40"
                                data-test-id="taskAttachmentView"
                            >
                        </td>
                        <td data-test-id="taskAttachmentName">{{ file.name }}</td>
                        <td data-test-id="taskAttachmentSize">{{ convertUnitSize(file.size) }}</td>
                        <td data-test-id="taskAttachmentType">{{ file.contentType }}</td>
                        <td class="operation-td">
                            <v-btn
                                link
                                text
                                :href="file.download_path"
                                target="_blank" rel="noopener noreferrer"
                                data-test-id="taskAttachmentPreviewButton"
                            >
                                    <v-icon>mdi-open-in-new</v-icon>
                            </v-btn>
                            <v-btn
                                @click="clickFileDeleteSingle(file)"
                                text
                                class="ml-2"
                                data-test-id="taskAttachmentDelete"
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
                    data-test-id="taskAttachmentInput"
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

import TaskDetailToolbar from './detail/TaskDetailToolbar.vue'
import TaskDeadlineAlert from './detail/TaskDeadlineAlert.vue'
import TaskDescription from './detail/TaskDescription.vue'
import TaskTerm from './detail/TaskTerm.vue'

import SubtaskEdit from "./subtask/SubtaskEdit.vue"
import SubtaskView from "./subtask/SubtaskView.vue"


import myMixin from "./task.js"

export default {
    mixins: [myMixin],
    components: {
        ConfirmDelete,
        MessageViewer,
        TaskDetailToolbar,
        TaskDeadlineAlert,
        TaskDescription,
        TaskTerm,
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
        status: null,
        priority: null,
        termSetting: false,
        task_deadline: null,

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
        scrollTo(0,0)
        this.params.success = "";
        this.params.error = "";
    },

    updated() {
        scrollTo(0,0)
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
            this.subtask_option.is_new = true
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
        // deleteTaskTerm() {
        //     this.task_deadline = null
        //     this.termSetting = false
        //     this.firebaseUpdateTaskDeadline(this.task_deadline, this.params.viewer.task_id)
        //     this.params.viewer.task_deadline = null
        // },
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
            this.params.delete_item = {}
            this.delete_modal = false;
            this.file_loading = false;
        },
        // 詳細閉じる
        closeDetail() {
            this.listRefresh()
            this.params.success = ""
            this.params.error = ""
            this.delete_options = []
            this.params.delete_item = {}
            this.params.subtask_viewer =  {}
            this.params.subtask_editor =  {}
            this.task_name_edit = false
            this.desc_editor = false
            this.params.detail_mode = false
        },
    }
}
</script>

<style scoped src="../../../assets/css/original.css"></style>
<style scoped src="./scoped.css"></style>