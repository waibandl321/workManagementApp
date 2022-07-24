<template>
  <div class="mt-6">
    <v-card-actions class="relative px-0">
        <p class="font-weight-bold mb-0">■ 添付ファイル</p>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="clickUploadButton()"
          data-test-id="taskAttachmentButton"
        >
          <v-icon>mdi-paperclip</v-icon>ファイルを添付する
        </v-btn>
    </v-card-actions>
    <v-divider />
    
    <div class="pt-4">
        <div
          v-if="!params.files.length > 0"
          data-test-id="taskAttachmentNothing"
        >
          添付ファイルはありません。
        </div>
        <div
            v-else
            class="d-flex align-center"
        >
          <div data-test-id="taskAttachmentLength">{{ params.files.length }} Files</div>
          <v-spacer />
          <v-btn
            text
            color="error"
            @click="clickAllFileDelete()"
            data-test-id="taskAttachmentAllDelete"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
            全ファイル削除
          </v-btn>
        </div>
    </div>
    <!-- ローディング -->
    <template v-if="file_loading">
        <div class="text-center py-6">
            <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
            ></v-progress-circular>
        </div>
    </template>
    <!-- ファイル一覧 -->
    <template v-else>
      <table class="file-table" data-test-id="taskAttachmentList">
        <tr v-for="(file, i) in params.files" :key="i">
          <td>
            <img
              :src="file.download_path"
              width="40"
              data-test-id="taskAttachmentView"
            >
          </td>
          <td data-test-id="taskAttachmentName">{{ file.name }}</td>
          <td data-test-id="taskAttachmentSize">{{ convertUnitSize(file.size) }}</td>
          <td data-test-id="taskAttachmentType">{{ file.contentType }}</td>
          <td class="operation-td">
            <v-btn
              link
              text
              :href="file.download_path"
              target="_blank" rel="noopener noreferrer"
              data-test-id="taskAttachmentPreviewButton"
            >
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn
              @click="clickFileDeleteSingle(file)"
              text
              class="ml-2"
              data-test-id="taskAttachmentDelete"
            >
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </td>
        </tr>
      </table>
      <input
          style="display: none"
          ref="fileUploadButton"
          type="file"
          @change="taskFileInputChange"
          data-test-id="taskAttachmentInput"
      >
    </template>
  </div>
</template>

<script>
import myMixin from "../task.js"
export default {
  name: "TaskDeadlineAlert",
  props: {
    file_loading: Boolean,
    params: Object,
    clickAllFileDelete: Function,
    clickFileDeleteSingle: Function,
  },
  mixins: [myMixin],
  methods: {
    clickUploadButton() {
      this.params.success = "";
      this.params.error = "";
      this.$refs.fileUploadButton.click()
    },
  }
}
</script>

<style scoped>
.file-table {
    width: 100%;
    border-collapse: collapse;
}
.file-table tbody tr:not(:first-child) {
    border-top: 1px solid #ccc;
}
.file-table td,
.file-table th {
    font-size: 14px;
    padding: 8px;
    vertical-align: center;
}
.operation-td {
    text-align: right;
}
.v-btn:not(.v-btn--round).v-size--default {
    min-width: unset;
    padding: 0 4px;
}
</style>