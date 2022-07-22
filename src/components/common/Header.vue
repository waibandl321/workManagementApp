<template>
    <div class="header">
        <div class="inner d-flex align-center">
            <v-spacer />
            <div class="d-flex align-center">
                <div
                    v-for="(item, i) in functions"
                    :key="i"
                    class="d-flex"
                >
                    <v-btn
                        class="ml-4"
                        text
                        :to="item.path"
                    >
                        <v-icon>{{ item.icon }}</v-icon>
                        <span class="pl-2">{{ item.text }}</span>
                    </v-btn>
                </div>
                <div class="ml-4">
                    <div class="pl-4">
                        <v-btn
                            @click="accountEdit()"
                            filled
                            :color="'#' + parents.user_info.color"
                            class="pa-2 white--text"
                            data-e2e-id="headerAccountName"
                        >
                            アカウント: {{ parents.user_info.last_name }} {{ parents.user_info.first_name }}
                        </v-btn>
                    </div>
                </div>
                <div class="ml-4">
                    <v-btn
                        color="blue-grey"
                        class="pa-2 white--text"
                        filled
                        @click="clickSignout()"
                        data-e2e-id="appSignout"
                    >
                        ログアウト
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>


export default {
    props: {
        parents: Object,
    },
    data: () => ({
        functions: [
            { text: "ダッシュボード", path: "/", icon: "mdi-view-dashboard-outline" },
            { text: "タスク一覧", path: "/task", icon: "mdi-format-list-checks" },
            { text: "ファイル管理", path: "/file", icon: "mdi-folder" },
        ],
    }),
    methods: {
        accountEdit() {
            this.pageMove('/account/update')
        },
        clickSignout() {
            this.pageMove('/auth/signout')
        }
    }
}
</script>
<style scoped>
.header {
    border-bottom: 1px solid #ccc;
    height: 70px;
    line-height: 70px;
    padding: 0 16px;
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
}
</style>