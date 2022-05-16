<template>
    <div>
        <div class="fixed-page-bottom">
            <v-menu offset-y top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="primary"
                        fab
                        x-large
                        dark
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon x-large>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item>
                        <v-btn
                            text
                            @click="$refs.pseudoInputFile.click()"
                        >
                            ファイルを選択
                        </v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn
                            text
                            @click="createFolderModal = true"
                        >
                            フォルダを作成
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
            <input
                type="file"
                multiple
                @change="uploadChange"
                ref="pseudoInputFile"
                style="display: none;"
            >
        </div>
        <!-- フォルダ作成 -->
        <v-dialog
            v-model="createFolderModal"
            width="600"
            >
            <v-card>
                <div class="font-weight-bold pa-4">
                    フォルダ作成
                </div>
                <v-divider></v-divider>
                <v-text-field
                    v-model.trim="folder_name"
                    dense
                    outlined
                    label="フォルダ名"
                    class="mt-4 px-4"
                ></v-text-field>
                <v-divider></v-divider>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        color="gray"
                        outlined
                        large
                        @click="createFolderModal = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        :disabled="!folder_name"
                        large
                        color="primary"
                        @click="executeCreateFolder()"
                    >
                        保存
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="params.loading"
            persistent
            width="400"
        >
            <UploadingOverlay />
        </v-dialog>
    </div>
</template>

<script>
import UploadingOverlay from '@/components/common/UploadingOverlay.vue'
import myMixin from './file'

export default {
    components: {
        UploadingOverlay
    },
    props: {
        params: Object
    },
    mixins: [myMixin],
    data: () => ({
        createFolderModal: false,
        folder_name: "",
    }),
    methods: {
        shareFolderFormdata() {
            return {
                "id"           : this.createRandomId(),
                "uid"          : this.storeGetFirebaseUid(),
                "type"         : 0,
                "name"         : this.folder_name,
                "size"         : "",
                "upload_at"    : this.getCurrentUnixtime(),
                "delete"       : 0,
                "parent_dir_id": this.params.now_dir,
            }
        },
        shareFileFormdata(file) {
            return {
                    "id"           : this.createRandomId(),
                    "uid"          : this.storeGetFirebaseUid(),
                    "type"         : 1,
                    "name"         : file.name,
                    "size"         : file.size,
                    "upload_at"    : this.getCurrentUnixtime(),
                    "delete"       : 0,
                    "parent_dir_id": this.params.now_dir,
            }
        },
        async executeCreateFolder() {
            const formdata = this.shareFolderFormdata()
            //保存処理
            const result = await this.firebaseCreateShareFiles(formdata)
            if(result) {
                this.params.success    = `「フォルダ : ${this.folder_name}」を作成しました。`
                this.createFolderModal = false
            }
            this.readShareFiles(this.params.now_dir)
        },
        async uploadChange() {
            this.params.dragging = false
            this.params.loading  = true
            let files            =  event.target.files

            for (let i = 0; i < files.length; i++) {
                const data = this.shareFileFormdata(files[i])
                // 保存処理
                await this.storageUploadShareFile(data)
                .then((downloadPath) => {
                    data.download_path = downloadPath
                    this.firebaseCreateShareFiles(data)
                })
                .catch((error) => {
                    console.log(error);
                })
            }

            this.params.loading = false
            this.readShareFiles(this.params.now_dir)
        },
    }
}
</script>

<style scoped>
.fixed-page-bottom {
    position: fixed;
    bottom: 24px;
    right: 24px;
}
</style>