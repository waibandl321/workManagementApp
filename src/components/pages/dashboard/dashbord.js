export default {
    data: () => ({

    }),
    methods: {
        async getTaskList() {
            let result = await this.apiGetTaskList()
            console.log(result);
        }
    }
}