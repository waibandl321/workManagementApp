<template>
  <div class="body">
    <Header :params="params" />
    <div class="list">
      <MessageViewer :params="messages" />
      <div class="mt-4">
        <v-btn color="primary" text @click="handlerCreateProject()">
          <v-icon>{{ is_display_add_input ? "mdi-close" : "mdi-plus" }}</v-icon>
          <span>プロジェクト追加</span>
        </v-btn>
      </div>
      <div v-if="is_display_add_input" class="mt-2 relative">
        <validation-observer v-slot="{ invalid }" ref="observer">
          <validation-provider
            name="プロジェクト名"
            rules="required"
            class="mt-6"
            v-slot="{ errors }"
          >
            <div class="relative">
              <v-text-field
                placeholder="プロジェクト名を入力してください"
                autofocus
                hide-details
                outlined
                v-model.trim="create_project_name"
              ></v-text-field>
              <v-btn
                depressed
                class="alt_submit px-4"
                color="primary"
                :disabled="invalid"
                @click="createProject()"
              >
                新規作成
              </v-btn>
            </div>
            <div v-if="errors.length > 0" class="input-error-message mb-2">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </validation-observer>
      </div>
      <!-- 一覧 -->
      <div class="list_body">
        <table class="basic-list mt-4">
          <thead>
            <tr>
              <td class="drag-icon-td">
                <v-icon>mdi-drag</v-icon>
              </td>
              <td>プロジェクト名</td>
              <td>ステータス</td>
              <td>
                <v-btn text @click="sortByDeadline" class="px-1">
                  締切日
                  <v-icon small>
                    {{ sort_by_deadline ? "mdi-arrow-up" : "mdi-arrow-down" }}
                  </v-icon>
                </v-btn>
              </td>
              <td>
                <v-btn text @click="sortByCreated()" class="px-1">
                  作成日時
                  <v-icon small>
                    {{ sort_by_created ? "mdi-arrow-up" : "mdi-arrow-down" }}
                  </v-icon>
                </v-btn>
              </td>
              <td class="options-td"></td>
            </tr>
          </thead>
          <tbody is="draggable" tag="tbody">
            <tr
              v-for="(project, i) in filter_items"
              :key="i"
              @click.stop="recordClick(project)"
            >
              <td class="drag-icon-td">
                <v-icon>mdi-drag</v-icon>
              </td>
              <td class="py-2">
                {{ project.project_name }}
              </td>
              <td class="py-2">
                {{ statusText(project.project_status) }}
              </td>
              <td class="py-2">
                {{ toDatetime(project.project_deadline, "yyyy-mm-dd") }}
              </td>
              <td class="py-2">
                {{ toDatetime(project.created, "yyyy-mm-dd") }}
              </td>
              <td class="options-td">
                <v-btn text @click.stop="clickDelete(project)" color="primary">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="!loading && filter_items.length === 0"
          class="pa-4 text-center"
          data-test-id="noItem"
        >
          <span style="font-size: 18px">アイテムがありません</span>
        </div>
        <!-- 削除確認モーダル -->
        <ConfirmDelete
          v-if="delete_modal"
          :delete_title="delete_title"
          :delete_options="delete_options"
        />
        <!-- ローディング -->
        <ExecLoading v-if="loading" />
      </div>
    </div>
    <ProjectDetail
      v-if="detail_mode"
      :detailMode="detail_mode"
      :detailItem="detail_item"
      :statusList="status_list"
      v-on:close-detail-modal="closeDetailModal"
      :listRefresh="initProjectListComponent"
    />
  </div>
</template>

<script>
import Header from "@/components/common/Header";
import MessageViewer from "@/components/common/MessageViewer.vue";
import ConfirmDelete from "@/components/common/ConfirmDelete.vue";
import ExecLoading from "@/components/common/ExecLoading.vue";
import draggable from "vuedraggable";
import myMixin from "@/mixin/firebase/project.js";
import ProjectDetail from "@/components/pages/projects/ProjectDetail.vue";

