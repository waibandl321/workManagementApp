<template>
    <div class="pa-6 account-edit">
        <v-container>
            <MessageViewer
                v-if="params.success || params.error"
                :params="params"
                class="mb-6"
            />
            <v-card>
                <v-card-title class="d-flex justify-space-between">
                    <span>アカウント情報更新</span>
                    <v-btn
                        color="error"
                        @click="clickDeleteAccount()"
                    >
                        アカウントを削除
                    </v-btn>
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
                            @click="accountUpdate()"
                            large
                            :disabled="invalid"
                        >
                            更新
                        </v-btn>
                        <v-btn
                            outlined
                            @click="cancel()"
                            large
                            class="ml-4"
                        >
                            閉じる
                        </v-btn>
                    </v-card-actions>
                </validation-observer>
            </v-card>
        </v-container>
        <ConfirmDelete
            v-if="delete_modal"
            :delete_options="delete_options"
            :delete_title="delete_title"
        />
        <ExecLoading v-if="params.loading" />
    </div>
</template>

<script>
import MessageViewer from '@/components/common/MessageViewer.vue'
import ConfirmDelete from '@/components/common/ConfirmDelete.vue'
import ExecLoading from '@/components/common/ExecLoading.vue'
import myMixin from './account'
export default {
    components: {
        MessageViewer,
        ConfirmDelete,
        ExecLoading
    },
    mixins: [myMixin],
    props: {
        params: Object,
        parents: Object
    },
    data: () => ({
        fitst_name: "",
        last_name: "",
        delete_modal: false,
        delete_options: [],
    }),
    created() {
        this.params.success = "";
        this.params.error = "";
        this.first_name = this.params.account_info.first_name
        this.last_name = this.params.account_info.last_name
    },
    methods: {
        async accountUpdate() {
            const account = this.generateAccountObject()
            const result = await this.apiAccountUpdate(account)
            if(result) {
                this.storeUpdateAccountInfo(this.copyJson(account));
                this.parents.user_info = this.copyJson(account);
                this.params.success = "アカウント情報を更新しました。「閉じる」ボタンからアプリケーションにお戻りください。";
            } else {
                this.params.error = "アカウント情報に失敗しました。時間を空けて再度更新してください。";
            }
        },
        generateAccountObject() {
            return {
                first_name: this.first_name,
                last_name: this.last_name,
                status: this.params.account_info.status,
                color: this.params.account_info.color
            }
        },
        // アカウント削除
        clickDeleteAccount() {
            this.delete_title = `アカウントを削除します。`;
            this.delete_options.push(
                {
                    function_cd: "cancel",
                    text: "キャンセル",
                    callback: this.closeModal
                },
                {
                    function_cd: "delete",
                    text: "削除する", 
                    callback: this.execDeleteAccount
                }
            )
            this.delete_modal = true;
        },
        async execDeleteAccount() {
            this.params.loading = true;
            this.delete_modal = false;
            try {
                await this.firebaseDeleteAccountFiles() //file(db)
                await this.storegeDeleteAccountFiles() //file(storage)
                await this.firebaseDeleteAccountTasks() //task
                await this.firebaseDeleteAccount() //user(db)
                await this.firebaseDeleteAuthUser() //user(firebase auth)
                this.params.success = "アカウントを削除しました。";
                this.params.delete_flag = true;
            } catch (error) {
                console.log(error);
                this.params.error = "アカウント削除に失敗しました。もう一度やり直してください。"
            }
            this.delete_options = []
            this.params.loading = false;
        },
        closeModal() {
            this.delete_options = []
            this.delete_modal = false;
        },
    }
}
</script>
<style scoped src="./scoped.css"></style>