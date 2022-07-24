<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="600"
    >
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
                    outlined
                    large
                    @click="closeModal"
                    data-test-id="fileDeleteCancel"
                >
                    キャンセル
                </v-btn>
                <v-btn
                    color="red darken-2"
                    dark
                    large
                    @click="deleteDecision"
                    data-test-id="fileDeleteDone"
                >
                    削除
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    props: {
        executeDelete: Function,
        closeModal: Function,
        delete_item: Object
    },
    data: () => ({
        dialog: true,
    }),
    methods: {
        deleteDecision() {
            this.executeDelete()
        }
    }
}
</script>
