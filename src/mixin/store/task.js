import store from '@/store'

export default {
    methods: {
        // タスク取得
        storeGetTasks() {
            return store.state.task.tasks
        },
        // タスクセット
        storeSetTasks(tasks) {
            store.dispatch("setTasks", tasks)
        },
        // タスク破棄
        storeDestroyTasks() {
            store.dispatch("destroyTasks")
        },
    }
}



