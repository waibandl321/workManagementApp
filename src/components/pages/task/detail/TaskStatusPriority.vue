<template>
  <v-row>
    <v-col data-test-id="taskDetailStatus">
      <div class="font-weight-bold pb-4">■ ステータス</div>
      <v-select
        label="ステータス"
        :items="params.task_status_list"
        item-text="text"
        item-value="key"
        outlined
        color="primary"
        dense
        v-model="params.viewer.task_status"
        @change="updateTaskStatus()"
      ></v-select>
    </v-col>
    <v-col data-test-id="taskDetailPriority">
      <div class="font-weight-bold pb-4">■ 優先度</div>
      <v-select
        label="優先度"
        :items="params.task_priorities"
        item-text="text"
        item-value="key"
        v-model="params.viewer.task_priority"
        outlined
        color="primary"
        dense
        @change="updateTaskPriority()"                        
      ></v-select>
    </v-col>
</v-row>
</template>

<script>
import myMixin from "../task.js"
export default {
  name: "TaskDeadlineAlert",
  props: {
    params: Object,
  },
  mixins: [myMixin],
  data: () => ({}),
  methods: {
    async updateTaskStatus() {
      const result = await this.firebaseUpdateTaskStatus(this.params.viewer)
      if(result) {
          this.params.success = "タスクのステータスを変更しました。"
      }
    },
    async updateTaskPriority() {
      const result = await this.firebaseUpdateTaskPriority(
        this.params.viewer.task_id,
        this.params.viewer.task_priority
      )
      if(result) {
          this.params.success = "タスクの優先度を変更しました。"
      }
    },
  }
}
</script>