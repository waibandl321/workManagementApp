export default {
    data: () => ({
        today: null,
        // mixin内で使用するタスク一覧
        items: [],
    }),
    async created() {
        this.today = this.convertDatetimeFromUnixtime(this.getCurrentUnixtime(), "yyyymmdd");
        this.items = await this.getAllDashboardTask()
        this.getDashboardTasksByOneWeek()
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
        // 直近7日間で作成されたタスク
        getDashboardTasksByOneWeek() {
            let result = this.items;
            result = result.filter((v) => 
                // 本日以前に作成
                this.judgeDateBeforeToday(v.created)
                // 7日前の日付 > create
                && this.judgeDateRangeBefore7Days(v.created)
            )
            return result;
        },
        // 直近7日間で完了したタスク
        getDashboardCompletedTasksByOneWeek() {
            let result = this.items;
            result = result.filter((v) => 
                this.judgeDateBeforeToday(v.created)
                && this.judgeDateRangeBefore7Days(v.created)
                && v.task_status == 5
            )
            return result;
        },
        // 直近7日間で完了したタスク：7日以内の完了タスク / 直近7日間で作成されたタスク * 100
        calcCompletedTaskRateBySevenDays() {
            const r = this.getDashboardCompletedTasksByOneWeek()
            const s = this.getDashboardTasksByOneWeek();
            return r.length / s.length * 100
        },
        // 直近1ヶ月で作成されたタスク
        getDashboardTasksByCreatedOneMonth() {
            let result = this.items;
            result = result.filter((v) => 
                // 本日以前に作成
                this.judgeDateBeforeToday(v.created)
                // 1ヶ月前の日付 > create
                && this.judgeDateRangeBeforeOneMonth(v.created)
            )
            return result;
        },
        // 直近1ヶ月で完了したタスク
        getDashboardCompletedTasksByOneMonth() {
            let result = this.items;
            result = result.filter((v) => 
                this.judgeDateBeforeToday(v.created)
                && this.judgeDateRangeBeforeOneMonth(v.created)
                && v.task_status == 5
            )
            return result;
        },
        // 一ヶ月間のタスク完了率：1ヶ月以内の完了タスク / 一ヶ月のタスク数 * 100
        calcCompletedTaskRateByOneMonth() {
            const r = this.getDashboardCompletedTasksByOneMonth()
            const s = this.getDashboardTasksByCreatedOneMonth();
            return r.length / s.length * 100
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
                && this.judgeDateAfterToday(v.task_deadline)
                && this.judgeDateRangeAfter7Days(v.task_deadline)
            )
            return result;
        },
        // 期限切れのタスク(＋期日設定がされている) 
        getExpiredTasks() {
            let result = this.getActivateTasks();
            result = result.filter((v) => 
                this.judgeDateBeforeToday(v.task_deadline)
            )
            return result;
        },
        // 本日期日のタスク
        getExpiredTasksToday() {
            let result = this.getActivateTasks();
            result = result.filter((v) => 
                this.judgeDateJustToday(v.task_deadline)
            )
            return result;
        },
        // 本日チェック
        judgeDateJustToday(target_date) {
            return this.convertDatetimeFromUnixtime(target_date, "yyyymmdd") == this.today
        },
        // 本日以前チェック
        judgeDateBeforeToday(target_date) {
            return this.convertDatetimeFromUnixtime(target_date, "yyyymmdd")
                    <= this.convertDatetimeFromUnixtime(this.getCurrentUnixtime(), "yyyymmdd")
        },
        // 本日以降チェック
        judgeDateAfterToday(target_date) {
            return this.convertDatetimeFromUnixtime(target_date, "yyyymmdd") 
                    >= this.convertDatetimeFromUnixtime(this.getCurrentUnixtime(), "yyyymmdd")
        },
        // １週間後チェック
        judgeDateRangeAfter7Days(target_date) {
            return this.convertDatetimeFromUnixtime(target_date, "yyyymmdd") 
                    < this.getUnixtimeAfter7Days()
        },
        // １週間前チェック
        judgeDateRangeBefore7Days(target_date) {
            return this.convertDatetimeFromUnixtime(target_date, "yyyymmdd") 
                    > this.getUnixtimeBefore7Days()
        },
        // １ヶ月後チェック
        judgeDateRangeAfterOneMonth(target_date) {
            return this.convertDatetimeFromUnixtime(target_date, "yyyymmdd") 
                    < this.getUnixtimeAfterOneMonth()
        },
        // １ヶ月前チェック
        judgeDateRangeBeforeOneMonth(target_date) {
            return this.convertDatetimeFromUnixtime(target_date, "yyyymmdd") 
                    > this.getUnixtimeBeforeOneMonth()
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