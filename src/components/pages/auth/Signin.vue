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
                    @click="signin()"
                >
                    ログイン
                </v-btn>
            </div>
            <v-divider />
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
        signin () {
            const valid = this.$refs.form.validate();
            if(valid) {
                this.loading = true

                return new Promise((resolve) => {
                    setTimeout(() => {
                        console.log("サインイン開始");
                        const uid = this.firebaseSignin(this.email, this.password)
                        resolve(uid)
                    }, 0);
                })
                .then((uid) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            console.log("ストアにUIDセット");
                            this.storeSetFirebaseUid(uid)
                            resolve(uid)
                        }, 0);
                    })
                })
                .then((uid) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            console.log("アカウント存在チェック");
                            const data = this.isExistAccount(uid)
                            resolve(data)
                        }, 0);
                    })
                })
                .then((account) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            this.storeSetAccountInfo(account)
                            resolve()
                        }, 0);
                    })
                })
                .then(() => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            this.loading = false
                            this.pageMove('/')
                            resolve()
                        }, 0);
                    })
                })
                .catch((reason) => {
                    console.log(reason.messege);
                });
            }
        },

        async isExistAccount(uid) {
            return await this.apiGetAccount(uid)
        },
    },
}
</script>

<style scoped src="./scoped.css"></style>