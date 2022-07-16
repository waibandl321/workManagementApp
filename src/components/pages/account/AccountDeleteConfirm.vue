<template>
    <div class="auth">
        <v-container>
            <v-card width="100%" class="pa-6">
                <MessageViewer
                    v-if="params.success || params.error"
                    :params="params"
                    class="mb-6"
                />
                <v-card-actions
                    class="mt-2 justify-center"
                >
                    <v-btn
                        @click="finishApp()"
                        x-large
                        color="primary"
                        rounded
                        width="100%"
                    >
                        アプリケーションの利用を終了する
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import MessageViewer from '@/components/common/MessageViewer.vue'
export default {
    components: {
        MessageViewer
    },
    created() {
        this.storeDeleteAccountInfo()
        this.storeDestroyFirebaseUid()
    },
    props: ["params"],
    methods: {
        finishApp() {
            this.$router.push("/auth/signout")
        }
    }
}
</script>