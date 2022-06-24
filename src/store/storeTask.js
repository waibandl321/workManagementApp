const activate = {
    state: {
        tasks: []
    },
    mutations: {
        SET_TASKS(state, _tasks) {
            state.tasks = _tasks;
        },
        DESTROY_TASKS (state) {
            state.tasks = [];
        },
    }, 
    actions: {
        setTasks({ commit }, tasks) {
            commit("SET_TASKS", tasks);
        },
        destroyTasks({ commit }) {
            commit("DESTROY_TASKS");
        },
    }
}

export default activate