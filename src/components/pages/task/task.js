export default {
  methods: {
    // サブタスク一覧取得
    async getSubtaskList(task_viewer) {
      if (task_viewer.task_id) {
        let result = await this.firebaseGetSubtaskList();
        if (!result) return [];
        result = Object.keys(result)
          .map((key) => {
            return result[key];
          })
          .filter((v) => v.task_id === task_viewer.task_id);

        return result;
      }
    },
    // 戻り値：タスク期日 - タスク作成日
    convertTaskPeriod(begin, end) {
      if (!end) {
        return "未設定";
      }
      const _begin = Number(this.toDatetime(begin, "yyyymmdd")),
        _end = Number(this.toDatetime(end, "yyyymmdd"));
      return _end - _begin + 1 + "日間";
    },
  },
};
