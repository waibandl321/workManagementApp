<template>
    <v-card>
        <v-card-title>
        <span class="text-h5">タスクを削除します</span>
        </v-card-title>
        <v-card-text>
            本当によろしいですか？
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                outlined
                depressed
                class="pa-4"
                @click="closeModal()"
            >
                キャンセル
            </v-btn>
            <v-btn
                depressed
                class="pa-4"
                color="red darken-4"
                outlined
                @click="execDeleteTask(item)"
                
            >
                削除する
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>

export default {
    props: {
        execDeleteTask: Function,
        closeModal: Function,
        item: Object
    },
}
</script>
