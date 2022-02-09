<template>
    <div class="board">
        <div class="d-flex align-center pb-4">
            <div>
                <v-btn
                    class="ml-4 mr-4"
                    color="primary"
                    fab
                    @click="post_form = true"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn
                    class="ml-4"
                    outlined
                    @click="layout = 'grid'"
                >
                    <v-icon>mdi-view-grid</v-icon>
                </v-btn>
                <v-btn
                    class="ml-4"
                    outlined
                    @click="layout = 'list'"
                >
                    <v-icon>mdi-format-list-bulleted-square</v-icon>
                </v-btn>
            </div>
            <div class="ml-6">
                <v-select
                    :items="sort_items"
                    prepend-icon="mdi-filter-menu"
                    label="表示順を並べ替え"
                    dense
                    outlined
                ></v-select>
            </div>
            <div class="ml-6">
                <v-select
                    :items="sort_categories"
                    label="部署別で絞り込み"
                    dense
                    outlined
                ></v-select>
            </div>
            <div class="ml-6">
                <v-text-field
                    label="フリーワードで検索"
                    outlined
                    dense
                ></v-text-field>
            </div>
        </div>
        <v-divider />
        <!-- grid layout -->
        <v-row
            class="pa-4 ma-0"
            v-if="layout == 'grid'"
        >
            <v-col 
                cols="4"
                v-for="i of 3"
                :key="i"
            >
                <v-card>
                    <v-card-text class="pb-0">
                        <v-chip class="mr-4">5:30PM</v-chip>
                        <span>2021/12/23</span>
                    </v-card-text>
                    <v-card-title>
                        社内不倫について
                    </v-card-title>
                    <v-card-text>
                        <div>人事担当としては、この「不倫問題」は、対岸の火事というわけにはいきません。会社は非常に濃密な人間関係の発生する場であり、「社内恋愛」や「社内不倫」は発生するものです。問題は、リスク回避をミッションとする企業の人事担当が「社内恋愛」や「社内不倫」に対してどこまで、どのように介入すべきかということです。</div>
                    </v-card-text>
                    <v-divider />
                    <v-card-text>
                        <v-btn text><v-icon>mdi-read</v-icon></v-btn>
                        <v-btn text><v-icon>mdi-star</v-icon></v-btn>
                        <v-btn text><v-icon>mdi-paperclip</v-icon></v-btn>
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                        <v-spacer />
                        <div class="d-flex align-center">
                            <div class="mr-2">投稿者 : </div>
                            <v-avatar
                                color="teal"
                                size="32"
                            >
                                <span class="white--text">大純</span>
                            </v-avatar>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <!-- list layout -->
        <div
            class="px-6"
            v-if="layout == 'list'"
        >
            <v-card v-for="i of 3" :key="i" class="mt-4">
                <div class="d-flex px-4">
                    <div class="d-flex align-center">
                        <div class="mr-2">投稿者 : </div>
                        <v-avatar
                            color="teal"
                            size="32"
                        >
                            <span class="white--text">大純</span>
                        </v-avatar>
                    </div>
                    <div>
                        <v-card-text class="pb-0">
                            <v-chip class="mr-4">5:30PM</v-chip>
                            <span>2021/12/23</span>
                        </v-card-text>
                        <v-card-title>
                                社内不倫について
                            </v-card-title>
                    </div>
                </div>
                <v-divider />
                <v-card-text>
                    <div>人事担当としては、この「不倫問題」は、対岸の火事というわけにはいきません。会社は非常に濃密な人間関係の発生する場であり、「社内恋愛」や「社内不倫」は発生するものです。問題は、リスク回避をミッションとする企業の人事担当が「社内恋愛」や「社内不倫」に対してどこまで、どのように介入すべきかということです。</div>
                </v-card-text>
            </v-card>
        </div>

        <v-dialog
            v-model="post_form"
            fullscreen
        >
            <v-card tile>
                <v-toolbar
                    flat
                    dark
                    color="primary"
                >
                    <v-btn
                    icon
                    dark
                    @click="post_form = false"
                    >
                    <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>新規投稿</v-toolbar-title>
                </v-toolbar>
                <!-- フォーム -->
                <div class="pa-6 form_body">
                    
                    <v-card-actions>
                        <v-text-field
                        :counter="10"
                        label="タイトル"
                        required
                        ></v-text-field>
                    </v-card-actions>

                    <v-card-actions>
                        <v-textarea
                            label="概要"
                            hint="Hint text"
                        ></v-textarea>
                    </v-card-actions>

                    <v-card-actions>
                        <v-select
                            :items="sort_categories"
                            label="部署別で絞り込み"
                        ></v-select>
                    </v-card-actions>

                    <v-card-actions>
                        <v-file-input
                            accept="image/*"
                            label="ファイル添付"
                        ></v-file-input>
                    </v-card-actions>

                        <v-card-actions>
                            <v-spacer />
                            <v-btn
                            outlined
                            class="mr-4"
                            @click="post_form = false"
                            >
                            キャンセル
                            </v-btn>

                            <v-btn
                            color="primary"
                            @click="post()"
                            >
                            投稿する
                            </v-btn>
                        </v-card-actions>
                    
                </div>
        </v-card>
      </v-dialog>

    </div>
</template>
<script>
  export default {
    data: () => ({
      selection: 1,
      sort_items: ['投稿の新しい順', '投稿の古い順', '閲覧数が多い順', 'いいね数'],
      sort_categories: ['全社周知 ', '営業部 ', '経理部 ', '人事部 ', '技術部 ', 'クリエイティブ事業部'],
      layout: "grid",
      post_form: false,
    }),
    methods: {
        post() {
            this.post_form = false
        },
    }
  }
</script>
<style scoped>
.board >>> .v-text-field__details {
    display: none;
}
.form_body {
    max-width: 800px;
    margin: 0 auto;
}
</style>






