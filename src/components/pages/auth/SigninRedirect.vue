<template>
    <div class="auth">
      <ExecLoading v-if="loading" />
      <v-card
        v-else
        class="pa-6"
      >
        <MessageViewer
          :params="messages"
        />
        <div v-if="!oauth_result">
          <v-btn @click="pageMove('/auth/signin')">サインイン画面に戻る</v-btn>
        </div>
        <div v-else>
          <v-btn @click="afterExternalSignin()">アプリケーションの利用を開始する</v-btn>
        </div>
      </v-card>
    </div>
</template>

<script>
import ExecLoading from '@/components/common/ExecLoading.vue'
import MessageViewer from '@/components/common/MessageViewer.vue'
export default {
    components: {
        ExecLoading,
        MessageViewer
    },
    data: () => ({
        loading: true,
        messages: {
          success: "",
          error: "",
        },
        oauth_result: null,
    }),
    created() {
      this.redirectCheck()
    },
    methods: {
        async signin() {
            try {
                await this.firebaseGoogleAuth()
            } catch (error) {
                console.log(error);
                this.loading = false;
                this.messages.error = `外部認証に失敗しました。サインイン画面からもう一度やり直してください。`;
            }
        },
        async redirectCheck() {
            const result = await this.firebaseAuthGetRedirectResult()
            if(result) {
              this.oauth_result = result;
              this.afterExternalSignin();
            } else {
              this.signin()
            }
        },
        async afterExternalSignin() {
          this.loading  = true;
          this.storeSetFirebaseUid(this.oauth_result.uid)
          const account = await this.firebaseGetAccount(this.oauth_result.uid)
          if(account) {
              this.storeSetAccountInfo(account)
              this.pageMove('/')
          } else {
              this.pageMove('/account/register')
          }
        }
    },
}
</script>

<style scoped src="./scoped.css"></style>