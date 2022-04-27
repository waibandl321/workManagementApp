<template>
    <div class="body">
        <Header />
        <div class="main">
            <div class="pa-6">
                <DashboadTask />
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import DashboadTask from './DashboadTask.vue'
export default {
    components: {
        Header,
        DashboadTask
    },
    data: () => ({}),
    created() {},
    computed: {},
    methods: {},
}
</script>
<style scoped>
.body {
  width: 100%;
}
.header {
  border-bottom: 1px solid #ccc;
  height: 70px;
  line-height: 70px;
  padding: 0 16px;
}
</style>