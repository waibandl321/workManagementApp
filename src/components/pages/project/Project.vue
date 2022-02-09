<template>
    <div class="inner">
        <div class="list" v-if="project_list">
            <ProjectList
                :recordClick="recordClick"
                :params="params"
                :parents="parents"
            />
        </div>
        <div class="detail" v-if="detail_active">
            <ProjectDetail
                :parents="parents"
                :params="params"
                :projectDetail="project_detail"
                :closeDetail="closeDetail"
                :displayWidth="displayWidth"
            />
        </div>
        <div class="detail" v-else>
            <ProjectDetailDammy />
        </div>
    </div>
</template>
<script>
import ProjectDetail from "@/components/pages/project/ProjectDetail"
import ProjectDetailDammy from "@/components/pages/project/ProjectDetailDammy"
import ProjectList from "@/components/pages/project/ProjectList"
import project_list from "@/config/json/projects.json"

export default {
    components: {
        ProjectList,
        ProjectDetail,
        ProjectDetailDammy
    },

    props: {
        parents: Object
    },

    data: () => ({
      detail_active: false,
      project_detail: [],
      project_list: true,
      params: {
        projects: [],
        status: { text: "全てのプロジェクト", value: 1 },
        status_filter_items: [
            { text: "全てのプロジェクト", value: 1 },
            { text: "有効なプロジェクト", value: 2 },
            { text: "未着手のプロジェクト", value: 3 },
            { text: "処理中のプロジェクト", value: 4 },
            { text: "社内確認待ちプロジェクト", value: 5 },
            { text: "期限切れプロジェクト", value: 6 },
            { text: "完了したプロジェクト", value: 7 },
        ],
        date_filter: { text: "優先度順", value: "1" },
        date_filter_items: [
            { text: "優先度順", value: "1" },
            { text: "期日が近い順", value: "2" },
            { text: "作成日順", value: "3" },
        ],
      },
    }),

    created() {
        this.init()
    },

    methods: {
        init() {
            this.params.projects = project_list.projects
        },
        recordClick(project) {
            this.detail_active = true
            this.project_detail = project
        },
        closeDetail() {
            this.detail_active = false
        },
        displayWidth(status) {
            if(status) {
                this.project_list = false
            } else {
                this.project_list = true
            }
        }
    }
}
</script>
<style scoped>
.inner {
    display: flex;
    height: 100%;
}
.list {
    border-right: 1px solid #ccc;
    width: 30%;
    padding: 0 24px;
}
.detail {
    padding: 0 24px;
    width: 100%;
}
.list + .detail {
    width: 70%;
}
</style>