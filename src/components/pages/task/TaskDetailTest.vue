<template>
    <v-dialog
        v-model="detailMode"
        persistent
        max-width="1024px"
    >
    <v-toolbar class="grey lighten-3">
        <v-btn
            icon
            data-test-id="taskDetailClose"
            @click="closeDetail()"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="toolbar_title px-2 taskname" data-test-id="taskDetailToolbar">
        <div
            v-if="task_name_edit_mode"
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
                    v-model="detail.task_name"
                    outlined
                    dense
                    background-color="white"
                    data-test-id="taskNameInput"
                ></v-text-field>
            </validation-provider>
            <v-btn
                @click="updateTaskName()"
                class="taskname_edit_save px-4"
                :disabled="invalid"
                data-test-id="taskNameSave"
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
            {{ detail.task_name ? detail.task_name : '' }}
            <v-btn
                icon
                @click="task_name_edit_mode = true"
                data-test-id="taskNameEdit"
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
            data-test-id="taskDetailDelete"
            @click="clickTaskDelete()"
        >
            <v-icon>mdi-delete</v-icon>
        </v-btn>
    </v-toolbar>
    <div class="pa-6 detail">
        <MessageViewer
            :params="messages"
        />
        <!-- 期日アラート -->
        <v-alert
            v-if="judgeRemainingDays(detail.task_deadline) <= 0"
            type="error"
            color="red darken-3"
            data-test-id="alertDeadline"
        >
            {{ outputTaskAlert() }}
        </v-alert>
        <!-- ステータス、優先度設定 -->
        <v-row>
            <v-col data-test-id="taskDetailStatus">
                <div class="font-weight-bold pb-4">■ ステータス</div>
                <v-select
                    label="ステータス"
                    :items="task_status_list"
                    item-text="text"
                    item-value="key"
                    outlined
                    color="primary"
                    dense
                    v-model="detail.task_status"
                    @change="updateTaskStatus()"
                ></v-select>
            </v-col>
            <v-col data-test-id="taskDetailPriority">
                <div class="font-weight-bold pb-4">■ 優先度</div>
                <v-select
                    label="優先度"
                    :items="task_priority_list"
                    item-text="text"
                    item-value="key"
                    v-model="detail.task_priority"
                    outlined
                    color="primary"
                    dense
                    @change="updateTaskPriority()"                        
                ></v-select>
            </v-col>
        </v-row>
        <v-divider />
        <div class="py-2 d-flex align-center">
            <div class="font-weight-bold">■ タスク期日</div>
                <div class="ml-4 relative">
                <v-btn
                    @click="term_setting = !term_setting" 
                    color="red darken-3"
                    fab
                    class="mr-2 white--text"
                    small
                    data-test-id="taskDeadlineOpen"
                >
                    <v-icon>mdi-calendar-check-outline</v-icon>
                </v-btn>
                <span
                    class="ml-2"
                    style="color: #C62828; font-size: 14px;"
                    data-test-id="taskDeadlineText"
                >
                    {{ toDatetime(detail.task_deadline, "yyyy-mm-dd") }}
                </span>
                <!-- date picker -->
                <div class="date_picker" v-if="term_setting">
                    <v-text-field
                        v-model="task_deadline"
                        label="日付を選択"
                        prepend-icon="mdi-calendar"
                        readonly
                        data-test-id="taskDeadlineValue"
                    ></v-text-field>
                    <div>
                    <v-date-picker
                        v-model="task_deadline"
                        no-title
                        color="primary"
                        data-test-id="taskDeadlinePicker"
                    ></v-date-picker>
                    </div>
                    <v-divider />
                    <div class="mt-2">
                    <v-btn
                        text
                        color="primary"
                        @click="updateTaskTerm()"
                        data-test-id="taskDeadlineSave"
                    >
                        保存
                    </v-btn>
                    <v-btn
                        text
                        @click="task_deadline = [], term_setting = false"
                        data-test-id="taskDeadlineCancel"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        text
                        color="red"
                        @click="deleteTaskTerm()"
                        data-test-id="taskDeadlineDelete"
                    >
                        日付を消去
                    </v-btn>
                    </div>
                </div>
            </div>
            <v-spacer />
            <div
                class="fs-sm"
                data-test-id="taskCreatedText"
            >
                タスク作成日: {{ toDatetime(detail.created, "yyyy-mm-dd") }}
            </div>
            <div
                class="ml-4 fs-sm"
                data-test-id="taskTermText"
            >
                タスク実施期間：{{ convertTaskPeriod(detail.created, detail.task_deadline) }}
            </div>
            <div
                class="ml-4 fs-sm"
                data-test-id="taskDaysLeft"
            >
                期日までの残り日数：{{ convertRemainingDays(detail.task_deadline) }}
            </div>
        </div>
        <v-divider />
        <div
            class="subtask_list"
            v-if="subtask_list"
        >
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
            <div class="mt-2">
                <div
                    v-if="!subtask_list.length"
                    data-test-id="noSubtask"
                >
                    サブタスクはありません
                </div>
                <div
                    v-for="(subtask, index) in subtask_list"
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
                        <span data-test-id="subtaskName">
                            {{ subtask.subtask_name ? subtask.subtask_name : '' }}
                        </span>
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
                    data-test-id="taskDescriptionEdit"
                >
                <v-icon class="mr-2">mdi-pencil-outline</v-icon>概要を編集
                </v-btn>
            </div>
            <div v-else>
                <v-btn
                    color="primary"
                    @click="updateTaskDescription()"
                    class="px-4"
                    data-test-id="taskDescriptionSave"
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
                    v-model="detail.task_description"
                    :options="editorOption"
                    data-test-id="taskDescriptionEditor"
                />
            </div>
            <div 
                v-else
                class="editor_body"
            >
                <div
                    v-if="!detail.task_description"
                    data-test-id="taskDescriptionText"
                >
                    タスクの詳細がありません
                </div>
                <div
                    v-html="detail.task_description"
                    data-test-id="taskDescriptionText"
                ></div>
            </div>
        </div>
        <!-- 添付 -->
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
            <div>
                <div 
                    v-if="task_files.length === 0"
                    class="py-2"
                    data-test-id="taskAttachmentNothing"
                >
                    添付ファイルはありません。
                </div>
                <div class="pt-4">
                    <div class="d-flex align-center">
                        <div data-test-id="taskAttachmentLength">{{ task_files.length }} Files</div>
                        <v-spacer />
                        <v-btn
                            v-if="task_files.length > 0"
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
            </div>
            <!-- ローディング -->
            <template v-if="task_file_loading">
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
                    <tr 
                        v-for="(file, i) in task_files" 
                        :key="i" 
                        data-test-id="taskAttachmentRecord"
                    >
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
                    @change="taskFileInputChange"
                    data-test-id="taskAttachmentInput"
                >
            </template>
        </div>
        <SubtaskView 
            :subtask_viewer="subtask_viewer"
            :subtask_editor="subtask_editor"
            :subtask_option="subtask_option"
            v-if="subtask_mode == 'subtask_detail'"
        />
        <SubtaskEdit 
            :subtask_editor="subtask_editor"
            :subtask_option="subtask_option"
            v-if="subtask_mode == 'subtask_edit'"
        />
        <ConfirmDelete
            v-if="delete_modal"
            :delete_title="delete_title"
            :delete_options="delete_options"
        />
    </div>
