<template>
  <v-alert
      v-if="judgeRemainingDays(params.viewer.task_deadline) <= 0"
      type="error"
      color="red darken-3"
      data-test-id="alertDeadline"
  >
      {{ outputTaskAlert() }}
  </v-alert>
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
  methods: {}
}
</script>