<template>
    <div>
        <v-row
            class="ma-0"
            v-if="mode == 'list'"
        >
            <v-col cols="2" class="file_left">
                <div class="relative">
                    <v-btn
                        @click="create = !create"
                        x-large
                        filled
                        color="primary"
                        class="white--text"
                    >
                        <v-icon large>mdi-plus</v-icon>
                        新規追加
                    </v-btn>
                    <div class="create" v-if="create">
                        <div class="pa-2">
                            <v-btn
                                text
                                @click="create_modal = true"
                            >
                                <v-icon class="mr-2">mdi-folder-multiple-outline</v-icon>フォルダの作成
                            </v-btn>
                        </div>
                        <div class="pa-2">
                            <input type="file" ref="new_file" style="display: none;">
                            <v-btn
                                text
                                @click="newFile()"
                            >
                                <v-icon class="mr-2">mdi-file-outline</v-icon>ファイルのアップロード
                            </v-btn>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <v-btn
                        @click="trashOpen()"
                        text
                    >
                        <v-icon>mdi-trash-can-outline</v-icon>
                        ゴミ箱
                    </v-btn>
                </div>
                {{ params.current_folder }}
            </v-col>
            <v-col cols="7">
                <Breadcrumb
                    :params="params"
                    :backFunc="backFunc"
                    v-if="params.current_folder != 0"
                />
                <div class="mt-4">
                    <v-text-field
                        label="ファイルを検索"
                        outlined
                        dense
                    ></v-text-field>
                </div>
                <div>
                    <h2>フォルダ</h2>
                    <v-divider />
                    <div v-if="params.folders">
                        <v-row class="ma-0">
                            <v-col
                                cols="4"
                                v-for="(folder, i) in params.folders"
                                :key="i"
                            >
                                <div class="relative">
                                    <div
                                        @click="folderItemClick(folder)"
                                        @dblclick="folderDblClick(folder.folder_id)"
                                        class="item d-flex align-center">
                                        <v-icon class="mr-2">mdi-folder-multiple-outline</v-icon>
                                        <span>{{ folder.folder_name }}</span>
                                    </div>
                                    <div class="admin">
                                        <v-btn
                                            text
                                            small
                                            @click="edit(folder)"
                                        >
                                            <v-icon>mdi-pencil-outline</v-icon></v-btn>
                                        <v-btn
                                            text
                                            small
                                            @click="del(folder)"
                                        >
                                            <v-icon>mdi-trash-can-outline</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                    <div v-else>
                        <div>フォルダなし</div>
                    </div>
                </div>
                <div class="mt-6">
                    <h2>ファイル</h2>
                    <v-divider />
                    <v-row class="ma-0">
                        <v-col
                            cols="4"
                            v-for="(file, i) in params.files"
                            :key="i"
                        >
                            <div class="relative">
                                <div
                                    @click="fileItemClick(file)"
                                    @dblclick="fileItemDblClick(file)"
                                    class="item item_file">
                                    <div class="preview"></div>
                                    <v-divider />
                                    <div class="d-flex align-center pa-3">
                                        <v-icon class="mr-2">{{ fileIcon(file.file_type) }}</v-icon>
                                        <span>{{ file.file_name }}</span>
                                    </div>
                                    <div class="px-3 text-right grey--text darken-2">{{ file.created_at }}</div>
                                </div>
                                <div class="admin">
                                    <v-btn text small><v-icon>mdi-download</v-icon></v-btn>
                                    <v-btn
                                        text
                                        small
                                        @click="del(file)"
                                    >
                                        <v-icon>mdi-trash-can-outline</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
            <v-col cols="3" class="file_details">
                <h3 class="mb-4">
                    <span v-if="params.flag == 'file'">
                        <v-icon class="mr-2">mdi-microsoft-excel</v-icon>
                        ファイルの詳細
                    </span>
                    <span v-else-if="params.flag == 'folder'">
                        フォルダの詳細
                    </span>
                    <span v-else>
                        アイテムをクリックすると詳細を表示
                    </span>
                </h3>
                <v-divider />
                <ul class="mt-4" v-if="params.flag == 'file'">
                    <li>ファイル名 : {{ params.file_detail.file_name }}</li>
                    <li>種類 : {{ params.file_detail.file_type }}</li>
                    <li>作成者 : {{ params.file_detail.account_id }}</li>
                    <li>最終更新 : {{ params.file_detail.updated_at }}</li>
                    <li>作成日 : {{ params.file_detail.created_at }}</li>
                </ul>
                <ul class="mt-4" v-else-if="params.flag == 'folder'">
                    <li>フォルダ名 : {{ params.folder_detail.folder_name }}</li>
                    <li>作成者 : {{ params.folder_detail.account_id }}</li>
                    <li>最終更新 : {{ params.folder_detail.updated_at }}</li>
                    <li>作成日 : {{ params.folder_detail.created_at }}</li>
                </ul>
            </v-col>
        </v-row>
        <TrashBox
            v-if="mode == 'trash'"
            :params="params"
            :trashBackFunc="trashBackFunc"
            :mode="mode"
        />
        <!-- item delete -->
        <v-row justify="center">
            <v-dialog
                v-model="delete_modal"
                persistent
                max-width="600px"
            >
            <v-card class="pa-4">
                <v-card-title>
                <span class="text-h5">アイテムを削除します</span>
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
                        @click="delete_modal = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        depressed
                        class="pa-4"
                        color="red darken-4"
                        outlined
                        @click="execDelete(delete_item)"
                    >
                        削除する
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-row>
        <!-- folder edit -->
        <v-row justify="center">
            <v-dialog
                v-model="edit_modal"
                persistent
                max-width="600px"
            >
            <v-card class="pa-4">
                <v-card-title>
                <span class="text-h5">編集</span>
                </v-card-title>

                <div class="px-4">
                    <v-text-field
                        :value="edit_item.folder_name"
                        outlined
                    ></v-text-field>
                </div>
                
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        outlined
                        depressed
                        class="pa-4"
                        @click="edit_modal = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        depressed
                        class="pa-4"
                        color="primary"
                        filled
                        @click="save()"
                    >
                        保存
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-row>
        <!-- create folder -->
        <v-row justify="center">
            <v-dialog
                v-model="create_modal"
                persistent
                max-width="600px"
            >
            <v-card class="pa-4">
                <v-card-title>
                <span class="text-h5">フォルダを作成</span>
                </v-card-title>

                <div class="px-4">
                    <v-text-field
                        label="フォルダ名を入力"
                        outlined
                    ></v-text-field>
                </div>
                
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        outlined
                        depressed
                        class="pa-4"
                        @click="create_modal = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        depressed
                        class="pa-4"
                        color="primary"
                        filled
                        @click="execCreate()"
                    >
                        新規作成
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>
import file_data from "@/config/json/file.json"
import folder_data from "@/config/json/folder.json"

