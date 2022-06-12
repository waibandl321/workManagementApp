<template>
    <div>
        <PasswordResetEmailSet
            v-if="params.mode === 'input'"
            :params="params"
        />
        <PasswordResetEmailConfirm
            v-if="params.mode === 'confirm'"
            :params="params"
        />
    </div>
</template>

<script>
import PasswordResetEmailConfirm from "./password_reset/PasswordResetEmailConfirm.vue"
import PasswordResetEmailSet from "./password_reset/PasswordResetEmailSet.vue"
export default {
    components: {
        PasswordResetEmailConfirm,
        PasswordResetEmailSet
    },
    data: () => ({
        params: {
            mode: "input"
        }
    }),
}
</script>

<style scoped src="././scoped.css"></style>