<template>
    <v-dialog
        v-model="dialog"
        width="800"
    >
        <v-card>
            <v-form v-model="valid">
                <v-card-title class="text-h5 grey lighten-2">
                    サブタスク作成
                </v-card-title>
                <v-card-text class="py-6">
                    
                        <v-text-field
                            label="サブタスク名"
                            outlined
                            ref="focusThis"
                            v-model="subtask_editor.subtask_name"
                            :rules="subtask_name_valid_rule"
                            required
                        ></v-text-field>
                        <quillEditor
                            ref="myQuillEditor"
                            :options="editorOption"
                            v-model="subtask_editor.subtask_description"
                        />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        v-for="(option, index) in subtask_option"
                        :key="index"
                        :color="option.function_cd === 'save' ? 'primary' : ''"
                        :disabled="disabledSave(option)"
                        outlined
                        @click="clickOption(option, subtask_editor)"
                    >
                        {{ option.text }}
                    </v-btn>
                </v-card-actions>
            </v-form>
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
    data: () => ({
        dialog: true,
        valid: false,
        subtask_name_valid_rule: [
            v => !!v || 'サブタスク名は必須です',
        ],
        // テキストエディタ
        editorOption: {
            theme: 'snow',
            placeholder: 'サブタスクの詳細を入力してください',
            modules: {
                toolbar: [],
            }
        },
        subtask_editor: {},
    }),
    created() {
        this.editorOption.modules.toolbar = this.getEditorOptions();
        // 編集か新規か判定
        if(this.params.subtask_editor) {
            this.subtask_editor = this.params.subtask_editor
        }
    },
    mounted() {
        // 自動フォーカス
        this.$refs.focusThis.focus();
    },
    methods: {
        clickOption(option) {
            if(option.function_cd === 'save') {
                option.callback(this.subtask_editor)
                return;
            }
            option.callback()
        },
        // タスク名の値無ければ保存ボタン非活性
        disabledSave(option) {
            if(option.function_cd !== 'save') return false;
            if(!this.subtask_editor.subtask_name) {
                return true;
            } else {
                return false;
            }
        }
    }
}
</script>

<style scoped>

</style>
