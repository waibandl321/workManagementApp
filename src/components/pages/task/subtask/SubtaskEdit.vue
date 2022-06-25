<template>
    <v-dialog
        v-model="dialog"
        width="800"
    >
        <v-card>
            <v-card-title class="text-h5 grey lighten-2">
                サブタスク作成
            </v-card-title>
            <v-card-text class="py-6">
                <v-text-field
                    label="サブタスク名"
                    outlined
                    ref="focusThis"
                ></v-text-field>
                <quillEditor
                    ref="myQuillEditor"
                    :options="editorOption"
                />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-for="(option, index) in subtask_option"
                    :key="index"
                    :color="option.function_cd === 'save' ? 'primary' : ''"
                    outlined
                    @click="clickOption(option)"
                >
                    {{ option.text }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
// エディタ
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
    props: {
        params: Object,
        subtask_option: Array,
    },
    components: {
        quillEditor
    },
    created() {
        this.editorOption.modules.toolbar = this.getEditorOptions();
    },
    mounted() {
        // 自動フォーカス
        this.$refs.focusThis.focus();
    },
    data: () => ({
        dialog: true,
        // テキストエディタ
        editorOption: {
            theme: 'snow',
            placeholder: 'サブタスクの詳細を入力してください',
            modules: {
                toolbar: [],
            }
        },
    }),
    methods: {
        clickOption(option) {
            option.callback()
        }
    }
}
</script>

<style scoped>

</style>
