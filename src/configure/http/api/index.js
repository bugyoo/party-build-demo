export default function (http) {
    return {

        queryByPage(data) {
            return http.json({
                url: `/index/query?pageNum=${data.pageNum -1}&pageSize=${data.pageSize}`,
                data
            });
        },

        queryTotalInfo (data){

            return http.json({
                url: '/index/queryInfo',
                data
            });
        }
    }
}
