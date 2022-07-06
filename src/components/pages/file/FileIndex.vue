<template>
    <div class="body">
        <Header :parents="parents"/>
        <div class="main">
            <div
                class="file-contents"
            >
                <MessageViewer :params="params" />
                <FileList
                    :params="params"
                    v-if="params.mode == 'list'"
                />
                <FileTrashboxList
                    :params="params"
                    v-if="params.mode == 'trashbox'"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import FileList from '@/components/pages/file/FileList.vue'
import FileTrashboxList from '@/components/pages/file/FileTrashboxList.vue'
import MessageViewer from '@/components/common/MessageViewer.vue'
import myMixin from './file'

export default {
    components: {
        Header,
        FileList,
        FileTrashboxList,
        MessageViewer
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
            filter_items: [],
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
    min-height: calc(100vh - 70px);
    padding: 24px;
    box-sizing: border-box;
    position: relative;
}
.file-contents.dragging::before {
    content: "";
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 10;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
.dragging-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
    pointer-events: none;
    z-index: 10;
}

</style>