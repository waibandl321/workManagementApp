<template>
    <v-card>
        <v-card-text>
        <v-alert
            outlined
            type="success"
            text
            v-if="!params.success"
        >
            タスク管理アプリにユーザー登録いただきありがとうございます！<br>
            基本情報の簡単な設定を済ませて、アプリを楽しんでください。
        </v-alert>
        <div v-if="params.success">
            <v-alert type="success">
            {{ params.success }}
            </v-alert>
        </div>
        </v-card-text>
        <v-divider />
        <v-card-title>
            アカウント情報登録
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
        <v-card-actions>
            <v-spacer />
            <v-btn
            color="primary"
            @click="register()"
            >
                登録
            </v-btn>
            <v-btn
                text
                @click="cancel()"
            >
                閉じる
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import myMixin from './account'
export default {
    mixins: [myMixin],
    props: {
        params: Object
    },
    data: () => {

    },
    methods: {
        register() {
            this.params.account_info.status = true
            this.params.account_info.color = this.setAccountAvatarColor()

            this.apiAccountRegister(this.params.account_info)
            this.storeSetAccountInfo(this.params.account_info)

            this.params.message = "アカウント情報を登録しました。"
        },
        
    }
}
</script>