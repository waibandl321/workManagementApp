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
                <validation-observer v-slot="{ invalid }" ref="observer">
                    <validation-provider
                        name="メールアドレス"
                        rules="email|required"
                        v-slot="{ errors }"
                        tag="div"
                        ref="email_provider"
                    >
                        <v-text-field
                            v-model="email"
                            label="メールアドレス"
                            autofocus
                            hide-details
                            outlined
                            dense
                            required
                            data-test-id="inputEmail"
                        ></v-text-field>
                        <div
                            class="input-error-message"
                            data-test-id="error-message-email"
                        >{{ errors[0] }}</div>
                    </validation-provider>
                    <validation-provider
                        name="パスワード"
                        :rules="{
                            required: {},
                        }"
                        v-slot="{ errors }"
                        tag="div"
                        ref="password_provider"
                        class="mt-6"
                    >
                        <v-text-field
                            label="パスワード"
                            hide-details
                            type="password"
                            required
                            outlined
                            dense
                            v-model="password"
                            data-test-id="inputPassword"
                        ></v-text-field>
                        <div
                            class="input-error-message"
                            data-test-id="error-message-password"
                        >{{ errors[0] }}</div>
                    </validation-provider>
                    <div class="my-4">
                        <v-btn
                            :disabled="invalid"
                            color="primary"
                            class="submit"
                            @click="emailSignin()"
                            data-test-id="execSignin"
                        >
                            サインイン
                        </v-btn>
                    </div>
                </validation-observer>
            </div>
            <v-divider />
            <div class="pa-4">
                <v-btn
                    to="/auth/password_reset"
                    outlined
                    data-test-id="passwordReset"
                >
                    パスワード再設定
                </v-btn>
            </div>
            <v-divider />
            <v-card-title data-test-id="other-signin">
                外部サービスでサインイン
            </v-card-title>
            <div class="px-4 pb-4">
                <v-btn
                    @click="externalSigninByGoogle()"
                    fab
                    depressed
                    data-test-id="googleSignin"
                >
                    <v-img
                        src="@/assets/img/icons-google.png"
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
                    data-test-id="pageMoveSignup"
                >
                    ユーザー登録がまだの方はこちら
                </v-btn>
            </div>
          </v-card>
        </div>
        <router-view/>
    </div>
</template>


<script>
import ExecLoading from "@/components/common/ExecLoading.vue"
export default {
    components: {
        ExecLoading
    },
    data: () => ({
        email: '',
        password: '',
        loading: false,
        error: ''
    }),
    mounted() {
        this.setRoutetitle()
    },
    methods: {
        // サインイン(サインイン)
        async emailSignin () {
            this.loading = true;
            try {
                const uid = await this.firebaseEmailSignin(this.email, this.password);
                if(uid) {
                    this.storeSetFirebaseUid(uid);
                    const account = await this.firebaseGetAccount(uid);
                    if(account) {
                        this.storeSetAccountInfo(account);
                        this.pageMove('/');
                    } else {
                        this.storeSetAccountInfo(null)
                        this.pageMove('/account/register')
                    }
                } else {
                    throw new Error();
                }
            } catch (error) {
                this.error = "認証に失敗しました。正しいメールアドレス、パスワードを入力してください。"
            }
            
            this.loading = false;
        },
        externalSigninByGoogle() {
            this.pageMove("/auth/redirect");
        },
    },
}
</script>

<style scoped src="./scoped.css"></style>