import { orderBy } from "lodash";

export default {
  methods: {
    // サブタスク一覧取得
    async getSubtaskList(task_viewer) {
      if (task_viewer.task_id) {
        let results = await this.firebaseGetSubtaskList();
        if (!results) return [];
        return orderBy(Object.keys(results)
        .map((key) => {
          return results[key];
        })
        .filter((v) => v.task_id === task_viewer.task_id), 'created', 'desc');
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
