<template>
    <div class="root-layout-wrap">
        <div v-show="showLayout" class="head-wrap">
            <div class="log-wrap" @click="$jump('/index')">
                <img :src="logoUrl"/>
                <span>DEMO-PC</span>
            </div>

            <div class="right-wrap">
                <div>
                    <img :src="currentUserImage"/>
                    <div class="info">
                        <p>{{ currentUserName }}</p>
                    </div>
                </div>


                <!--<div class="logout-wrap">
                    <ev-iconFont icon="icon-tuichu" @click.native="logoutHandler"></ev-iconFont>
                </div>-->
            </div>
        </div>

        <div v-if="showLayout" class="content-wrap" :style="{ height: rootContentWrapHeight }">
            <div
                    class="left-menu-wrap"
                    v-if="!isLivePage"
                    :style="{width: `${menuCollapse ? '55px' : '200px' }`}"
            >
                <el-menu :default-active="currentActiveMenuCode" :collapse="menuCollapse" unique-opened>
                    <template v-for="(item, index) in firstMenus">
                        <el-submenu v-if="item.children && item.children.length > 0" :index="item.name">
                            <template slot="title">
                                <ev-iconFont :icon="(item.meta || []).icon"></ev-iconFont>
                                <span>{{ ((item.meta || {}).title) }}</span>
                            </template>

                            <template v-for="(child, childIndex) in item.children">
                                <template
                                        v-if="child.children && child.children.length > 0 && child.children.filter(it => !it.meta.hidden).length > 0"
                                >
                                    <el-submenu :index="child.name">
                                        <span slot="title">{{((child.meta || {}).title)}}</span>

                                        <el-menu-item
                                                v-for="(_child, _childIndex) in child.children"
                                                :key="_childIndex"
                                                :index="_child.name"
                                                @click="$jump({ name: _child.name })"
                                        >{{ ((_child.meta || {}).title) }}
                                        </el-menu-item>
                                    </el-submenu>
                                </template>

                                <template v-else>
                                    <el-menu-item
                                            :index="child.name"
                                            @click="$jump({ name: child.name })"
                                    ><ev-iconFont :icon="(child.meta || []).icon"></ev-iconFont>
                                        {{ ((child.meta || {}).title) }}
                                    </el-menu-item>
                                </template>
                            </template>
                        </el-submenu>
                        <el-menu-item v-else :index="item.name" @click="activeMenu(item)">
                            <ev-iconFont :icon="(item.meta || []).icon"></ev-iconFont>
                            <span slot="title">{{ ((item.meta || {}).title) }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </div>

            <div
                    class="root-content-wrap"
                    :style="{ width: `calc(100% - ${!isLivePage ? (menuCollapse ? '55px' : '200px') : '0px' })`, left: `${!isLivePage ? (menuCollapse ? '55px' : '200px') : '0px' }`}"
            >
                <div class="top-path-wrap">
                    <div class="live" v-if="otherInfo.navTopName">
                        <!--                        <img src="~@/assets/index/top-item-1.svg" alt="正在进行的直播">-->
                        <span style="margin-left: 5px;">{{ otherInfo.navTopName}}</span>

                        <div class="back-wrap">
                            <el-button type="warning" class="button-wide" @click="$jump({ name: 'myLive' })">退出直播
                            </el-button>
                        </div>
                    </div>
                    <div class="path" v-else>
                        <ev-iconFont
                                icon="icon-caidanlan"
                                :class="{'collapse': menuCollapse}"
                                @click.native="menuCollapse = !menuCollapse"
                        ></ev-iconFont>
                        <!--                        <span>{{ currentPathName}}</span>-->
                        <ul class="clearFloat">
                            <li
                                    v-for="(item, index) in currentPathList"
                                    :key="index"
                                    @click="$jump({ name: item.name })"
                            >
                                <!--                                <ev-iconFont v-if="item.meta.icon" :icon="item.meta.icon"></ev-iconFont>-->
                                <span>{{ item.meta.title }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="content-wrap" ref="scrollWrapRef">
                    <router-view class="animated fadeIn"></router-view>
                </div>
            </div>
        </div>

        <router-view v-else></router-view>

        <ev-backTop :getScrollInstance="() => $getRef('scrollWrapRef')"></ev-backTop>
    </div>
</template>

<script>
    export default JBoot({
        props: {},

        data() {
            return {
                menuCollapse: false,
                showSwitchTip: true,
                currentOrg: undefined
            };
        },

        created() {
            this.setCurrentOrg(sessionStorage.getItem('$fosung-cloud-front-current-org-role-oneId'));

            this.$busListener(
                "layout.menu.collapse",
                collapse => (this.menuCollapse = collapse)
            );
        },

        computed: {
            isLivePage() {
                return this.$route.name === "liveIndex";
            },

            firstMenus() {
                let menus =
                    (this.menuInfo_successMenus || []).find(item => item.path === "/") ||
                    {};

                let firstMenus = (menus.children || []).filter(item => {
                    let meta = item.meta || {};

                    return !meta.hidden || !item.parentId || item.parentId === "0";
                });

                return firstMenus.reduce(function (result, current) {
                    let menu = Object.assign({}, current);

                    menu.children = handleMenuChild(menu.children);

                    if (menu.children && menu.children.length === 1) {
                        result.push(menu.children[0]);
                    } else {
                        result.push(menu);
                    }

                    return result;
                }, []);

                function handleMenuChild(childrenList) {
                    return childrenList
                        ? childrenList.filter(item => !(item.meta || {}).hidden)
                        : [];
                }
            },

            currentActiveMenuCode() {
                return (this.$route.meta || {}).permissionCode;
            },

            rootContentWrapHeight() {
                let headHeight = 57;

                return `calc(100% - ${headHeight}px)`;
            },

            currentUserName() {
                return this.userInfo.name || "匿名";
            },

            currentUserImage() {
                let defaultImage = require("@/assets/system/information/default-head-img-1.png");

                return this.userInfo.avatar || defaultImage;
            },

            currentPathName() {
                return this.$route.matched
                    .map(item => (item.meta || {}).title)
                    .filter(item => !!item)
                    .join(" / ");
            },

            currentPathList() {
                return this.$route.matched.filter(item => (item.meta || {}).title);
            },

            manageOrgList() {
                let orgList = (this.userInfo.roleList || []).map(item => {
                    return Object.assign({}, item, { _oneId: item.roleCode + '-' + item.orgId })
                });

                !this.otherInfo.currentActiveRoleOneId && this.setCurrentOrg((orgList[0] || {})._oneId);

                return orgList;
            },

            showLayout() {
                return !["cityMap", "villageMap"].includes(this.$route.name);
            },
            // logo访问地址
            logoUrl(){
                return this.otherInfo.frontConfig.logo
            }
        },

        mounted() {
            console.log(this.$route,'$route.meta')
            this.showSwitchTipTimeId = setTimeout(() => {
                this.showSwitchTip = false;
            }, 3000);
        },

        beforeDestroy() {
            this.showSwitchTipTimeId && clearTimeout(this.showSwitchTipTimeId);
        },

        methods: {
            activeMenu(item){
                if( item.path && item.path.toString().startsWith("http") ){
                    window.open( item.path.toString() )
                }else{
                    this.$jump({ name:item.name })
                }
            },
            checkMenuIsActive(item) {
                if (this.$route.name === item.name) {
                    return true;
                } else {
                    return !!this.$route.matched.find(c => c.name === item.name);
                }
            },

            switchMenuHandler(item) {
                if (item.name === "dataBigScreen") {
                    window.open(window.location.origin + item.path, "_blank");
                } else {
                    this.$jump({name: item.name});
                }
            },

            logoutHandler() {
                this.$isOk("退出登录", "确定要退出登录吗？").then(() => {
                    this.$api("user", "logout").then(({success}) => {
                        if (success) {
                            sessionStorage.removeItem('$fosung-cloud-front-current-org-role-oneId');
                            sessionStorage.removeItem('$fosung-cloud-front-current-org-role-code');
                            sessionStorage.removeItem("$fusong-cloud-front-current-org-id");
                            sessionStorage.removeItem("$fusong-cloud-front-current-org-code");

                            setTimeout(() => {
                                let {logoutUrl} = this.otherInfo.frontConfig;

                                // window.location.href = logoutUrl + '?redirect_uri=' + window.location.origin;
                                window.location.href = logoutUrl;
                            });
                        }
                    });
                });
            },

            setCurrentOrg(oneId) {
                if (!oneId) {
                    return;
                }

                this.$store.commit('SET_OTHER_INFO', {
                    key: 'currentActiveRoleOneId',
                    value: oneId
                });

                sessionStorage.setItem('$fosung-cloud-front-current-org-role-oneId', oneId);

                let org = this.manageOrgList.find(item => item._oneId === oneId);

                if (org) {
                    this.$store.commit('SET_OTHER_INFO', {
                        key: 'currentRoleCode',
                        value: org.roleCode
                    });

                    this.currentOrg = org.orgName + ' - ' + org.roleName;

                    sessionStorage.setItem('$fosung-cloud-front-current-org-id', org.orgId);

                    this.$store.commit('SET_OTHER_INFO', {
                        key: 'currentOrgName',
                        value: this.currentOrg
                    });

                    this.$store.commit('SET_OTHER_INFO', {
                        key: 'currentOrgId',
                        value: org.orgId
                    });

                    let oldRoleCode = sessionStorage.getItem('$fosung-cloud-front-current-org-role-code');

                    if (!oldRoleCode || oldRoleCode !== org.roleCode) {
                        sessionStorage.setItem('$fosung-cloud-front-current-org-role-code', org.roleCode);

                        this.$busBroadcast('router.permission.reload');
                    }
                }
            },

            handleOrgSwitch(item) {
                this.setCurrentOrg(item._oneId);

                this.$jump('/');

                this.$forceUpdate();

                this.$busBroadcast('global.org.change', item.orgId);
            }
        },

        watch: {}
    }).store("userInfo", "menuInfo/successMenus", "otherInfo").build();
</script>


<style lang="scss">
    .root-layout-wrap {
        height: 100%;
        width: 100%;
        /*background-color: #EAEEF1;*/
        background-color: #fafafa;

        & > .head-wrap {
            user-select: none;
            height: 57px;
            background-size: cover;
            position: relative;
            top: 0;
            left: 0;
            background-image: url("../../assets/layout/head-back.jpg");

            & > .log-wrap {
                display: inline-block;
                position: absolute;
                left: 15px;
                cursor: pointer;

                & > img {
                    height: 60px;
                }

                & > span {
                    color: #ffffff;
                    margin-left: 5px;
                    vertical-align: text-bottom;
                    font-weight: 800;
                    display: inline-block;
                    padding-bottom: 20px;
                    padding-top: 20px;
                    font-size: 18px;
                }
            }

            & > .right-wrap {
                position: absolute;
                top: 0;
                right: 15px;
                & > div {
                    display: inline-block;
                    outline: none !important;
                    margin-top: 10px;

                    & > img {
                        width: 28px;
                        height: 28px;
                        vertical-align: middle;
                        border-radius: 50%;
                    }

                    & > .info {
                        display: inline-block;
                        vertical-align: middle;

                        & > p {
                            color: #ffffff;
                            margin-left: 5px;
                            font-size: 14px;
                            line-height: 14px;

                            &:first-child {
                                font-weight: 500;
                            }

                            &:last-child {
                                margin-top: 3px;
                                font-size: 12px;
                            }
                        }
                    }
                }


                & > .logout-wrap {
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 10px;

                    & > i {
                        color: #ffffff;
                        cursor: pointer;

                        &:hover {
                            font-weight: bold;
                        }
                    }
                }
            }
        }

        & > .two-menu-wrap {
        }

        & > .content-wrap {
            position: relative;

            & > .left-menu-wrap {
                width: 200px;
                height: 100%;
                float: left;
                box-shadow: 0 2px 4px 0 #a7a7a7;

                & > .el-menu {
                    height: 100%;
                    overflow-y: auto;
                    border-right: none;

                    &.el-menu--collapse {
                        width: 55px;
                    }

                    & > li {
                        border-bottom: 1px solid #ebeef3;

                        &.el-menu-item,
                        &.el-submenu > .el-submenu__title {
                            /*padding: 0 15px !important;*/
                            height: 50px !important;
                            line-height: 50px !important;

                            & > i {
                                margin-right: 5px;
                            }
                        }

                        & > .el-menu,
                        & > .el-menu > li > .el-menu {
                            background-color: #f5f5f5;
                            user-select: none;

                            & > .el-menu-item,
                            & > .el-submenu > .el-submenu__title {
                                user-select: none;
                                height: 40px !important;
                                line-height: 40px !important;
                                min-width: 18px;
                                /*padding: 0 10px 0 auto !important;*/
                                color: #606266;

                                &:not(:first-child) {
                                    border-top: 1px solid #e4e7ed;
                                }

                                &.is-active {
                                    color: #409eff;
                                }
                            }
                        }

                        & > .el-menu > li > .el-menu {
                            background-color: #e6e6e6;

                            & > .el-menu-item,
                            & > .el-submenu > .el-submenu__title {
                                &:not(:first-child) {
                                    border-top: 1px solid #d6d6d6;
                                }
                            }
                        }
                    }
                }
            }

            & > .root-content-wrap {
                height: 100%;
                display: inline-block;
                position: absolute;
                overflow: hidden;
                transition: left 0.2s ease-out;

                & > .top-path-wrap {
                    height: 40px;
                    background: linear-gradient(
                                    180deg,
                                    rgba(255, 255, 255, 1) 0%,
                                    rgba(255, 255, 255, 1) 0%,
                                    rgba(240, 240, 240, 1) 100%,
                                    rgba(240, 240, 240, 1) 100%
                    );
                    line-height: 40px;
                    width: 100%;
                    color: #848484;
                    border-left: 1px solid #e8e5e5;
                    box-shadow: 0 2px 4px 0 #a7a7a7;

                    & > div {
                        & > span {
                            margin-left: 3px;
                            font-size: 14px;
                        }
                    }

                    & > .live {
                        margin-left: 10px;

                        & > img {
                            width: 20px;
                            height: 20px;
                            vertical-align: text-bottom;
                        }

                        & > span {
                            display: inline-block;
                            width: calc(100% - 120px - 35px);
                        }

                        & > .back-wrap {
                            display: inline-block;
                            width: 120px;
                            text-align: center;
                        }
                    }

                    & > .path {
                        & > i {
                            margin-left: 10px;
                            cursor: pointer;
                            font-size: 14px;
                            display: inline-block;
                            transition: transform 0.3s;
                            transform: rotate(0);

                            &.collapse {
                                transform: rotate(90deg);
                            }
                        }

                        & > ul {
                            display: inline-block;
                            vertical-align: bottom;
                            margin-left: 3px;

                            & > li {
                                float: left;
                                cursor: pointer;
                                user-select: none;

                                &:not(:first-child) {
                                    &:before {
                                        content: "/";
                                        display: inline-block;
                                        margin: 0 4px;
                                    }
                                }

                                &:hover > span {
                                    color: #333333;
                                }

                                &:last-child {
                                    cursor: not-allowed;
                                    color: #bbb9b9;
                                }

                                & > i {
                                }

                                & > span {
                                    color: #848484;
                                    font-size: 14px;
                                }
                            }
                        }
                    }
                }

                & > .content-wrap {
                    padding: 8px 10px;
                    height: calc(100% - 40px - 20px);
                    width: calc(100% - 20px);
                    overflow-y: auto;
                    margin: 2px 0;

                    /* & > .animated {
                         height: 100%;
                     }*/
                }
            }
        }
    }
</style>