import Breadcrumb from "@/components/common/Breadcrumb.vue"
import TrashBox from "@/components/pages/file/TrashBox.vue"

export default {

    components: {
        Breadcrumb,
        TrashBox
    },

    data: () => ({
        mode: "list",
        create: false,
        params: {
            files: [],
            has_folder_files: [],
            file_detail: [],
            folders: [],
            folder_detail: [],
            has_parent_folder: [],
            current_folder: 0,
            trash_folders: [],
            trash_files: [],
            flag: ""
        },
        create_modal: false,
        delete_modal: false,
        edit_modal: false,
        edit_item: [],
        delete_item: [],
    }),

    created(){
        this.init()
    },

    methods: {
        // level 0
        init() {
            file_data.files.forEach(r => {
                if(!r.folder_id && r.status != false) {
                    this.params.files.push(r)
                } else if( r.status == false ) {
                    this.params.trash_files.push(r)
                } else {
                    this.params.has_folder_files.push(r)
                }
            })

            folder_data.folders.forEach(r => {
                if(!r.parent_folder && r.status != false) {
                    this.params.folders.push(r)
                }  else if( r.status == false ) {
                    this.params.trash_folders.push(r)
                } else {
                    this.params.has_parent_folder.push(r)
                }
            });
        },
        // reset data
        reset() {
            this.params.files = [],
            this.params.has_folder_files = [],
            this.params.file_detail = [],
            this.params.folders = [],
            this.params.folder_detail = [],
            this.params.has_parent_folder = [],
            this.params.current_folder = 0,
            this.params.flag = ""
        },
        // file
        fileIcon(type) {
            const icons = file_data.icons
            let icon = ''
            icons.forEach(r => {
                if(r.type == type) {
                    icon = r.icon
                }
            })
            return icon
        },
        fileItemClick(file) {
            this.params.flag = "file"
            this.params.file_detail = file
        },
        fileItemDblClick() {

        },
        // folder
        folderItemClick(folder) {
            this.params.flag = "folder"
            this.params.folder_detail = folder
        },
        folderDblClick(id){
            this.params.folders = []
            this.params.files = []
            this.params.current_folder = id
            this.params.has_parent_folder.forEach(r => {
                if(r.parent_folder == id) {
                    this.params.folders.push(r)
                }
            })
            this.params.has_folder_files.forEach(r => {
                if(r.folder_id == id) {
                    this.params.files.push(r)
                }
            })
        },
        // create || delete || edit
        execCreate() {
            alert("フォルダーID : " + this.params.current_folder + 'に作成します')
            this.create_modal = false
        },
        newFile() {
            this.$refs.new_file.click()
        },
        del(item) {
            this.delete_item = item
            this.delete_modal = true
        },
        execDelete() {
            alert("完全に削除")
            this.delete_modal = false
        },
        edit(item) {
            this.edit_item = item
            this.edit_modal = true
        },
        save() {
            alert('保存処理が走ります')
            this.edit_modal = false
        },
        trashOpen() {
           this.mode = 'trash'
        },
        // history back
        backFunc() {
            let current = this.params.folder_detail.parent_folder
            if(!current) {
                this.reset()
                this.init()
            } else {
                this.folderDblClick(current)
            }
        },
        trashBackFunc(mode) {
            if(mode) {
                this.mode = mode
            }
        }
    },
}
</script>
<style scoped>
.file_details {
    border-left: 1px solid #ccc;
}
.file_left {
    border-right: 1px solid #ccc;
}
.item {
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
}
.item.item_file {
    padding: 0;
}
.relative {
    position: relative;
}
.create,
.admin {
    position: absolute;
    padding: 4px 0;
    box-shadow: 0px 2px 8px #00000029;
    border-radius: 8px;
    background-color: #fff;
    z-index: 2;
}
.create {
    top: 100%;
    left: 0;
}
.admin {
    display: none;
    top: -16px;
    right: -20px;
}
.item:hover {
    cursor: pointer;
    background-color: #f9f9f9;
}
.admin:hover,
.item:hover + .admin{
    display: block;
}
.preview {
    height: 150px;
    background-color: #eee;
}
</style>