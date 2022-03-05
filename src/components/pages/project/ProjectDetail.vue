<template>
    <div class="detail_inner">
        <div class="d-flex align-center">
            <div
                class="text-h5 font-weight-bold projectname"
            >
                <div v-if="projectNameEdit" class="projectname_edit">
                    <v-text-field
                        v-model="projectDetail.project_name"
                    >
                    </v-text-field>
                    <v-btn
                        color="primary"
                        @click="projectNameUpdate()"
                        class="projectname_edit_save px-2"
                    >
                        保存
                    </v-btn>
                </div>
                <div v-else>
                <v-btn
                    text
                    color="primary"
                    @click="projectNameEdit = true"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                {{ projectDetail.project_name }}
                </div>
            </div>
            <v-spacer></v-spacer>
            <div>
                <v-btn
                    text
                    @click="deleteConfirm()"
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
                        :items="this.params.project_status_list"
                        item-text="text"
                        item-value="key"
                        outlined
                        color="primary"
                        dense
                        v-model="status"
                        @change="settingProjectStatus()"
                    ></v-select>
                </v-col>
                <!-- 優先度 -->
                <v-col cols="4">
                    <v-select
                        label="優先度"
                        :items="this.params.project_priorities"
                        item-text="text"
                        item-value="key"
                        v-model="priority"
                        outlined
                        color="primary"
                        dense
                        @change="settingProjectPriority()"
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
                        {{ projectDetail.project_start_date }} ~ {{ projectDetail.project_end_date }}
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
                                @click="projectTermSetting()"
                            >保存</v-btn>
                            <v-btn
                                text
                                @click="term_dates = [], term = false"
                            >キャンセル</v-btn>
                            <v-btn
                                text
                                color="red"
                                @click="deleteProjectTerm()"
                            >日付を消去</v-btn>
                        </div>
                    </div>
                </v-col>
                </v-row>
                <v-spacer />
            </div>
        <v-divider />
        
        <!-- project detail -->
        <div class="py-6">
            <v-card-actions class="px-0">
                <div class="font-weight-bold">■ プロジェクト詳細</div>
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
                        @click="updateProjectDescription()"
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
                    v-model.trim="projectDetail.project_description"
                />
            </div>
            <div class="editor_body" v-else>
                <div v-if="projectDetail.project_description">
                    <div v-html="projectDetail.project_description"></div>
                </div>
                <div v-else>
                    プロジェクトの詳細がありません
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
                <span class="text-h5">このプロジェクトにアップされている全てのファイルを削除します</span>
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

        <!-- delete project confirm -->
        <v-row justify="center">
            <v-dialog
            v-model="project_delete_confirm"
            persistent
            max-width="600px"
            >
            <v-card>
                <v-card-title>
                <span class="text-h5">プロジェクトを削除します</span>
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
                        @click="project_delete_confirm = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        depressed
                        class="pa-4"
                        color="red darken-4"
                        outlined
                        @click="execDeleteProject(projectDetail)"
                        
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


