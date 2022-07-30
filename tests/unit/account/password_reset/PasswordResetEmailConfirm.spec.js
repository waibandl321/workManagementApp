<template>
    <div class="auth">
        <v-card class="card">
            <v-card-title>
                パスワード再設定
            </v-card-title>
            <v-card-text>
                入力されたメールアドレスに再設定用のリンクを送付しました。<br>
                メールに記載されたリンクからパスワード再設定を行ってください。
            </v-card-text>
            <v-divider></v-divider>
            <div class="pa-4">
                <v-btn
                    to="/auth/signin"
                    data-test-id="backSigninFromPasswordReset"
                >
                    サインイン画面に戻る
                </v-btn>
            </div>
        </v-card>
    </div>
</template>
<script>

</script>
<style scoped src="../scoped.css"></style>