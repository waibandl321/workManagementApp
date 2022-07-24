<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="800"
        content-class="subtask-view-modal"
    >
        <v-card>
            <v-card-title
                class="text-h5 grey lighten-2"
                data-test-id="subtaskTitle"
            >
                サブタスク詳細
            </v-card-title>
            <div class="pa-4">
                <div class="font-weight-bold pb-2">■ サブタスク名</div>
                <v-divider />
                <div
                    class="mt-2"
                    data-test-id="subtaskName"
                >
                    {{ params.subtask_viewer.subtask_name }}
                </div>
            
                <div class="font-weight-bold mt-10 pb-2">■ サブタスク詳細</div>
                <v-divider />
                <div
                    v-html="params.subtask_viewer.subtask_description"
                    class="mt-2 pb-10"
                    data-test-id="subtaskDescription"
                ></div>
            </div>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-for="(option, index) in subtask_option"
                    :key="index"
                    :color="option.function_cd === 'edit' ? 'primary' : ''"
                    outlined
                    @click="clickOption(option, params.subtask_viewer)"
                    :data-test-id="'subtaskView' + option.function_cd"
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
