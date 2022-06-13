<template>
    <div>
        <MessageViewer
            :params="params"
            class="mb-6"
        />
        <v-card>
            <v-card-title>
                アカウント情報更新
            </v-card-title>
            <v-card-text>
                <v-row class="ma-0">
                    <v-col>
                        <v-text-field
                            label="性(必須)"
                            v-model="params.account_info.last_name"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            label="名(必須)"
                            v-model="params.account_info.first_name"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row class="ma-0">
                    <v-col>
                        <div>メールアドレス</div>
                        <div>{{ auth_user.email }}</div>
                        <div class="mt-2">
                            <v-btn
                                outlined
                                color="primary"
                                @click="clickEmailUpdate()"
                            >
                                メールアドレスを変更
                            </v-btn>
                        </div>
                    </v-col>
                    <v-col>
                        <div>パスワード</div>
                        <div>********************</div>
                        <div class="mt-2">
                            <v-btn
                                outlined
                                color="primary"
                            >
                                パスワードを更新
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn
                color="primary"
                @click="accountUpdate()"
                >
                    更新
                </v-btn>
                <v-btn
                    outlined
                    @click="cancel()"
                >
                    閉じる
                </v-btn>
            </v-card-actions>


            <!-- email update modal -->
            <template>
                <v-dialog
                    v-model="email_update_dialog"
                    width="500"
                >
                    <v-card>
                        <v-card-title class="text-h5 grey lighten-2">
                            メールアドレス変更
                        </v-card-title>

                        <div class="pa-4">
                            <div class="py-4" v-if="params.loading">
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
                                <v-text-field
                                    v-model="auth_user.email"
                                    :rules="emailRules"
                                    label="E-mail"
                                    outlined
                                    dense
                                    required
                                ></v-text-field>
                            </v-form>
                        </div>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="email_update_dialog = false"
                                depressed
                                outlined
                            >
                                キャンセル
                            </v-btn>
                            <v-btn
                                color="primary"
                                @click="execUpdateEmail()"
                                depressed
                            >
                                更新
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template><!-- / email update modal -->
        </v-card>
    </div>
</template>

<script>
import MessageViewer from '@/components/common/MessageViewer.vue'
import myMixin from './account'
export default {
    components: {
        MessageViewer
    },
    mixins: [myMixin],
    props: {
        params: Object
    },
    data: () => ({
        auth_user: {},
        email_update_dialog: false,

        valid: true,
        emailRules: [
            v => !!v || 'メールアドレスは入力必須です',
            v => /.+@.+\..+/.test(v) || 'メールアドレスの形式で入力してください',
        ],
    }),
    created() {
        this.auth_user = this.firebaseGetCurrentUser();
    },
    methods: {
        accountUpdate() {
            this.apiAccountUpdate(this.params.account_info);
            this.storeUpdateAccountInfo(this.copyJson(this.params.account_info));
            this.params.success = "アカウント情報を更新しました。「閉じる」ボタンからアプリケーションにお戻りください。";
        },
        clickEmailUpdate() {
            this.email_update_dialog = true;
        },
        async execUpdateEmail() {
            this.params.loading = true;
            const result = await this.firebaseUpdateEmail(this.auth_user.email);
            if(result) {
                // 確認メール送付
                const success = await this.firebaseSendEmailVerification()
                if(success) {
                    this.params.success = 
                    `メールアドレスを更新しました。\n
                    新しいメールアドレスに確認メールを送付しましたので、ご確認ください。`;
                } else {
                    this.params.success = "メールアドレスを更新しました。";
                }
            } else {
                this.params.error = "更新に失敗しました";
                return;
            }
            
            this.email_update_dialog = false;
            this.params.loading = false;
        },
    }
}
</script>