<template>
    <div class="auth"></div>
</template>

<script>
export default {
    mounted() {
        setTimeout(() => {
            this.openAlert('アカウントを削除しました。アプリケーションの利用を終了します。')
            this.$router.push("/auth/signout")
        }, 100)
    },
}
</script>
<style>
.auth {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #eee;
    opacity: 1;
}
.auth >>> .v-card {
    width: 800px
}
.card .v-sheet.v-card {
    box-shadow: none;
}
</style>