<template>
    <v-card>
        <div>
            <v-alert type="success" v-if="params.success">
            {{ params.success }}
            </v-alert>
        </div>
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
    </v-card>
</template>

<script>
import myMixin from './account'
export default {
    mixins: [myMixin],
    props: {
        params: Object
    },
    data: () => ({
        
    }),
    methods: {
        accountUpdate() {
            this.apiAccountUpdate(this.params.account_info)
            this.storeUpdateAccountInfo(this.copyJson(this.params.account_info))
            this.params.success = "アカウント情報を更新しました。"
        },
        copyJson(value) {
            return JSON.parse(JSON.stringify(value))
        },
    }
}
</script>