<template>
  <v-toolbar-title class="toolbar_title px-2" data-test-id="taskDetailToolbar">
      <div
          v-if="edit_mode"
          class="taskname_edit"
      >
          <validation-observer v-slot="{ invalid }" ref="observer">
              <validation-provider
                  name="タスク名"
                  rules="required"
              >
                  <v-text-field
                      autofocus
                      hide-details
                      v-model="params.viewer.task_name"
                      outlined
                      dense
                      background-color="white"
                      data-test-id="taskNameInput"
                  ></v-text-field>
              </validation-provider>
              <v-btn
                  @click="tasknameUpdate()"
                  class="taskname_edit_save px-4"
                  :disabled="invalid"
                  data-test-id="taskNameSave"
                  color="primary"
              >
                  保存
              </v-btn>
          </validation-observer>
      </div>
      <div
          v-else
          class="d-flex align-center"
      >
          {{ params.viewer.task_name ? params.viewer.task_name : '' }}
          <v-btn
              icon
              @click="edit_mode = true"
              data-test-id="taskNameEdit"
              color="primary"
          >
              <v-icon>mdi-pencil</v-icon>
          </v-btn>
      </div>
  </v-toolbar-title>
</template>

<script>
import myMixin from "../task.js"
export default {
  name: "TaskName",
  props: {
    params: Object,
  },
  mixins: [myMixin],
  data: () => ({
    edit_mode: false,
  }),
  methods: {
    async tasknameUpdate() {
        const result = await this.firebaseUpdateTaskname(this.params.viewer.task_id, this.params.viewer.task_name)
        if(result) {
            this.edit_mode = false
            this.params.success = "タスク名を更新しました。"
        }
    },
  }
}
</script>

<style scoped>
.taskname {
    position: relative;
    width: 80%;
}
.taskname_edit {
    position: relative;
}
.taskname_edit_input {
    background-color: #fff;
    padding: 8px 72px 8px 12px;
    border: none;
    outline: none;
    font-size: 16px;
    width: 100%;
}
.taskname_edit_input:focus {
    border: none;
    outline: none;
}
.taskname_edit_save {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%!important;
}
</style>