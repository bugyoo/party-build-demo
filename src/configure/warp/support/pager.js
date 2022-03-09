export default {
    methods: {
        getQueryPageParam (pageNum, pageSize){
            if(this.searchConditionChange){
                pageNum = 1;
                pageSize = this.page.pageSize || 11;

                this.$set(this.page, 'pageNum', pageNum);
                this.$set(this.page, 'pageSize', pageSize);

                this.searchConditionChange = false;
            }else{
                pageNum = pageNum || this.page.pageNum;
                pageSize = pageSize || this.page.pageSize;
            }

            return { pageNum: pageNum - 1, pageSize };
        },

        getQueryPageResponse (response){
            return response || {};
        },

        initPageInfo(response) {
            this.$set(this, 'page', {
                list: response.datalist,
                total: response.totalelements,
                pageSize: response.pagesize,
                pageNum: response.pagenum + 1
            });
        }
    }
}
