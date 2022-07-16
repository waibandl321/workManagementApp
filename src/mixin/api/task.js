import {
    getDatabase,
    ref,
    set,
    update,
    remove,
    onValue
} from "firebase/database";

export default {
    methods: {
        // タスク一覧取得
        async apiGetTaskList() {
            return new Promise((resolve, reject) => {
                const db = getDatabase()
                const starCountRef = ref(db, '/tasks/' + this.storeGetFirebaseUid())
                onValue(starCountRef, (snapshot) => {
                    resolve(snapshot.val());
                }, (err) => {
                    reject(err);
                })
            })
        },
        // サブタスク一覧取得
        async apiGetSubtaskList() {
            return new Promise((resolve, reject) => {
                const db = getDatabase();
                const userId = this.storeGetFirebaseUid()
                const starCountRef = ref(db, 'subtasks/' + userId)
                onValue(starCountRef, (snapshot) => {
                    resolve(snapshot.val());
                }, (err) => {
                    reject(err);
                })
            })
        },
        
        // タスク作成
        async apiTaskCreate(task) {
            const db = getDatabase();
            return await set(ref(db, '/tasks/' + this.storeGetFirebaseUid() + '/' + task.task_id), task)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            })
        },
        // サブタスク作成
        async apiSubtaskCreate(subtask) {
            const db = getDatabase();
            const userId = this.storeGetFirebaseUid()
            return await set(ref(db, '/subtasks/' + userId + '/' + subtask.subtask_id), subtask)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            })
        },
        // サブタスク更新
        async apiUpdateSubtask(subtask) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/subtasks/' + userId + '/' + subtask.subtask_id] = subtask;
            return await update(ref(db), updates)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
        },

        // タスクステータス更新
        async apiUpdateTaskStatus(task) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};

            if(task.task_status == 5) {
                updates['/tasks/' + userId + '/' + task.task_id + '/task_status'] = task.task_status
                updates['/tasks/' + userId + '/' + task.task_id + '/finished_at'] = this.getCurrentUnixtime()
            } else {
                updates['/tasks/' + userId + '/' + task.task_id + '/task_status'] = task.task_status
            }
            return await update(ref(db), updates)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
        },
        // タスク優先度更新
        async apiUpdateTaskPriority(id, priority) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/tasks/' + userId + '/' + id + '/task_priority'] = priority
            return await update(ref(db), updates)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            })
        },
        // タスク名更新
        async apiUpdateTaskname(id, taskname) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/tasks/' + userId + '/' + id + '/task_name'] = taskname
            return await update(ref(db), updates)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            })
        },
        // タスク詳細更新
        async apiUpdateTaskDescription(id, description) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/tasks/' + userId + '/' + id + '/task_description'] = description
            return await update(ref(db), updates)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            })
        },
        // タスク期日更新
        async apiUpdateTaskDeadline(task_deadline, task_id) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            const updates = {};
            updates['/tasks/' + userId + '/' + task_id + '/task_deadline'] = task_deadline
            return await update(ref(db), updates)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            })
        },
        
        // 削除
        async apiDeleteTask(task) {
            const db = getDatabase()
            const updates = {};
            updates['/tasks/' + this.storeGetFirebaseUid() + '/' + task.task_id] = null;
            return await update(ref(db), updates);
        },
        // アカウント削除に連動したタスク削除
        async firebaseDeleteAccountTasks() {
            const db = getDatabase()
            const updates = {};
            updates['/tasks/' + this.storeGetFirebaseUid()] = null;
            return await update(ref(db), updates);
        },
        async apiDeleteSubtask(subtask) {
            const db = getDatabase()
            const updates = {};
            updates['/subtasks/' + this.storeGetFirebaseUid() + '/' + subtask.subtask_id] = null;
            return await update(ref(db), updates)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            })
        },
        // 親タスク削除時にサブタスクがある場合
        apiDeleteSubtaskHasTask(subtasks) {
            const db = getDatabase()
            const userId = this.storeGetFirebaseUid()
            subtasks.forEach(r => {
                const subtask_id = r.subtask_id;
                remove(ref(db, '/subtasks/' + userId + '/' + subtask_id));
            })
        },
        getSortStatusOptions() {
            return SORT_STATUS_OPTION;
        },
        getSortDateOptions() {
            return SORT_DATE_OPTIONS;
        },
        getTaskPriorities() {
            return TASK_PRIORITIES;
        },        
        getTaskStatus() {
            return TASK_STATUS;
        },
        getEditorOptions() {
            return ERITOR_OPTIONS;
        },
    }
}

const TASK_STATUS = [
    { key: 0, text: "指定しない" },
    { key: 1, text: "未着手" },
    { key: 2, text: "処理中" },
    { key: 3, text: "社内確認待ち" },
    { key: 4, text: "先方連絡待ち" },
    { key: 5, text: "完了" }
];
const SORT_STATUS_OPTION = [
    { text: "全てのタスク", value: 1 },
    { text: "有効なタスク", value: 2 },
    { text: "未着手のタスク", value: 3 },
    { text: "処理中のタスク", value: 4 },
    { text: "社内確認待ちタスク", value: 5 },
    { text: "期限切れタスク", value: 6 },
    { text: "完了したタスク", value: 7 },
];
const SORT_DATE_OPTIONS = [
    { text: "期日が近い順", value: 1 },
    { text: "作成日順", value: 2 },
];
const TASK_PRIORITIES = [
    { key: 0, text: "指定しない" },
    { key: 1, text: "最優先" },
    { key: 4, text: "高" },
    { key: 2, text: "中" },
    { key: 3, text: "低" },
];
const ERITOR_OPTIONS = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    // [{ 'header': 1 }, { 'header': 2 }],            // custom button values
    // [{ 'direction': 'rtl' }],                      // text direction
    // [{ 'script': 'sub'}, { 'script': 'super' }],   // superscript/subscript
    // [{ 'font': [] }],                              // font family
    // [{ 'align': [] }],                             // text-align
    // ['clean']                                      // remove formatting button
];