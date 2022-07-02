<template>
    <v-row>
        <v-col>
            <v-card>
                <v-card-title class="pa-2">アクティブタスク数</v-card-title>
                <div class="px-4 pb-4">
                    <v-card>
                        <v-card-title class="justify-center task-number">
                            {{ params.all_tasks.length - params.is_completed_tasks.length }}
                        </v-card-title>
                    </v-card>
                </div>
            </v-card>
        </v-col>
        <v-col>
            <v-card>
                <v-card-title class="pa-2">期限切れタスク数</v-card-title>
                <div class="px-4 pb-4">
                    <v-card>
                        <v-card-title class="justify-center task-number">
                            {{ params.is_expired_tasks.length }}
                        </v-card-title>
                    </v-card>
                </div>
            </v-card>
        </v-col>
        <v-col>
            <v-card>
                <v-card-title class="pa-2">完了タスク数</v-card-title>
                <div class="px-4 pb-4">
                    <v-card>
                        <v-card-title class="justify-center task-number">
                            {{ params.is_completed_tasks.length }}
                        </v-card-title>
                    </v-card>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import dashboardMixin from '../dashbord.js'
export default {
    props: ["params"],
    mixins: [dashboardMixin],
}
</script>

<style>
.dashbord .task-number.v-card__title {
    font-size: 32px;
}
</style>