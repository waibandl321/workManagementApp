<template>
    <div class="auth">
       <div>
          <v-card class="card">
            <v-card-title>
                ユーザー登録
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
                            type="password"
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
                    @click="signup()"
                >
                    登録する
                </v-btn>
            </div>
            <v-divider />
            <div class="pa-4">
                <v-btn outlined color="primary" to="/auth/signin">
                    ログインはこちら
                </v-btn>
            </div>
          </v-card>
        </div>
    </div>
</template>

<script>

export default {
    data: () => ({
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
        error: '',
    }),

    methods: {
        // サインアップ
        async signup () {
            this.loading = true
            const valid = this.$refs.form.validate();
            if(valid) {
                const uid = await this.firebaseSignup(this.email, this.password)
                if(uid) {
                    this.storeSetFirebaseUid(uid);
                    this.pageMove('/account')
                } else {
                    this.error = "入力されたメールアドレスの形式が間違っているか、すでに登録されている可能性があります。"
                }
            }
            this.loading = false;
        },
        reset () {
            this.$refs.form.reset()
        },
        resetValidation () {
            this.$refs.form.resetValidation()
        },
    },
}
</script>

<style scoped src="./scoped.css"></style>