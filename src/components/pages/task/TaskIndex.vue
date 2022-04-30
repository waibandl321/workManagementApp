<template>
    <div class="body">
        <Header
            :parents="parents"
        />
        <div class="main">
            <Task />
        </div>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import Task from './Task.vue'
export default {
    components: {
        Header,
        Task,
    },
    data: () => ({
        parents: {
            user_info: {}
        }
    }),
    created() {
        this.init()
    },
    methods: {
        init() {
            this.parents.user_info = this.storeGetAccountInfo()
        }
    }
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