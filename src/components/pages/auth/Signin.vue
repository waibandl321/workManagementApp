<template>
    <div class="auth">
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
                
                    <div>
                        <v-text-field
                            label="パスワード"
                            :rules="passwordRules"
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
export default {
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
            const valid = this.$refs.form.validate();
            if(valid) {
                this.loading = true
                try {
                    const uid = await this.firebaseEmailSignin(this.email, this.password);
                    this.storeSetFirebaseUid(uid);
                    const account = await this.isExistAccount(uid);
                    if(account) {
                        this.storeSetAccountInfo(account);
                        this.pageMove('/');
                    } else {
                        this.storeSetAccountInfo(null)
                        this.pageMove('/account')
                    }
                    this.loading = false;
                } catch (error) {
                    console.log(error);
                    this.loading = false;
                    this.error = "認証に失敗しました。もう一度やり直してください。"
                }
            }
        },
        async externalSigninByGoogle() {
            this.loading = true
            try {
                const uid = await this.firebaseGoogleAuth();
                this.storeSetFirebaseUid(uid)
                const account = await this.isExistAccount(uid)
                if(account) {
                    this.storeSetAccountInfo(account)
                    this.pageMove('/')
                } else {
                    this.storeSetAccountInfo(null)
                    this.pageMove('/account')
                }
                this.loading = false
            } catch (error) {
                console.log(error);
                this.error = "外部認証に失敗しました。"
                this.loading = false
            }
        },
        async isExistAccount(uid) {
            return await this.apiGetAccount(uid)
        },
    },
}
</script>

<style scoped src="./scoped.css"></style>