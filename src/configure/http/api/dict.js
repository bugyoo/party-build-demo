/**
 * Created by litao on 2018/10/8.
 */
export default (http) => {
    return {
        /**
         * 查询字典列表
         * @param data
         * @return {*}
         */
        queryDictList(data) {
            return http.json({
                url: '/api/dict/query',
                data
            })
        },

        /**
         * 获取字典详情
         * @param data
         * @return {*}
         */
        getDictInfo(data) {
            return http.json({
                url: `/api/dict/getOne`,
                data
            })
        },


        /**
         * 保存字典信息
         * @param data
         * @return {*}
         */
        saveDictInfo(data) {
            return http.json({
                url: '/api/dict/save',
                data
            })
        },

        /**
         * 删除字典
         * @param data
         * @return {*}
         */
        removeDict(data) {
            return http.json({
                url: '/api/dict/delete',
                data
            })
        },

        /**
         * 查询子节点
         * @param data
         */
        queryChildren (data){
            return http.json({
                url: '/api/dict/queryChildren',
                data
            })
        }
    }
}
