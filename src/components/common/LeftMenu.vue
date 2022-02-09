<template>
    <div class="inner">
         <div
          class="pa-2"
          v-for="(item, i) in functions"
          :key="i"
         >
          <v-btn
            text
            :to="item.path"
            @click="sideClick()"
          >
            <v-icon>{{ item.icon }}</v-icon>
            <span class="pl-2" >{{ item.text }}</span>
         </v-btn>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        toggleSide: Function
    },
    data: () => ({
        drawer: false,
        functions: [
            { text: "ダッシュボード", path: "/", icon: "mdi-view-dashboard-outline" },
            { text: "ファイル管理", path: "/file", icon: "mdi-folder-multiple-outline" },
            { text: "プロジェクト", path: "/project", icon: "mdi-calendar-check-outline" },
            { text: "タスク", path: "/task", icon: "mdi-format-list-checks" },
            { text: "チャット", path: "/chat", icon: "mdi-chat-processing-outline" },
            { text: "掲示板", path: "/board", icon: "mdi-playlist-check" },
        ],
        side_close: false
    }),
    methods: {
        sideClick() {
            this.toggleSide(false)
        }
    }
}
</script>
<style scoped>

</style>