/**
 * Created by litao on 2018/11/29.
 */
export default {
    data (){
        return {
            queryParams: {},
            submitParams: {}
        }
    },

    methods: {
        /**
         * 设置提交携带的参数
         * @param params
         */
        setSubmitParams (params){
            this.$set(this, 'submitParams', params);

            return this;
        },

        /**
         * 设置查询携带的参数
         * @param params
         */
        setQueryParams (params){
            this.$set(this, 'queryParams', params);
        }
    }
}