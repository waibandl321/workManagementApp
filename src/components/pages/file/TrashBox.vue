<template>
    <div>
        <v-row class="ma-0">
            <v-col cols="2">
                <v-btn
                    text
                    @click="del(file)"
                >
                    <v-icon>mdi-trash-can-outline</v-icon>
                    全てのアイテムを削除する
                </v-btn>
            </v-col>
            <v-col cols="7">
                <Breadcrumb
                    :params="params"
                    :backFunc="backFunc"
                />
                <div>
                    <h2>フォルダ(ゴミ箱)</h2>
                    <v-divider />
                    <div 
                        v-if="no_folder"
                        class="mt-4"
                    >
                        {{ no_folder }}
                    </div>
                    <div v-if="trashFolders">
                        <v-row class="ma-0">
                            <v-col
                                cols="4"
                                v-for="(folder, i) in trashFolders"
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
                    <h2>ファイル(ゴミ箱)</h2>
                    <v-divider />
                    <v-row
                        class="ma-0"
                        v-if="trashFiles"
                    >
                        <v-col
                            cols="4"
                            v-for="(file, i) in trashFiles"
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
                    <span v-if="flag == 'file'">
                        <v-icon class="mr-2">mdi-microsoft-excel</v-icon>
                        ファイルの詳細
                    </span>
                    <span v-else-if="flag == 'folder'">
                        フォルダの詳細
                    </span>
                    <span v-else>
                        アイテムをクリックすると詳細を表示
                    </span>
                </h3>
                <v-divider />
                <ul class="mt-4" v-if="flag == 'file'">
                    <li>ファイル名 : {{ file_detail.file_name }}</li>
                    <li>種類 : {{ file_detail.file_type }}</li>
                    <li>作成者 : {{ file_detail.account_id }}</li>
                    <li>最終更新 : {{ file_detail.updated_at }}</li>
                    <li>作成日 : {{ file_detail.created_at }}</li>
                </ul>
                <ul class="mt-4" v-else-if="flag == 'folder'">
                    <li>フォルダ名 : {{ folder_detail.folder_name }}</li>
                    <li>作成者 : {{ folder_detail.account_id }}</li>
                    <li>最終更新 : {{ folder_detail.updated_at }}</li>
                    <li>作成日 : {{ folder_detail.created_at }}</li>
                </ul>
            </v-col>
        </v-row>
        
        <!-- item delete -->
        <v-row justify="center">
            <v-dialog
                v-model="delete_modal"
                persistent
                max-width="600px"
            >
            <v-card class="pa-4">
                <v-card-title>
                <span class="text-h5">アイテムを完全に削除します</span>
                </v-card-title>
                <v-card-text>
                    削除後は復元できません。<br>
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
        
    </div>
</template>
<script>
import file_data from "@/config/json/file.json"
import Breadcrumb from "@/components/common/Breadcrumb.vue"


export default {

    components: {
        Breadcrumb,
    },
    props: {
        params: Object,
        trashBackFunc: Function
    },
    data: () => ({
        
        delete_modal: false,
        delete_item: [],

        trashFolders: [],
        trashFiles: [],

        has_parent_folder: [],
        has_folder_files: [],

        flag: "",
        current_folder: null,
        file_detail: [],
        folder_detail: [],

        no_folder: "",

    }),

    created(){
        this.init()
    },

    methods: {
        // data set
        init() {
            this.params.trash_files.forEach(r => {
                if(!r.folder_id) {
                    this.trashFiles.push(r)
                } else {
                    this.has_folder_files.push(r)
                }
            })
            this.params.trash_folders.forEach(r => {
                if(!r.parent_folder) {
                    this.trashFolders.push(r)
                } else {
                    this.has_parent_folder.push(r)
                }
            });
        },
        // reset data
        reset() {
            this.trashFolders = []
            this.trashFiles = []
            this.has_parent_folder = [],
            this.has_folder_files = [],
            this.file_detail = [],
            this.folder_detail = [],
            this.current_folder = 0,
            this.flag = ""
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
            this.flag = "file"
            this.file_detail = file
        },
        
        // folder
        folderItemClick(folder) {
            this.flag = "folder"
            this.folder_detail = folder
        },
        folderDblClick(id){
            this.trashFolders = []
            this.trashFiles = []
            this.current_folder = id
            this.has_parent_folder.forEach(r => {
                if(id == r.parent_folder) {
                    this.trashFolders.push(r)
                } else {
                    this.no_folder = "フォルダがありません"
                }
            })
            this.has_folder_files.forEach(r => {
                if(id == r.folder_id) {
                    this.trashFiles.push(r)
                }
            })
        },

        // create || delete || edit
        del(item) {
            this.delete_item = item
            this.delete_modal = true
        },
        execDelete() {
            alert("完全に削除")
            this.delete_modal = false
        },
        
        
        // history back
        backFunc() {
            if(this.current_folder) {
                this.no_folder = ""
                this.reset()
                this.init()
            } else {
                this.trashBackFunc('list')
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