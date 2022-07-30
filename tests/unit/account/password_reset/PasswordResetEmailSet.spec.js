<template>
    <div class="auth">
        <ExecLoading v-if="loading" />
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
                <MessageViewer :params="params" />
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
                            label="E-mail"
                            outlined
                            hide-details
                            autofocus
                            dense
                            data-test-id="inputEmail"
                        ></v-text-field>
                        <div class="input-error-message">{{ errors[0] }}</div>
                    </validation-provider>
                    <div class="my-4">
                        <v-btn
                            :disabled="invalid"
                            color="primary"
                            class="submit"
                            @click="sendPasswordResetEmail()"
                            data-test-id="passwordResetEmailSend"
                        >
                            送信
                        </v-btn>
                    </div>
                </validation-observer>
            </div>
            <v-divider></v-divider>
            <div class="pa-4">
               <v-btn
                    to="/auth/signin"
                    data-test-id="backSigninFromPasswordReset"
                >
                    サインイン画面に戻る
                </v-btn>
            </div>
          </v-card>
        </div>
    </div>
</template>

<script>
import MessageViewer from '@/components/common/MessageViewer.vue'
import ExecLoading from "@/components/common/ExecLoading.vue"
export default {
    components: {
        ExecLoading,
        MessageViewer
    },
    props: {
        params: Object
    },
    data: () => ({
        loading: false,
        email: '',
    }),
    methods: {
        async sendPasswordResetEmail() {
            this.loading = true;
            try {
                const result = await this.firebaseSendEmailByPasswordReset(this.email);
                if(result) {
                    this.params.mode = "confirm";
                } else {
                    throw new Error()
                }
            } catch (error) {
                this.params.error = "メール送信中にエラーが発生しました。再度時間をおいて設定してください。";
            }
            this.loading = false
        }
    }
}
</script>
<style scoped src="../scoped.css"></style>