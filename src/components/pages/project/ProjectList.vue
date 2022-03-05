<template>
    <div class="list_inner">
        <div class="list_head">
            <div class="d-flex mb-4">
                <v-spacer />
                <v-btn color="success" filled @click="reload()">
                    <v-icon>mdi-reload</v-icon>
                    再読み込み
                </v-btn>
            </div>
            <h2>プロジェクト</h2>
            <div class="filter">
                <v-row class="my-0">
                    <v-col cols="6" class="filter-box">
                        <v-select
                            label="ステータスで絞り込む"
                            :items="this.params.project_status_list"
                            item-text="text"
                            item-value="key"
                            outlined
                            color="primary"
                            dense
                            v-model="status"
                            @change="filterStatus()"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" class="filter-box">
                        <v-select
                            label="優先度で絞り込む"
                            :items="this.params.project_priorities"
                            item-text="text"
                            item-value="key"
                            outlined
                            color="primary"
                            dense
                            v-model="priority"
                            @change="filterPriority()"
                        ></v-select>
                    </v-col>
                </v-row>
            </div>
            <!-- add project -->
            <div class="project-add">
                <v-btn
                    color="primary"
                    text
                    @click="project_input = !project_input"
                >
                    <v-icon>mdi-plus</v-icon>
                    プロジェクトを追加
                </v-btn>
            </div>
            <v-alert
                v-model="success"
                close-text="Close Alert"
                color="success"
                text
                dense
                dismissible
            >
                プロジェクトを新規作成しました！
            </v-alert>
            <v-alert
                dense
                outlined
                dismissible
                type="error"
                v-model="project_delete_alert"
            >
                プロジェクトを削除しました。
            </v-alert>
            <div class="mt-2 relative" v-show="project_input">
                <v-text-field
                    label="プロジェクト名を入力"
                    v-model="new_project_name"
                >
                </v-text-field>
                <v-btn
                    depressed
                    class="primary alt_submit"
                    text
                    @click="createProject()"
                >新規作成
                </v-btn>
            </div>
            <div v-if="loading">
                <v-progress-linear
                    indeterminate
                    color="primary"
                ></v-progress-linear>
            </div>
        </div>
        
        <div class="list_body">
            <table
                class="project-list mt-4"
            >
                <thead>
                    <tr>
                        <td>プロジェクト名</td>
                        <td>優先度</td>
                        <td>ステータス</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="project in params.project_list"
                        :key="project.id"
                        @click.stop="record(project)"
                    >
                        <td class="py-2">{{ project.project_name }}</td>
                        <td class="py-2">{{ project.project_priority.text }}</td>
                        <td class="py-2">{{ project.project_status.text }}</td>
                        <td class="options-td">
                            <v-btn
                                text
                                @click.stop="del(project)"
                            >
                                <v-icon>mdi-trash-can-outline</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- プロジェクト削除確認モーダル -->
        <v-row justify="center">
            <v-dialog
            v-model="project_delete"
            persistent
            max-width="600px"
            >
            <v-card>
                <v-card-title>
                <span class="text-h5">プロジェクトを削除します</span>
                </v-card-title>
                <v-card-text>
                    本当によろしいですか？
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        outlined
                        depressed
                        class="pa-4"
                        @click="project_delete = false"
                    >
                        キャンセル
                    </v-btn>
                    <v-btn
                        depressed
                        class="pa-4"
                        color="red darken-4"
                        outlined
                        @click="execDelete()"
                        
                    >
                        削除する
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
export default {
    props: {
        recordClick: Function,
        params: Object,
        refreshProjectList: Function,
        refreshProjectDetail: Function,
        filterListStatus: Function,
        filterListPriority: Function,
    },
    data: () => ({
        project_input: false,
        // create
        new_project_name: "",
        loading: false,
        success: false,
        // delete
        delete_project: {},
        project_delete: false,
        project_delete_alert: false,
        // filter
        priority: null,
        status: null
    }),

    created() {
        this.init()
    },

    methods: {
        reload() {
            this.refreshProjectList()
            if(this.project_detail) {
                this.refreshProjectDetail()
            }
        },
        init() {
            this.refreshProjectList(this.delete_project ? this.delete_project : {})
        },
        // 絞り込み
        filterStatus() {
            const list = this.params.project_status_list
            let filter_key = Number
            list.forEach(r => {
                if(r.key == this.status) {
                    filter_key = r.key
                }   
            });
            this.filterListStatus(filter_key, this.priority)
        },
        filterPriority() {
            const list = this.params.project_status_list
            let filter_key = Number
            list.forEach(r => {
                if(r.key == this.priority) {
                    filter_key = r.key
                }   
            });
            this.filterListPriority(filter_key, this.status)
        },
        record(project) {
            this.recordClick(project)
        },
        createProject() {
            this.loading = true
            const create = this.apiProjectCreate(this.new_project_name)
            if(create) {
                this.loading = false
                this.success = true
                this.new_project_name = ""
                this.init()
            }
        },
        // delete
        del(project) {
            this.project_delete = true
            this.delete_project = project
        },
        execDelete() {
            this.apiDeleteProject(this.delete_project)
            this.project_delete_alert = true
            this.project_delete = false
            this.init()
        }
    }
}
</script>

<style scoped>
.list_inner >>> .v-text-field__details {
    display: none;
}

.filter-box {
    max-width: 300px;
}
select {
    border: 1px solid #ccc;
    height: 40px;
}
select:focus {
    outline: none;
}
.project-list {
    border-collapse: collapse;
    table-layout: unset;
    width: 100%;
}
thead {
    background-color: #eee;
}
td {
    font-size: 14px;
    padding: 4px;
}
tbody tr {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
}
tbody tr:hover {
    cursor: pointer;
    background-color: #f6f6f6;
}
.relative {
    position: relative;
}
.alt_submit {
    position: absolute;
    right: 8px;
    z-index: 2;
    top: 35%;
    transform: translateY(-35%);
}
.options-td {
    width: 60px;
}
.options-td {
    text-align: right;
}
</style>