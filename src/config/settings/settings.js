export default {
    data: () => ({
        status_filter_items: [
            { text: "全てのタスク", value: 1 },
            { text: "有効なタスク", value: 2 },
            { text: "未着手のタスク", value: 3 },
            { text: "処理中のタスク", value: 4 },
            { text: "社内確認待ちタスク", value: 5 },
            { text: "期限切れタスク", value: 6 },
            { text: "完了したタスク", value: 7 },
        ],
    }),
}