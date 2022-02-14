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
        createRandomId() {
            return Math.random().toString(32).substring(2)
        }
    }
}