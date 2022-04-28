const activate = {
    state: {
        uid: '',
    },
    mutations: {
        SET_UID (state, _uid) {
            state.uid = _uid
        },
        DESTROY_UID (state) {
            state.uid = ''
        },
    }, 
    actions: {
        setUid({ commit }, _uid) {
            commit("SET_UID", _uid)
        },
        destroyUid({ commit }) {
            commit("DESTROY_UID")
        },
    }
}

export default activate