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