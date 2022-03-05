<template>
    <div class="inner"
        :class="{flex: detail_active}"
        ref="resizeArea"
    >
        <div class="list"
            v-if="project_list_layout"
            ref="list"
            :style="{ width: list_width, borderColor: resizeLineColor }"
        >
            <ProjectList
                :recordClick="recordClick"
                :params="params"
                :refreshProjectList="refreshProjectList"
                :refreshProjectDetail="refreshProjectDetail"
                :filterListStatus="filterListStatus"
                :filterListPriority="filterListPriority"
                :deleteAllFile="deleteAllFile"
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
            <ProjectDetail
                :params="params"
                :projectDetail="project_detail"
                :refreshProjectList="refreshProjectList"
                :refreshProjectDetail="refreshProjectDetail"
                :closeDetail="closeDetail"
                :getFileList="getFileList"
                :deleteAllFile="deleteAllFile"
            />
        </div>
    </div>
</template>
<script>
import ProjectDetail from "@/components/pages/project/ProjectDetail"
import ProjectList from "@/components/pages/project/ProjectList"

export default {
    components: {
        ProjectList,
        ProjectDetail,
    },

    props: {},

    data: () => ({
      detail_active: false,
      project_detail: [],
      project_list_layout: true,
      params: {
        project_list: [],
        project_status_list: {},
        project_priorities: {},
        status: { text: "全てのプロジェクト", value: 1 },
        default_sort_item: { text: "作成日順", value: 2 },
        files: []
      },
      list_width: '100%',
      detail_width: '',
      resizeLineColor: '#ddd',
    }),

    created() {
        this.params.project_status_list = this.getProjectStatus() // status
        this.params.project_priorities = this.getProjectPriorities() // priorities
        this.getProjectList()
        this.getFileList()
        this.refreshProjectList()
    },
    
    methods: {
        getProjectList() {
            this.params.project_list = this.apiGetProjectList()
        },
        // プロジェクト一覧更新
        refreshProjectList(delete_item, from_delete) {
            if(delete_item) {
                this.deleteProjectDetail(delete_item)
            }
            if(from_delete) {
                this.project_detail = []
                this.detail_active = false
            }
            this.params.project_list = this.apiGetProjectList()
        },
         // プロジェクト詳細の更新
        refreshProjectDetail() {
            this.project_detail = this.apiGetProjectDetail(this.project_detail.project_id)
        },
        // ファイルデータの取得
        getFileList() {
            let files = this.apiGetFiles()
            if(files) {
                const obj = Object.entries(files)
                let arr = []
                obj.forEach(r => {
                    if(r[1].project_id == this.project_detail.project_id) {
                        arr.push(r[1])
                    }
                })
                this.params.files = arr
            } else {
                this.params.files = []
            }
        },
        // 全ての添付ファイルを削除
        deleteAllFile(files) {
            files.forEach(r => {
                this.apiDeleteFileStorage(r)
            })
        },
        // プロジェクトリストクリック
        recordClick(project) {
            this.detail_active = true
            this.list_width = '40%'
            this.detail_width = '60%'
            this.project_detail = project
            this.getFileList()
        },
        

        // 詳細画面close
        closeDetail() {
            this.detail_active = false
            this.list_width = "100%"
        },
        
        // プロジェクトリストの絞り込み
        filterListStatus(filter_key, priority) {
            this.refreshProjectList()
            if(filter_key != 0) {
                this.filter(filter_key, "project_status")
            }
            if(priority) {
                this.filter(priority, "project_priority")
            }
        },
        filterListPriority(filter_key, status) {
            this.refreshProjectList()
            if(filter_key != 0) {
                this.filter(filter_key, "project_priority")
            }
            if(status) {
                this.filter(status, "project_status")
            }
        },
        filter(filter_key, filter_text) {
            let arr = []
            let obj = {}
            if( filter_text == "project_status" ) {
                Object.entries(this.params.project_list).forEach(r => {
                    if(r[1].project_status.key == filter_key) {
                        arr.push(r)
                    }
                })
                obj = Object.fromEntries(arr)
                this.params.project_list = obj
            }
            else if( filter_text == "project_priority" ) {
                Object.entries(this.params.project_list).forEach(r => {
                    if(r[1].project_priority.key == filter_key) {
                        arr.push(r)
                    }
                })
                obj = Object.fromEntries(arr)
                this.params.project_list = obj
            }
        },
        // リスト削除 => 詳細情報の削除
        deleteProjectDetail(delete_item) {
            if(delete_item.project_id == this.project_detail.project_id) {
                this.project_detail = []
                this.detail_active = false
            }
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