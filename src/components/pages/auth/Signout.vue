<template>
    <v-dialog
        v-model="loading"
        persistent
        width="400"
    >
        <LoadingOverlay />
    </v-dialog>
</template>


<script>
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
export default {
    components: {
        LoadingOverlay,
    },
    data: () => ({
        loading: true,
    }),
    created() {
        this.firebaseSignout()
        this.storeDeleteAccountInfo()
        this.storeDestroyFirebaseUid()
        this.pageMove('/auth/signin')
        this.loading = false
    },
    methods: {
        
    },
}
</script>

<style scoped src="./scoped.css"></style>