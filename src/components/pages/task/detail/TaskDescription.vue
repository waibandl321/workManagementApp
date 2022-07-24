<template>
  <div class="py-4">
    <v-card-actions class="px-0">
      <div class="font-weight-bold">■ タスク概要説明</div>
      <v-spacer />
      <div v-if="!desc_editor">
        <v-btn
            color="primary"
            text
            @click="desc_editor = true"
            class="px-4"
            data-test-id="taskDescriptionEdit"
        >
          <v-icon class="mr-2">mdi-pencil-outline</v-icon>概要を編集
        </v-btn>
      </div>
      <div v-else>
        <v-btn
            color="primary"
            @click="updateTaskDescription()"
            class="px-4"
            data-test-id="taskDescriptionSave"
        >
          <v-icon class="mr-2">mdi-close</v-icon>編集内容を保存
        </v-btn>
      </div>
    </v-card-actions>
    <v-divider />
    <div
        v-if="desc_editor"
        class="detail-editor"
    >
      <quillEditor
          ref="myQuillEditor"
          v-model="params.viewer.task_description"
          :options="editorOption"
          data-test-id="taskDescriptionEditor"
      />
    </div>
    <div 
        v-else
        class="editor_body"
    >
      <div
          v-if="!params.viewer.task_description"
          data-test-id="taskDescriptionText"
      >
          タスクの詳細がありません
      </div>
      <div
          v-html="params.viewer.task_description"
          data-test-id="taskDescriptionText"
      ></div>
    </div>
  </div>
</template>

<script>
// エディタ
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: "TaskDeadlineAlert",
  props: {
    params: Object,
  },
  components: {
    quillEditor
  },
  data: () => ({
    desc_editor: false,
    // テキストエディタ
    editorOption: {
        theme: 'snow',
        placeholder: 'タスク詳細を入力してください',
        modules: {
            toolbar: [],
        }
    },
  }),
  created() {
    this.editorOption.modules.toolbar = this.getEditorOptions();
  },
  methods: {
    async updateTaskDescription() {
        const result = await this.firebaseUpdateTaskDescription(this.params.viewer.task_id, this.params.viewer.task_description);
        if(result) {
            this.desc_editor = false
            this.params.success = "タスク概要説明を更新しました。"
        }
    },
  }
}
</script>

<style scoped>
.editor_body {
    padding: 16px;
    background-color: #f5f5f8;
}
.detail-editor >>> .ql-container.ql-snow {
    min-height: 150px;
    font-size: medium;
}
</style>