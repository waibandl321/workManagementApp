<template>
    <v-col>
        <v-card class="pb-6 px-2 pt-2">
            <v-card-title class="pa-2">期限切れ率（週間・月間）</v-card-title>
            <v-card-subtitle class="pa-2">完了時の期限切れタスク数 / 作成タスク数 * 100</v-card-subtitle>
            <v-row class="mx-0">
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
<style>
.apexcharts-text.apexcharts-datalabel-value {
    font-size: 18px;
    font-weight: bold;
}
</style>