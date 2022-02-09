<template>
    <div class="d-flex" style="width: 100%; height: 100%;">
        <div class="menu">
            <div class="text-center">
                <v-btn
                    fab
                    @click="mode = 'member'"
                >
                    <v-icon x-large>mdi-account-outline</v-icon>
                </v-btn>
            </div>
            <div class="text-center mt-4">
                <v-btn
                    fab
                    @click="mode = 'talk'"
                >
                    <v-icon x-large>mdi-chat-processing-outline</v-icon>
                </v-btn>
            </div>
        </div>
        <div
            class="content"
            v-if="mode == 'member'"
        >
            <ChatList
                :parents="parents"
                :changeMode="changeMode"
            />
        </div>
        <div
            v-if="mode == 'talk'"
            class="content"
        >
            <ChatTalkRoom
                :parents="parents"
                :changeMode="changeMode"
                :talkData="talk_data"
            />
        </div>
    </div>
</template>
<script>
import ChatList from "./ChatList.vue";
import ChatTalkRoom from "./ChatTalkRoom.vue";

export default {
    components: {
        ChatList,
        ChatTalkRoom
    },
    props: {
        parents: Object
    },
    data: () => ({
        mode: "member",
        talk_data: {}
    }),
    created() {
        
    },
    methods: {
        changeMode(mode, data) {
            this.mode = mode
            this.talk_data = data
        }
    },
}
</script>
<style scoped>
.menu {
    width: 120px;
    border-right: 1px solid #ccc;
    height: 100%;
}
.content {
    width: calc(100% - 120px);
    padding-left: 40px;
    height: 100%;
}
</style>