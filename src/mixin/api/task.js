import {
    getDatabase,
    ref,
    set,
    update,
    remove,
    onValue
} from "firebase/database";

export default {

    data: () => ({
        task_status: [
            { key: 0, text: "指定しない" },
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
        task_priorities: [
            { key: 0, text: "指定しない" },
            { key: 1, text: "最優先" },
            { key: 2, text: "中" },
            { key: 3, text: "低(後回しでOK)" },
        ]
    }),

    methods: {
        getSortStatusOptions() {
            return this.sort_status_options
        },
        getSortDateOptions() {
            return this.sort_date_options
        },
        getTaskPriorities() {
            return this.task_priorities
        },        
        getTaskStatus() {
            return this.task_status
        },
        // 取得
        async apiGetTaskList() {
            return new Promise((resolve,) => {
                const db = getDatabase()
                const r = ref(db, '/tasks/' + this.storeGetFirebaseUid())
                onValue(r, (snapshot) => {
                    return resolve(snapshot.val())
                })
            })
            .catch((reason) => {
                console.log(reason.messege);
            });
        },
        apiGetSubtaskList() {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const r = ref(db, 'subtasks/' + userId)
            let d = ""
            onValue(r, (snapshot) => {
                d = snapshot.val()
            })
            return d
        },
        
        // 作成
        apiTaskCreate(new_task) {
            const id = Math.random().toString(32).substring(2)
            const data_obj = {
                task_id: id,
                project_id: "",
                task_name: new_task,
                task_description: "",
                task_message_content: "",
                task_message_post_account: "",
                task_status: 0,
                task_priority: 0,
                task_manager: "",
                task_deadline: null,
                create_account: this.storeGetFirebaseUid(),
                created: this.getCurrentUnixtime(),
                updated: ""
            }
            try {
                const db = getDatabase();
                set(ref(db, '/tasks/' + this.storeGetFirebaseUid() + '/' + id), data_obj)
                return true
            } catch (error) {
                console.log(error);
                return false
            }
        },
        apiSubtaskCreate(subtask_name, task_id) {
            const db = getDatabase();
            const userId = this.storeGetFirebaseUid()
            const id = this.createRandomId()
            const time = this.getCurrentUnixtime()
            set(ref(db, '/subtasks/' + userId + '/' + id), {
                subtask_id: id,
                task_id: task_id,
                subtask_name: subtask_name,
                subtask_description: "",
                subtask_message_content: "",
                subtask_message_post_account: "",
                subtask_status: {
                    key: 0,
                    text: "指定しない",
                },
                subtask_manager: "",
                subtask_start_date: "",
                subtask_end_date: "",
                create_account: userId,
                created: time,
                updated: ""
            });
            return true
        },

        // 更新
        apiDeleteTaskTerm(id) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/tasks/' + userId + '/' + id + '/task_deadline'] = null
            update(ref(db), updates);
        },
        apiUpdateTaskStatus(id, status) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/tasks/' + userId + '/' + id + '/task_status'] = status
            update(ref(db), updates);
        },
        apiUpdateTaskPriority(id, priority) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/tasks/' + userId + '/' + id + '/task_priority'] = priority
            update(ref(db), updates);
        },
        apiUpdateTaskname(id, taskname) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/tasks/' + userId + '/' + id + '/task_name'] = taskname
            update(ref(db), updates);
        },
        apiUpdateTaskDescription(id, description) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/tasks/' + userId + '/' + id + '/task_description'] = description
            update(ref(db), updates);
        },
        apiUpdateTaskTerm(task_deadline, task_id) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/tasks/' + userId + '/' + task_id + '/task_deadline'] = task_deadline
            update(ref(db), updates);
        },
        
        // 削除
        apiDeleteTask(task) {
            const db = getDatabase()
            const updates = {};
            updates['/tasks/' + this.storeGetFirebaseUid() + '/' + task.task_id] = null;

            return update(ref(db), updates);
        },
        apiDeleteSubtask(subtask) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const subtask_id = subtask.subtask_id
            remove(ref(db, '/subtasks/' + userId + '/' + subtask_id));
        },
        // 親タスク削除時にサブタスクがある場合
        apiDeleteSubtaskHasTask(subtasks) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            subtasks.forEach(r => {
                const subtask_id = r.subtask_id
                remove(ref(db, '/subtasks/' + userId + '/' + subtask_id));
            })
        }
    }
}
