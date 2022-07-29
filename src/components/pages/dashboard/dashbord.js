export default {
    data: () => ({
        today: null,
    }),
    async created() {
        this.today = this.toDatetime(this.nowUnix(), "yyyymmdd");
    },
    methods: {
        async getAllDashboardTask() {
            let result = await this.firebaseGetTaskList()
            if(!result) {
                return [];
            }
            result = Object.keys(result)
            .map((key) => {
                return result[key]
            })
            return result;
        },

        // 直近7日間で作成されたタスク
        createdTasksWeekly() {
            let result = this.storeGetDashboardTasks();
            if(!result) return []
            result = result.filter((v) => 
                this.judgeDateBeforeToday(v.created) // 本日以前に作成
                && this.judgeDateRangeBefore7Days(v.created) // 7日前の日付 > create
            )
            return result;
        },
        // 直近7日間で完了したタスク
        completedTasksWeekly() {
            let result = this.storeGetDashboardTasks();
            if(!result) return []
            result = result.filter((v) => 
                this.judgeDateBeforeToday(v.created)
                && this.judgeDateRangeBefore7Days(v.created)
                && v.task_status == 5
            )
            return result;
        },
        // 直近7日間で完了したタスク：7日以内の完了タスク / 直近7日間で作成されたタスク * 100
        calcCompletionRateWeekly() {
            const r = this.completedTasksWeekly()
            const s = this.createdTasksWeekly();
            return Math.round(r.length / s.length * 100)
        },
        // 直近1ヶ月で作成されたタスク
        createdTasksMonthly() {
            let result = this.storeGetDashboardTasks();
            if(!result) return []
            result = result.filter((v) => 
                this.judgeDateBeforeToday(v.created) // 本日以前に作成
                && this.judgeDateRangeBeforeOneMonth(v.created) // 1ヶ月前の日付 > create
            )
            return result;
        },
        // 直近1ヶ月で完了したタスク
        completedTasksMonthly() {
            let result = this.storeGetDashboardTasks();
            if(!result) return []
            result = result.filter((v) => 
                this.judgeDateBeforeToday(v.created)
                && this.judgeDateRangeBeforeOneMonth(v.created)
                && v.task_status == 5
            )
            return result;
        },
        // 一ヶ月間のタスク完了率：1ヶ月以内の完了タスク / 一ヶ月のタスク数 * 100
        calcCompletionRateMonthly() {
            const r = this.completedTasksMonthly()
            const s = this.createdTasksMonthly();
            return Math.round(r.length / s.length * 100)
        },
        

        // 期限切れタスク（直近7日間）
        getExpiredTasksRateByOneWeek() {
            let result = this.completedTasksWeekly();
            result = result.filter((v) =>
                v.task_deadline &&
                v.finished_at &&
                this.judgeExpired(v.task_deadline, v.finished_at)
            )
            return result;
        },
        // 期限切れタスク（直近30日間）
        getExpiredTasksRateByOneMonth() {
            let result = this.createdTasksMonthly()
            result = result.filter((v) =>
                v.task_deadline &&
                v.finished_at &&
                this.judgeExpired(v.task_deadline, v.finished_at)
            )
            return result;
        },

        // 直近7日間のタスク期限切れ率：期限切れタスク数 / 7日間のタスク作成数 * 100
        calcExpirationRateWeekly() {
            const r = this.getExpiredTasksRateByOneWeek()
            const s = this.createdTasksWeekly();
            return Math.round(r.length / s.length * 100)
        },
        // 一ヶ月間のタスク期限切れ率：期限切れタスク数 / 一ヶ月のタスク作成数 * 100
        calcExpirationRateMonthly() {
            const r = this.getExpiredTasksRateByOneMonth()
            const s = this.createdTasksMonthly();
            return Math.round(r.length / s.length * 100)
        },

        
        // 期限切れのタスク(＋期日設定がされている) 
        getExpiredTasks() {
            let result = this.storeGetDashboardTasks();
            result = result.filter((v) => 
                v.task_status !== 5 &&
                this.judgeDateBeforeYesterday(v.task_deadline)
            )
            return result;
        },
        
        // アクティブタスク
        getActivateTasks() {
            let result = this.storeGetDashboardTasks();
            result = result.filter((v) => v.task_status !== 5)
            return result;
        },
        // 完了タスク
        getCompletedTasks() {
            let result = this.storeGetDashboardTasks();
            result = result.filter((v) => v.task_status === 5)
            return result;
        },
        // 本日チェック
        judgeDateJustToday(target_date) {
            return this.toDatetime(target_date, "yyyymmdd") == this.today
        },
        // 本日以前チェック
        judgeDateBeforeToday(target_date) {
            return this.toDatetime(target_date, "yyyymmdd")
                    <= this.toDatetime(this.nowUnix(), "yyyymmdd")
        },
        // 本日含まないver
        judgeDateBeforeYesterday(target_date) {
            return this.toDatetime(target_date, "yyyymmdd")
                    < this.toDatetime(this.nowUnix(), "yyyymmdd")
        },
        // 本日以降チェック
        judgeDateAfterToday(target_date) {
            return this.toDatetime(target_date, "yyyymmdd") 
                    >= this.toDatetime(this.nowUnix(), "yyyymmdd")
        },
        // １週間後チェック
        judgeDateRangeAfter7Days(target_date) {
            return this.toDatetime(target_date, "yyyymmdd") 
                    < this.getUnixtimeAfter7Days()
        },
        // １週間前チェック
        judgeDateRangeBefore7Days(target_date) {
            return this.toDatetime(target_date, "yyyymmdd") 
                    > this.getUnixtimeBefore7Days()
        },
        // １ヶ月後チェック
        judgeDateRangeAfterOneMonth(target_date) {
            return this.toDatetime(target_date, "yyyymmdd") 
                    < this.getUnixtimeAfterOneMonth()
        },
        // １ヶ月前チェック
        judgeDateRangeBeforeOneMonth(target_date) {
            return this.toDatetime(target_date, "yyyymmdd") 
                    > this.getUnixtimeBeforeOneMonth()
        },
        // 期日 < 終了日チェック
        judgeExpired(task_deadline, finished_at) {
            return this.toDatetime(task_deadline, "yyyymmdd") < this.toDatetime(finished_at, "yyyymmdd")
        },
    }
}