<template>
    <div class="auth">
        <!-- 新規登録 -->
        <AccountRegister
            v-if="!params.account_info.status"
            :params="params"
        />
        <!-- 更新 -->
        <AccountUpdate
            v-else
            :params="params"
        />
        <!-- ローディング -->
        <Loading
            v-if="params.loading"
        />
    </div>
</template>

<script>
import AccountRegister from './AccountRegister.vue'
import AccountUpdate from './AccountUpdate.vue'
import Loading from '@/components/common/Loading.vue'
import myMixin from './account.js'

export default {
    components: {
        AccountRegister,
        AccountUpdate,
        Loading
    },
    mixins: [myMixin],
    data: () => ({
        params: {
            loading: false,
            account_info: {},
            success: null,
            error: ""
        }
    }),
    created() {
        this.accountRead()
    },
    methods: {
        async accountRead() {
            this.params.success = null
            this.params.error = ""
            this.params.account_info = await this.apiGetAccount(this.storeGetFirebaseUid())
        },
    },
}
</script>


<style scoped src="./scoped.css"></style>