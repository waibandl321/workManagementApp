<template>
    <div class="body">
        <Header :parents="parents"/>
        <div class="main">
            <!-- ドラッグ&ドロップ対応 -->
            <div
                class="file-contents"
            >
                <MessageViewer :params="params" />
                <!-- アイテムリスト -->
                <FileList
                    :params="params"
                    v-if="params.mode == 'list'"
                />
                <!-- ゴミ箱中身 -->
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
            file_data: [
                // // 最上階層ディレクトリの想定
                // {
                //     "id": "vhadfg7asdvfsyg",
                //     "uid": "mqjDRiPUTySp5rAgidw1bfd68tq1",
                //     "type": 0, // 0:ディレクトリ, 1:ファイル
                //     "name": "ディレクトリ第1階層",
                //     "size": "", //単位:バイト
                //     "upload_at": 1651817938, // unixtime
                //     "delete": 0, //0:アクティブ, 1:ゴミ箱
                //     "parent_dir_id": "0",
                // },
                // // ↑親ディレクトリが存在する場合の想定
                // {
                //     "id": "vhadfg7asd637w",
                //     "uid": "mqjDRiPUTySp5rAgidw1bfd68tq1",
                //     "type": 0,
                //     "name": "ディレクトリ第2階層",
                //     "size": "",
                //     "upload_at": 1651817938,
                //     "delete": 0,
                //     "parent_dir_id": "vhadfg7asdvfsyg",
                // },
                // // ディレクトリに属さないファイル
                // {
                //     "id": "vsbhgrf63g7y",
                //     "uid": "mqjDRiPUTySp5rAgidw1bfd68tq1",
                //     "type": 1,
                //     "name": "file.jpg",
                //     "size": 2289, 
                //     "upload_at": 1651817938,
                //     "delete": 0,
                //     "parent_dir_id": "0",
                // },
                // {
                //     "id": "csdycg8bbbb",
                //     "uid": "mqjDRiPUTySp5rAgidw1bfd68tq1",
                //     "type": 1,
                //     "name": "file1.jpg",
                //     "size": 2289, 
                //     "upload_at": 1651817938,
                //     "delete": 0,
                //     "parent_dir_id": "vhadfg7asdvfsyg",
                // },
                // // 親ディレクトリを持つファイル
                // {
                //     "id": "457ebvifve8y",
                //     "uid": "mqjDRiPUTySp5rAgidw1bfd68tq1",
                //     "type": 1,
                //     "name": "file2.jpg",
                //     "size": 2289,
                //     "upload_at": 1651817938,
                //     "delete": 0,
                //     "parent_dir_id": "vhadfg7asd637w",
                // }
            ],
        },
        now_dir: "0",
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