<template>
    <router-view :params="params" :parents="parents"></router-view>
</template>
<script>
export default {
    data: () => ({
        params: {
            account_info: {},
            success: "",
            error: "",
            loading: false,
        },
        parents: {
            user_info: {}
        },
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