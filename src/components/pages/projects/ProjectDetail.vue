<template>
  <v-dialog
    v-model="detailMode"
    persistent
    max-width="1024px"
    content-class="project-detail-dialog"
  >
    <v-card>
      <v-toolbar class="grey lighten-3">
        <v-btn icon @click="closeDetail()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="toolbar_title px-2 project_name">
          <div v-if="project_name_edit_mode" class="project_name_edit">
            <validation-observer v-slot="{ invalid }" ref="observer">
              <validation-provider name="プロジェクト名" rules="required">
                <v-text-field
                  autofocus
                  hide-details
                  v-model="detail.project_name"
                  outlined
                  dense
                  background-color="white"
                ></v-text-field>
              </validation-provider>
              <v-btn
                @click="updateProjectName()"
                class="project_name_edit_save px-4"
                :disabled="invalid"
                color="primary"
              >
                保存
              </v-btn>
            </validation-observer>
          </div>
          <div v-else class="d-flex align-center">
            {{ detail.project_name ? detail.project_name : "" }}
            <v-btn icon @click="project_name_edit_mode = true" color="primary">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" @click="clickProjectDelete()">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="pa-6 detail">
        <MessageViewer :params="messages" />
        <!-- ステータス、優先度設定 -->
        <v-row>
          <v-col>
            <div class="font-weight-bold pb-4">■ ステータス</div>
            <v-select
              label="ステータス"
              :items="statusList"
              item-text="text"
              item-value="key"
              outlined
              color="primary"
              dense
              v-model="detail.project_status"
              @change="updateProjectStatus()"
            ></v-select>
          </v-col>
        </v-row>
        <v-divider />
        <div class="py-2 d-flex align-center">
          <div class="font-weight-bold">■ プロジェクト期日</div>
          <div class="ml-4 relative">
            <v-btn
              @click="term_setting = !term_setting"
              color="red darken-3"
              fab
              class="mr-2 white--text"
              small
            >
              <v-icon>mdi-calendar-check-outline</v-icon>
            </v-btn>
            <span class="ml-2" style="color: #c62828; font-size: 14px">
              {{ toDatetime(detail.project_deadline, "yyyy-mm-dd") }}
            </span>
            <!-- date picker -->
            <div class="date_picker" v-if="term_setting">
              <v-text-field
                v-model="project_deadline"
                label="日付を選択"
                prepend-icon="mdi-calendar"
                readonly
              ></v-text-field>
              <div>
                <v-date-picker
                  v-model="project_deadline"
                  no-title
                  color="primary"
                ></v-date-picker>
              </div>
              <v-divider />
              <div class="mt-2">
                <v-btn text color="primary" @click="updateProjectTerm()">
                  保存
                </v-btn>
                <v-btn
                  text
                  @click="(project_deadline = []), (term_setting = false)"
                >
                  キャンセル
                </v-btn>
                <v-btn text color="red" @click="deleteProjectTerm()">
                  日付を消去
                </v-btn>
              </div>
            </div>
          </div>
          <v-spacer />
          <div class="fs-sm">
            プロジェクト作成日: {{ toDatetime(detail.created, "yyyy-mm-dd") }}
          </div>
        </div>
        <v-divider />
        <dl class="py-2 d-flex flex-wrap align-center">
          <dt style="width: 20%" class="py-2">
            <span class="font-weight-bold">■ リポジトリ</span>
            <span>
              <v-btn
                text
                color="primary"
                v-if="detail.project_repository"
                target="_blank"
                :href="detail.project_repository"
                rel="noopener"
              >
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </span>
          </dt>
          <dd style="width: 80%" class="py-2">
            <div class="d-flex">
              <v-text-field
                class="ml-4"
                hide-details
                v-model="detail.project_repository"
                outlined
                dense
                background-color="white"
              ></v-text-field>
              <v-btn
                class="ml-2 px-4"
                color="primary"
                @click="updateProjectRepository()"
                >保存</v-btn
              >
            </div>
          </dd>
          <dt style="width: 20%" class="py-2">
            <span class="font-weight-bold">■ 仕様書</span>
            <span>
              <v-btn
                text
                color="primary"
                v-if="detail.project_doc"
                target="_blank"
                :href="detail.project_doc"
                rel="noopener"
              >
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </span>
          </dt>
          <dd style="width: 80%" class="py-2">
            <div class="d-flex">
              <v-text-field
                class="ml-4"
                hide-details
                v-model="detail.project_doc"
                outlined
                dense
                background-color="white"
              ></v-text-field>
              <v-btn
                class="ml-2 px-4"
                color="primary"
                @click="updateProjectDoc()"
                >保存</v-btn
              >
            </div>
          </dd>
        </dl>
        <v-divider />

        <div class="py-4">
          <v-card-actions class="px-0">
            <div class="font-weight-bold">■ プロジェクト概要説明</div>
            <v-spacer />
            <div v-if="!desc_editor">
              <v-btn
                color="primary"
                text
                @click="desc_editor = true"
                class="px-4"
              >
                <v-icon class="mr-2">mdi-pencil-outline</v-icon>概要を編集
              </v-btn>
            </div>
            <div v-else>
              <v-btn
                color="primary"
                @click="updateProjectDescription()"
                class="px-4"
              >
                <v-icon class="mr-2">mdi-close</v-icon>編集内容を保存
              </v-btn>
            </div>
          </v-card-actions>
          <v-divider />
          <div v-if="desc_editor" class="detail-editor">
            <quillEditor
              ref="myQuillEditor"
              v-model="detail.project_description"
              :options="editorOption"
            />
          </div>
          <div v-else class="editor_body">
            <div v-if="!detail.project_description">
              プロジェクトの詳細がありません
            </div>
            <div v-html="detail.project_description"></div>
          </div>
        </div>
        <ConfirmDelete
          v-if="delete_modal"
          :delete_title="delete_title"
          :delete_options="delete_options"
        />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import ConfirmDelete from "@/components/common/ConfirmDelete.vue";
