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
      loading: false,
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
      error: '',
    }),

    methods: {
      // sign up
      signup () {
        const valid = this.$refs.form.validate();
        if(valid) {
            this.loading = true
            this.authSignUp(this.email, this.password)
        }
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


<style scoped>
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
.card {
    width: 320px;
}
.submit {
    width: 100%;
}
</style>