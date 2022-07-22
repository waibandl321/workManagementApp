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
import PasswordResetEmailConfirm from "./PasswordResetEmailConfirm.vue"
import PasswordResetEmailSet from "./PasswordResetEmailSet.vue"
export default {
    components: {
        PasswordResetEmailConfirm,
        PasswordResetEmailSet
    },
    data: () => ({
        params: {
            mode: "input",
            error: "",
        }
    }),
    created() {
        this.setRoutetitle()
    },
}
</script>

<style scoped src="@/components/pages/auth/scoped.css"></style>