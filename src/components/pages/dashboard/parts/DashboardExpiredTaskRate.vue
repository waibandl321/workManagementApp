<template>
    <v-col>
        <v-card class="pa-4">
            <v-card-title class="dashboard-card-title">期限切れ率（週間・月間）</v-card-title>
            <v-card-subtitle class="px-0 mt-2">完了時の期限切れタスク数 / 作成タスク数 * 100</v-card-subtitle>
            <v-row>
                <v-col>
                    <v-card>
                        <apexchart
                            width="300"
                            type="radialBar"
                            :options="graph_options"
                            :series="setGraphExpiredValueByOneWeek()"
                        ></apexchart>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            期限切れタスク: {{ getExpiredTasksRateByOneWeek().length }}
                        </div>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            週間タスク数：{{ getDashboardTasksByCreatedOneWeek().length }}
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <apexchart
                            width="300"
                            type="radialBar"
                            :options="graph_options"
                            :series="setGraphExpiredValueDataByMonth()"
                        ></apexchart>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            期限切れタスク: {{ getExpiredTasksRateByOneMonth().length }}
                        </div>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            月間タスク数：{{ getDashboardTasksByCreatedOneMonth().length }}
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-col>
</template>
<script>
import dashboardMixin from '../dashbord.js'
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

export default {
    props: ["params"],
    components: {
        apexchart: VueApexCharts,
    },
    mixins: [dashboardMixin],
    data: () => ({
        graph_options: {
            colors: ["#e91e63"],
            chart: {
                type: 'radialBar',
                // アニメーション
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 600,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 250
                    }
                },
            },
            labels: ['期限切れ率'],
        },
    }),
    methods: {
        setGraphExpiredValueByOneWeek() {
            let result =  this.calcExpiredTasksRateByOneWeek()
            return [result]
        },
        setGraphExpiredValueDataByMonth() {
            let result =  this.calcExpiredTasksRateByOneMonth()
            return [result]
        }
    }
}
</script>
<style scoped>
.apexcharts-text.apexcharts-datalabel-value {
    font-size: 18px;
    font-weight: bold;
}
.dashboard-card-title {
    padding-left: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-left: 4px solid rgba(233, 30, 99, 0.85);;
}
</style>