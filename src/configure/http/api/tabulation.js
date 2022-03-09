export default function (http) {
    return {
        //查询表格
        queryByPage(data) {
            return http.json({
                url: '/api/tabulation/list',
                data
            });
        },

        queryTotalInfo (data){
            return http.json({
                url: '/index/queryInfo',
                data
            });
        },
        //删除
        delete(data){
            return http.json({
                url: '/api/tabulation/delete',
                data
            });
        }
    }
}