export default {
  components: {
    Header,
    draggable,
    ExecLoading,
    ConfirmDelete,
    MessageViewer,
    ProjectDetail,
  },
  mixins: [myMixin],
  data: () => ({
    params: {
      user_info: {},
    },
    messages: {
      success: "",
      error: "",
    },
    // ローディング
    loading: false,
    // ステータス
    status_list: [],
    // 作成
    create_project_name: "",
    is_display_add_input: false,
    // 削除
    delete_item: {},
    delete_options: [],
    delete_title: "",
    delete_modal: false,
    // リスト
    items: [],
    filter_items: [],
    filter_text: "",
    filter_status: null,
    // ソート
    sort_by_deadline: false,
    sort_by_created: true,
    // 詳細
    detail_mode: false,
    detail_item: {},
  }),
  async created() {
    this.setRoutetitle();
    this.params.user_info = this.storeGetAccountInfo();
    if (!this.params.user_info.first_name) {
      this.pageMove("/account/register");
      return;
    }
    this.status_list = this.getProjectStatusList();
    await this.initProjectListComponent();
  },
  computed: {
    statusText() {
      return (status_key) => {
        const result = this.status_list.find((v) => v.key === status_key);
        return result ? result.text : "";
      };
    },
  },
  methods: {
    async initProjectListComponent() {
      this.loading = true;
      try {
        let result = await this.readProjectList();
        if (result.length === 0) {
          this.items = [];
          this.loading = false;
          this.filterList();
          return;
        }
        result = result.filter((v) => v.project_status !== 3);
        this.items = result;
        this.filterList();
      } catch (error) {
        this.messages.error = "プロジェクトの読み込みに失敗しました。";
      }
      this.loading = false;
    },
    async readProjectList() {
      let result = await this.firebaseGetProjectList();
      if (!result) return [];
      result = Object.keys(result)
        .map((key) => {
          return result[key];
        })
        .sort((a, b) => a.created - b.created);

      return result;
    },
    // リストの絞り込み
    async filterList() {
      let result = this.items;
      if (this.filter_status) {
        // 完了の場合は全プロジェクト取得してからフィルタ
        if (this.filter_status === 3) {
          result = await this.readDoneProject();
        } else {
          result = result.filter(
            (v) => v.project_status === this.filter_status
          );
        }
      }
      if (this.filter_text) {
        result = result.filter((v) =>
          v.project_name.includes(this.filter_text)
        );
      }
      this.filter_items = result;
    },
    // 完了プロジェクトの読み込み
    async readDoneProject() {
      let result = await this.firebaseGetProjectList(); // global mixin
      if (!result) return [];
      result = Object.keys(result)
        .map((key) => {
          return result[key];
        })
        .filter((v) => v.project_status === 3)
        .sort((a, b) => a.created - b.created);

      return result;
    },
    // 期日でのソート
    sortByDeadline() {
      this.sort_by_deadline = !this.sort_by_deadline;
      let result = this.items;
      if (this.sort_by_deadline) {
        result.sort((a, b) => {
          if (!a.project_deadline) return 1;
          if (!b.project_deadline) return -1;
          return a.project_deadline - b.project_deadline;
        });
      } else {
        result.sort((a, b) => {
          if (!a.project_deadline) return 1;
          if (!b.project_deadline) return -1;
          return b.project_deadline - a.project_deadline;
        });
      }
      this.filter_items = result;
    },
    // 作成日のソート
    sortByCreated() {
      this.sort_by_created = !this.sort_by_created;
      let result = this.items;
      if (this.sort_by_created) {
        result.sort((a, b) => {
          return a.created - b.created;
        });
      } else {
        result.sort((a, b) => {
          return b.created - a.created;
        });
      }
      this.filter_items = result;
    },
    // プロジェクト作成ハンドラー
    handlerCreateProject() {
      this.is_display_add_input = !this.is_display_add_input;
      this.create_project_name = "";
    },
    // プロジェクト作成実行
    async createProject() {
      const project = this.generateProjectObject(this.create_project_name);
      try {
        await this.firebaseProjectCreate(project); // global mixin
        this.messages.success = "プロジェクトを新規作成しました";
      } catch (error) {
        this.messages.error = "プロジェクト作成に失敗しました。";
        console.log(error);
      }
      this.initProjectListComponent();
      this.is_display_add_input = false;
      this.create_project_name = "";
    },
    generateProjectObject(create_project_name) {
      const id = this.createRandomId();
      return {
        project_id: id,
        project_name: create_project_name,
        project_description: "",
        project_repository: "",
        project_doc: "",
        project_status: 0,
        project_deadline: null,
        create_account: this.storeGetFirebaseUid(),
        created: this.nowUnix(),
        updated: "",
        finished_at: "",
      };
    },
    // プロジェクト削除 確認
    clickDelete(project) {
      this.messages.success = "";
      this.messages.error = "";
      this.delete_options.push(
        {
          function_cd: "cancel",
          text: "キャンセル",
          callback: this.closeDeleteModal,
        },
        {
          function_cd: "delete",
          text: "削除する",
          callback: this.execDeleteProjectFromList,
        }
      );
      this.delete_title = `プロジェクト「${project.project_name}」を削除します。`;
      this.delete_item = project;
      this.delete_modal = true;
    },
    // プロジェクト削除 キャンセル
    closeDeleteModal() {
      this.delete_item = {};
      this.delete_options = [];
      this.delete_modal = false;
    },
    // プロジェクト削除 実行
    async execDeleteProjectFromList() {
      this.delete_modal = false;
      this.loading = true;
      try {
        await this.firebaseDeleteProject(this.delete_item); //global mixin
        this.messages.success = "プロジェクトを削除しました。";
      } catch (error) {
        this.messages.error = "プロジェクト削除に失敗しました。";
      }
      this.initProjectListComponent();
      this.delete_item = {};
      this.delete_options = [];
    },
    // 一覧クリック
    async recordClick(project) {
      this.messages.success = "";
      this.messages.error = "";
      this.setProjectDetailItem(project);
    },
    // 詳細アイテムセット
    async setProjectDetailItem(project) {
      try {
        const result = await this.firebaseGetProjectDetail(project.project_id);
        if (!result) throw new Error();
        this.detail_item = result;
        this.detail_mode = true;
      } catch (error) {
        console.log(error);
        this.messages.error = "データの読み込みに失敗しました。";
      }
    },
    closeDetailModal() {
      this.detail_mode = false;
    },
  },
};
</script>
<style scoped>
.list {
  box-sizing: border-box;
  padding: 24px 16px 10%;
}
.list {
  overflow: auto;
  width: 100%;
  height: calc(100vh - 70px);
}
.basic-list {
  border-collapse: collapse;
  table-layout: unset;
  width: 100%;
}
.basic-list thead {
  background-color: #eee;
}
.basic-list tbody tr {
  border-bottom: 1px solid #ccc;
}
.basic-list tbody tr:hover {
  cursor: pointer;
  background-color: #f6f6f6;
}
.basic-list td {
  font-size: 14px;
  padding: 4px;
}
.options-td {
  text-align: right;
}
.drag-icon-td {
  width: 32px;
}
.relative {
  position: relative;
}
.alt_submit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}
.input-error-message {
  font-size: 14px;
  color: #ff5252;
  margin-top: 4px;
}
</style>
