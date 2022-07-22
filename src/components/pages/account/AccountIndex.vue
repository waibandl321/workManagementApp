<template>
    <div class="body">
        <Header :parents="parents"/>
        <AccountRegister
            v-if="!params.account_info.status"
            :params="params"
            :parents="parents"
        />
        <AccountUpdate
            v-else-if="params.account_info.status"
            :params="params"
            :parents="parents"
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
        parents: {
            user_info: {}
        },
        params: {
            account_info: {},
            success: "",
            error: "",
            loading: false,
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