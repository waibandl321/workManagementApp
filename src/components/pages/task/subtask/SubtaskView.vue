<template>
    <v-dialog
        v-model="dialog"
        width="800"
    >
        <v-card>
            <v-card-title class="text-h5 grey lighten-2">
                サブタスク詳細
            </v-card-title>
            
            {{ subtask_viewer }}
            <v-card-text class="py-6">
                <span class="font-weight-bold">サブタスク名</span>：{{ subtask_viewer.subtask_name }}
            </v-card-text>
            <v-card-text class="py-6">
                <span class="font-weight-bold">サブタスク詳細</span>：{{ subtask_viewer.subtask_description }}
            </v-card-text> 

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-for="(option, index) in subtask_option"
                    :key="index"
                    :color="option.function_cd === 'edit' ? 'primary' : ''"
                    outlined
                    @click="clickOption(option)"
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
        subtask_viewer: Object,
    },
    components: {
        
    },
    created() {
        
    },
    mounted() {
        
    },
    data: () => ({
        dialog: true,
    }),
    methods: {
        // 編集遷移込み
        clickOption(option) {
            let edit_flag = null;
            if(option.function_cd === 'edit') {
                edit_flag = 'subtask_edit'
            }
            option.callback(edit_flag)
        }
    }
}
</script>

<style scoped>

</style>
