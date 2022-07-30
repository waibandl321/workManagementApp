<template>
    <div class="body">
        <Header :params="params"/>
        <AccountRegister
            v-if="!params.account_info.status"
            :params="params"
        />
        <AccountUpdate
            v-else-if="params.account_info.status"
            :params="params"
        />
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import AccountRegister from '@/components/pages/account/AccountRegister.vue'
import AccountUpdate from '@/components/pages/account/AccountUpdate.vue'

export default {
    components: {
        Header,
        AccountRegister,
        AccountUpdate,
    },
    data: () => ({
        params: {
            account_info: {},
            success: "",
            error: "",
            loading: false,
        }
    }),
    created() {
        this.accountRead();
    },
    methods: {
        accountRead() {
            this.params.success = ""
            this.params.error = ""
            this.params.account_info = this.storeGetAccountInfo()
            // this.params.user_info = this.storeGetAccountInfo()
        },
    },
}
</script>
<style scoped src="./scoped.css"></style>