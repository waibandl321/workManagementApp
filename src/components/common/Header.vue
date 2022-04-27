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
                <div class="pl-4">
                    <v-btn
                        text
                        @click="drawer()"
                    >
                        <v-icon color="primary" x-large>mdi-apps</v-icon>
                    </v-btn>
                </div>
                <div>
                    <div class="pl-4">
                        <v-btn
                            @click="account()"
                            filled
                            color="primary"
                            class="pa-2 white--text"
                        >
                            アカウント名
                        </v-btn>
                    </div>
                </div>
            </div>
            <!-- 機能メニュー -->
            <div class="drawer" v-if="drawer_menu">
                <div
                    v-for="(item, i) in functions"
                    :key="i"
                    class="pa-2"
                >
                <v-btn
                    class="justify-flex-start"
                    text
                    :to="item.path"
                    @click="drawer_menu = false"
                >
                    <v-icon>{{ item.icon }}</v-icon>
                    <span class="pl-2">{{ item.text }}</span>
                </v-btn>
                </div>
            </div>
            <!-- profile -->
            <div class="account_menu" v-if="account_menu">
                <div class="py-2">
                    <v-btn
                        text
                        @click="accountEdit()"
                    >
                        アカウント情報編集
                    </v-btn>
                </div>
                <div class="py-2">
                    <v-btn
                        text
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
     drawer_menu: false,
     account_menu: false,
     functions: [
         { text: "ダッシュボード", path: "/", icon: "mdi-view-dashboard-outline" },
         { text: "プロジェクト", path: "/project", icon: "mdi-calendar-check-outline" },
         { text: "タスク", path: "/task", icon: "mdi-format-list-checks" },
     ],
 }),
 methods: {
     add() {
         this.drawer_menu = false
         this.account_menu = false
     },
     drawer() {
         this.account_menu = false
         this.drawer_menu = !this.drawer_menu
     },
     account() {
         this.drawer_menu = false
         this.account_menu = !this.account_menu
     },
     signout() {
        //signout
        this.authSignOut()
        this.account_menu = false
     },
     accountEdit() {
         this.$router.push('/auth/account')
         this.account_menu = false

     }
 }
}
</script>
<style scoped>
.inner {
    font-size: 14px;
}
.inner >>> .v-btn:not(.v-btn--round).v-size--default {
    height: auto;
    min-height: auto;
    text-align: left;
    padding: 0;
}
input:focus {
    outline: none;
}
input[type="text"] {
    border: 1px solid #ccc;
}
.search-input {
    padding: 8px 12px;
}
.inner {
    position: relative;
}
.account_menu,
.add,
.drawer {
    position: absolute;
    top: 70px;
    box-shadow: 0px 2px 8px #00000029;
    padding: 1rem;
    background-color: #fff;
    z-index: 2;
}
.add {
    right: 80px;
}
.header .account_menu,
.header .drawer {
    right: 0;
    line-height: normal;
}
.name {
    margin-top: -12px;
}

</style>