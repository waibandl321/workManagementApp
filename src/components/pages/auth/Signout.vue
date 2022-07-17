<template>
    <ExecLoading v-if="loading" />
</template>


<script>
import ExecLoading from '@/components/common/ExecLoading.vue'
export default {
    components: {
        ExecLoading,
    },
    data: () => ({
        loading: true,
    }),
    async created() {
        this.setRoutetitle()
        const result = await this.firebaseSignout();
        if(result) {
            this.storeDeleteAccountInfo()
            this.storeDestroyFirebaseUid()
            this.pageMove('/auth/signin')
            this.loading = false
        }
    },
    methods: {
        
    },
}
</script>

<style scoped src="./scoped.css"></style>