export default {
    props: {
        closeDetail: Function,
        params: Object,
        projectDetail: Object,
        refreshProjectList: Function,
        refreshProjectDetail: Function,
        getFileList: Function
    },
    components: {
        Editor
    },
    data: () => ({
        // layout
        wide_display: false,
        status: null,
        // プロジェクト名
        projectNameEdit: false,
        // プロジェクト詳細
        desc_edit: false,
        edidor_settings: tinymceSettings.edidor_settings,
        //プロジェクト優先度
        priority: null,
        //file
        delete_file_modal: false,
        delete_all_file_modal: false,
        file_loading: false,
        file_upload_done: false,
        file_delete_done: false,
        delete_file: {},
        // menu
        project_delete_confirm: false,
        loading: false,
        success: false,
        // project date picker
        term: false,
        term_dates: [],
    }),
   
    created(){
        
        this.setProjectStatus()
        this.setProjectPriority()
    },
    updated() {
        this.setProjectStatus()
        this.setProjectPriority()
    },
    computed: {
        dateRangeText() {
            return this.projectDetail.project_start_date + " 〜 " + this.projectDetail.project_end_date
        },
    },
    methods: {
       
        // ファイルアップロード
        onFileChange(e) {
            this.file_loading = true
            this.file_select = false
            const files = e.target.files || e.dataTransfer.files
            if(files.length > 0) {
                this.apiUploadFile(files[0], this.projectDetail.project_id, "project")
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
            files.forEach(r => {
                this.apiDeleteFileStorage(r)
            })
        },
        // プロジェクト名
        projectNameUpdate() {
            this.apiUpdateProjectname(this.projectDetail.project_id, this.projectDetail.project_name)
            this.projectNameEdit = false
            this.refreshProjectDetail()
            this.refreshProjectList()
        },
        // 概要
        updateProjectDescription() {
            this.apiUpdateProjectDescription(this.projectDetail.project_id, this.projectDetail.project_description);
            this.desc_edit = false
            this.refreshProjectDetail()

        },
        // 優先度
        setProjectPriority() {
            let project_priority = this.projectDetail.project_priority
            const list = this.params.project_priorities
            list.forEach(r => {
                r.key == project_priority.key ? this.priority = r : null
            })
        },
        //プロジェクト優先度更新
        settingProjectPriority() {
            const list = this.params.project_priorities
            let priority = ""
            list.forEach(r => {
                if(this.priority == r.key) {
                   priority = r
                }
            })
            this.apiSettingProjectPriority(this.projectDetail.project_id, priority)
            this.refreshProjectDetail()
            this.refreshProjectList()
        },
        //プロジェクトステータスセット
        setProjectStatus() {
            let project_status = this.projectDetail.project_status
            const list = this.params.project_status_list
            list.forEach(r => {
                r.key == project_status.key ? this.status = r : null
            })
        },
        //プロジェクトステータス更新
        settingProjectStatus() {
            const status_list  = this.params.project_status_list
            let status = ""
            status_list.forEach(r => {
                if(this.status == r.key) {
                   status = r
                }
            })
            this.apiSettingProjectStatus(this.projectDetail.project_id, status)
            this.refreshProjectDetail()
            this.refreshProjectList()
        },

        
        // プロジェクト期間設定
        projectTermSetting() {
            this.term = false
            this.term_dates.sort(function(a, b){
                return (a > b ? 1 : -1);
            })
            this.apiSettingProjectTerm(this.term_dates, this.projectDetail.project_id)
            this.refreshProjectDetail()
            this.refreshProjectList()
        },
        deleteProjectTerm() {
            this.term_dates = [],
            this.term = false
            this.apiDeleteProjectTerm(this.projectDetail.project_id)
            this.refreshProjectDetail()
            this.refreshProjectList()
        },
        
        // プロジェクト削除
        deleteConfirm() {
            this.project_delete_confirm = true
        },
        execDeleteProject(projectDetail) {
            let from_detail = true
            this.apiDeleteProject(projectDetail)
            this.execDeleteAllFile(this.params.files)
            this.project_delete_confirm = false
            this.refreshProjectList(null, from_detail)
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
.project_link,
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
    right: 0;
    top: 100%;
}
.projectname {
    position: relative;
    width: 80%;
}
.projectname_edit_save {
    position: absolute;
    right: 0;
    top: 8px;
}
.project_link {
    right: 0;
}
.alt_submit {
    position: absolute;
    right: 8px;
    top: 35%;
    transform: translateY(-35%);
}
td {
    font-size: 14px;
}
.project-list {
    border-collapse: collapse;
    table-layout: unset;
    width: 100%;
}


.project-list tr:not(:first-child) {
    border-top: 1px solid #ccc;
}
.project-list tr {
    border-bottom: 1px solid #ccc;
}
.project-list tr:hover {
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
/* editor style */
.editor_body {
    padding: 24px;
    background-color: #f9f9f9;
}
.editor_body >>> p,
.editor_body >>> li {
    font-size: 14px;
}
</style>
