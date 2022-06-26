<template>
    <div class="body">
        <Header :parents="parents" />
        <div class="pa-4 dashbord">
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-actions class="pa-2">
                            <v-card-title class="pa-2">タスク完了率（週間・月間）</v-card-title>
                            <v-spacer></v-spacer>
                            <div>
                                <v-btn outlined class="ml-2">週間</v-btn>
                                <v-btn outlined class="ml-2">月間</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-actions class="pa-2">
                            <v-card-title class="pa-2">期限切れ率（週間・月間）</v-card-title>
                            <v-spacer></v-spacer>
                            <div>
                                <v-btn outlined class="ml-2">週間</v-btn>
                                <v-btn outlined class="ml-2">月間</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-actions class="pa-2">
                            <v-card-title class="pa-2">アクティブタスク数（週間、月間）</v-card-title>
                            <v-spacer></v-spacer>
                            <div>
                                <v-btn outlined class="ml-2">週間</v-btn>
                                <v-btn outlined class="ml-2">月間</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-actions class="pa-2">
                            <v-card-title class="pa-2">期限切れタスク数</v-card-title>
                            <v-spacer></v-spacer>
                            <div>
                                <v-btn outlined class="ml-2">週間</v-btn>
                                <v-btn outlined class="ml-2">月間</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-actions class="pa-2">
                            <v-card-title class="pa-2">完了タスク数</v-card-title>
                            <v-spacer></v-spacer>
                            <div>
                                <v-btn outlined class="ml-2">週間</v-btn>
                                <v-btn outlined class="ml-2">月間</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">期限が近いタスク（１週間以内）</v-card-title>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">期限切れのタスク（週間、月間）</v-card-title>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">最近更新されたタスク（１週間以内）</v-card-title>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="pa-2">完了したタスク（週間、月間）</v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import myMixin from './dashbord.js'
export default {
    components: {
        Header,
    },
    mixins: [myMixin],
    data: () => ({
        parents: {
            user_info: {}
        },
        params: {
            all_tasks: [],
            is_completed_tasks: [],
            is_expired_tasks: [],
            is_active_tasks: [],
            is_updated_tasks: [],
            is_near_deadline_tasks: []


        }
    }),
    created() {
        this.parents.user_info = this.storeGetAccountInfo()
        this.initTaskList()
    },
    methods: {
        async initTaskList() {
            this.all_tasks = await this.getTaskList()
        }
    }
}
</script>
<style scoped>
.body {
  width: 100%;
}
.header {
  border-bottom: 1px solid #ccc;
  height: 70px;
  line-height: 70px;
  padding: 0 16px;
}
.dashbord >>> .v-card__title {
    font-size: 16px;
}
</style>