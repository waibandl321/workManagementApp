<template>
    <v-dialog
        persistent
        max-width="600px"
        v-model="dialog"
    >
        <v-card class="pa-6">
            <v-card-title class="pa-0">
                <span class="text-h5">{{ delete_title }} </span>
            </v-card-title>
            <v-card-text class="px-0 mt-2">
                削除後は復元できません。本当によろしいですか？
            </v-card-text>
            <v-divider />
            <v-card-actions class="px-0 pb-0 mt-2">
                <v-spacer></v-spacer>
                <v-btn
                    v-for="(option, index) in menu_options"
                    :key="index"
                    outlined
                    depressed
                    large
                    @click="clickOption(option)"
                    :color="option.function_cd === 'delete' ? 'red darken-3' : ''"                
                    class="pa-4"
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
        delete_title: String,
        closeModal: Function,
        delete_options: Array
    },
    data: () => ({
        dialog: true,
        menu_options: null,
    }),
    created() {
        this.menu_options = this.delete_options
    },
    methods: {
        clickOption(option) {
            option.callback()
        }
    }
}
</script>
