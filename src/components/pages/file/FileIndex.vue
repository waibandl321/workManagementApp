<template>
    <div class="body">
        <Header :parents="parents"/>
        <div class="main file-contents">
            <MessageViewer :params="params" />
            <FileList
                :params="params"
                v-if="params.mode == 'list'"
            />
            <FileAdd :params="params"/>
        </div>
        <ExecLoading v-if="params.loading" />
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import FileList from '@/components/pages/file/FileList.vue'
import FileAdd from './FileAdd.vue'
import MessageViewer from '@/components/common/MessageViewer.vue'
import ExecLoading from '@/components/common/ExecLoading.vue'
import myMixin from './file'

export default {
    components: {
        Header,
        FileList,
        FileAdd,
        MessageViewer,
        ExecLoading,
    },
    mixins: [myMixin],
    data: () => ({
        parents: {
            user_info: {}
        },
        params: {
            success: "",
            error: "",
            loading: false,
            mode: 'list',
            files: [],
            now_dir: "0",
        },
    }),
    created() {
        this.parents.user_info = this.storeGetAccountInfo()
    },
    methods: {
        
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
.file-contents {
    height: calc(100vh - 160px);
    padding: 24px;
    box-sizing: border-box;
    position: relative;
}
.loading-overlay {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,.5);
}
</style>