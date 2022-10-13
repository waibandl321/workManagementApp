<template>
    <div class="auth">
        <ExecLoading v-if="loading" />
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
                    <validation-observer v-slot="{ invalid }" ref="observer">
                        <validation-provider
                            name="メールアドレス"
                            :rules="{
                                email: {},
                                required: {}
                            }"
                            v-slot="{ errors }"
                            tag="div"
                            ref="email_provider"
                        >
                            <v-text-field
                                v-model="email"
                                label="メールアドレス"
                                hide-details
                                outlined
                                autofocus
                                dense
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
                                alpha_num: {},
                                min: max_length_password
                            }"
                            v-slot="{ errors }"
                            tag="div"
                            class="mt-6"
                            ref="password_provider"
                        >
                            <v-text-field
                                label="パスワード"
                                hide-details
                                type="password"
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
                        <div class="my-6">
                            <v-btn
                                :disabled="invalid"
                                color="primary"
                                class="submit"
                                @click="signup()"
                                data-test-id="execSignup"
                            >
                                登録する
                            </v-btn>
                        </div>
                    </validation-observer>
                    <v-divider />
                    <v-card-title class="px-0" data-test-id="otherSignup">
                        外部サービスでアカウント作成
                    </v-card-title>
                    <div class="pb-4">
                        <v-btn
                            @click="externalSigninByGoogle()"
                            fab
                            depressed
                            data-test-id="googleSignup"
                        >
                            <v-img
                                src="@/assets/img/icons-google.png"
                                max-width="32"
                                min-width="32"
                            >
                            </v-img>
                        </v-btn>
                    </div>
                </div>
                <v-divider />
                <div class="pa-4">
                    <v-btn
                        outlined color="primary"
                        to="/auth/signin"
                        data-test-id="pageMoveSignin"
                    >
                        サインインはこちら
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
        email: '',
        password: '',
        loading: false,
        error: '',
    }),
    created() {
        this.setRoutetitle()
    },
    methods: {
        // サインアップ
        async signup () {
            this.loading = true
            try {
                const uid = await this.firebaseSignup(this.email, this.password)
                if(uid) {
                    this.storeSetFirebaseUid(uid);
                    this.pageMove('/account/register')
                } else {
                    throw new Error()
                }
            } catch (error) {
                console.log(error);
                this.error = "入力された情報のユーザーはすでに登録されている可能性があります。"
            }
            this.loading = false;
        },
        externalSigninByGoogle() {
            this.pageMove("/auth/redirect")
        },
    },
}
</script>

<style scoped src="./scoped.css"></style>