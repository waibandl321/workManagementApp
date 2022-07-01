export default {
    data: () => ({
        
    }),

    methods: {
        copyJson(value) {
            return JSON.parse(JSON.stringify(value))
        },
        // 日時取得と出力形式整形
        getCurrentUnixtime() {
            var a = new Date().getTime();
            var b = Math.floor( a / 1000 );
            return b
        },
        convertUnixtimeFromDate(value) {
            const a = new Date(value).getTime();
            var b = Math.floor( a / 1000 );
            return b
        },
        convertDatetimeFromUnixtime(value, format) {
            if(!value) {
                return "未設定"
            }
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
        // 現在から7日後の日付を取得（本日を含むので実質8日計算）
        getUnixtimeAfter7Days() {
            let date_obj = new Date();
            date_obj.setDate(date_obj.getDate() + 8)
            return date_obj.getFullYear() 
                    + ""
                    + ("0" + (date_obj.getMonth() + 1)).slice(-2)
                    + ""
                    + ("0" + date_obj.getDate()).slice(-2);
        },
        // 現在から7日前の日付を取得（本日を含むので実質8日計算）
        getUnixtimeBefore7Days() {
            let date_obj = new Date();
            date_obj.setDate(date_obj.getDate() - 8)
            return date_obj.getFullYear() 
                    + ""
                    + ("0" + (date_obj.getMonth() + 1)).slice(-2)
                    + ""
                    + ("0" + date_obj.getDate()).slice(-2);
        },
        // 現在から1ヶ月後の日付を取得
        getUnixtimeAfterOneMonth() {
            let date_obj = new Date();
            date_obj.setMonth(date_obj.getMonth() + 1);
            return date_obj.getFullYear() 
                    + ""
                    + ("0" + (date_obj.getMonth() + 1)).slice(-2)
                    + ""
                    + ("0" + date_obj.getDate()).slice(-2);
        },
        // 現在から1ヶ月前の日付を取得
        getUnixtimeBeforeOneMonth() {
            let date_obj = new Date();
            date_obj.setMonth(date_obj.getMonth() - 1);
            return date_obj.getFullYear() 
                    + ""
                    + ("0" + (date_obj.getMonth() + 1)).slice(-2)
                    + ""
                    + ("0" + date_obj.getDate()).slice(-2);
        },
        // ランダムIDのセット
        createRandomId() {
            return Math.random().toString(32).substring(2)
        },

        // ページ遷移
        pageMove(page) {
            this.$router.push(page, () => {})
        },

        // サインインに遷移
        redirectSignin() {
            window.location = "/auth/signout";
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