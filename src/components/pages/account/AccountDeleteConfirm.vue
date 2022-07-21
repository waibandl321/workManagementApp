<template>
    <div class="auth">
        <ExecLoading v-if="params.loading" />
        <v-container v-else>
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
                        data-e2e-id="finishApp"
                    >
                        アプリケーションの利用を終了する
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import ExecLoading from '@/components/common/ExecLoading.vue'
import MessageViewer from '@/components/common/MessageViewer.vue'
export default {
    components: {
        MessageViewer,
        ExecLoading
    },
    created() {
        this.storeDeleteAccountInfo()
        this.storeDestroyFirebaseUid()
    },
    props: ["params"],
    methods: {
        async accountDelete() {
            
        },
        finishApp() {
            this.$router.push("/auth/signout")
        }
    }
}
</script>