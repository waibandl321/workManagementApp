<template>
    <v-card>
        <v-card-text>
            <v-alert
                outlined
                type="success"
                text
                v-if="!params.success"
            >
                基本情報の簡単な設定を済ませて、アプリを楽しんでください。
            </v-alert>
            <v-alert
                type="success"
                v-else
            >
                アカウント情報を登録しました。「閉じる」ボタンを押してアプリケーションの利用を開始してください。 
            </v-alert>
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
                @click="pageMove('/')"
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
        async register() {
            this.params.account_info.status = true
            this.params.account_info.color = this.setAccountAvatarColor()

            await this.apiAccountRegister(this.params.account_info, this.storeGetFirebaseUid())
            this.storeSetAccountInfo(this.params.account_info)
            this.params.success = true
        },
    }
}
</script>