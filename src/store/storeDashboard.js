const activate = {
  state: {
      dashboard_tasks: null,
  },
  mutations: {
      SET_DASHBOAD_TASKS (state, items) {
          state.dashboard_tasks = items
      },
  }, 
  actions: {
      setDashboardTasks({ commit }, items) {
          commit("SET_DASHBOAD_TASKS", items)
      },
      deleteDashboardTasks({ commit }) {
          commit("SET_DASHBOAD_TASKS", null)
      },
  }
}

export default activate