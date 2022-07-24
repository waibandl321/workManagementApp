<template>
    <v-dialog
        v-model="params.detail_mode"
        persistent
        max-width="1024px"
    >
    <!-- ツールバー -->
    <TaskDetailToolbar 
        :closeDetail="closeDetail"
        :clickTaskDelete="clickTaskDelete"
        :params="params"
    ></TaskDetailToolbar>
    <div class="pa-6 detail">
        <!-- メッセージ -->
        <MessageViewer
            :params="params"
        />
        <!-- 期限切れアラート -->
        <TaskDeadlineAlert :params="params"></TaskDeadlineAlert>

        <!-- ステータス・優先度設定 -->
        <TaskStatusPriority :params="params"></TaskStatusPriority>
        <v-divider />

        <!-- 期日設定 -->
        <TaskTerm
            :params="params"
        ></TaskTerm>
        <v-divider />

        <!-- サブタスク一覧 -->
        <SubtaskList
            :params="params"
            :clickSubtaskNew="clickSubtaskNew"
            :clickSubtaskRecord="clickSubtaskRecord"
        ></SubtaskList>

        <!-- 概要 -->
        <TaskDescription :params="params"></TaskDescription>
        
        <!-- 添付ファイル -->
        <TaskAttachment
            :params="params"
            :file_loading="file_loading"
            :clickAllFileDelete="clickAllFileDelete"
            :clickFileDeleteSingle="clickFileDeleteSingle"
        ></TaskAttachment>

        <!-- 削除確認 -->
        <ConfirmDelete
            v-if="delete_modal"
            :delete_title="delete_title"
            :delete_options="delete_options"
        />

        <!-- サブタスク詳細・編集 -->
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
import TaskStatusPriority from "./detail/TaskStatusPriority.vue"
import SubtaskEdit from "./subtask/SubtaskEdit.vue"
import SubtaskView from "./subtask/SubtaskView.vue"
import SubtaskList from "./subtask/SubtaskList.vue"
import myMixin from "./task.js"
import TaskAttachment from "./detail/TaskAttachment.vue"

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
    TaskStatusPriority,
    SubtaskList,
    TaskAttachment
},
    props: {
        listRefresh: Function,
        params: Object,
    },
    data: () => ({
        file_loading: false,
        delete_file: {},
        
        subtask_mode: "task",
        subtask_option: [],
        
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