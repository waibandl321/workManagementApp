import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

import account from "./storeAccount"


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account
  },
  plugins: [createPersistedState(
    { storage: window.sessionStorage }
    )
  ]
});