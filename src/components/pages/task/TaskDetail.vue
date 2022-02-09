<template>
    <div class="detail_inner">
        <div class="d-flex align-center">
            <h2>{{ taskDetail.task_name }}</h2>            
            <v-spacer />
            <div class="relative">
                <v-btn
                    class="ma-2"
                    text
                    @click="link_area = !link_area"
                >
                    <v-icon>mdi-link</v-icon>
                </v-btn>
                <div
                    v-if="link_area"
                    class="task_link d-flex align-center">
                    <div>
                        <small>このタスクのリンク</small>
                        https://www.example.com/task/:id/
                    </div>
                    <div class="ml-2">
                        <v-btn text class="ma-2">
                            <v-icon>mdi-content-copy</v-icon>
                        </v-btn>
                    </div>
                </div>
            </div>
            <div class="relative">
                <v-btn
                    class="ma-2"
                    text
                    @click="task_menu = !task_menu"
                >
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <div
                    v-if="task_menu"
                    class="task_menu">
                    <div>
                        <v-btn text class="ma-2">
                            <v-icon class="mr-2">mdi-open-in-new</v-icon>
                            別タブで開く
                        </v-btn>
                    </div>
                    <div>
                        <template v-if="!wide_display">
                            <v-btn
                                text
                                class="ma-2"
                                @click="wide()"
                            >
                                <v-icon class="mr-2">mdi-arrow-expand-all</v-icon>
                                全画面表示
                            </v-btn>
                        </template>
                        <template v-else>
                            <v-btn
                                text
                                class="ma-2"
                                @click="wide()"
                            >
                                <v-icon class="mr-2">mdi-arrow-collapse-all</v-icon>
                                リストを表示
                            </v-btn>
                        </template>
                    </div>
                    <div>
                        <v-btn
                            text
                            class="ma-2"
                            @click="task_delete_confirm = !task_delete_confirm"
                        >
                            <v-icon>mdi-trash-can-outline</v-icon>
                            タスクを削除
                        </v-btn>
                    </div>
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
                        :items="status_list"
                        item-text="text"
                        item-value="key"
                        outlined
                        color="primary"
                        dense
                        v-model="default_status"
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
                <div style="font-size: 14px;">
                    <span>タスクID : {{ taskDetail.task_id }} </span>
                    <span>作成者 : {{ taskDetail.task_manager }}</span>
                    <span>作成日 : {{ taskDetail.created_at }}</span>
                </div>
            </div>
        <v-divider />
        <div class="relative">
            <v-btn
                @click="term = !term"
                text
                class="ma-2"
            >
                <v-icon>mdi-calendar-check-outline</v-icon>
                {{ dateRangeText }}
            </v-btn>
            <v-btn
                text
                class="ma-2"
                @click="subtask_input = !subtask_input"
            >
                <v-icon>mdi-subdirectory-arrow-right</v-icon>
                サブタスク
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
                    >
                    <v-btn
                        text
                        @click="inputfileClick()"
                    >
                        <v-icon class="mr-2">mdi-desktop-mac</v-icon>
                        お使いのコンピューター
                    </v-btn>
                </div>
                <div>
                    <v-btn
                        text
                        class="my-2"
                        @click="selectFromFileAdmin()"
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
                        @click="term = false"
                    >保存</v-btn>
                    <v-btn
                        text
                        @click="term = false, term_dates = []"
                    >キャンセル</v-btn>
                    <v-btn
                        text
                        color="red"
                        @click="term_dates = []"
                    >日付を消去</v-btn>
                </div>
            </div>
        </div>
        <!-- subtask area -->
        <div class="task-add-form" v-show="subtask_input">
            <div class="relative">
                <v-text-field
                    label="タスク名を入力"
                    outlined
                    dense
                >
                </v-text-field>
                <v-btn
                    depressed
                    class="primary alt_submit"
                    text
                >新規作成
                </v-btn>
            </div>
        </div>
        <v-divider />
        <div class="subtask_list" v-if="subtasks">
            <table class="task-list mt-4">
                <tbody>
                <tr
                    v-for="subtask in subtasks"
                    :key="subtask.id"
                    @click="record(subtask)"
                >
                    <td class="py-2">
                        <v-avatar
                            color="teal"
                            size="32"
                        >
                            <span class="white--text">大純</span>
                        </v-avatar>
                    </td>
                    <td class="py-2">{{ subtask.subtask_name }}</td>
                    <td class="py-2">{{ subtask.subtask_status.value }}</td>
                </tr>
                </tbody>
            </table>
            <v-btn
                text
                class="ma-2"
                color="primary"
                @click="subtask_input_bottom = !subtask_input_bottom"
            >
                <v-icon >mdi-plus</v-icon>
                サブタスクを追加
            </v-btn>
            <div class="task-add-form" v-show="subtask_input_bottom">
                <div class="relative">
                    <v-text-field
                        label="タスク名を入力"
                        outlined
                        dense
                    >
                    </v-text-field>
                    <v-btn
                        depressed
                        class="primary alt_submit"
                        text
                    >新規作成
                    </v-btn>
                </div>
            </div>
        </div>
        <!-- task detail -->
        <div class="py-6">
            <p>■ タスク詳細</p>
            <Editor
                ref="editor"
                :api-key="edidor_settings.apikey"
                :initialValue="edidor_settings.initialValue"
                :init="edidor_settings.init"
            />
        </div>
        <!-- files -->
        <div class="d-flex align-center mt-4 mb-2">
            <div>2 Files</div>
            <div class="file_operation_wrap">
                <v-btn
                    text
                    @click="all_file_admin = !all_file_admin"
                >
                    <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
                <div class="drawer" v-if="all_file_admin">
                    <v-btn text>
                        <v-icon>mdi-trash-can-outline</v-icon>
                        全て削除
                    </v-btn>
                </div>
            </div>
            <v-spacer />
            <v-btn text>
                <v-icon>mdi-download</v-icon>
                ダウンロード
            </v-btn>
            <v-btn text>
                <v-icon>mdi-trash-can-outline</v-icon>
                削除
            </v-btn>
        </div>
        <v-divider />
        <!-- file list -->
        <div class="py-4">
            <div class="d-flex align-center py-2" v-for="i of 2" :key="i">
                <v-checkbox
                
                ></v-checkbox>
                <div class="preview">
                    <v-img src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" width="100"/>
                </div>
                <div>ファイル名ファイル名</div>
                <v-spacer />
                <div>アップロード日時</div>
                <div>アップした人の名前</div>
            </div>
        </div>
        <v-divider />
        <!-- messages -->
        <div class="pt-4">
            <v-list class="pb-6">
                <v-list-item v-for="(item, i) in messages" :key="i">
                    <v-list-item-avatar color="primary">
                        {{ item.account_id }}
                    </v-list-item-avatar>
                    
                    <v-list-item-content>
                        <v-list-item-title class="grey lighten-4 pa-2">
                            <v-btn text color="primary"><v-icon>mdi-at</v-icon>{{ item.message_to }}</v-btn>
                            {{ item.message_content }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                
            </v-list>
            <v-divider />
            <!-- message input -->
            <div class="d-flex align-center pt-6 message_send">
                <div class="avatar">
                    <v-avatar
                        color="primary"
                        size="32"
                    >
                        <span class="white--text">大純</span>
                    </v-avatar>
                </div>
                <div class="message_send_textarea px-2 d-flex">
                    <v-textarea
                        auto-grow
                        filled
                        rows="1"
                    >
                    </v-textarea>
                    <div class="icons">
                        <v-btn text><v-icon>mdi-at</v-icon></v-btn>
                        <v-btn text><v-icon>mdi-emoticon</v-icon></v-btn>
                        <v-btn text><v-icon>mdi-paperclip</v-icon></v-btn>
                    </div>
                </div>
                <div class="message_send_btn">
                    <v-btn fill color="primary" large>送信</v-btn>
                </div>
            </div>
        </div>
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
                        @click="file_select_modal = false"
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
                        @click="task_delete_confirm = false"
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
import Editor from "@tinymce/tinymce-vue"
import message_json from "@/config/json/message.json"
import settings from "@/config/json/settings.json"
import project_json from "@/config/json/projects.json"
export default {
    props: ["taskDetail", "closeDetail", "parents", "params", "displayWidth"],
    components: {
        Editor
    },
    data: () => ({
        default_status: { key: 1, text: "未着手" },
        status_list: [],
        // message
        messages: [],
        //file
        all_file_admin: false,
        file_select: false,
        file_select_modal: false,
        //priject
        select_projects: false,
        projects: null,
        project: null,
        //link
        link_area: false,
        // menu
        task_menu: false,
        task_delete_confirm: false,
        // manager
        select_manager: false,
        //subtask
        subtask_input: false,
        subtask_input_bottom: false,
        subtasks: [],
        // display
        wide_display: false,

        //editor
        edidor_settings: {
            apikey:'oq5iukdtuvton4zy3smr1m1pwaar2rfkjg98z8p1fv5q8tbt',
            init: {
                height : 300,
                selector: "textarea",
                menubar: false,
                table_toolbar: [
                    'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol'
                ],
                plugins: [
                    'print preview fullpage importcss searchreplace autolink \
                    autosave save directionality visualblocks visualchars fullscreen image link media template codesample \
                    table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount \
                    imagetools textpattern noneditable help charmap quickbars  emoticons'
                ],
                toolbar:[
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help table'
                ],
            },
            initialValue: '<p>This is the initial content of the editor</p>',
        },
        // file list
        selected: [],
        // task date picker
        term: false,
        term_dates: [],
    }),

    created(){
        this.init()
    }, 
    
    computed: {
      // term_date
        dateRangeText () {
            return this.term_dates ? this.term_dates.join(' ~ ') : ""
        },
    },

    methods: {
        
        // close detail
        close() {
            this.closeDetail()
        },
        wide() {
            this.wide_display = !this.wide_display
            this.displayWidth(this.wide_display);
        },
        // load data
        init() {
            this.messages = message_json.messages
            this.status_list = settings.status_list
            this.projects = project_json.projects
            this.subtasks = this.params.subtasks
        },
        // file upload
        inputfileClick() {
            this.$refs.file.click();
        },
        selectFromFileAdmin() {
            this.file_select_modal = true
        },
        // select task manager
        selectManager() {
            this.select_manager = false
        },

        //subtask
        record(subtask) {
            console.log(subtask)
        }
        
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
.task_menu,
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
.task_menu,
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
</style>
