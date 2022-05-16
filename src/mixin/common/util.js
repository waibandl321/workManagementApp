export default {
    data: () => ({
        
    }),

    methods: {
        // 日時取得と出力形式整形
        getCurrentUnixtime() {
            var a = new Date().getTime();
            var b = Math.floor( a / 1000 );
            return b
        },
        convertDatetimeFromUnixtime(value, format) {
            let date = new Date(value*1000)
            let fm = format

            const year = date.getFullYear()
            const month = ("0"+ (date.getMonth() + 1)).slice(-2);
            const day = ("0"+ date.getDate()).slice(-2);
            const time = date.getHours()
            const minutes = date.getMinutes()

            return fm.replace("yyyy", year)
                    .replace("mm", month)
                    .replace("dd", day)
                    .replace("hh", time)
                    .replace("mm", minutes)
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
        },

        // ファイルサイズ変換
        convertUnitSize(byte) {
            let target = null
            let unit = 'B'
            const KB = 1024
            const MB = Math.pow(KB, 2)
            const GB = Math.pow(KB, 3)

            if( byte >= KB ) {
                target = KB
                unit = 'KB'
            }
            if( byte >= MB ) {
                target = MB
                unit = 'MB'
            }
            if( byte >= GB ) {
                target = GB
                unit = 'KB'
            }
            return `${convertSize(target, byte)} ${unit}`

            function convertSize(target, byte) {
                let size = null
                if( target ) {
                    size =  Math.round( (byte / target) * 10 ) / 10
                } else {
                    size = byte
                }
                return size
            }
        }
    }
}