<template>
    <v-col>
        <v-card class="pa-4">
            <v-card-title class="dashboard-card-title">期限切れ率（週間・月間）</v-card-title>
            <v-row class="mt-2 dashboard-card-row">
                <v-col>
                    <v-card>
                        <v-card-title class="justify-center">過去7日間</v-card-title>
                        <apexchart
                            type="radialBar"
                            :options="graph_options"
                            :series="setExpirationRateWeekly()"
                        ></apexchart>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            完了時に期限切れ: {{ expiration_length_weekly }}
                        </div>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            週間タスク数：{{ task_length_weekly }}
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-card-title class="justify-center">1ヶ月間</v-card-title>
                        <apexchart
                            type="radialBar"
                            :options="graph_options"
                            :series="setExpirationRateMonthly()"
                        ></apexchart>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            完了時に期限切れ: {{ expiration_length_monthly }}
                        </div>
                        <v-divider></v-divider>
                        <div class="pa-4">
                            月間タスク数：{{ task_length_monthly }}
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
                        delay: 200
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
            },
            labels: ['期限切れ率'],
        },
    }),
    computed: {
        expiration_length_weekly: function() {
            const result = this.getExpiredTasksRateByOneWeek()
            return result.length;
        },
        task_length_weekly: function() {
            const result = this.createdTasksWeekly()
            return result.length;
        },
        expiration_length_monthly: function() {
            const result = this.getExpiredTasksRateByOneMonth()
            return result.length
        },
        task_length_monthly: function() {
            const result = this.createdTasksMonthly()
            return result.length;
        },
    },
    methods: {
        setExpirationRateWeekly() {
            let result =  this.calcExpirationRateWeekly()
            if(!result) {
                return [0]
            }
            return [result]
        },
        setExpirationRateMonthly() {
            let result =  this.calcExpirationRateMonthly()
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
    border-left: 4px solid rgba(233, 30, 99, 0.85);;
}
.dashboard-card-row {
    flex-wrap: nowrap;
}
</style>