import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/index.js'
// firebase
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";


// mixins
import utilMixin from "@/mixin/common/util.js"
import authMixin from "./mixin/firebase/auth.js"

import accountMixin from "./mixin/api/account.js"
import accountStore from "./mixin/store/account.js"

import taskMixin from "@/mixin/api/task.js"
import fileMixin from "@/mixin/api/file.js"
import fileRelatedDatabaseMixin from "@/mixin/api/file_relatied_db.js"
import dashboardMixin from "@/mixin/api/dashboard.js"
import vuetify from './plugins/vuetify'

// firebase setting info
import firebaseSettings from "@/config/settings/firebase.js"

Vue.mixin(authMixin)

Vue.mixin(accountMixin)
Vue.mixin(accountStore)

Vue.mixin(taskMixin)
Vue.mixin(fileMixin)
Vue.mixin(fileRelatedDatabaseMixin)
Vue.use(dashboardMixin)

Vue.mixin(utilMixin)



Vue.config.productionTip = false

// Initialize Firebase
const firebaseApp = initializeApp(firebaseSettings.firebaseConfig);
getDatabase(firebaseApp);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