import MessageViewer from "@/components/common/MessageViewer.vue";
import { quillEditor } from "vue-quill-editor";
import myMixin from "@/mixin/firebase/project.js";

export default {
  mixins: [myMixin],
  components: {
    ConfirmDelete,
    MessageViewer,
    quillEditor,
  },
  props: {
    listRefresh: Function,
    detailMode: Boolean,
    detailItem: Object,
    statusList: Array,
  },
  data: function () {
    return {
      messages: {
        success: "",
        error: "",
      },
      project_name_edit_mode: false,
      term_setting: false,
      project_deadline: null,

      desc_editor: false,
      editorOption: {
        theme: "snow",
        placeholder: "プロジェクト詳細を入力してください",
        modules: {
          toolbar: [],
        },
      },

      detail: this.detailItem,
      // 削除
      delete_options: [],
      delete_title: "",
      delete_modal: false,
    };
  },
  created() {
    this.messages.success = "";
    this.messages.error = "";
    this.editorOption.modules.toolbar = this.getEditorOptions();
  },
  methods: {
    async updateProjectName() {
      const result = await this.firebaseUpdateProjectname(
        this.detail.project_id,
        this.detail.project_name
      );
      if (result) {
        this.project_name_edit_mode = false;
        this.messages.success = "プロジェクト名を更新しました。";
      }
    },
    async updateProjectStatus() {
      const result = await this.firebaseUpdateProjectStatus(this.detail);
      if (result) {
        this.messages.success = "プロジェクトのステータスを変更しました。";
      }
    },
    // 期日設定
    deleteProjectTerm() {
      this.project_deadline = null;
      this.term_setting = false;
      this.firebaseUpdateProjectDeadline(
        this.project_deadline,
        this.detail.project_id
      );
      this.detail.project_deadline = null;
    },
    async updateProjectTerm() {
      const deadline = this.convertUnixtimeFromDate(this.project_deadline);
      if (deadline === this.detail.project_deadline) {
        this.term_setting = false;
        return;
      }
      const result = await this.firebaseUpdateProjectDeadline(
        deadline,
        this.detail.project_id
      );
      if (result) {
        this.detail.project_deadline = deadline;
        this.messages.success = "プロジェクト期日を変更しました";
      }
      this.project_deadline = null;
      this.term_setting = false;
    },
    // プロジェクト概要
    async updateProjectDescription() {
      const result = await this.firebaseUpdateProjectDescription(
        this.detail.project_id,
        this.detail.project_description
      );
      if (result) {
        this.desc_editor = false;
        this.messages.success = "プロジェクト概要説明を更新しました。";
      }
    },
    // プロジェクト リポジトリ
    async updateProjectRepository() {
      const result = await this.firebaseUpdateProjectRepository(
        this.detail.project_id,
        this.detail.project_repository
      );
      if (result) {
        this.desc_editor = false;
        this.messages.success = "プロジェクトリポジトリを更新しました。";
      }
    },
    // プロジェクト ドキュメント
    async updateProjectDoc() {
      const result = await this.firebaseUpdateProjectDoc(
        this.detail.project_id,
        this.detail.project_doc
      );
      if (result) {
        this.desc_editor = false;
        this.messages.success = "ドキュメントURLを更新しました。";
      }
    },
    // プロジェクト削除 ハンドラ
    clickProjectDelete() {
      this.delete_options.push(
        {
          function_cd: "cancel",
          text: "キャンセル",
          callback: this.closeModal,
        },
        {
          function_cd: "delete",
          text: "削除する",
          callback: this.execDeleteProject,
        }
      );
      this.delete_title = `プロジェクト「${this.detail.project_name}」を削除します。`;
      this.delete_item = this.detail;
      this.delete_modal = true;
    },
    // 物理削除
    async execDeleteProject() {
      try {
        await this.firebaseDeleteProject(this.delete_item);
        this.messages.success = "プロジェクトを削除しました。";
      } catch (error) {
        this.messages.error = "プロジェクト削除に失敗しました。";
      }
      this.closeDetail();
      this.listRefresh();
      this.delete_item = {};
      this.delete_options = [];
      this.delete_modal = false;
    },
    closeModal() {
      this.delete_options = [];
      this.delete_item = {};
      this.delete_modal = false;
    },
    // 詳細閉じる
    closeDetail() {
      this.listRefresh();
      this.messages.success = "";
      this.messages.error = "";
      this.delete_options = [];
      this.delete_item = {};
      this.project_name_edit = false;
      this.desc_editor = false;
      this.$emit("close-detail-modal");
    },
  },
};
</script>
<style scoped>
.detail {
  min-height: calc(90vh - 64px);
}
.v-toolbar {
  position: sticky;
  top: 0;
  z-index: 2;
}
.toolbar_title {
  width: 100%;
}
.project_name {
  position: relative;
  width: 100%;
}
.project_name_edit {
  position: relative;
}
.project_name_edit_input {
  background-color: #fff;
  padding: 8px 72px 8px 12px;
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%;
}
.project_name_edit_input:focus {
  border: none;
  outline: none;
}
.project_name_edit_save {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100% !important;
}
.relative {
  position: relative;
}
.date_picker {
  position: absolute;
  box-shadow: 0px 2px 8px #00000029;
  padding: 0.5rem 1rem;
  background-color: #fff;
  z-index: 2;
}
.date_picker {
  left: 0;
  top: 100%;
}
.operation-td {
  text-align: right;
}
.v-btn:not(.v-btn--round).v-size--default {
  min-width: unset;
  padding: 0 4px;
}
.editor_body {
  padding: 16px;
  background-color: #f5f5f8;
}
.detail-editor >>> .ql-container.ql-snow {
  min-height: 150px;
  font-size: medium;
}
</style>
<style>
.project-detail-dialog {
  min-height: 90vh;
}
</style>
