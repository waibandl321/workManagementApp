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
        params: Object,
        parents: Object
    },
    data: () => ({
        last_name: "",
        first_name: ""
    }),
    methods: {
        async register() {
            const account = this.generateNewAccountObject()
            try {
                await this.apiAccountCreate(account)
                this.storeSetAccountInfo(account)
                this.parents.user_info = this.copyJson(account);
                this.params.success = "アカウント情報を登録しました。"
            } catch (error) {
                console.log(error);
                this.params.success = "アカウント情報に失敗しました。"
            }
            
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