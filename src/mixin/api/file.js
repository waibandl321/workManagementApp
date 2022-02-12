import {
    getDatabase,
    ref,
    set
} 
from "firebase/database";
export default {

    data: () => ({
        newSave: null
    }),

    methods: {
        apiUploadFile(file, task_id) {
            const size = this.formatSize(file.size)
            const id = this.createRandomId()
            const now = this.getNowTime()
            const form_data = {
                file_size: size,
                file_name: file.name,
                file_type: file.type,
                task_id: task_id,
                folder_id: "null",
                project_id: "null",
                subtask_id: "null",
                chat_id: "null",
                board_id: "null",
                message_id: "null",
                account_id: "null",
                status: true,
                created_at: now
            }
            const db = getDatabase();
            set(ref(db, 'files/' + id), form_data)
        },
    }
}
