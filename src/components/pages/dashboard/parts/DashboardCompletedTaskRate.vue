<template>
    <v-col>
        <v-card class="pa-4">
            <v-card-title class="dashboard-card-title">タスク完了率（週間・月間）</v-card-title>
            <v-row class="mt-2">
                <v-col>
                    <v-card>
                        <v-card-title class="justify-center">過去7日間</v-card-title>
                        <apexchart
                            type="radialBar"
                            :options="graph_options"
                            :series="setGraphDataByCompletedTasksByOneWeek()"
                        ></apexchart>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            完了したタスク：{{ getDashboardCompletedTasksByOneWeek().length }}
                        </div>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            週間タスク数：{{ getDashboardTasksByCreatedOneWeek().length }}
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="justify-center">1ヶ月間</v-card-title>
                        <apexchart
                            type="radialBar"
                            :options="graph_options"
                            :series="setGraphDataByCompletedTasksByMonth()"
                        ></apexchart>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            完了したタスク：{{ getDashboardCompletedTasksByOneMonth().length }}
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
            colors: ["#31A85C"],
            chart: {
                type: 'radialBar',
                // アニメーション
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 600,
                    animateGradually: {
                        enabled: true,
                        delay: 200
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
            },
            labels: ['完了率'],
        },
    }),
    created() {
        
    },
    methods: {
        setGraphDataByCompletedTasksByOneWeek() {
            let result =  this.calcCompletedTaskRateBySevenDays()
            if(!result) {
                return [0]    
            }
            return [result]
        },
        setGraphDataByCompletedTasksByMonth() {
            let result =  this.calcCompletedTaskRateByOneMonth()
            if(!result) {
                return [0]    
            }
            return [result]
        },
    }
}
</script>

<style scoped>
.apexcharts-text.apexcharts-datalabel-value {
    font-size: 18px;
    font-weight: bold;
}
.dashboard-card-title {
    font-weight: bold;
    padding-left: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-left: 4px solid #31A85C;
}
</style>