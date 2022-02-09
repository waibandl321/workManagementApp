<template>
    <div class="detail_inner">
        <div class="d-flex align-center">
            <h2>{{ projectDetail.project_name }}</h2>            
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
                    class="project_link d-flex align-center">
                    <div>
                        <small>このプロジェクトのリンク</small>
                        https://www.example.com/project/:id/
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
                    @click="project_menu = !project_menu"
                >
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <div
                    v-if="project_menu"
                    class="project_menu">
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
                            @click="project_delete_confirm = !project_delete_confirm"
                        >
                            <v-icon>mdi-trash-can-outline</v-icon>
                            プロジェクトを削除
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

            <!-- member -->
            <div
                v-if="projectDetail.project_member"
                class="d-flex align-center px-4"
                style="border-left: 1px solid #ccc; border-right: 1px solid #ccc;"
            >
                <div class="pr-4">プロジェクトメンバー : </div>
                    <v-btn text>
                        <v-avatar
                            color="primary"
                            size="32"
                        >
                            <span class="white--text">大純</span>
                        </v-avatar>
                    </v-btn>
                </div>
                <div class="pl-4">
                    <span class="pr-2">責任者 : </span>
                    <v-avatar
                        color="primary"
                        size="32"
                    >
                        <span class="white--text">{{ projectDetail.project_manager }}</span>
                    </v-avatar>
                </div>
            </div>
        <v-divider />
        <div class="d-flex align-center">
            <div class="relative">
                <v-btn
                    @click="term = !term"
                    text
                    class="ma-2"
                >
                    <v-icon>mdi-calendar-check-outline</v-icon>
                    {{ dateRangeText }}
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
            <div class="relative">
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
            </div>
        </div>
        <!-- project detail -->
        <div class="py-6">
            <p>■ プロジェクト詳細</p>
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
                        @click="project_delete_confirm = false"
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
    props: ["projectDetail", "closeDetail", "parents", "params", "displayWidth"],
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
        //link
        link_area: false,
        // menu
        project_menu: false,
        project_delete_confirm: false,
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
        // project date picker
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
        },
        // file upload
        inputfileClick() {
            this.$refs.file.click();
        },
        selectFromFileAdmin() {
            this.file_select_modal = true
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
.project_menu,
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
.project_menu,
.project_link {
    right: 0;
}
.alt_submit {
    position: absolute;
    right: 8px;
    z-index: 2;
    top: 35%;
    transform: translateY(-35%);
}
.project-list {
    border-collapse: collapse;
    table-layout: unset;
    width: 100%;
}
.project-list tr {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
}
.project-list tr:hover {
    cursor: pointer;
    background-color: #f6f6f6;
}
</style>
