<template>
    <div class="auth">
       <div>
          <v-card class="card">
            <v-card-title>
                パスワード再設定
            </v-card-title>
            <v-card-text>
                パスワード再設定用のメールアドレスを入力してください。<br>
                入力されたメールアドレスに再設定用のリンクを送付します。
            </v-card-text>
            <div class="px-4">
                <div class="py-4" v-if="error">
                    <v-alert
                        dense
                        outlined
                        type="error"
                    >
                        {{ error }}
                    </v-alert>
                </div>
                 <div class="py-4" v-if="loading">
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    ></v-progress-linear>
                </div>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <div>
                        <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                            outlined
                            dense
                            required
                        ></v-text-field>
                    </div>
                </v-form>
            </div>
            <div class="pa-4">
               <v-btn
                    :disabled="!valid"
                    color="primary"
                    class="submit"
                    @click="sendPasswordResetEmail()"
                >
                    送信
                </v-btn>
            </div>
            <v-divider></v-divider>
            <div class="pa-4">
               <v-btn
                    to="/auth/signin"
                >
                    ログイン画面に戻る
                </v-btn>
            </div>
          </v-card>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        params: Object
    },
    data: () => ({
        loading: false,
        valid: true,
        email: '',
        emailRules: [
            v => !!v || 'メールアドレスは入力必須です',
            v => /.+@.+\..+/.test(v) || 'メールアドレスの形式で入力してください',
        ],
        error: ''
    }),
    methods: {
        async sendPasswordResetEmail() {
            this.loading = true
            const result = await this.firebaseSendEmailByPasswordReset(this.email);
            if(result) {
                this.params.mode = "confirm"
                this.loading = false
            }
        }
    }
}
</script>
<style scoped src="../scoped.css"></style>