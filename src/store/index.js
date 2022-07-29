import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

import account from "./storeAccount"
import auth from "./storeAuth"
import dashboard from "./storeDashboard"


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account: account,
    auth: auth,
    dashboard: dashboard
  },
  plugins: [createPersistedState(
    { storage: window.localStorage }
    )
  ]
});