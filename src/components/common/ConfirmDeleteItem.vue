<template>
    <v-card>
        <div class="font-weight-bold px-6 pt-6">アイテム削除</div>

        <v-card-text class="pt-6">
            選択された「
                {{ delete_item.type == 0 ? "ディレクトリ名：" : "ファイル名：" }}
                {{ delete_item.name }}
            」
            を削除します。本当によろしいですか？
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 py-4">
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-2"
                dark
                large
                @click="deleteDecision"
            >
                削除
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

export default {
    props: {
        executeDelete: Function,
        delete_item: Object
    },
    data: () => ({

    }),
    methods: {
        deleteDecision() {
            this.executeDelete(this.delete_item)
        }
    }
}
</script>
