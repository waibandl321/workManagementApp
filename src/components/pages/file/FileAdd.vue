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
                            @click="create_folder_modal = true"
                        >
                            フォルダを作成
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
            <input
                type="file"
                @change="uploadChange"
                ref="pseudoInputFile"
                style="display: none;"
            >
        </div>
        
        <!-- フォルダ作成モーダル -->
        <v-dialog
            v-model="create_folder_modal"
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
                    autofocus
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
                        @click="create_folder_modal = false"
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
    </div>
</template>

<script>
import myMixin from './file'
export default {
    props: {
        params: Object
    },
    mixins: [myMixin],
    data: () => ({
        create_folder_modal: false,
        folder_name: "",
    }),
    created() {
        
    },
    methods: {
        async executeCreateFolder() {
            this.params.success = "";
            this.params.error = "";
            const formdata = this.generateFolderObject();
            try {
                await this.firebaseCreateShareFiles(formdata);
                this.params.success = `「フォルダ : ${this.folder_name}」を作成しました。`;
            } catch (err) {
                this.params.error = "作成中にエラーが発生しました";
                console.log(err);
            }
            this.folder_name = "";
            this.readShareFiles(this.params.now_dir);
            this.create_folder_modal = false;
        },
        
        async uploadChange(event) {
            this.params.loading = true;
            this.params.success = "";
            this.params.error = "";
            const upload_file = event.target.files || event.dataTransfer.files;
            // バイナリレベルの拡張子チェック
            if(await this.judgeBinaryFileType(upload_file)) {
                try {
                    // 同じファイルが存在する場合は一度該当ファイルを削除（ストレージ・DB）
                    await this.judgeSameFile(...upload_file)
                    const custom_metadata = this.generateFileObject(...upload_file)
                    // 保存処理
                    await this.storageUploadShareFile(...upload_file)
                    .then((downloadPath) => {
                        custom_metadata.download_path = downloadPath;
                        this.firebaseCreateShareFiles(custom_metadata);
                        this.params.success = "ファイルをアップロードしました。";
                    })
                } catch (err) {
                    console.log(err);
                    this.params.error = "ファイルをアップロードに失敗しました。";
                }
                this.params.loading = false;
                this.readShareFiles(this.params.now_dir);
            } else {
                this.params.error = `
                    許可されていないファイル形式または、ファイルの元データが改ざんされています。\n
                    アップロード可能なファイル形式はjpg, png, gif, pdfです
                `;
                this.params.loading  = false;
            }
        },

        async judgeSameFile(upload_file) {
            let result = this.params.files;
            result = result.filter((v) => v.name === upload_file.name)
            if(result.length === 0) return;

            console.log("same file name: " + result[0].name);
            await this._executeDelete(...result)
        },
        async _executeDelete(file) {
            try {
                const result = await this.firebaseDeleteShareFiles(file)
                if(result && file.type === 1) {
                    await this.storageDeleteShareFile(file)
                    return;
                }
            } catch (error) {
                console.log(error);
                return;
            }
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