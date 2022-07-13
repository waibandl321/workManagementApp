<template>
    <v-dialog
        v-model="dialog"
        width="800"
    >
        <v-card>
            <v-card-title class="text-h5 grey lighten-2">
                サブタスク詳細
            </v-card-title>
            <v-card-text class="py-6">
                <div class="font-weight-bold">■ サブタスク名</div>
                <div class="mt-3">{{ params.subtask_viewer.subtask_name }}</div>
            </v-card-text>
            <v-card-text class="py-6">
                <div class="font-weight-bold">■ サブタスク詳細</div>
                <div
                    v-html="params.subtask_viewer.subtask_description"
                    class="mt-3"
                ></div>
            </v-card-text> 

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-for="(option, index) in subtask_option"
                    :key="index"
                    :color="option.function_cd === 'edit' ? 'primary' : ''"
                    outlined
                    @click="clickOption(option, params.subtask_viewer)"
                >
                    {{ option.text }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        params: Object,
        subtask_option: Array,
    },
    data: () => ({
        dialog: true,
    }),
    methods: {
        // 編集遷移込み
        clickOption(option, subtask) {
            if(option.function_cd === 'edit' && subtask) {
                this.params.subtask_editor = subtask;
                option.callback("subtask_edit");
                return
            }
            option.callback();
        }
    }
}
</script>

<style scoped>

</style>
