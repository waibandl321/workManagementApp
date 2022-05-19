<template>
    <v-card>
        <v-toolbar
            dark
            color="primary"
            >
            <v-btn
                icon
                dark
                @click="closeFilePreview()"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>ファイル詳細</v-toolbar-title>
        </v-toolbar>
        <div class="pa-6">
            <Loading v-if="previewer.loading" />
            <template v-if="previewer.type !== 'pdf'">
                <img
                    :src="previewer.data.download_path"
                    @load="previewer.loading = false"
                    style="max-width: 100%;"
                >
            </template>
            <template v-else>
                <div
                    v-if="previewer.page_end > 1"
                    class="mb-3"
                >
                    <div class="d-flex align-center justify-center">
                        <v-btn
                            outlined
                            @click="prevPage"
                            :disabled="previewer.page_current <= 1"
                        >
                            戻る
                        </v-btn>
                        <div class="mx-6">
                            {{ previewer.page_current }} / {{ previewer.page_end }}
                        </div>
                        <v-btn
                            outlined
                            @click="nextPage"
                            :disabled="previewer.page_current === previewer.page_end"
                        >
                            次へ
                        </v-btn>
                    </div>
                </div>
                <div>
                    <pdf
                        :src="previewer.data.download_path"
                        @loaded="previewer.loading = false"
                        @num-pages="previewer.page_end = $event"
                        :page="previewer.page_current"
                        
                    ></pdf>
                </div>
            </template>
        </div>
    </v-card>
</template>

<script>
// pdf.js参考 https://qiita.com/kenkubomi/items/b46e65b8aba0f87d4a69
import pdf from 'vue-pdf'
import Loading from '@/components/common/Loading.vue'

export default {
    components: {
        pdf,
        Loading
    },
    props: {
        closeFilePreview: Function,
        previewer: Object,
    },
    methods: {
        prevPage() {
            this.previewer.page_current = this.previewer.page_current - 1;
        },
        nextPage() {
            this.previewer.page_current = this.previewer.page_current + 1;
        },
    }
}
</script>