</v-dialog>
</template>

<script>
import ConfirmDelete from "@/components/common/ConfirmDelete.vue"
import MessageViewer from '@/components/common/MessageViewer.vue'
import SubtaskEdit from "./subtask/SubtaskEdit.vue"
import SubtaskView from "./subtask/SubtaskView.vue"
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
        detailMode: Boolean,
        detailItem: Object,
    },
    inject: [
        "task_status_list",
        "task_priority_list"
    ],
    data: function() {
        return {
            messages: {
                success: "",
                error: "",
            },
            task_name_edit_mode: false,
            term_setting: false,
            task_deadline: null,

            desc_editor: false,
            editorOption: {
                theme: 'snow',
                placeholder: 'タスク詳細を入力してください',
                modules: {
                    toolbar: [],
                }
            },
            
            subtask_mode: "task",
            subtask_list: [],
            subtask_viewer: {},
            subtask_editor: {},
            subtask_option: [],

            task_file_loading: false,
            task_files: [],
            delete_file: {},
            
            detail: this.detailItem,
            delete_options: [],
            delete_title: "",
            delete_modal: false,
        }
    },
    created() {
        // scrollTo(0,0)
        this.messages.success = "";
        this.messages.error = "";
        // this.editorOption.modules.toolbar = this.getEditorOptions();
        // this.readSubtaskList()
        // this.getTaskFileList()
    },
    methods: {
        
        // サブタスク読み込み
        async readSubtaskList() {
            this.subtask_list = await this.getSubtaskList(this.detail);
        },
        async updateTaskName() {
            const result = await this.firebaseUpdateTaskname(
            this.detail.task_id,
            this.detail.task_name
            )
            if(result) {
                this.task_name_edit_mode = false
                this.messages.success = "タスク名を更新しました。"
            }
        },
        async updateTaskStatus() {
            const result = await this.firebaseUpdateTaskStatus(this.detail)
            if(result) {
                this.messages.success = "タスクのステータスを変更しました。"
            }
        },
        async updateTaskPriority() {
            const result = await this.firebaseUpdateTaskPriority(
                this.detail.task_id,
                this.detail.task_priority
            )
            if(result) {
                this.messages.success = "タスクの優先度を変更しました。"
            }
        },
        // タスク期日アラート
        outputTaskAlert() {
            if(!this.detail.task_deadline) {
                return
            }
            const result = this.judgeRemainingDays(this.detail.task_deadline)
            switch (true) {
                case result === 0:
                    return "本日期日です";
                case result < 0:
                    return "タスクが期日を過ぎています";
                default:
                    break;
            }
        },
        // 期日設定
        deleteTaskTerm() {
            this.task_deadline = null;
            this.term_setting = false;
            this.firebaseUpdateTaskDeadline(
                this.task_deadline,
                this.detail.task_id
            )
            this.detail.task_deadline = null;
        },
        async updateTaskTerm() {
            const deadline = this.convertUnixtimeFromDate(this.task_deadline)
            if(deadline === this.detail.task_deadline){
                this.term_setting = false;
                return;
            }
            const result = await this.firebaseUpdateTaskDeadline(
            deadline,
            this.detail.task_id
            )
            if(result) {
                this.detail.task_deadline = deadline;
                this.messages.success = "タスク期日を変更しました";
            }
            this.task_deadline = null;
            this.term_setting = false;
        },
        convertRemainingDays(end) {
            const days = this.judgeRemainingDays(end)
            
            switch (true) {
                case days < 0:
                    return "期限切れ";
                case days === 0:
                    return "本日期日";
                case days > 0:
                    return days + "日";
                default:
                    break;
            }
        },
        toDatetime(value, format) {
            if(!value) {
                return "未設定"
            }
            let date = new Date(value*1000)
            let fm = format

            const year = date.getFullYear()
            const month = ("0"+ (date.getMonth() + 1)).slice(-2);
            const day = ("0"+ date.getDate()).slice(-2);
            const time = date.getHours()
            const minutes = date.getMinutes()

            return fm.replace("yyyy", year)
                    .replace("mm", month)
                    .replace("dd", day)
                    .replace("hh", time)
                    .replace("mm", minutes)
        },
        judgeRemainingDays(end) {
            if(!end) {
                return undefined
            }
            const today = new Date(this.toDatetime(this.nowUnix(), "yyyy-mm-dd"));
            const _end = new Date(this.toDatetime(end, "yyyy-mm-dd"));
            return (_end - today) / 86400000;
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
        async createSubtask(new_subtask) {
            const subtask = this.generateSubtaskObject(new_subtask)
            try {
                await this.firebaseSubtaskCreate(subtask)
                this.messages.success = "サブタスクを新規作成しました。";
                this.subtask_option = [];
                this.subtask_editor = {};
                this.subtask_list = await this.getSubtaskList(this.detail)
            } catch (error) {
                this.messages.error = "サブタスク作成中にエラーが発生しました。";
            }
            this.subtask_mode = "task";
        },
        generateSubtaskObject(new_subtask) {
            return {
                subtask_id: this.createRandomId(),
                task_id: this.detail.task_id,
                subtask_name: new_subtask.subtask_name,
                subtask_description: new_subtask.subtask_description ? new_subtask.subtask_description : "",
                create_account: this.storeGetFirebaseUid(),
                created: this.nowUnix(),
                finished_at: ""
            }
        },
        // サブタスク更新
        async updateSubtask(subtask, is_finished_flag) {
            if(is_finished_flag) {
                if(!subtask.finished_at) {
                subtask.finished_at = this.nowUnix()
                } else {
                return; //MEMO: finishedの場合は何もしない
                }
            }
            const result = await this.firebaseUpdateSubtask(subtask)
            if(result) {
                this.messages.success = "サブタスクを更新しました。"
            } else {
                this.messages.error = "サブタスクの更新に失敗しました。"
            }
            this.subtask_editor = {};
            this.subtask_option = []
            this.subtask_list = await this.getSubtaskList(this.detail);
            this.subtask_mode = "task";
        },
        // サブタスク削除
        async deleteSubtask(subtask) {
            const result = await this.firebaseDeleteSubtask(subtask);
            if(result) {
                this.messages.success = "サブタスクを削除しました。"
            } else {
                this.messages.error = "サブタスクの削除に失敗しました。"
            }
            this.subtask_list = await this.getSubtaskList(this.detail);
        },
        // サブタスク詳細
        clickSubtaskRecord(subtask) {
            this.subtask_viewer = subtask;
            this.subtask_option.push(
                { function_cd: "cancel", text: "閉じる", callback: this.closeSubtask },
                { function_cd: "edit", text: "編集", callback: this.changeSubtaskMode },
            )
            this.subtask_mode = "subtask_detail";
        },
        changeSubtaskMode(mode, item) {
            this.subtask_option = [
                { function_cd: "cancel", text: "キャンセル", callback: this.closeSubtask },
                { function_cd: "save", text: "保存", callback: this.updateSubtask },
            ]
            this.subtask_editor = item;
            this.subtask_mode = mode;
        },
        async closeSubtask() {
            this.subtask_list = await this.getSubtaskList(this.detail)
            this.subtask_option = [];
            this.subtask_viewer =  {}
            this.subtask_editor =  {}
            this.subtask_mode = "task";
        },
        // タスク概要
        async updateTaskDescription() {
            const result = await this.firebaseUpdateTaskDescription(
            this.detail.task_id,
            this.detail.task_description
            );
            if(result) {
                this.desc_editor = false
                this.messages.success = "タスク概要説明を更新しました。"
            }
        },
        // ファイル一覧取得
        async getTaskFileList() {
            let result = []
            try {
                result = await this.firebaseReadFile();
            } catch (error) {
                console.log(error);
                this.messages.error = `
                ファイルの読み込みに失敗しました。ブラウザを再読み込みしていただくか、
                しばらく時間を置いてから操作してください。`;
            }

            if(result) {
                this.task_files = _getFilesByTaskId(result, this.detail);
            } else {
                this.task_files = []
            }
            this.task_file_loading = false;
            function _getFilesByTaskId(_result, target) {
                return Object.keys(_result)
                        .map((key) => {
                            return _result[key]
                        })
                        .filter((v) => v.task_id == target.task_id);
            }
        },
        // ファイルアップロード
        clickUploadButton() {
            this.messages.success = "";
            this.messages.error = "";
            this.$refs.fileUploadButton.click()
        },
        async taskFileInputChange(event) {
            this.task_file_loading = true
            const files = event.target.files || event.dataTransfer.files
            if( await this.judgeBinaryFileType(files) ) { //util
                try {
                    await this.judgeSameTaskFile(...files)
                    await this.storageUploadTaskFile(...files, this.detail.task_id) //mixin
                    .then((result) => {
                        const task_file_obj = this.generateTaskFileObject(result)
                        this.firebaseSaveFile(task_file_obj); //mixin
                    })
                    this.messages.success = "ファイルをアップロードしました。";
                } catch (error) {
                    this.messages.error = "ファイルアップロードに失敗しました。";
                    console.log(error);
                }
                await this.getTaskFileList(); //mixin
            } else {
                this.messages.error = `
                    許可されていないファイル形式または、ファイルの元データが改ざんされています。\n
                    アップロード可能なファイル形式はjpg, png, gif, pdfです
                `;
            }
            scrollTo(0,0)
            this.task_file_loading = false;
        },
        generateTaskFileObject(result) {
            return {
                db_id: result.customMetadata.db_id,
                name: result.name,
                size: result.size,
                contentType: result.contentType,
                download_path: result.download_path,
                task_id: result.customMetadata.task_id,
            }
        },
        // 同名ファイルの上書き
        async judgeSameTaskFile(upload_file) {
            let result = this.task_files;
            result = result.filter((v) => v.name === upload_file.name)
            if(result.length === 0) return;
            return await this.executeDeleteSameTaskFile(...result)
        },
        async executeDeleteSameTaskFile(file) {
            try {
                const result = await this.firebaseDeleteFile(file)
                if(result) {
                    await this.storageDeleteFile(file)
                }
            } catch (error) {
                console.log(error);
            }
            return;
        },
        // ファイル削除確認
        clickFileDeleteSingle(file) {
            this.delete_title = `ファイル「${file.name}」を削除します。`;
            this.delete_options.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeModal },
                { function_cd: "delete", text: "削除する",   callback: this.execDeleteFile }
            )
            this.delete_file = file;
            this.delete_modal = true;
        },
        // ファイル物理削除
        async execDeleteFile() {
            this.task_file_loading = true;
            this.delete_modal = false;
            const storage_result = await this.storageDeleteFile(this.delete_file)
            if(storage_result) {
                await this.firebaseDeleteFile(this.delete_file)
                this.messages.success = `ファイル${this.delete_file.name}を削除しました。`
            } else {
                this.messages.success = `ファイル${this.delete_file.name}の削除に失敗しました。`
            }
            scrollTo(0,0)
            await this.getTaskFileList()
            this.delete_file = {}
            this.delete_options = []
            this.task_file_loading = false;
        },
        // 全てのファイルを削除確認
        clickAllFileDelete() {
            this.delete_title = `このタスクにアップされている全てのファイルを削除します`;
            this.delete_options.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeModal },
                { function_cd: "delete", text: "削除する",   callback: this.deleteFilesByTaskFromDetail }
            )
            this.delete_modal = true;
        },
        // 全てのファイル物理削除
        async deleteFilesByTaskFromDetail() {
            this.delete_modal = false;
            this.task_file_loading = true;
            try {
                for(const file of this.task_files) {
                    const result = await this.storageDeleteFile(file)
                    if(result) {
                        await this.firebaseDeleteFile(file)
                    }
                }
                this.messages.success = "全てのファイルを削除しました。";
            } catch (error) {
                console.log(error);
                this.messages.error = `
                ファイル削除中にエラーが発生しました。
                時間をおいてもう一度やり直してください。`
            }
            scrollTo(0,0)
            await this.getTaskFileList();
            this.delete_options = [];
            this.task_file_loading = false;
        },
        
        // タスク削除
        clickTaskDelete() {
            this.delete_options.push(
                { function_cd: "cancel", text: "キャンセル", callback: this.closeModal },
                { function_cd: "delete", text: "削除する",   callback: this.execDeleteTask }
            )
            this.delete_title = `タスク「${this.detail.task_name}」を削除します。`;
            this.delete_item = this.detail;
            this.delete_modal = true;
        },
        // 物理削除
        async execDeleteTask() {
            try {
                await this.firebaseDeleteTask(this.delete_item)
                await this.deleteSubtasksByTaskFromDetail(this.subtask_list)
                await this.deleteFilesByTaskFromDetail(this.task_files)
                this.messages.success = "タスクを削除しました。"
            } catch (error) {
                this.messages.error = "タスク削除に失敗しました。"
            }
            this.closeDetail();
            this.listRefresh()
            this.delete_item = {}
            this.delete_options = []
            this.delete_modal = false
        },
        // タスクに紐付くサブタスクの物理削除
        async deleteSubtasksByTaskFromDetail(subtask_list) {
            if(subtask_list.length === 0) return;
            try {
                await subtask_list.forEach(item => {
                    this.firebaseDeleteSubtask(item);
                })    
            } catch (error) {
                console.log(error);
                throw new Error();
            }
        },
        closeModal() {
            this.delete_options = []
            this.delete_item = {}
            this.delete_modal = false;
            this.task_file_loading = false;
        },
        // 詳細閉じる
        closeDetail() {
            this.listRefresh()
            this.messages.success = ""
            this.messages.error = ""
            this.delete_options = []
            this.delete_item = {}
            this.subtask_viewer =  {}
            this.subtask_editor =  {}
            this.task_name_edit = false
            this.desc_editor = false
            this.$emit("close-detail-modal")
        },
    }
}
</script>
<style scoped>
.detail {
    padding-bottom: 120px!important;
    height: 100%;
    background-color: #fff;
}
.v-toolbar {
    position: sticky;
    top: 0;
    z-index: 2;
}
.toolbar_title {
    width: 100%;
}
.taskname {
    position: relative;
    width: 100%;
}
.taskname_edit {
    position: relative;
}
.taskname_edit_input {
    background-color: #fff;
    padding: 8px 72px 8px 12px;
    border: none;
    outline: none;
    font-size: 16px;
    width: 100%;
}
.taskname_edit_input:focus {
    border: none;
    outline: none;
}
.taskname_edit_save {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%!important;
}
.relative {
    position: relative;
}
.date_picker {
    position: absolute;
    box-shadow: 0px 2px 8px #00000029;
    padding: 0.5rem 1rem;
    background-color: #fff;
    z-index: 2;
}
.date_picker {
    left: 0;
    top: 100%;
}
.file-table {
    width: 100%;
    border-collapse: collapse;
}
.file-table tbody tr:not(:first-child) {
    border-top: 1px solid #ccc;
}
.file-table td,
.file-table th {
    font-size: 14px;
    padding: 8px;
    vertical-align: center;
}
.operation-td {
    text-align: right;
}
.v-btn:not(.v-btn--round).v-size--default {
    min-width: unset;
    padding: 0 4px;
}
.editor_body {
    padding: 16px;
    background-color: #f5f5f8;
}
.detail-editor >>> .ql-container.ql-snow {
    min-height: 150px;
    font-size: medium;
}
</style>