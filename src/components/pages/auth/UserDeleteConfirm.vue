<template>
    <div class="auth">
        <v-container>
            <v-card width="100%" class="pa-6">
                <v-alert type="error">
                    アカウントを削除しました。
                </v-alert>
                <v-card-actions
                    class="mt-2 justify-center"
                >
                    <v-btn
                        @click="finishApp()"
                        x-large
                        color="#333"
                        dark
                        width="100%"
                        data-e2e-id="finishApp"
                    >
                        アプリケーションの利用を終了する
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
</template>

<script>
export default {
    methods: {
        finishApp() {
            this.$router.push("/auth/signout")
        }
    }
}
</script>
<style>
.auth {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #eee;
    opacity: 1;
}
.auth >>> .v-card {
    width: 800px
}
.card .v-sheet.v-card {
    box-shadow: none;
}
</style>