<template>
    <div class="auth">
        <!-- 新規登録 -->
        <v-card v-if="isnew">
            <div class="py-4" v-if="loading">
                <v-progress-linear
                    indeterminate
                    color="primary"
                ></v-progress-linear>
            </div>
            <v-card-text>
            <v-alert
                outlined
                type="success"
                text
            >
                タスク管理アプリにユーザー登録いただきありがとうございます！<br>
                基本情報の簡単な設定を済ませて、アプリを楽しんでください。
            </v-alert>
            </v-card-text>
            <v-divider />
            <v-card-title>アカウント情報登録</v-card-title>
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
                            placeholder="Placeholder"
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
                    @click="cancel()"
                >
                    閉じる
                </v-btn>
            </v-card-actions>
        </v-card>
        <!-- 更新 -->
        <v-card v-else>
            <div class="py-4" v-if="loading">
                <v-progress-linear
                    indeterminate
                    color="primary"
                ></v-progress-linear>
            </div>
            <v-card-text>
             <v-alert
                v-if="update_done"
                outlined
                type="success"
                text
            >
                {{ update_done }}
            </v-alert>
            </v-card-text>
            <v-card-title>
                アカウント情報更新
            </v-card-title>
            <v-card-text>
                <v-row class="ma-0">
                    <v-col>
                        <v-text-field
                            label="性(必須)"
                            v-model="accountData.last_name"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            label="名(必須)"
                            placeholder="Placeholder"
                            v-model="accountData.first_name"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn
                color="primary"
                @click="update()"
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
    </div>
</template>

<script>
export default {
    props: {
        accountData: Object
    },
    data: () => ({
        loading: false,
        last_name: null,
        first_name: null,
        status: true,
        color: "",
        update_done: "",
        isnew: true
    }),

    created() {
      if(this.accountData) {
          this.isnew = false
      } else {
          this.isnew = true
      }
    },

    methods: {

        register() {
            this.loading = true
            this.color = this.setAccountAvatarColor()
            this.authAccountRegister(this.first_name, this.last_name, this.status, this.color)
            this.loading = false
            this.$router.push('/', () => {})
        },

        update() {
            this.loading = true
            this.authAccountUpdate(this.accountData)
            this.update_done = "アカウント情報の更新が完了しました！"
            this.loading = false
        },
        cancel() {
            this.$router.push('/', () => {})
        },

        setAccountAvatarColor() {
            let letters= '0123456789ABCDEF'.split('');
            let color= '#';
            for (let i= 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
    },
}
</script>


<style scoped src="./scoped.css"></style>