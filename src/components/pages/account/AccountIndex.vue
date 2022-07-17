<template>
    <div class="body">
        <Header
            :parents="parents"
            v-if="!params.delete_flag"
        />
        <AccountRegister
            v-if="!params.account_info.status && !params.delete_flag"
            :params="params"
            :parents="parents"
        />
        <AccountUpdate
            v-else-if="params.account_info.status && !params.delete_flag"
            :params="params"
            :parents="parents"
        />
        <AccountDeleteConfirm
            v-if="params.delete_flag"
            :params="params"
        />
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import AccountRegister from '@/components/pages/account/AccountRegister.vue'
import AccountUpdate from '@/components/pages/account/AccountUpdate.vue'
import AccountDeleteConfirm from '@/components/pages/account/AccountDeleteConfirm'

export default {
    components: {
        Header,
        AccountRegister,
        AccountUpdate,
        AccountDeleteConfirm
    },
    data: () => ({
        parents: {
            user_info: {}
        },
        params: {
            account_info: {},
            success: "",
            error: "",
            loading: false,
            delete_flag: false,
        }
    }),
    created() {
        this.setRoutetitle()
        this.accountRead();
    },
    methods: {
        async accountRead() {
            this.params.success = ""
            this.params.error = ""
            this.params.account_info = this.storeGetAccountInfo()
            this.parents.user_info = this.storeGetAccountInfo()
        },
    },
}
</script>
<style scoped src="./scoped.css"></style>