import store from '@/store'

export default {
    methods: {
        storeGetDashboardTasks() {
          return store.state.dashboard.dashboard_tasks;
        },
        storeSetDashboardTasks(items) {
          store.dispatch("setDashboardTasks", items)
        },
        storeDeleteDashboardTasks() {
          store.dispatch("deleteDashboardTasks")
        }
    }
}



