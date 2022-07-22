const activate = {
    state: {
        uid: '',
        delete_result: null,
    },
    mutations: {
        SET_UID (state, _uid) {
            state.uid = _uid
        },
        DESTROY_UID (state) {
            state.uid = ''
        },
        SET_ACCOUNT_DELETE_RESULT(state, _delete_result) {
            state.delete_result = _delete_result
        },
        DELETE_ACCOUNT_DELETE_RESULT(state) {
            state.delete_result = null
        }
    }, 
    actions: {
        setUid({ commit }, _uid) {
            commit("SET_UID", _uid)
        },
        destroyUid({ commit }) {
            commit("DESTROY_UID")
        },
        setAccountDeleteResult({ commit }, _delete_result) {
            commit("SET_ACCOUNT_DELETE_RESULT", _delete_result)
        },
        deleteAccountDeleteResult({ commit }) {
            commit("DELETE_ACCOUNT_DELETE_RESULT")
        }
    }
}

export default activate