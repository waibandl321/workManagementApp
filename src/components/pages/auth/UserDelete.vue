<template>
    <ExecLoading v-if="loading"></ExecLoading>
</template>

<script>
import ExecLoading from '@/components/common/ExecLoading.vue'
export default {
    components: {
        ExecLoading
    },
    data: () => ({
        loading: true
    }),
    created() {
        this.delete()
    },
    methods: {
        async delete() {
            try {
                await this.firebaseDeleteAuthUser() //user(firebase auth)
                await this.firebaseDeleteAccountFiles() //file(db)
                await this.storegeDeleteAccountFiles() //file(storage)
                await this.firebaseDeleteAccountTasks() //task
                await this.firebaseDeleteAccountSubtasks() //subtask
                await this.firebaseDeleteAccount() //user(db)
                await this.firebaseDeleteAccountTaskFiles() // taskfile(db)
                // memo: storeにアカウント削除結果保存
                this.storeSetDeleteResult(true)
                this.pageMove("/auth/delete_confirm")
            } catch (error) {
                console.log(error);
                // memo: storeにアカウント削除結果保存
                this.storeSetDeleteResult(false)
                this.pageMove("/account")
            }
            this.loading = false;
        }
    }
}
</script>