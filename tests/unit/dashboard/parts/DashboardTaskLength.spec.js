<template>
    <v-row>
        <v-col>
            <v-card class="pa-4">
                <v-card-title class="pt-0 px-0 font-weight-bold justify-center">
                    アクティブタスク数
                </v-card-title>
                <div>
                    <v-card
                        color="#359EFA"
                        dark
                        link
                        hover
                        to="/task"
                    >
                        <v-card-title class="justify-center" style="font-size: 32px;">
                            {{ activate }}
                        </v-card-title>
                    </v-card>
                </div>
            </v-card>
        </v-col>
        <v-col>
            <v-card class="pa-4">
                <v-card-title class="pt-0 px-0 font-weight-bold justify-center">
                    期限切れアクティブタスク数
                </v-card-title>
                <div>
                    <v-card
                        color="#EB3E79"
                        dark
                        link
                        hover
                        to="/task"
                    >
                        <v-card-title class="justify-center" style="font-size: 32px;">
                            {{ expired }}
                        </v-card-title>
                    </v-card>
                </div>
            </v-card>
        </v-col>
        <v-col>
            <v-card class="pa-4">
                <v-card-title class="pt-0 px-0 font-weight-bold justify-center">
                    完了タスク数
                </v-card-title>
                <div>
                    <v-card
                        color="#31A85C"
                        dark
                    >
                        <v-card-title class="justify-center" style="font-size: 32px;">
                            {{ completed }}
                        </v-card-title>
                    </v-card>
                </div>
            </v-card>
        </v-col>
        </v-row>
</template>
<script>
export default {
    props: ["params"],
    computed: {
        activate: function() {
            return this.params.all_tasks.length - this.params.is_completed_tasks.length;
        },
        expired: function() {
            return this.params.is_expired_tasks.length;
        },
        completed: function() {
            return this.params.is_completed_tasks.length;
        },
    },
}
</script>