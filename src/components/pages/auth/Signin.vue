<template>
    <div class="auth">
        <ExecLoading v-if="loading" />
        <div>
          <v-card class="card">
            <v-card-title>
                サインイン
            </v-card-title>
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
                
                    <div>
                        <v-text-field
                            label="パスワード"
                            :rules="passwordRules"
                            type="password"
                            required
                            outlined
                            dense
                            v-model="password"
                        ></v-text-field>
                    </div>
                </v-form>
            </div>
            <div class="pa-4">
               <v-btn
                    :disabled="!valid"
                    color="primary"
                    class="submit"
                    @click="emailSignin()"
                >
                    サインイン
                </v-btn>
            </div>
            <v-divider />
            <div class="pa-4">
                <v-btn
                    to="/auth/password_reset_email"
                    outlined
                >
                    パスワード再設定
                </v-btn>
            </div>
            <v-divider />
            <v-card-title>
                外部サービスでサインイン
            </v-card-title>
            <div class="px-4 pb-4">
                <v-btn
                    @click="externalSigninByGoogle()"
                    fab
                    depressed
                >
                    <v-img
                        src="./img/icons-google.png"
                        max-width="32"
                        min-width="32"
                    >
                    </v-img>
                </v-btn>
            </div>
            <v-divider></v-divider>
            <div class="pa-4">
                <v-btn
                    outlined
                    color="primary"
                    to="/auth/signup"
                >
                    ユーザー登録はこちら
                </v-btn>
            </div>
          </v-card>
        </div>
    </div>
</template>


<script>
import ExecLoading from "@/components/common/ExecLoading.vue"
export default {
    components: {
        ExecLoading
    },
    data: () => ({
        auth: false,

        // 入力バリデーション
        valid: true,
        email: '',
        emailRules: [
        v => !!v || 'メールアドレスは入力必須です',
        v => /.+@.+\..+/.test(v) || 'メールアドレスの形式で入力してください',
        ],
        passwordRules: [
            v => !!v || 'パスワードは入力必須です',
        ],
        password: '',

        loading: false,
        error: ''
    }),

    methods: {
        reset () {
            this.$refs.form.reset()
        },
        resetValidation () {
            this.$refs.form.resetValidation()
        },
        // サインイン(サインイン)
        async emailSignin () {
            this.loading = true;
            const valid = this.$refs.form.validate();
            if(valid) {
                const uid = await this.firebaseEmailSignin(this.email, this.password);
                if(uid) {
                    this.storeSetFirebaseUid(uid);
                    const account = await this.isExistAuthAccount(uid);
                    if(account) {
                        this.storeSetAccountInfo(account);
                        this.pageMove('/');
                    } else {
                        this.storeSetAccountInfo(null)
                        this.pageMove('/account')
                    }
                } else {
                    this.error = "認証に失敗しました。もう一度やり直してください。"
                }
            } else {
                this.error = '入力されたメールアドレスもしくは、パスワードが間違っています。'
            }
            this.loading = false;
        },
        async externalSigninByGoogle() {
            this.loading = true;
            try {
                const uid = await this.firebaseGoogleAuth();
                this.storeSetFirebaseUid(uid)
                const account = await this.isExistAuthAccount(uid)
                if(account) {
                    this.storeSetAccountInfo(account)
                    this.pageMove('/')
                } else {
                    this.storeSetAccountInfo(null)
                    this.pageMove('/account')
                }
            } catch (error) {
                console.log(error);
                this.error = "外部認証に失敗しました。"
            }
            this.loading = false;
        },
        async isExistAuthAccount(uid) {
            return await this.apiGetAccount(uid)
        },
    },
}
</script>

<style scoped src="./scoped.css"></style>