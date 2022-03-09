/**
 * Created by litao on 2018/10/25.
 */
export default function (context, router, to, from, next) {
    let $vm = context.$vue.prototype ;
    let $store = context.$store ;
    let $api = $vm.$api ;

    // 全局默认的配置
    if( !window.globalConfig ){
        $api('user', 'getConfigure').then(({ data }) => {
            // 默认的logo地址
            data.logo = data.logo || '/static/logo/logo.png'
            if( data.title ){
                document.title = data.title ;
            }
            window.globalConfig = data
            console.log('全局配置->'+JSON.stringify(data))
            $store.commit('SET_OTHER_INFO', {
                key: 'frontConfig',
                value: data || {}
            });
        }).then(()=>{
            toNextRoute( context, router, to, from, next )
        })
    }else{
        console.log("跳转路由->"+JSON.stringify(to.meta))
        toNextRoute( context, router, to, from, next )
    }
}

function toNextRoute(context, router, to, from, next){
    let whitePermissionCodeList = ['index'],
        $vm = context.$vue.prototype,
        $api = $vm.$api,
        $store = context.$store,
        isLogin = context.utils.objectNotEmp($store.getters.userInfo);

    if(to.meta && to.meta.permissionCode === '*'){
        next();
    }else{
        if(isLogin){
            next();
        }else{
            let maskId = $vm.$openMask(document.body, '正在加载配置...');
            //设置全局配置
            let data = window.globalConfig
            let { loginUrl, logoutUrl } = data || {};
            localStorage.setItem('loginUrl' , loginUrl ) ;
            //必须配置登录/登出路径
            if(loginUrl && logoutUrl){
                //关闭全部遮罩
                $vm.$closeAllMask();
                maskId = $vm.$openMask(document.body, '正在获取用户...');
                //获取用户信息
                $api('user', 'getCurrentUser').then(({ data }) => {
                    if( data && data.id ){
                        console.log("userSource->"+data.userSource)
                        // 设置用户来源
                        localStorage.setItem('userSource' , data.userSource ) ;

                        $store.commit('SAVE_USER', data);

                        loadSourceByRole(data);

                        $vm.$busListener('router.permission.reload', () => loadSourceByRole(data, false));
                    }else{
                        maskId && $vm.$closeMask(maskId);
                        next({ name: 'noAuthority' });
                    }
                }, error => requestErrorHandler(error, '获取当前用户失败，请稍后重试！'));
            }else{
                requestErrorHandler(data, '服务器未配置登录/登出路径，请检查！');
            }


            function loadSourceByRole (userInfo, addRouter = true){
                let navigateFileName = 'navigate';

                let serverMenus = require('../http/mock/response/sys/resource/' + navigateFileName).default || [];

                if(serverMenus && serverMenus.length > 0){
                    let permissionMenus = $store.getters.menuInfo.permissionMenus || [];
                    let otherMenus = $store.getters.menuInfo.otherMenus || [];

                    if(permissionMenus.length > 0){
                        let permissionMap = {}, indexMap = {};

                        serverMenus.forEach((item, index) => {
                            permissionMap[item.code] = item;
                            indexMap[item.code] = index;
                        });

                        let menuMap = {};

                        treeToList(permissionMenus.find(item => item.children && item.children.length > 0).children);

                        function treeToList(source) {
                            (source || []).forEach(item => {
                                if(item.name){
                                    menuMap[item.name] = item;

                                    if(item.children && item.children.length > 0){
                                        treeToList(item.children);
                                    }
                                }
                            });
                        }

                        permissionMenus[0].children = menuMerge(serverMenus);

                        function menuMerge(source) {
                            return (source || []).map(item => {
                                let mapResult = menuMap[item.code];
                                let result = Object.assign({}, item, mapResult, { children: item.children });

                                if(mapResult){
                                    result.meta = result.meta || {};
                                    result.meta.icon = item.iconSkin || result.meta.icon;
                                    result.meta.title = item.name;
                                    if(result.children && result.children.length > 0){
                                        result.children = menuMerge(result.children);
                                    }else{
                                        if(mapResult.children && mapResult.children.length > 0){
                                            result.children = mapResult.children.filter(cit => cit.meta && (whitePermissionCodeList.includes(cit.meta.permissionCode) || cit.meta.permissionCode === item.code));
                                        }
                                    }

                                    return result;
                                }
                            }).filter(item => item);
                        }

                        $store.commit('UPDATE_MENU', {
                            field: 'successMenus',
                            value: otherMenus.concat(permissionMenus)
                        });

                        addRouter && router.addRoutes(permissionMenus);
                    }
                }else{
                    $vm.$error('您没有系统权限！');
                    return;
                }

                $store.commit('UPDATE_MENU', {
                    field: 'serverMenus',
                    value: serverMenus
                });

                $vm.$closeMask(maskId);

                next(to);
            }
        }

    }
}
