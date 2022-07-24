<template>
  <div class="subtask_list" v-if="params.subtask_list">
    <v-card-actions class="px-0">
      <p class="font-weight-bold my-0">■ サブタスク</p>
      <v-spacer />
        <v-btn
          text
          color="primary"
          @click="clickSubtaskNew()"
          data-test-id="subtaskCreateButton"
        >
          <v-icon >mdi-plus</v-icon>
          サブタスクを追加
      </v-btn>
    </v-card-actions>
    <v-divider />
    <div class="mt-4">
      <div
        v-if="!params.subtask_list.length"
        data-test-id="noSubtask"
      >
        サブタスクはありません
      </div>
      <div
        v-for="(subtask, index) in params.subtask_list"
        :key="index"
        class="subtask-card__wrap"
        data-test-id="subtaskList"
      >
        <div class="subtask-card__icon">
          <v-icon large>mdi-subdirectory-arrow-right</v-icon>
        </div>
        <v-card
          @click="clickSubtaskRecord(subtask)"
          class="subtask-card__body"
          hove
          data-test-id="subtaskCard"                    
        >
          <v-card-actions class="justify-space-between px-4">
            <span data-test-id="subtaskName">{{ subtask.subtask_name ? subtask.subtask_name : '' }}</span>
            <span>
              <v-btn 
                fab
                small
                class="mr-2"
                @click.stop="updateSubtask(subtask, true)"
                :color="subtask.finished_at ? 'primary' : null"
                data-test-id="subtaskCheckButton"
              >
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
              <v-btn
                @click.stop="deleteSubtask(subtask)"
                fab
                small
                data-test-id="subtaskDeleteButton"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </span>
          </v-card-actions>
        </v-card>
      </div>
    </div>
</div>
</template>

<script>
import myMixin from "../task.js"
export default {
  name: "TaskDeadlineAlert",
  props: {
    params: Object,
    clickSubtaskNew: Function,
    clickSubtaskRecord: Function,
  },
  mixins: [myMixin],
  data: () => ({}),
  methods: {
    // サブタスク更新
    async updateSubtask(subtask, is_finished_flag) {
      if(is_finished_flag) {
        if(!subtask.finished_at) {
          subtask.finished_at = this.getCurrentUnixtime()
        } else {
          return; //MEMO: finishedの場合は何もしない
        }
      }
      const result = await this.firebaseUpdateSubtask(subtask)
      if(result) {
        this.params.success = "サブタスクを更新しました。"
      } else {
        this.params.error = "サブタスクの更新に失敗しました。"
      }
      this.params.subtask_editor = {};
      this.subtask_option = []
      this.params.subtask_list = await this.getSubtaskList(this.params.viewer);
      this.subtask_mode = "task";
    },
    // サブタスク削除
    async deleteSubtask(subtask) {
      const result = await this.firebaseDeleteSubtask(subtask);
      if(result) {
          this.params.success = "サブタスクを削除しました。"
      } else {
          this.params.error = "サブタスクの削除に失敗しました。"
      }
      this.params.subtask_list = await this.getSubtaskList(this.params.viewer);
    },
  }
}
</script>

<style>
.subtask-card__wrap {
    display: flex;
    align-items: center;
}
.subtask-card__icon {
    width: 40px;
    text-align: center;
}
.subtask-card__body {
    width: calc(100% - 40px);
    margin-top: 8px;
}
</style>