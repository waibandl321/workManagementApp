<template>
    <div class="header">
        <div class="inner d-flex align-center">
            <div class="d-flex align-center">
                <div class="pr-4">
                    <v-btn
                        text
                        to="/"
                    >
                        <v-icon color="primary" x-large>mdi-home-variant-outline</v-icon>
                    </v-btn>
                </div>
            </div>
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
                        >
                            ログイン中: {{ parents.user_info.last_name }} {{ parents.user_info.first_name }}
                        </v-btn>
                    </div>
                </div>
                <div class="ml-4">
                    <v-btn
                        color="blue-grey"
                        class="pa-2 white--text"
                        filled
                        @click="signout()"
                    >
                        ログアウト
                    </v-btn>
                </div>
            </div>
            <div>
                <v-alert
                    dense
                    outlined
                    type="error"
                    v-if="error"
                >
                    {{ error }}
                </v-alert>
            </div>
            <div v-if="loading">
                <v-progress-linear
                    indeterminate
                    color="primary"
                ></v-progress-linear>
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
        loading: false,
        error: "",
        functions: [
            { text: "ダッシュボード", path: "/", icon: "mdi-view-dashboard-outline" },
            { text: "タスク一覧", path: "/task", icon: "mdi-format-list-checks" },
        ],
    }),

    created() {
    },

    methods: {
        signout() {
            this.firebaseSignout()
            this.storeDeleteAccountInfo()
            this.parents.user_info = {}
            this.pageMove('/auth/signin')
        },
        accountEdit() {
            this.pageMove('/account')
        }
    }
}
</script>
<style scoped></style>