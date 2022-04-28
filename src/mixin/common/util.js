export default {
    data: () => ({
        
    }),

    methods: {
        // 現在時刻を返す
        getNowTime() {
            let time = new Date()
            let today = Date(time);
            return today
        },

        // ランダムIDのセット
        createRandomId() {
            return Math.random().toString(32).substring(2)
        },

        // ページ遷移
        pageMove(page) {
            this.$router.push(page, () => {})
        }
    }
}