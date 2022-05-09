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
        <!-- ストレージ -->
        <v-progress-linear
            v-model="storage_value"
            color="primary"
            background-color="#eee"
            rounded
            height="20"
        >
            <strong>{{ Math.ceil(storage_value) }}%</strong>
        </v-progress-linear>
        <!-- パンくず -->
        <v-breadcrumbs
            :items="breadcrumbs"
            class="pa-0 mt-4"
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

        <!-- リンク -->
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text>
                <v-icon>mdi-delete</v-icon>
                ゴミ箱
            </v-btn>
            <v-btn color="primary" text>
                <v-icon>mdi-cached</v-icon>
                全アイテム削除
            </v-btn>
        </v-card-actions>

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
                            :color="item.type == 0 ? '#ebcb6a' : '#666'"
                        >
                            {{ item.type == 0 ? "mdi-folder" : 'mdi-file-outline' }}
                        </v-icon>
                        <span class="ml-2">{{ item.name }}</span>
                    </td>
                    <td>{{ item.uid }}</td>
                    <td>{{ convertDatetimeFromUnixtime(item.upload_at) }}</td>
                    <td>{{ item.size }}</td>
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
                                <v-list-item>
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
import ConfirmDeleteItem from '@/components/common/ConfirmDeleteItem.vue'

import myMixin from './file'

export default {
    components: {
        FileAdd,
        ConfirmDeleteItem
    },
    props: {
        params: Object,
    },
    mixins: [myMixin],
    data: () => ({
        breadcrumbs: [
            {
                href: "0",
                text: 'TOP',
                disabled: true
            },
        ],
        deleteModal: false,
        delete_item: {},
        search_text: "",
        storage_value: 33,
    }),
    created() {
        this.readShareFiles()
    },
    methods: {
        
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
                        return [key, result[key]];
                    })
                    .filter(r => r[1].id == select_dir_id)
            
            // TODO:配列構造をシンプルにしたい
            this.breadcrumbs.push(
                {
                    href: select_dir_id,
                    text: result[0][1].name,
                }
            )
            // 現在表示されているディレクトリをチェックし、disabled属性を設定する
            this.breadcrumbs.forEach(r => {
                if(this.params.now_dir == r.href) {
                    r.disabled = true
                } else {
                    r.disabled = false
                }
            })
        },
        listClick(item) {
            // TODO:ファイルの場合はプレビュー表示
            if(item.type != 0) return;
            this.readShareFiles(item.id, 'record')
            this.pushBreadcrumbs(item.id)
        },
        clickDir(select_dir_id) {
            if(this.params.now_dir == 0) return    
            this.readShareFiles(select_dir_id)

            let breadcrumbs = this.breadcrumbs
            const begin = matchIndex(select_dir_id)
            breadcrumbs.splice(begin + 1)

            // クリックされたディレクトリ以降の要素を削除するために、マッチした配列のIndexを返す
            function matchIndex(select_dir_id) {
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
            const result = await this.firebaseDeleteShareFiles(delete_item)
            if(result) {
                this.params.success = `アイテム：${delete_item.name}を削除しました`
                this.deleteModal = false
                this.readShareFiles(this.params.now_dir)
            }
            
        }
    }
}
</script>

<style scoped src="../../../assets/css/original.css"></style>

