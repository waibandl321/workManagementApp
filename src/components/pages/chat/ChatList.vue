<template>
    <v-row class="ma-0 h-max">
        <v-col cols="2" class="h-max">
            <v-text-field
                label="メンバーを検索"
            ></v-text-field>
            <div
                v-for="(account, i) in parents.accounts"
                :key="i"
                class="py-1"
            >   
                <v-btn
                    text
                    @click="selectMember(account)"
                >
                    <v-avatar
                        :color="account.account_avatar"
                        size="32"
                        class="mr-2"
                    >
                        <span class="white--text">{{ account.account_initial }}</span>
                    </v-avatar>
                    {{ account.account_name }}
                </v-btn>
            </div>
        </v-col>
        <v-col cols="10" class="body h-max">
            <div v-if="!status">
                <v-alert
                    dense
                    text
                    type="success"
                >
                    あなたがトークしたいメンバーを選択して、トークを開始してください。
                </v-alert>
            </div>
            <div class="text-center" v-else>
                <v-avatar
                    :color="detail.account_avatar"
                    size="48"
                >
                    <span class="white--text">{{ detail.account_initial }}</span>
                </v-avatar>
                <div class="mt-2">
                    {{ detail.account_name }}
                </div>
                <div
                    class="mt-4"
                >
                    <v-btn
                        color="primary"
                        @click="talk(detail)"
                    >
                        {{ detail.account_name }} さんとトークする
                    </v-btn>
                </div>
            </div>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: {
        parents: Object,
        changeMode: Function,
    },
    data: () => ({
        status: false,
        detail: [],
    }),
    created() {
        
    },
    methods: {
        selectMember(account) {
            this.detail = account
            this.status = true
        },
        talk(detail) {
            this.changeMode('talk', detail)
        },
    },
}
</script>

<style scoped>
.body {
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    padding-left: 40px;
    border-left: 1px solid #ccc;
}
.h-max {
    height: 100%;
}
</style>