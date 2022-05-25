<template>
    <div class="auth">
       <div>
          <v-card class="card">
            <v-card-title>
                ログイン
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
                    ログイン
                </v-btn>
            </div>
            <v-divider />
            <div class="pa-4">
                <v-btn
                    @click="externalSigninByGoogle()"
                    fab
                    small
                >
                    <v-img
                        src="./img/icons-google.png"
                        max-width="32"
                        min-width="32"
                    >
                    </v-img>
                </v-btn>
                <v-btn
                    @click="externalSigninByGithub()"
                    fab
                    small
                >
                    <v-img
                        src="./img/github-logo.png"
                        max-width="32"
                        min-width="32"
                    >
                    </v-img>
                </v-btn>
            </div>
            <v-divider></v-divider>
            <div class="pa-4">
                <v-btn outlined color="primary" to="/auth/signup">
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
        // サインイン(ログイン)
        async emailSignin () {
            const valid = this.$refs.form.validate();
            if(valid) {
                this.loading = true
                await this.firebaseEmailSignin(this.email, this.password)
                .then((uid) => {
                    console.log("ストアにUIDセット");
                    this.storeSetFirebaseUid(uid)
                    return uid
                })
                .then((uid) => {
                    console.log("アカウント存在チェック");
                    return this.isExistAccount(uid)
                })
                .then((account) => {
                    if(account) {
                        console.log("ストアにアカウント情報セット");
                        this.storeSetAccountInfo(account)
                        console.log("ログイン後ページ遷移");
                        this.pageMove('/')
                        this.loading = false
                    } else {
                        this.storeSetAccountInfo(null)
                        console.log("アカウント情報が存在しないので、アカウント登録画面に遷移");
                        this.pageMove('/account')
                        this.loading = false
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false
                    this.error = "認証に失敗しました。もう一度やり直してください。"
                })
            }
        },
        async externalSigninByGoogle() {
            this.loading = true
            await this.firebaseGoogleAuth()
            .then((uid) => {
                console.log("ストアにUIDセット");
                this.storeSetFirebaseUid(uid)
                return uid
            })
            .then((uid) => {
                console.log("アカウント存在チェック");
                return this.isExistAccount(uid)
            })
            .then((account) => {
                if(account) {
                    console.log("ストアにアカウント情報セット");
                    this.storeSetAccountInfo(account)
                    console.log("ログイン後ページ遷移");
                    this.pageMove('/')
                    this.loading = false
                } else {
                    this.storeSetAccountInfo(null)
                    console.log("アカウント情報が存在しないので、アカウント登録画面に遷移");
                    this.pageMove('/account')
                    this.loading = false
                }
            })
            .catch((error) => {
                console.log(error);
                this.error = "外部認証に失敗しました。"
            })
        },

        async externalSigninByGithub() {
            this.loading = true
            await this.firebaseGithubAuth()
            .then((uid) => {
                console.log("ストアにUIDセット");
                this.storeSetFirebaseUid(uid)
                return uid
            })
            .then((uid) => {
                console.log("アカウント存在チェック");
                return this.isExistAccount(uid)
            })
            .then((account) => {
                if(account) {
                    console.log("ストアにアカウント情報セット");
                    this.storeSetAccountInfo(account)
                    console.log("ログイン後ページ遷移");
                    this.pageMove('/')
                    this.loading = false
                } else {
                    this.storeSetAccountInfo(null)
                    console.log("アカウント情報が存在しないので、アカウント登録画面に遷移");
                    this.pageMove('/account')
                    this.loading = false
                }
            })
            .catch((error) => {
                console.log(error);
                this.error = "外部認証に失敗しました。"
            })
        },

        afterSignin(uid) {
            console.log("ストアにUIDセット");
            this.storeSetFirebaseUid(uid)
            console.log("アカウント存在チェック");
            const account = this.isExistAccount(uid)
            if(account) {
                console.log("ストアにアカウント情報セット");
                this.storeSetAccountInfo(account)
                console.log("ログイン後ページ遷移");
                this.pageMove('/')
                this.loading = false
            } else {
                console.log("アカウント情報が存在しないので、アカウント登録画面に遷移");
                this.pageMove('/account')
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