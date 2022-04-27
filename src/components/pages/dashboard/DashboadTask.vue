<template>
    <div class="mt-10">
        <h3>タスク</h3>
        <v-row class="ma-0">
            <v-col cols="4">
                <v-card>
                    <v-card-title>優先度が高いタスク</v-card-title>
                    <v-divider />
                    <v-card-text></v-card-text>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card>
                    <v-card-title>期限が迫っているタスク</v-card-title>
                    <v-divider />
                    <v-card-text></v-card-text>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card>
                    <v-card-title>期限切れのタスク</v-card-title>
                    <v-divider />
                    <v-card-text></v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    data: () => ({}),
    created() {},
    computed: {},
    methods: {},
}
</script>
