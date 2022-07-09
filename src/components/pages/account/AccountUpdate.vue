<template>
    <div class="pa-6 account-edit">
        <MessageViewer
            v-if="params.success || params.error"
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
                            v-model="last_name"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            label="名(必須)"
                            v-model="first_name"
                        ></v-text-field>
                    </v-col>
                </v-row>                
            </v-card-text>
            <v-divider />
            <v-card-actions class="pa-4">
                <v-spacer />
                <v-btn
                    color="primary"
                    @click="accountUpdate()"
                    large
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
        params: Object,
        parents: Object
    },
    data: () => ({
        fitst_name: "",
        last_name: ""
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
        }
    }
}
</script>
<style scoped src="./scoped.css"></style>