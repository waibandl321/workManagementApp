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
    </div>
</template>

<script>
import AccountRegister from './AccountRegister.vue'
import AccountUpdate from './AccountUpdate.vue'
import myMixin from './account.js'

export default {
    components: {
        AccountRegister,
        AccountUpdate,
    },
    mixins: [myMixin],
    data: () => ({
        params: {
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
            this.params.account_info = this.storeGetAccountInfo()
        },
    },
}
</script>


<style scoped src="./scoped.css"></style>