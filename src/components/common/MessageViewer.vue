<template>
    <div data-test-id="alertComponent">
        <v-alert
            v-if="params.success"
            dismissible
            :toggle="toggleSuccess"
            type="success"
        >
            {{ params.success }}
        </v-alert>
        <v-alert
            v-if="params.error"
            dismissible
            :toggle="toggleError"
            type="error"
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
    methods: {
        toggleError() {
            this.params.error = ""
        },
        toggleSuccess() {
            this.params.success = ""
        },
    }
}
</script>
