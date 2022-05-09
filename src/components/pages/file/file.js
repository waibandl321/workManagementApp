export default {
    created() {

    },
    methods: {
        async readShareFiles(select_dir_id) {
            const promise = new Promise((resolve) => {
                resolve();
            });
            
            promise
            .then( async () => {
                return await this.firebaseReadShareFiles()
            })
            .then((files) => {
                this.params.file_data = files
                let result = []
                this.params.now_dir = "0"

                if(select_dir_id) {
                    this.params.now_dir = select_dir_id
                    Object.keys(files).forEach((key) =>  {
                        if(files[key].parent_dir_id == select_dir_id) {
                            result.push(files[key])
                        }
                    });
                } else {
                    Object.keys(files).forEach((key) =>  {
                        if(files[key].parent_dir_id == "0") {
                            result.push(files[key])
                        }
                    });
                }
                this.params.filter_items = result
            })
            .catch((error) => {
                console.log(error);
            })
        },
    }
}