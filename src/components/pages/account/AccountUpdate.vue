<template>
    <div class="pa-6 account-edit">
        <MessageViewer
            v-if="params.success | params.error"
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
        params: Object
    },
    data: () => ({}),
    created() {},
    methods: {
        accountUpdate() {
            this.apiAccountUpdate(this.params.account_info);
            this.storeUpdateAccountInfo(this.copyJson(this.params.account_info));
            this.params.success = "アカウント情報を更新しました。「閉じる」ボタンからアプリケーションにお戻りください。";
        },
    }
}
</script>
<style scoped src="./scoped.css"></style>