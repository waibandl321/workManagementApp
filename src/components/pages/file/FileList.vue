<template>
    <div>
        <!-- 検索 -->
        <v-text-field
            label="ファイル名で検索"
            dense
            outlined
        ></v-text-field>
        <!-- ストレージ -->
        <v-progress-linear
            v-model="knowledge"
            height="25"
            class="mt-2"
        >
            <strong>{{ Math.ceil(knowledge) }}%</strong>
        </v-progress-linear>
        <!-- パンくず -->
        <v-breadcrumbs
            :items="breadcrumbs"
            class="mt-4"
        >
            <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>
        <!-- リスト -->
        <v-simple-table
            fixed-header
            height="500px"
        >
            <template v-slot:default>
                <thead>
                    <tr>
                        <th>ファイル名</th>
                        <th>更新者</th>
                        <th>更新日</th>
                        <th>サイズ</th>
                        <th>
                            <v-btn color="primary" text>
                                <v-icon>mdi-delete</v-icon>
                                全てのアイテムを削除
                            </v-btn>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    
                    >
                        <td>ファイル名</td>
                        <td>名前 太郎</td>
                        <td>2022/02/23</td>
                        <td>45 KB</td>
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
                                    <v-btn text>削除</v-btn>
                                </v-list-item>
                                <v-list-item>
                                    <v-btn text>ダウンロード</v-btn>
                                </v-list-item>
                            </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <!-- 追加アイコン -->
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
                        <v-btn text>ファイルを選択</v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn text>フォルダを作成</v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </div>
</template>

<script>

export default {
    data: () => ({
        // ストレージ
        knowledge: 33,
        // パンくず
        breadcrumbs: [
            {
                text: 'Dashboard',
                disabled: false,
                href: 'breadcrumbs_dashboard',
            },
            {
                text: 'Link 1',
                disabled: false,
                href: 'breadcrumbs_link_1',
            },
        ],
    }),
    methods: {
        
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
