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
        formatSize(byte) {
            const base = 1024;
            let res = ''
            res = Math.ceil(byte / base)
            return res + 'KB';
        },
        createRandomId() {
            return Math.random().toString(32).substring(2)
        }
    }
}