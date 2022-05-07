<template>
    <div>
        <v-alert
            type="success"
            dismissible
            v-if="params.success"
        >
            {{ params.success }}
        </v-alert>
        <v-alert
            type="error"
            dismissible
            v-if="params.error"
        >
            {{ params.error }}
        </v-alert>
    </div>
</template>

<script>
export default {
    props: {
        params: Object
    },
    data: () => ({

    })
}
</script>
