const activate = {
    state: {
        account: {}
    },
    mutations: {
        SET_ACCOUNT_DATA (state, account) {
            state.account = account
        },
        UPDATE_ACCOUNT_DATA (state, account) {
            state.account = account
        }
    },
    actions: {
        setAccountData({ commit }, account) {
            commit("SET_ACCOUNT_DATA", account)
        },
        updateAccountData({ commit }, account) {
            commit("UPDATE_ACCOUNT_DATA", account)
        },
    },
}

export default activate