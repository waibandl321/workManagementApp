import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/index.js'
import vuetify from './plugins/vuetify'

// mixins
import utilMixin from "@/mixin/common/util.js"
import authMixin from "./mixin/firebase/auth.js"
import authStore from "./mixin/store/auth.js"
import accountMixin from "./mixin/api/account.js"
import accountStore from "./mixin/store/account.js"
import dashboardMixin from "@/mixin/api/dashboard.js"
import shareFilesMixin from "./mixin/api/share_files.js"
import taskMixin from "@/mixin/api/task.js"
import storageMixin from "@/mixin/api/storage.js"
import fileRelatedDatabaseMixin from "@/mixin/api/file_relatied_db.js"
Vue.mixin(utilMixin)
Vue.mixin(authMixin)
Vue.mixin(authStore)
Vue.mixin(accountMixin)
Vue.mixin(accountStore)
Vue.mixin(dashboardMixin)
Vue.mixin(shareFilesMixin)
Vue.mixin(taskMixin)
Vue.mixin(storageMixin)
Vue.mixin(fileRelatedDatabaseMixin)


// Firebase
import firebaseSettings from "@/config/settings/firebase.js"
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
const firebaseApp = initializeApp(firebaseSettings.firebaseConfig);
getDatabase(firebaseApp);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  // vue-head docs: https://github.com/ktquez/vue-head#examples-new-syntax
  head: {
    title: {
      inner: 'タスク管理アプリ'
    },
    meta: [
      { name: 'description', content: 'Vue.jsとFirebaseで構築されたタスク管理アプリです。日々のタスクや重要なファイルなどを管理できます。' },
    ],
  }
}).$mount('#app')
