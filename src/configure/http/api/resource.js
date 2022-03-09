/**
 * Created by litao on 2018/10/8.
 */
export default (http) => {
    return {
        /**
         * 查询菜单列表
         * @param data
         * @return {*}
         */
        queryResourceList (data) {
            return http.json({
                url: '/sys/resource/queryAll',
                data
            })
        },

        /**
         * 查询菜单列表
         * @param data
         * @return {*}
         */
        queryResourceListByRoleId (data) {
            return http.json({
                url: '/sys/resource/queryByRoleId?roleId='+data.roleId
            })
        },

        /**
         * 查询菜单详情
         * @param data
         * @return {*}
         */
        getResourceInfo (data){
            return http({
                url: `/sys/resource/get?id=${data.id}`,
                method: 'post'
            });
        },

        /**
         * 保存菜单信息
         * @param data
         * @return {*}
         */
        saveResourceInfo (data){
            return http.json({
                url: '/sys/resource/save',
                data
            });
        },

        /**
         * 删除菜单信息
         * @param data
         */
        removeResource (data){
            return http.json({
                url: '/sys/resource/delete',
                data
            });
        },

        /**
         * 查询我的资源菜单
         */
        queryMyResource (){
            return http({
                url: '/sys/resource/navigate',
                method: 'post'
            });
        }
    }
}
