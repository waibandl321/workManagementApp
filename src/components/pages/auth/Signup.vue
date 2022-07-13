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
                        >
                            <v-text-field
                                v-model="email"
                                label="メールアドレス"
                                hide-details
                                outlined
                                autofocus
                                dense
                            ></v-text-field>
                            <div class="input-error-messsage">{{ errors[0] }}</div>
                        </validation-provider>
                        <validation-provider
                            name="パスワード"
                            :rules="{
                                required: {},
                                min: max_length_password
                            }"
                            v-slot="{ errors }"
                            tag="div"
                            class="mt-6"
                        >
                            <v-text-field
                                label="パスワード"
                                hide-details
                                type="password"
                                outlined
                                dense
                                v-model="password"
                            ></v-text-field>
                            <div
                                v-for="(error, index) in errors"
                                :key="index"
                                class="input-error-messsage"
                            >
                                {{ error }}
                            </div>
                        </validation-provider>
                        <div class="my-6">
                            <v-btn
                                :disabled="invalid"
                                color="primary"
                                class="submit"
                                @click="signup()"
                            >
                                登録する
                            </v-btn>
                        </div>
                    </validation-observer>
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

    methods: {
        // サインアップ
        async signup () {
            this.loading = true
            try {
                const uid = await this.firebaseSignup(this.email, this.password)
                if(uid) {
                    this.storeSetFirebaseUid(uid);
                    this.pageMove('/account')
                } else {
                    throw new Error()
                }
            } catch (error) {
                console.log(error);
                this.error = "入力されたメールアドレスのユーザーはすでに登録されている可能性があります。"
            }
            this.loading = false;
        },
    },
}
</script>

<style scoped src="./scoped.css"></style>