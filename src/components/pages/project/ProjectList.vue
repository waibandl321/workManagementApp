<template>
    <div class="list_inner">
        <h2>プロジェクト</h2>
        <div class="filter">
            <v-row class="ma-0">
                <v-col cols="6" class="pl-0">
                    <v-select
                        label="ステータスで絞り込む"
                        :items="params.status_filter_items"
                        v-model="params.status"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
                    ></v-select>
                </v-col>
                <v-col cols="6" class="pr-0">
                    <v-select
                        label="優先順位で絞り込む"
                        :items="params.date_filter_items"
                        v-model="params.date_filter"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
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
        <div class="mt-2 relative" v-show="project_input">
            <v-text-field
                    label="プロジェクト名を入力"
                    outlined
                    dense
                >
                </v-text-field>
            <v-btn
                depressed
                class="primary alt_submit"
                text
            >新規作成
            </v-btn>
        </div>
        <table class="project-list mt-4">
            <tbody>
            <tr
                v-for="project in project_data"
                :key="project.id"
                @click="record(project)"
            >
                <td class="py-2">
                    <v-avatar
                        color="teal"
                        size="32"
                    >
                        <span class="white--text">大純</span>
                    </v-avatar>
                </td>
                <td class="py-2">{{ project.project_name }}</td>
                <td class="py-2">{{ project.project_status.value }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>



<script>
export default {
    props: {
        projects: Array,
        recordClick: Function,
        params: Object
    },
    data: () => ({
        project_data: [],
        project_input: false,
    }),
    created() {
        this.project_data = this.params.projects
    },
    methods: {
        record(project) {
            this.recordClick(project)
        }
    }
}
</script>

<style scoped>
* {
    font-size: 14px;
}
.list_inner >>> .v-text-field__details {
    display: none;
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
.project-list tr {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
}
.project-list tr:hover {
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

</style>