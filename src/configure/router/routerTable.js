/**
 * Created by litao on 2018/10/25.
 */
export default function (redirect) {

    const load = require('./import/_import_' + process.env.NODE_ENV);

    return {
        other: [
            {
                name: 'error',
                path: '/error/:errorPageRoute?',
                props: true,
                component: load('views/error/index'),
                meta: {permissionCode: '*'}
            },
            {
                name: 'noAuthority',
                path: '/authority/401',
                props: true,
                component: load('views/error/no-authority'),
                meta: {permissionCode: '*'}
            }
        ],
        permission: [
            {
                name: '/',
                path: '/',
                component: load('views/layout/index'),
                redirect,
                children: [
                    {
                        name: 'index',
                        path: 'index',
                        component: load('views/index/index'),
                        meta: {title: '首页', permissionCode: 'index', icon: 'icon-zhuye',keepFlag:true}
                    },
                    {
                        name: 'system',
                        path: 'system',
                        component: load('views/system/index'),
                        meta: {title: '系统设置', permissionCode: 'system', icon: 'icon-zhuye'},
                        redirect,
                        children: [
                            {
                                name: 'dict',
                                path: 'dict',
                                component: load('views/system/dict/index'),
                                meta: {title: '字典管理', permissionCode: 'dict', icon: 'icon-zhuye'},
                            }
                        ]
                    },
                    {
                        name: 'help',
                        path: 'http://www.baidu.com',
                        meta: {title: '外部链接', permissionCode: 'help', icon: 'icon-zhuye'}
                    },
                    {
                        name: 'tabulation',
                        path: 'tabulation',
                        component: load('views/tabulation/index'),
                        meta: {title: '表格管理', permissionCode: 'tabulation', icon: 'icon-zhuye'},
                        redirect,
                        children: [
                            {
                                name: 'sheet',
                                path: 'sheet',
                                component: load('views/tabulation/list/index'),
                                meta: {title: '表格管理', permissionCode: 'sheet', icon: 'icon-zhuye'},
                            }
                        ]
                    },
                ]
            }
        ]
    }
}
