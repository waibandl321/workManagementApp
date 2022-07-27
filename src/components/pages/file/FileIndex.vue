<template>
    <div class="body">
        <Header :params="params"/>
        <div class="file-contents">
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
        this.setRoutetitle()
        this.params.user_info = this.storeGetAccountInfo()
        if(!this.params.user_info.first_name) {
            this.pageMove('/account/register')
        }
    },
    methods: {
        
    }

}
</script>
<style scoped>
.file-contents {
    height: calc(100vh - 160px);
    padding: 24px;
}
</style>