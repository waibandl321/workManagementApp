import config from '@/config/settings/common.js'
export default {
    data: () => ({
        
    }),
    methods: {
        // アラート
        openAlert(message) {
            alert(message)
        },
        // ページタイトル設定
        getServiceBasetitle() {
            return config.basetitle;
        },
        getRoutetitle() {
            return this.$route.meta.title;
        },
        setRoutetitle() {
            const result = this.getRoutetitle()
            document.title = (result + this.getServiceBasetitle())
        },
        copyJson(value) {
            return JSON.parse(JSON.stringify(value))
        },
        // 日時取得(Unixtime形式)
        nowUnix() {
            var a = new Date().getTime();
            var b = Math.floor( a / 1000 );
            return b
        },
        // 日付をUnixtimeに変換
        convertUnixtimeFromDate(value) {
            const a = new Date(value).getTime();
            var b = Math.floor( a / 1000 );
            return b
        },
        // Unixtimeをformat(ex. yyyy/mm/dd)に変換
        toDatetime(value, format) {
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
        },
        // 厳密な拡張子チェック(ファイルデータ改ざん対応) 
        async judgeBinaryFileType(file) {
            let result = null;
            const file_reader = new FileReader();
            file_reader.readAsArrayBuffer(...file);
            return new Promise((resolve, reject) => {
                file_reader.onload = function(event) {
                    let headerStr = "";
                    let headerHex = "";
                    const unit_8_array = new Uint8Array(event.target.result);
                    for (let i = 0; i < 10; i++) {
                        headerHex += unit_8_array[i].toString(16);
                        headerStr += String.fromCharCode(unit_8_array[i]);
                    }

                    if (headerHex.indexOf("ffd8") !== -1) { // jpg, jpeg
                        result = true;
                    } else if (headerStr.indexOf("PNG") != -1) { // png
                        result = true;
                    } else if (headerStr.indexOf("GIF") != -1) { // gif
                        result = true;
                    } else if (headerStr.indexOf("PDF") != -1) { // pdf
                        result = true;
                    } else {
                        result = false;
                    }
                    console.log("file upload result=" + result + " binary headerStr=" + headerStr + " binary headerHex=" + headerHex);
                    resolve(result);
                }, function(err) {
                    reject(err)
                }
            })
        },
    }
}