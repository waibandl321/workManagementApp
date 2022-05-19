<template>
    <div>
        <v-alert
            v-if="params.success"
            dismissible
            type="success"
        >
            {{ params.success }}
        </v-alert>
        <v-alert
            v-if="params.error"
            dismissible            
            :toggle="toggle"
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
    data: () => ({

    }),
    methods: {
        toggle() {
            this.params.error = ""
        }
    }
}
</script>
