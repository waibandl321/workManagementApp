<template>
  <div class="breadcrumb">
    <v-app-bar
      dense
      color="white"
      outlined
    >
      <v-btn
        text
        outlined
        @click="back()"
       >
        <v-icon>mdi-arrow-left</v-icon>
        戻る
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
    props: {
        params: Object,
        backFunc: Function,
    },
    data: () => ({

    }),
    methods: {
        back() {
            this.backFunc()
        }
    }
}
</script>

<style scoped>
.breadcrumb >>> .theme--light.v-sheet--outlined {
    border: 1px solid #ccc;
    box-shadow: none;
}
.breadcrumb >>> .v-toolbar--dense .v-toolbar__content,
.breadcrumb >>> .v-toolbar--dense .v-toolbar__extension {
    padding: 0;
}
</style>