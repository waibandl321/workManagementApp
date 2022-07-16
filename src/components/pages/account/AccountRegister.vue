<template>
    <div class="auth">
        <v-card>
            <v-card-text>
                <v-alert
                    outlined
                    type="success"
                    text
                    v-if="!params.success"
                >
                    初期設定は名前を登録するだけです。名前はニックネームでOKです。
                </v-alert>
                <v-alert
                    type="success"
                    v-else
                >
                    {{ params.success }}
                </v-alert>
            </v-card-text>
            <v-divider />
            <v-card-title>
                アカウント情報登録
            </v-card-title>
            <validation-observer v-slot="{ invalid }">
                <v-row class="ma-0">
                    <validation-provider
                        name="性"
                        rules="required"
                        v-slot="{ errors }"
                        tag="div"
                        class="col"
                    >
                        <v-text-field
                            label="性(必須)"
                            v-model="last_name"
                            hide-details
                            outlined
                            autofocus
                        ></v-text-field>
                        <div class="input-error-messsage">{{ errors[0] }}</div>
                    </validation-provider>
                    <validation-provider
                        name="名"
                        rules="required"
                        v-slot="{ errors }"
                        tag="div"
                        class="col"
                    >
                        <v-text-field
                            label="名(必須)"
                            v-model="first_name"
                            hide-details
                            outlined
                        ></v-text-field>
                        <div class="input-error-messsage">{{ errors[0] }}</div>
                    </validation-provider>
                </v-row>
                <v-divider />
                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn
                        color="primary"
                        @click="register()"
                        :disabled="invalid"
                        large
                    >
                        登録
                    </v-btn>
                    <v-btn
                        v-if="register_status"
                        large
                        @click="pageMove('/')"
                        outlined
                    >
                        閉じる
                    </v-btn>
                </v-card-actions>
            </validation-observer>
        </v-card>
        <ExecLoading v-if="params.loading" />
    </div>
</template>
<script>
import ExecLoading from '@/components/common/ExecLoading.vue'
import myMixin from './account'
export default {
    components: {
        ExecLoading
    },
    mixins: [myMixin],
    props: {
        params: Object,
        parents: Object
    },
    data: () => ({
        last_name: "",
        first_name: "",
        register_status: false,
    }),
    methods: {
        async register() {
            this.params.loading = true
            const account = this.generateNewAccountObject()
            try {
                await this.apiAccountCreate(account)
                this.storeSetAccountInfo(account)
                this.parents.user_info = this.copyJson(account);
                this.register_status = true;
                this.params.success = "アカウント情報を登録しました。「閉じる」ボタンを押してアプリケーションの利用を開始してください。 "
            } catch (error) {
                console.log(error);
                this.params.error = "アカウント情報に失敗しました。もう一度お試しください。"
            }
            this.params.loading = false
        },
        generateNewAccountObject() {
            return {
                first_name: this.first_name,
                last_name: this.last_name,
                status: true,
                color: this.setAccountAvatarColor()
            }
        }
    }
}
</script>
<style scoped src="./scoped.css"></style>