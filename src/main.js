import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store.js'
// firebase
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

// mixins
import utilMixin from "@/mixin/common/util.js"
import authMixin from "./mixin/auth/auth.js"
import taskMixin from "@/mixin/api/task.js"
import fileMixin from "@/mixin/api/file.js"
import subtaskMixin from "@/mixin/api/subtask.js"
import chatMixin from "@/mixin/api/chat.js"
import boardMixin from "@/mixin/api/board.js"
import dashboardMixin from "@/mixin/api/dashboard.js"
import projectMixin from "@/mixin/api/project.js"
import vuetify from './plugins/vuetify'

// firebase setting info
import firebaseSettings from "@/config/settings/firebase.js"

Vue.mixin(authMixin)
Vue.mixin(taskMixin)
Vue.mixin(utilMixin)
Vue.mixin(fileMixin)

Vue.use(subtaskMixin)
Vue.use(chatMixin)

Vue.use(boardMixin)
Vue.use(dashboardMixin)
Vue.use(projectMixin)


Vue.config.productionTip = false

// Initialize Firebase
const app = initializeApp(firebaseSettings.firebaseConfig);
getDatabase(app);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
