<template>
    <div class="auth">
        <v-card class="pa-6">
            <MessageViewer
                v-if="params.success || params.error"
                :params="params"
                class="mb-6"
            />            
            <div v-if="!register_status">
                <v-card-title class="px-0">
                    アカウント情報登録
                </v-card-title>
                <validation-observer v-slot="{ invalid }">
                    <v-row>
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
                                data-test-id="lastName"
                            ></v-text-field>
                            <div class="input-error-message">{{ errors[0] }}</div>
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
                                data-test-id="firstName"
                            ></v-text-field>
                            <div class="input-error-message">{{ errors[0] }}</div>
                        </validation-provider>
                    </v-row>
                    <v-divider
                        class="mt-4"
                    />
                    <v-card-actions class="pa-4">
                        <v-spacer />
                        <v-btn
                            color="primary"
                            @click="register()"
                            :disabled="invalid"
                            large
                            data-test-id="accountRegister"
                        >
                            登録
                        </v-btn>
                    </v-card-actions>
                </validation-observer>
            </div>
            <div v-else>
                <v-btn
                    to="/"
                    x-large
                    color="primary"
                    rounded
                    width="100%"
                    data-test-id="startApp"
                >
                    アプリケーションの利用を開始する
                </v-btn>
            </div>
        </v-card>
        <ExecLoading v-if="params.loading" />
    </div>
</template>
<script>
import ExecLoading from '@/components/common/ExecLoading.vue'
import MessageViewer from '@/components/common/MessageViewer.vue'
import myMixin from './account'
export default {
    components: {
        MessageViewer,
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
    created() {
        
    },
    methods: {
        async register() {
            this.params.loading = true
            const account = this.generateNewAccountObject()
            try {
                await this.firebaseAccountCreate(account)
                this.storeSetAccountInfo(account)
                this.params.user_info = this.copyJson(account);
                this.register_status = true;
                this.params.success = `アカウント情報登録が完了しました。\n タスクやファイルを登録してご利用を開始してください。`
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
        },
    }
}
</script>
<style scoped src="./scoped.css"></style>