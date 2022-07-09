<template>
    <div>
        <!-- 検索 -->
        <v-text-field
            v-model.trim="search_text"
            @input="search()"
            dense
            outlined
            label="ファイル名でディレクトリ内を検索"
        ></v-text-field>

        <!-- パンくず -->
        <v-breadcrumbs
            :items="breadcrumbs"
            class="pa-0 my-4"
        >
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item
                    :href="item.href"
                    :disabled="isActiveBreadcrumb(item)"
                    @click.prevent="clickDir(item.href)"
                >
                    {{ item.text }}
                </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>

        <!-- リストテーブル -->
        <table class="basic-list">
            <thead>
                <tr>
                    <td>アイテム名</td>
                    <td>更新者</td>
                    <td>更新日</td>
                    <td>サイズ</td>
                    <td class="options-td"></td>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(item, i) in params.files"
                    :key="i"
                    @click="listClick(item)"
                >
                    <td>
                        <v-icon
                            :color="item.type === 0 ? '#ebcb6a' : '#666'"
                        >
                            {{ item.type === 0 ? "mdi-folder" : 'mdi-file-outline' }}
                        </v-icon>
                        <span class="ml-2">{{ item.name }}</span>
                    </td>
                    <td>{{ item.uid }}</td>
                    <td>{{ convertDatetimeFromUnixtime(item.upload_at, "yyyy/mm/dd") }}</td>
                    <td>{{ outputFilesize(item) }}</td>
                    <td>
                        <div class="d-flex align-center justify-end">
                            <v-btn
                                v-show="item.type !== 0"
                                @click.stop.prevent="downloadFile(item)"
                                color="primary"
                                text
                                fab
                                small
                            >
                                <v-icon>mdi-cloud-download-outline</v-icon>
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click.stop="deleteItem(item)"
                                fab
                                small
                            >
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                            
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- プレビュー -->
        <v-dialog
            v-model="file_preview"
        >
            <FilePreviewer
                :closeFilePreview="closeFilePreview"
                :previewer="previewer"
            />
        </v-dialog>

        <!-- 削除確認 -->
        <v-dialog
            v-model="delete_modal"
            width="600"
        >
            <FileDeleteModal
                :executeDelete="executeDelete"
                :delete_item="delete_item"
            />
        </v-dialog>
    </div>
</template>

<script>
import FilePreviewer from './FilePreviewer.vue'
import FileDeleteModal from './FileDeleteModal.vue'
import myMixin from './file'

export default {
    components: {
        FilePreviewer,
        FileDeleteModal, 
    },
    props: {
        params: Object,
    },
    mixins: [myMixin],
    data: () => ({
        search_text: "",
        breadcrumbs: [
            {
                href: "0",
                text: 'TOP',
                disabled: true
            },
        ],
        delete_modal: false,
        delete_item: {},
        file_preview: false,
        previewer: {
            data: {},
            type: null, 
            page_current: 1,
            page_end: null,
            loading: false,
        },
    }),
    async created() {
        await this.readShareFiles()
    },
    methods: {
        outputFilesize(item) {
            if(item.type === 0) {
                return;
            } else {
                return this.convertUnitSize(item.size);
            }
        },
        search() {
            let result = this.params.files
            if(this.search_text) {
                result = result.filter(v => v.name.includes(this.search_text))
                this.params.files = result
            } else {
                this.readShareFiles(this.params.now_dir)
            }
        },
        async listClick(item) {
            this.previewer.loading = true;
            // directory
            if(item.type === 0) {
                await this.readShareFiles(item.id)
                this.pushBreadcrumbs(item)
            // file
            } else {
                this.previewer.data = item;
                this.params.error = "";
                this.file_preview = true;
            }
        },
        
        // パンくず
        async clickDir(select_dir_id) {
            if(this.params.now_dir == 0) return
            const begin = this.breadcrumbs.findIndex((v) => v.href === select_dir_id)
            // 先頭以降の配列削除
            this.breadcrumbs.splice(begin + 1)
            await this.readShareFiles(select_dir_id)
        },
        pushBreadcrumbs(item) {
            this.params.now_dir = item.id
            this.breadcrumbs.push(
                {
                    href: item.id,
                    text: item.name,
                }
            )
        },
        isActiveBreadcrumb(item) {
            return item.href === this.params.now_dir
        },
        // ファイルダウンロード
        downloadFile(item) {
            fetch(item.download_path)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', item.name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
        },
        deleteItem(item) {
            this.delete_item = item;
            this.params.success = "";
            this.delete_modal = true;
        },
        async executeDelete() {
            this.delete_modal = false;
            this.params.loading = true;
            try {
                const result = await this.firebaseDeleteShareFiles(this.delete_item)
                if(result && this.delete_item.type === 1) {
                    await this.storageDeleteShareFile(this.delete_item)
                } 
                this.params.success = `アイテム：${this.delete_item.name}を削除しました。`
            } catch (error) {
                this.params.error = `アイテム：${this.delete_item.name}の削除中にエラーが発生しました。`
                console.log(error);
            }
            this.readShareFiles(this.params.now_dir);
            this.params.loading = false;
        },
        closeFilePreview() {
            this.file_preview = false;
            this.previewer.data = {};
            this.type = null;
            this.page_current = 1;
            this.page_end = null;
            this.previewer.loading = false;
        },
    }
}
</script>

<style scoped src="../../../assets/css/original.css"></style>

