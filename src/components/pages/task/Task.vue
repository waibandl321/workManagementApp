<template>
    <div class="inner"
        :class="{flex: detail_active}"
        ref="resizeArea"
    >
        <div class="list"
            v-if="task_list_layout"
            ref="list"
            :style="{ width: list_width, borderColor: resizeLineColor }"
        >
            <TaskList
                :recordClick="recordClick"
                :params="params"
                :refreshTaskList="refreshTaskList"
                :refreshTaskDetail="refreshTaskDetail"
                :deleteSubtaskHasTask="deleteSubtaskHasTask"
                :filterListStatus="filterListStatus"
                :filterListPriority="filterListPriority"
            />
        </div>
        <div class="x-layout-split"
            v-if="detail_active"
            ref="resizeLine"
            draggable="true" 
            @drag="resize"
            @dragend="resizeEnd"
        >
        </div>
        <div class="detail"
            v-if="detail_active"
            ref="detailArea"
            :style="{ width: detail_width }"
        >
            <TaskDetail
                :params="params"
                :taskDetail="task_detail"
                :refreshTaskList="refreshTaskList"
                :refreshTaskDetail="refreshTaskDetail"
                :closeDetail="closeDetail"
                :deleteSubtaskHasTask="deleteSubtaskHasTask"
                :initSubtaskList="initSubtaskList"
                :getFileList="getFileList"
            />
        </div>
    </div>
</template>
<script>
import TaskDetail from "@/components/pages/task/TaskDetail"
import TaskList from "@/components/pages/task/TaskList"

export default {
    components: {
        TaskList,
        TaskDetail,
    },

    props: {},

    data: () => ({
      detail_active: false,
      task_detail: [],
      task_list_layout: true,
      params: {
        task_list: [],
        task_status_list: {},
        task_priorities: {},
        subtask_list: {},
        status: { text: "全てのタスク", value: 1 },
        default_sort_item: { text: "作成日順", value: 2 },
        files: []
      },
      list_width: '100%',
      detail_width: '',
      resizeLineColor: '#ddd',
    }),

    created() {
        this.params.task_status_list = this.getTaskStatus() // status
        this.params.task_priorities = this.getTaskPriorities() // priorities
        this.getTaskList()
        this.getFileList()
        this.refreshTaskList()
    },
    
    methods: {
        getTaskList() {
            this.params.task_list = this.apiGetTaskList()
        },
        // タスク一覧更新
        refreshTaskList(delete_item, from_delete) {
            if(delete_item) {
                this.deleteTaskDetail(delete_item)
            }
            if(from_delete) {
                this.task_detail = []
                this.detail_active = false
            }
            this.params.task_list = this.apiGetTaskList()
        },
         // タスク詳細の更新
        refreshTaskDetail() {
            this.task_detail = this.apiGetTaskDetail(this.task_detail.task_id)
        },
        // ファイルデータの取得
        getFileList() {
            let files = this.apiGetFiles()
            if(files) {
                const obj = Object.entries(files)
                let arr = []
                obj.forEach(r => {
                    if(r[1].task_id == this.task_detail.task_id) {
                        arr.push(r[1])
                    }
                })
                this.params.files = arr
            } else {
                this.params.files = []
            }
        },
        // タスクリストクリック
        recordClick(task) {
            this.detail_active = true
            this.list_width = '40%'
            this.detail_width = '60%'
            this.initSubtaskList(task)
            this.task_detail = task
            this.getFileList()
        },
        // サブタスク一覧
        initSubtaskList(task) {
            if(task.task_id) {
                let subtasks = []
                let obj = this.apiGetSubtaskList()
                if(obj) {
                    let arr = Object.entries(obj)
                    arr.forEach(r => {
                        if(r[1].task_id == task.task_id) {
                            subtasks.push(r[1])
                        }
                    })
                    this.params.subtask_list = subtasks
                } else {
                    this.params.subtask_list = {}
                }
            }
        },
        

        // 詳細画面close
        closeDetail() {
            this.detail_active = false
            this.list_width = "100%"
        },
        
        // タスクリストの絞り込み
        filterListStatus(filter_key, priority) {
            this.refreshTaskList()
            if(filter_key != 0) {
                this.filter(filter_key, "task_status")
            }
            if(priority) {
                this.filter(priority, "task_priority")
            }
        },
        filterListPriority(filter_key, status) {
            this.refreshTaskList()
            if(filter_key != 0) {
                this.filter(filter_key, "task_priority")
            }
            if(status) {
                this.filter(status, "task_status")
            }
        },
        filter(filter_key, filter_text) {
            let arr = []
            let obj = {}
            if( filter_text == "task_status" ) {
                Object.entries(this.params.task_list).forEach(r => {
                    if(r[1].task_status.key == filter_key) {
                        arr.push(r)
                    }
                })
                obj = Object.fromEntries(arr)
                this.params.task_list = obj
            }
            else if( filter_text == "task_priority" ) {
                Object.entries(this.params.task_list).forEach(r => {
                    if(r[1].task_priority.key == filter_key) {
                        arr.push(r)
                    }
                })
                obj = Object.fromEntries(arr)
                this.params.task_list = obj
            }
        },
        // リスト削除 => 詳細情報の削除
        deleteTaskDetail(delete_item) {
            if(delete_item.task_id == this.task_detail.task_id) {
                this.task_detail = []
                this.detail_active = false
            }
        },
        // サブタスクの削除
        deleteSubtaskHasTask(item) {
            this.initSubtaskList(item)
            if(this.params.subtask_list.length > 0) {
                this.apiDeleteSubtaskHasTask(this.params.subtask_list)
            }
            return true
        },
        // 要素のリサイズ
        resize(event) {
            if(event.clientX != 0) {
                this.list_width = event.x + 'px'
                this.detail_width = (window.innerWidth - event.x) + 'px'
                this.resizeLineColor = "#1976d2"
            }
        },
        resizeEnd() {
            this.resizeLineColor = "#ddd"
        }
    }   
}
</script>
<style scoped>
.inner {
    display: flex;
    height: 100%;
    overflow-y: hidden;
}
.list,
.detail {
    box-sizing: border-box;
    padding: 24px 16px 10%;
    height: calc(100vh - 70px);
    overflow: auto;
}
.list {
    border-right: 3px solid;
}
.list::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}
.list::-webkit-scrollbar-track {
  border-radius: 5px;
  box-shadow: 0 0 4px #aaa inset;
}
.list::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #bbb;
}
.x-layout-split {
    width: 3px;
    opacity: 0;
    transform: translateX(-3px);
    background-color: #ccc;
}
.x-layout-split:hover {
    cursor: col-resize;
}
</style>