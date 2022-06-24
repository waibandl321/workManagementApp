<template>
    <div class="body">
        <Header
            :parents="parents"
        />
        <!-- 新規登録 -->
        <div
            class="auth"
            v-if="!params.account_info.status"
        >
            <AccountRegister
                :params="params"
            />
        </div>
        <div
            class="pa-6"
            v-else
        >
            <!-- 更新 -->
            <AccountUpdate
                :params="params"
            />
        </div>
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
<style scoped>
.body {
  width: 100%;
}
.header {
  border-bottom: 1px solid #ccc;
  height: 70px;
  line-height: 70px;
  padding: 0 16px;
}
</style>