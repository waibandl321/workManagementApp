import {
    getDatabase,
    ref,
    set,
    remove,
    onValue
} from "firebase/database";

export default {

    data: () => ({
        task_status: [
            { key: 1, text: "未着手" },
            { key: 2, text: "処理中" },
            { key: 3, text: "社内確認待ち" },
            { key: 4, text: "先方連絡待ち" },
            { key: 5, text: "完了" }
        ],
        sort_status_options: [
            { text: "全てのタスク", value: 1 },
            { text: "有効なタスク", value: 2 },
            { text: "未着手のタスク", value: 3 },
            { text: "処理中のタスク", value: 4 },
            { text: "社内確認待ちタスク", value: 5 },
            { text: "期限切れタスク", value: 6 },
            { text: "完了したタスク", value: 7 },
        ],
        sort_date_options: [
            { text: "期日が近い順", value: 1 },
            { text: "作成日順", value: 2 },
        ],
    }),

    methods: {
        getStatusOptions() {
            return this.sort_status_options
        },
        getSortOptions() {
            return this.sort_date_options
        },
        getTaskStatus() {
            return this.task_status
        },
        // create
        apiTaskCreate(new_task) {
            const db = getDatabase();
            const userId = this.getAuthUserId()
            const id = Math.random().toString(32).substring(2)
            set(ref(db, '/tasks/' + id), {
                task_id: id,
                project_id: "",
                task_name: new_task,
                task_description: "",
                task_message_content: "",
                task_message_post_account: "",
                task_status: {
                    key: 1,
                    value: "新規",
                },
                task_manager: "",
                task_start_date: "",
                task_end_date: "",
                create_account: userId,
            });
            return true
        },
        // get
        apiGetTaskList() {
            const db = getDatabase()
            const r = ref(db, '/tasks/')
            let d = ""
            onValue(r, (snapshot) => {
                d = snapshot.val()
            })
            return d
            
        },
        // delete
        apiDeleteTask(task) {
            const db = getDatabase()
            const task_id = task.task_id
            remove(ref(db, '/tasks/' + task_id));
        },
    }
}
