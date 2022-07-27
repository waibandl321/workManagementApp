<template>
  <div class="py-2 d-flex align-center">
    <div class="font-weight-bold">■ タスク期日</div>
    <div class="ml-4 relative">
      <v-btn
        @click="termSetting = !termSetting" 
        color="red darken-3"
        fab
        class="mr-2 white--text"
        small
        data-test-id="taskDeadlineOpen"
      >
        <v-icon>mdi-calendar-check-outline</v-icon>
      </v-btn>
      <span
        class="ml-2"
        style="color: #C62828; font-size: 14px;"
        data-test-id="taskDeadlineText"
      >
        {{ this.convertDatetimeFromUnixtime(params.viewer.task_deadline, "yyyy-mm-dd") }}
      </span>
      <!-- date picker -->
      <div class="date_picker" v-if="termSetting">
        <v-text-field
          v-model="task_deadline"
          label="日付を選択"
          prepend-icon="mdi-calendar"
          readonly
          data-test-id="taskDeadlineValue"
        ></v-text-field>
        <div>
          <v-date-picker
            v-model="task_deadline"
            no-title
            color="primary"
            data-test-id="taskDeadlinePicker"
          ></v-date-picker>
        </div>
        <v-divider />
        <div class="mt-2">
          <v-btn
            text
            color="primary"
            @click="updateTaskTerm()"
            data-test-id="taskDeadlineSave"
          >
            保存
          </v-btn>
          <v-btn
            text
            @click="task_deadline = [], termSetting = false"
            data-test-id="taskDeadlineCancel"
          >
            キャンセル
          </v-btn>
          <v-btn
            text
            color="red"
            @click="deleteTaskTerm()"
            data-test-id="taskDeadlineDelete"
          >
            日付を消去
          </v-btn>
        </div>
      </div>
    </div>
    <v-spacer />
    <div class="fs-sm" data-test-id="taskCreatedText">
      タスク作成日: {{ convertDatetimeFromUnixtime(params.viewer.created, "yyyy-mm-dd") }}
    </div>
    <div class="ml-4 fs-sm" data-test-id="taskTermText">
      タスク実施期間：{{ convertTaskPeriod(params.viewer.created, params.viewer.task_deadline) }}
    </div>
    <div class="ml-4 fs-sm" data-test-id="taskDaysLeft">
      期日までの残り日数：{{ convertRemainingDays(params.viewer.task_deadline) }}
    </div>
</div>
</template>

<script>
import myMixin from "../task.js"

export default {
  name: "TaskTerm",
  props: {
    params: Object,
  },
  mixins: [myMixin],
  data: () => ({
    termSetting: false,
    task_deadline: null,
  }),
  methods: {
    deleteTaskTerm() {
      this.task_deadline = null;
      this.termSetting = false;
      this.firebaseUpdateTaskDeadline(
        this.task_deadline,
        this.params.viewer.task_id
      )
      this.params.viewer.task_deadline = null;
    },
    async updateTaskTerm() {
        const deadline = this.convertUnixtimeFromDate(this.task_deadline)
        if(deadline === this.params.viewer.task_deadline){
            this.termSetting = false;
            return;
        }
        const result = await this.firebaseUpdateTaskDeadline(
          deadline,
          this.params.viewer.task_id
        )
        if(result) {
            this.params.viewer.task_deadline = deadline;
            this.params.success = "タスク期日を変更しました";
        }
        this.task_deadline = null;
        this.termSetting = false;
    },
  }
}
</script>
<style scoped>
.relative {
    position: relative;
}
.date_picker {
    position: absolute;
    box-shadow: 0px 2px 8px #00000029;
    padding: 0.5rem 1rem;
    background-color: #fff;
    z-index: 2;
}
.date_picker {
    left: 0;
    top: 100%;
}
</style>