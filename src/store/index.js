import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

import account from "./storeAccount"
import auth from "./storeAuth"


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account: account,
    auth: auth,
  },
  plugins: [createPersistedState(
    { storage: window.localStorage }
    )
  ]
});