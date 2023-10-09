<template>
  <div class="header">
    <div class="inner d-flex align-center">
      <v-spacer />
      <div class="d-flex align-center">
        <div v-for="(item, i) in functions" :key="i" class="d-flex">
          <v-btn class="ml-4" text :to="item.path" :data-test-id="item.text">
            <v-icon>{{ item.icon }}</v-icon>
            <span class="pl-2">{{ item.text }}</span>
          </v-btn>
        </div>
        <div class="ml-4">
          <div class="pl-4">
            <v-btn
              @click="accountEdit()"
              filled
              :color="'#' + params.user_info.color"
              class="pa-2 white--text"
              data-test-id="headerAccountName"
            >
              アカウント: {{ params.user_info.last_name }}
              {{ params.user_info.first_name }}
            </v-btn>
          </div>
        </div>
        <div class="ml-4">
          <v-btn
            color="blue-grey"
            class="pa-2 white--text"
            filled
            @click="clickSignout()"
            data-test-id="appSignout"
          >
            ログアウト
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    params: Object,
  },
  data: () => ({
    functions: [
      { text: "ダッシュボード", path: "/", icon: "mdi-view-dashboard-outline" },
      { text: "タスク", path: "/task", icon: "mdi-format-list-checks" },
      {
        text: "プロジェクト",
        path: "/projects",
        icon: "mdi-notebook",
      },
      { text: "ファイル管理", path: "/file", icon: "mdi-folder" },
    ],
  }),
  methods: {
    accountEdit() {
      this.pageMove("/account/update");
    },
    clickSignout() {
      this.pageMove("/auth/signout");
    },
  },
};
</script>
<style scoped>
.header {
  border-bottom: 1px solid #ccc;
  height: 70px;
  line-height: 70px;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
}
</style>
