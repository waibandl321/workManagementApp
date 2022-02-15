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
        // タスクリストの並べ替え選択肢
        getSortStatusOptions() {
            return this.sort_status_options
        },
        getSortDateOptions() {
            return this.sort_date_options
        },

        // タスクステータス 
        getTaskStatus() {
            return this.task_status
        },
        
        // タスク作成
        apiTaskCreate(new_task) {
            const db = getDatabase();
            const userId = this.getAuthUserId()
            const id = Math.random().toString(32).substring(2)
            const time = this.getNowTime()
            set(ref(db, '/tasks/' + id), {
                task_id: id,
                project_id: "",
                task_name: new_task,
                task_description: "",
                task_message_content: "",
                task_message_post_account: "",
                task_status: {
                    key: 1,
                    text: "未着手",
                },
                task_manager: "",
                task_start_date: "",
                task_end_date: "",
                create_account: userId,
                created: time,
                updated: ""
            });
            return true
        },

        // タスク一覧取得
        apiGetTaskList() {
            const db = getDatabase()
            const r = ref(db, '/tasks/')
            let d = ""
            onValue(r, (snapshot) => {
                d = snapshot.val()
            })
            return d
        },

        // タスク詳細取得
        apiGetTaskDetail(id) {
            const db = getDatabase()
            const r = ref(db, '/tasks/' + id)
            let d = ""
            onValue(r, (snapshot) => {
                d = snapshot.val()
            })
            return d
        },
        // タスク期間更新
        apiSettingTaskTerm(terms, id) {
            for (let i = 0; i < 2; i++) {
                const db = getDatabase()
                const updates = {};
                updates['/tasks/' + id + '/task_start_date'] = terms[0]
                if(terms[1]) {
                    updates['/tasks/' + id + '/task_end_date'] = terms[1]
                }
                update(ref(db), updates);
            }
        },
        apiDeleteTaskTerm(id) {
            const db = getDatabase()
            const updates = {};
            updates['/tasks/' + id + '/task_start_date'] = ""
            updates['/tasks/' + id + '/task_end_date'] = ""                
            update(ref(db), updates);
        },
        // タスクステータス設定
        apiSettingTaskStatus(id, status) {
            const db = getDatabase()
            const updates = {};
            updates['/tasks/' + id + '/task_status'] = status
            update(ref(db), updates);
        },

        // タスク概要説明文
        apiUpdateTaskDescription(id, description) {
            const db = getDatabase()
            const updates = {};
            updates['/tasks/' + id + '/task_description'] = description
            update(ref(db), updates);
        },
        
        // タスク削除
        apiDeleteTask(task) {
            const db = getDatabase()
            const task_id = task.task_id
            remove(ref(db, '/tasks/' + task_id));
        },

        // サブタスク作成
        apiSubtaskCreate(subtask_name, task_id) {
            const db = getDatabase();
            const userId = this.getAuthUserId()
            const id = this.createRandomId()
            const time = this.getNowTime()
            set(ref(db, '/subtasks/' + id), {
                subtask_id: id,
                task_id: task_id,
                subtask_name: subtask_name,
                subtask_description: "",
                subtask_message_content: "",
                subtask_message_post_account: "",
                subtask_status: {
                    key: 1,
                    text: "未着手",
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
        // サブタスク一覧取得
        apiGetsubTaskList() {
            const db = getDatabase()
            const r = ref(db, 'subtasks/')
            let d = ""
            onValue(r, (snapshot) => {
                d = snapshot.val()
            })
            return d
        },
        // サブタスク削除(単体)
        apiDeleteSubtask(subtask) {
            const db = getDatabase()
            const subtask_id = subtask.subtask_id
            remove(ref(db, '/subtasks/' + subtask_id));
        },
        // 親タスク削除時のサブタスク削除
        apiDeleteSubtaskHasTask(subtasks) {
            const db = getDatabase()
            subtasks.forEach(r => {
                const subtask_id = r.subtask_id
                remove(ref(db, '/subtasks/' + subtask_id));
            })
        }
    }
}
