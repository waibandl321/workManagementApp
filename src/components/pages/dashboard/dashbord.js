export default {
    data: () => ({
        today: null,
        // mixin内で使用するタスク一覧
        items: [],
    }),
    async created() {
        this.today = this.convertDatetimeFromUnixtime(this.getCurrentUnixtime(), "yyyymmdd");
        this.items = await this.getAllDashboardTask()
    },
    methods: {
        async getAllDashboardTask() {
            let result = await this.apiGetTaskList()
            result = Object.keys(result)
            .map((key) => {
                return result[key]
            })
            this.items = result
            return result;
        },
        // 現在日付から7日前の日付
        getDateSevenDaysAgoFromCurrent() {
            
        },
        // 現在日付から30日前の日付
        getDateThirtyDaysAgoFromCurrent() {

        },

        // 直近1ヶ月(30日)以内に作成されたタスク
        geDashboardTasksByOneMonth() {},
        
        // 直近一ヶ月以内に作成されたタスク
        geCompletedDashboardTasksByOneMonth() {

        },
        // 直近7日間に作成されたタスク
        geDashboardTasksByOneWeek() {

        },
        // タスク完了率（直近7日間）
        calcCompletionRateByOneMonth() {
            // 計算式：1ヶ月以内の完了タスク / 一ヶ月のタスク数 * 100
        },
        // タスク完了率（直近30日間）
        calcCompletionRateByOneWeek() {
            // 計算式：7日以内の完了タスク / 7日以内のタスク数 * 100
        },

        // 期限切れ率（直近7日間）
        calcExpiredTasksRateByOneWeek() {

        },
        // 期限切れ率（直近30日間）
        calcExpiredTasksRateByOneMonth() {

        },

        // 有効なタスク数
        getActiveTasksLength() {

        },
        // 期限切れのタスク数（直近7日間）
        getNearDeadlineTasksLengthByOneWeek() {

        },
        // 期限切れのタスク数（直近30日）
        getNearDeadlineTasksLengthByOneMonth() {

        },
        // 期日設定がされている＋期限が直近7日間以内のタスク（土・日・祝日を含む）
        getNearDeadlineTasksByOneWeek() {
            let result = this.getActivateTasks();
            result = result.filter((v) => 
                v.task_deadline
                && this.judgeDeadlineAfterToday(v)
                && this.judgeDeadlineRangeSevenDays(v)
            )
            return result;
        },
        // 期限切れのタスク(＋期日設定がされている) 
        getExpiredTasks() {
            let result = this.getActivateTasks();
            result = result.filter((v) => 
                this.judgeDeadlineBeforeToday(v)
            )
            return result;
        },
        // 本日期日のタスク
        getExpiredTasksToday() {
            let result = this.getActivateTasks();
            result = result.filter((v) => 
                this.judgeDeadlineJustToday(v)
            )
            return result;
        },
        // 期日チェック
        judgeDeadlineJustToday(task) {
            return this.convertDatetimeFromUnixtime(task.task_deadline, "yyyymmdd") == this.today
        },
        judgeDeadlineBeforeToday(task) {
            return this.convertDatetimeFromUnixtime(task.task_deadline, "yyyymmdd")
                    < this.convertDatetimeFromUnixtime(this.getCurrentUnixtime(), "yyyymmdd")
        },
        judgeDeadlineAfterToday(task) {
            return this.convertDatetimeFromUnixtime(task.task_deadline, "yyyymmdd") 
                    > this.convertDatetimeFromUnixtime(this.getCurrentUnixtime(), "yyyymmdd")
        },
        judgeDeadlineRangeSevenDays(task) {
            return this.convertDatetimeFromUnixtime(task.task_deadline, "yyyymmdd") 
                    < this.getUnixtimeAfter7Days()
        },
        // アクティブタスク
        getActivateTasks() {
            let result = this.items;
            result = result.filter((v) => v.task_status !== 5)
            return result;
        },
        // 完了タスク
        getCompletedTasks() {
            let result = this.items;
            result = result.filter((v) => v.task_status === 5)
            return result;
        },
    }
}