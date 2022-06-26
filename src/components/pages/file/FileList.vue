<template>
    <div>
        <!-- 検索 -->
        <v-text-field
            v-model.trim="search_text"
            @change="searchFileList()"
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
                    :disabled="item.disabled"
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
                    v-for="(item, i) in params.filter_items"
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
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="primary"
                                    text
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="deleteItem(item)"
                                    >
                                        削除
                                    </v-btn>
                                </v-list-item>
                                <v-list-item v-if="item.type !== 0">
                                    <v-btn 
                                        text
                                        color="primary"
                                        @click="downloadFile(item)"
                                    >
                                        ダウンロード
                                    </v-btn>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- ファイルプレビュー -->
        <v-dialog
            v-model="file_preview"
        >
            <FilePreviewer
                :closeFilePreview="closeFilePreview"
                :previewer="previewer"
            />
        </v-dialog>

        <!-- アイテム追加エリア -->
        <FileAdd :params="params"/>

        <!-- アイテム削除 -->
        <v-dialog
            v-model="deleteModal"
            width="600"
        >
            <ConfirmDeleteItem
                :executeDelete="executeDelete"
                :delete_item="delete_item"
            />
        </v-dialog>
    </div>
</template>

<script>
import FileAdd from './FileAdd.vue'
import FilePreviewer from './FilePreviewer.vue'
import ConfirmDeleteItem from '@/components/common/ConfirmDeleteItem.vue'
import myMixin from './file'

export default {
    components: {
        FileAdd,
        FilePreviewer,
        ConfirmDeleteItem, 
    },
    props: {
        params: Object,
    },
    mixins: [myMixin],
    data: () => ({
        // パンくず
        breadcrumbs: [
            {
                href: "0",
                text: 'TOP',
                disabled: true
            },
        ],

        // 削除
        deleteModal: false,
        delete_item: {},

        // ファイルプレビュー
        file_preview: false,
        previewer: {
            data: {},
            type: null, 
            page_current: 1,
            page_end: null,
            loading: false,
        },

        // 検索
        search_text: "",

    }),
    created() {
        this.readShareFiles()
    },
    methods: {
        closeFilePreview() {
            this.file_preview = false;
            this.previewer.data = {};
            this.type = null;
            this.page_current = 1;
            this.page_end = null;
            this.previewer.loading = false;
        },
        outputFilesize(item) {
            if(item.type === 0) {
                return;
            } else {
                return this.convertUnitSize(item.size);
            }
        },
        searchFileList() {
            let result = this.params.filter_items
            if(this.search_text) {
                result = result.filter(v => v.name.includes(this.search_text))
                this.params.filter_items = result
            } else {
                this.readShareFiles(this.params.now_dir)
            }
        },
        pushBreadcrumbs(select_dir_id) {
            this.params.now_dir = select_dir_id
            
            let result = this.params.file_data
            result = Object.keys(result)
                    .map((key) => {
                        return result[key];
                    })
                    .filter(r => r.id == select_dir_id)
            this.breadcrumbs.push(
                {
                    href: select_dir_id,
                    text: result[0].name,
                }
            )
            // 現在表示されているディレクトリをチェックし、disabled属性を設定する
            this.breadcrumbs.forEach(r => {
                if(this.params.now_dir === r.href) {
                    r.disabled = true
                } else {
                    r.disabled = false
                }
            })
        },
        listClick(item) {
            this.previewer.loading = true;

            const position = item.name.lastIndexOf('.'),
                  extension = _getFileExtention(item),
                  permissionExtension = ['jpg', 'png', 'svg', 'gif', 'jpeg', 'pdf'];
            
            if(item.type === 0) {
                this.readShareFiles(item.id)
                this.pushBreadcrumbs(item.id)
            } else {
                this.previewer.type = _checkFileExtention()
                if(this.previewer.type) {
                    this.previewer.data = item
                    this.params.error = ""
                    this.file_preview = true
                } else {
                    this.file_preview = false
                    this.params.error = "プレビュー未対応のファイルです"
                    return;
                }
            }

            function _getFileExtention(item) {
                return item.name.slice(position + 1)
            }
            function _checkFileExtention() {
                if(permissionExtension.indexOf(extension) === -1) {
                    return undefined;
                }

                switch (extension) {
                    case "pdf":
                        return "pdf";
                    default:
                        return "img"
                }
            }
        },
        clickDir(select_dir_id) {
            if(this.params.now_dir == 0) return    
            this.readShareFiles(select_dir_id)

            let breadcrumbs = this.breadcrumbs
            const begin = _matchIndex(select_dir_id)
            breadcrumbs.splice(begin + 1)

            // クリックされたディレクトリ以降の要素を削除するために、マッチした配列のIndexを返す
            function _matchIndex(select_dir_id) {
                for (let i = 0; i < breadcrumbs.length; i++) {
                    if(breadcrumbs[i].href == select_dir_id) {
                        return i
                    }
                }
            }
        },
        
        downloadFile(item) {
            alert(item);
        },
        deleteItem(item) {
            this.delete_item = item
            this.params.success = ""
            this.deleteModal = true
        },
        async executeDelete(delete_item) {
            this.deleteModal = false
            this.params.loading = true
            const result = await this.firebaseDeleteShareFiles(delete_item)
            if(result && delete_item.type == 1) {
                await this.storageDeleteShareFile(delete_item)
                .then(() => {
                    console.log("削除成功");
                })
                .catch((error) => {
                    console.log(error);
                })
            }
            this.params.success = `アイテム：${delete_item.name}を削除しました`
            this.params.loading = false
            this.readShareFiles(this.params.now_dir)
        },
    }
}
</script>

<style scoped src="../../../assets/css/original.css"></style>

