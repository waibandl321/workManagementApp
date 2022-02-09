<template>
     <v-row class="h-max">
         <v-col cols="2" class="h-max">
            <v-text-field
                label="トークルームを検索"
            ></v-text-field>
            <div
                v-for="(account, i) in parents.accounts"
                :key="i"
                class="py-1"
            >   
                <v-btn
                    text
                    @click="selectChat(account)"
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
            <v-card-actions>
                <v-spacer />
                <v-btn
                    fab
                    color="primary"
                    @click="add()"
                >
                    <v-icon x-large>mdi-chat-plus-outline</v-icon>
                </v-btn>
            </v-card-actions>
        </v-col>
        <v-col cols="10" class="relative body h-max">
            <div>
                <div class="pb-4">
                    <v-avatar
                        :color="detail.account_avatar"
                        size="48"
                        class="mr-2"
                    >
                        <span class="white--text">{{ detail.account_initial }}</span>
                    </v-avatar>
                    {{ detail.account_name }}さんとのトーク
                </div>
                <v-divider />
                <!-- message input -->
                <div class="d-flex align-center pt-6 message_send">
                    <div class="avatar">
                        <v-avatar
                            color="primary"
                            size="48"
                        >
                            <span class="white--text">大純</span>
                        </v-avatar>
                    </div>
                    <div class="message_send_textarea px-2 d-flex">
                        <v-textarea
                            auto-grow
                            filled
                            rows="1"
                        >
                        </v-textarea>
                        <div class="icons">
                            <v-btn text><v-icon>mdi-at</v-icon></v-btn>
                            <v-btn text><v-icon>mdi-emoticon</v-icon></v-btn>
                            <v-btn text><v-icon>mdi-paperclip</v-icon></v-btn>
                        </div>
                    </div>
                    <div class="message_send_btn">
                        <v-btn fill color="primary" large>送信</v-btn>
                    </div>
                </div>
            </div> 
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: {
        parents: Object,
        talkData: Object,
        changeMode: Function,
    },

    data: () => ({
        select: false,
        detail: {},
    }),

    created() {
        if(this.talkData) {
            this.detail = this.talkData
        }
     },

    methods: {
        add() {
            this.changeMode('member')
        },
        selectChat(account) {
            this.detail = account
            this.talkData = []
            this.select = true
        },
    },
}
</script>

<style scoped>
.relative {
    position: relative;
}
.body {
    padding-left: 40px;
    padding-right: 40px;
    border-left: 1px solid #ccc;
}
.h-max {
    height: 100%;
}
.message_send {
    position: absolute;
    bottom: 0;
    width: 100%;
    right: 0;
    padding: 0 20px;
}

.message_send_textarea {
    width: calc(100% - 120px);
}
.icons {
    position: absolute;
    bottom: 8px;
    right: 10%;
}
.v-btn:not(.v-btn--round).v-size--default {
    min-width: unset;
    padding: 0 4px;
}
.message_send_textarea >>> .v-text-field__details {
    display: none;
}
</style>