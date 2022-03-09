/**
 * Created by litao on 2018/10/15.
 */
export default (http) => {
    return {
        /**
         * 获取配置
         * @return {*}
         */
        getConfigure (){
            return http.json({
                url: '/api/user/configure'
            });
        },

        /**
         * 获取当前登录用户
         * @return {*}
         */
        getCurrentUser (){
            return http.json({
                url: '/api/user/info'
            });
        },

        /**
         * 退出登录
         * @returns {*}
         */
        logout (){
            return http.json({
                url: '/logout'
            });
        }
    }
}
