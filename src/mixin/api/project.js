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
         project_status: [
            { key: 0, text: "指定しない" },
            { key: 1, text: "未着手" },
            { key: 2, text: "処理中" },
            { key: 3, text: "社内確認待ち" },
            { key: 4, text: "先方連絡待ち" },
            { key: 5, text: "完了" }
        ],
        sort_status_options: [
            { text: "全てのプロジェクト", value: 1 },
            { text: "有効なプロジェクト", value: 2 },
            { text: "未着手のプロジェクト", value: 3 },
            { text: "処理中のプロジェクト", value: 4 },
            { text: "社内確認待ちプロジェクト", value: 5 },
            { text: "期限切れプロジェクト", value: 6 },
            { text: "完了したプロジェクト", value: 7 },
        ],
        sort_date_options: [
            { text: "期日が近い順", value: 1 },
            { text: "作成日順", value: 2 },
        ],
         project_priorities: [
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
        getProjectPriorities() {
            return this.project_priorities
        },
        // プロジェクトステータス取得
        getProjectStatus() {
            return this.project_status
        },
        // プロジェクト作成
        apiProjectCreate(new_project) {
            const db = getDatabase();
            const userId = this.getAuthUserId()
            const id = Math.random().toString(32).substring(2)
            const time = this.getNowTime()
            set(ref(db, '/projects/' + userId + '/' + id), {
                project_id: id,
                task_id: "",
                project_name: new_project,
                project_description: "",
                project_message_content: "",
                project_message_post_account: "",
                project_status: {
                    key: 1,
                    text: "未着手",
                },
                project_priority: {
                    key: 2,
                    text: "中"
                },
                project_manager: "",
                project_start_date: "",
                project_end_date: "",
                create_account: userId,
                created: time,
                updated: ""
            });
            return true
        },

        // プロジェクト一覧取得
        apiGetProjectList() {
            const db = getDatabase()
            const userId = this.getAuthUserId()
            const r = ref(db, '/projects/' + userId)
            let d = ""
            onValue(r, (snapshot) => {
                d = snapshot.val()
            })
            return d
        },

        // プロジェクト詳細取得
        apiGetProjectDetail(id) {
            const db = getDatabase()
            const userId = this.getAuthUserId()
            const r = ref(db, '/projects/' + userId + '/' + id)
            let d = ""
            onValue(r, (snapshot) => {
                d = snapshot.val()
            })
            return d
        },
        // プロジェクト期間更新
        apiSettingProjectTerm(terms, id) {
            for (let i = 0; i < 2; i++) {
                const db = getDatabase()
                const userId = this.getAuthUserId()
                const updates = {};
                updates['/projects/' + userId + '/' + id + '/project_start_date'] = terms[0]
                if(terms[1]) {
                    updates['/projects/' + userId + '/' + id + '/project_end_date'] = terms[1]
                }
                update(ref(db), updates);
            }
        },
        apiDeleteProjectTerm(id) {
            const db = getDatabase()
            const userId = this.getAuthUserId()
            const updates = {};
            updates['/projects/' + userId + '/' + id + '/project_start_date'] = ""
            updates['/projects/' + userId + '/' + id + '/project_end_date'] = ""                
            update(ref(db), updates);
        },
        // プロジェクトステータス設定
        apiSettingProjectStatus(id, status) {
            const db = getDatabase()
            const userId = this.getAuthUserId()
            const updates = {};
            updates['/projects/' + userId + '/' + id + '/project_status'] = status
            update(ref(db), updates);
        },
        // プロジェクト優先度設定
        apiSettingProjectPriority(id, priority) {
            const db = getDatabase()
            const userId = this.getAuthUserId()
            const updates = {};
            updates['/projects/' + userId + '/' + id + '/project_priority'] = priority
            update(ref(db), updates);
        },
        // プロジェクト名
        apiUpdateProjectname(id, projectname) {
            const db = getDatabase()
            const userId = this.getAuthUserId()
            const updates = {};
            updates['/projects/' + userId + '/' + id + '/project_name'] = projectname
            update(ref(db), updates);
        },
        // プロジェクト概要説明文
        apiUpdateProjectDescription(id, description) {
            const db = getDatabase()
            const userId = this.getAuthUserId()
            const updates = {};
            updates['/projects/' + userId + '/' + id + '/project_description'] = description
            update(ref(db), updates);
        },
        
        // プロジェクト削除
        apiDeleteProject(project) {
            const db = getDatabase()
            const userId = this.getAuthUserId()
            const project_id = project.project_id
            remove(ref(db, '/projects/' + userId + '/' + project_id));
        },

        
    }
}
