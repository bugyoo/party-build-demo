/**
 * Created by litao on 2018/10/23.
 */
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui';
import EasyScroll from 'easyscroll';
import routerTable from './router/routerTable';
import routerBefore from './router/routerBefore';
import restApi from './http/restApi';
import httpMocks from './http/mock/intercept';
import scanWraps from './warp';
import UtilIndex from './util/index';
export default function (context) {
    //安装elementUI
    context.install(Element, { size: 'mini' });
    UtilIndex.install()
    setTimeout(() => {
        [
            { field: '$success', type: 'success' },
            { field: '$warn', type: 'warning' },
            { field: '$info', type: 'success' },
            { field: '$error', type: 'error' }
        ].forEach(({ field, type }) => context.$vue.prototype[field] = message => Element.Message({ message, type }));
    });

    //安装滚动条插件
    context.install(EasyScroll);

    //store
    context.$configure.set('globalStore', {
        otherInfo: {
            state: {
                otherInfo: {
                    navTopName: '', //导航栏的路径自定义展示内容
                    frontConfig: {}, //返回的前台配置
                }
            },

            mutations: {
                SET_OTHER_INFO: function (state, { key, value }) {
                    let old = Object.assign({}, state.otherInfo);
                    state.otherInfo = {};
                    state.otherInfo = Object.assign(old, { [key]: value });state.otherInfo[key] = value;
                }
            }
        }
    });

    //请求加密
    context.$configure.set('requestIsEncrypt', false);

    //内置log打印
    context.$configure.set('inlayLog', process.env.NODE_ENV !== 'production');

    //初始化全局封装
    context.$configure.set('globalWrap', scanWraps(context.utils.extractName));

    //设置http请求需要用到的httpToken的key值
    context.$configure.set('tokenKey', 'jn-rural-promote');

    //配置入口文件
    context.$configure.set('rootFileConfigure', function () {
        return {
            instance: function () {
                return require('../Root.vue').default;
            }
        }
    });

    //路由模式
    context.$configure.set('routerMode', 'history');

    //自动注册组件上下文
    context.$configure.set('componentContext', require.context('@/components/', true, /\.vue$/));

    //路由表配置
    context.$configure.set('routerTable', routerTable);

    //跳转之前的拦截
    context.$configure.set('routerBefore', routerBefore.bind(null, context));

    //http请求基础路径
    context.$configure.set('httpBaseUrl', '/__api');

    //restApi
    context.$configure.set('restApi', restApi.bind(null, context));

    //是否启用mock
    context.$configure.set('mockFlag', process.env.NODE_ENV !== 'production');

    //httpMocks
    context.$configure.set('httpMocks', httpMocks);

    // 请求提交之前
    context.$configure.set('requestBeforeSend', function(config){
        // 处理不该后端返回的数据
        if( config.isJson && config.data ){
            delete config.data.createDatetime
            delete config.data.createUserId
            delete config.data.lastUpdateDatetime
            delete config.data.lastUpdateUserId
        }

    });

    //请求成功拦截
    context.$configure.set('httpSuccessHandler', function (response, cb) {
        cb(
            response.data.success === true || (
                (response.config.responseType === 'json' && response.data) ||
                response.headers['content-type'] === 'application/octet-stream'
            )
        );
    });

    //请求异常拦截
    context.$configure.set('httpErrorHandler', function (error, cb) {
        if(error.response && error.response.status === 401){
            // context.$rootInstance.$jump("/login");

            let { loginUrl } = context.$store.getters.otherInfo.frontConfig;

          //  window.location.href = context.$configure.get('httpBaseUrl') + (
          //      loginUrl.startsWith('/') ? loginUrl : '/' + loginUrl
          //  );
            window.location.href = loginUrl;
        }else if(error.response && error.response.status === 403){
            context.$rootInstance.$jump({ name: 'noAuthority' });
        }else{
            cb();
        }
    });
}
