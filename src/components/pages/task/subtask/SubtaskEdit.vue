<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="800"
        content-class="subtask-edit-modal"
    >
        <v-card>
            <validation-observer v-slot="{ invalid }" ref="observer">
                <v-card-title class="text-h5 grey lighten-2" data-e2e-id="subtaskEditTitle">
                    サブタスク{{ subtask_option.is_new ? '作成' : '更新' }}
                </v-card-title>
                <v-card-text class="py-6">
                    <validation-provider
                        name="サブタスク名"
                        rules="required"
                        v-slot="{ errors }"
                        tag="div"
                        class="mb-6"
                    >
                        <v-text-field
                            label="サブタスク名"
                            outlined
                            autofocus
                            v-model="subtask_editor.subtask_name"
                            hide-details
                            required
                            data-e2e-id="subtaskNameInput"
                        ></v-text-field>
                        <div class="input-error-message">{{ errors[0] }}</div>
                    </validation-provider>
                    <quillEditor
                        ref="myQuillEditor"
                        :options="editorOption"
                        v-model.trim="subtask_editor.subtask_description"
                        data-e2e-id="subtaskDescriptionEditor"
                    />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        v-for="(option, index) in subtask_option"
                        :key="index"
                        :color="option.function_cd === 'save' ? 'primary' : ''"
                        :disabled="option.function_cd === 'save' && invalid"
                        outlined
                        @click="clickOption(option, subtask_editor)"
                        :data-e2e-id="'subtaskEdit' + option.function_cd"
                    >
                        {{ option.text }}
                    </v-btn>
                </v-card-actions>
            </validation-observer>
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
    methods: {
        clickOption(option, subtask) {
            if(option.function_cd === 'save') {
                option.callback(subtask)
                return;
            }
            option.callback()
        },
    }
}
</script>

<style scoped>
.input-error-message {
    font-size: 14px;
    color: #ff5252;
    margin-top: 4px;
}
</style>
