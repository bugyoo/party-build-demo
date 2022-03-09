<template>
    <div class="common-layout-tab-wrap clearFloat" v-bind="$attrs" v-on="$listeners">
        <div class="top-wrap">
            <div class="title-container block-box-shadow">
                <div class="title-wrap">
                    <slot name="title">{{ title }}</slot>
                </div>

                <div class="top-right" :style="{width: topRightWidth + 'px'}">
                    <slot name="top-right" :toggleSearchMoreVisible="handleToggleSearchMoreVisible"></slot>
                </div>
            </div>

            <transition name="el-zoom-in-top">
                <div class="search-more-wrap block-box-shadow" v-show="searchMoreVisible">
                    <slot name="search-more"></slot>
                </div>
            </transition>
        </div>

        <div class="table-wrap block-box-shadow">
            <div class="table" :style="{height: `calc(100% - ${pageHeight})`}">
                <slot name="table"></slot>
            </div>

            <div class="page" :style="{height: pageHeight}">
                <slot name="page"></slot>
            </div>
        </div>

        <slot></slot>
    </div>
</template>

<script>
    export default JBoot({
        registryName: 'ListLayout',

        props: {
            title: String,

            topRightWidth: {
                type: Number,
                default (){
                    return 410
                }
            }
        },

        data() {
            return {
                searchMoreVisible: false
            }
        },

        computed: {
            pageHeight (){
                return !!this.$slots.page ? '40px' : '0px';
            }
        },

        methods: {
            handleToggleSearchMoreVisible (){
                this.searchMoreVisible = !this.searchMoreVisible;
            }
        },

        watch: {}
    }).build();
</script>

<style lang="scss">
    .common-layout-tab-wrap {
        width: 100%;
        height: 100%;
        & > div{
            width: 100%;
        }
        & > .top-wrap{
            height: 40px;
            z-index: 1;
            position: relative;
            & > .title-container{
                padding: 10px;
                background: linear-gradient(180deg, rgba(254, 254, 254, 1) 0%, rgba(254, 254, 254, 1) 0%, rgba(245, 246, 245, 1) 100%, rgba(245, 246, 245, 1) 100%);
                & > .title-wrap{
                    font-size: 14px;
                    font-weight: 500;
                    display: inline-block;
                    &:before{
                        content: '';
                        height: 13px;
                        width: 2px;
                        margin-top: 3px;
                        background-color: #CC0000;
                        display: inline-block;
                        float: left;
                        margin-right: 5px;
                    }
                }
                & > .top-right{
                    float: right;
                    margin-top: -5px;
                    text-align: right;
                    & .el-form-item{
                        margin-bottom: 0;
                        &:last-child{
                            margin-right: 0;
                        }
                        & .el-button{
                            &+.el-button{
                                margin-left: 3px;
                            }
                        }
                    }
                }
            }
            & > .search-more-wrap{
                width: 100%;
               // position: absolute;
                float:left;
                top: 40px;
                left: 0;
            }
        }
        & > .table-wrap{
            margin-top: 10px;
            overflow: hidden;
            height: calc(100% - 40px - 10px);
            & > .table{
                & .el-table.border{
                    background-color: #ffffff;
                    border: 1px solid #ececec !important;
                    & tbody > tr:last-child > td{
                        border-bottom: none;
                    }
                }
            }
            & > .page{
                text-align: right;
                margin-top: 3px;
            }
        }
    }
</style>
