<template>
    <!-- ローディング -->
    <div
        class="loading-overlay"
    >
        <v-progress-circular
            indeterminate
            color="white"
            size="40"
        ></v-progress-circular>
    </div>
</template>

<script>
export default {
    props: ["params"]
}
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,.5);
}
</style>