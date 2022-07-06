export default {
    created() {

    },
    methods: {
        async readShareFiles(select_dir_id) {
            let result = []
            try {
                const files = await this.firebaseReadShareFiles()
                if(!files) return []
                this.params.file_data = files
                this.params.now_dir = "0"
                if(select_dir_id) {
                    this.params.now_dir = select_dir_id
                    _matchParentDirectory(files, select_dir_id)
                } else {
                    _matchParentDirectory(files, "0")
                }
                this.params.filter_items = result
                
            } catch (error) {
                console.log(error);
            }

            // 親ディレクトリに一致するファイルデータを返す
            function _matchParentDirectory(files, dir_id) {
                Object.keys(files).forEach((key) =>  {
                    if(files[key].parent_dir_id == dir_id) {
                        result.push(files[key])
                    }
                });
            }
        },
    }
}