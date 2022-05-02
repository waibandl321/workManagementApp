export default {
    data: () => ({
        
    }),

    methods: {

        getCurrentUnixtime() {
            var date = new Date() ;
            var a = date.getTime();
            var b = Math.floor( a / 1000 );
            return b
        },

        convertDatetimeFromUnixtime(value) {
            let date = new Date(value*1000)

            const year = date.getFullYear()
            const month = ("0"+ (date.getMonth() + 1)).slice(-2);
            const day = ("0"+ date.getDate()).slice(-2);
            const time = date.getHours()
            const minutes = date.getMinutes()

            return year + '-'
            + month + '-'
            + day + ' '
            + time + ':'
            + minutes
        },

        // ランダムIDのセット
        createRandomId() {
            return Math.random().toString(32).substring(2)
        },

        // ページ遷移
        pageMove(page) {
            this.$router.push(page, () => {})
        },
        
        // 配列・オブジェクト変換
        convertObject(value) {
            return Object.entries(value)
        },
        convertArray(value) {
            return Object.fromEntries(value)
        }
    }
}