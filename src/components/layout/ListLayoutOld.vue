<template>
    <div class="list">
        <div class="left" v-if="showLeftLayout" :style="computedLeftStyle">
            <slot name="left-component"></slot>
        </div>
        <div class="right" :style="computedRightStyle">
            <div  class="search white-back" :style="{
                width: showRightForm ? 'calc(100% - 370px)' : '',
                display: showRightForm ? 'inline-block' : 'block'
            }">
                <slot name="search" :toggleSearchMore="toggleSearchMore" :showSearchMore="showSearchMore"></slot>
            </div>

            <div class="list white-back" :ref="listContainerRef" :style="{
                width: showRightForm ? 'calc(100% - 359px)' : '',
                display: showRightForm ? 'inline-block' : 'block',
                height: showSearch ? 'calc(100% - 51px)' : 'calc(100% - 5px)'
            }">
                <div class="table-opinion" v-if="showTableOpinion">
                    <slot name="table-opinion"></slot>
                </div>

                <div class="table-content" :style="{
                    height: `calc(100% - ${minusHeightNumber}px)`
                }">
                    <slot name="table-list"></slot>
                </div>

                <div class="table-footer" v-if="showTableFooter">
                    <slot name="table-footer"></slot>
                </div>
            </div>

            <div class="right-form" v-if="showRightForm">
                <slot name="right-form"></slot>
            </div>

            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default JBoot({
        registryName: 'ListLayoutOld',

        props: {
            leftWidth: [ String, Number ]
        },

        data (){
            return {
                showSearchMore: false,
                listContainerRef: 'listContainerRef'
            }
        },

        computed: {
            computedLeftWidth (){
                if(this.$slots['left-component']){
                    return (parseFloat(this.leftWidth || '250px') + 10) + 'px';
                }

                return '0px';
            },

            showLeftLayout (){
                return this.$slots['left-component'];
            },

            computedLeftStyle (){
                let leftStyle = {};

                if(this.showLeftLayout){
                    leftStyle.width = `calc(${this.computedLeftWidth})`;
                    leftStyle.float = 'left';
                    leftStyle.overflow = 'scroll';
                }

                return leftStyle;
            },

            computedRightStyle (){
                let rightStyle = {};

                if(this.showLeftLayout){
                    rightStyle.width = `calc(100% - ${this.computedLeftWidth})`;
                    rightStyle.float = 'right';
                }

                return rightStyle;
            },

            showSearch (){
                return this.$slots['search'] || this.$scopedSlots['search'];
            },

            showTableOpinion (){
                return this.$slots['table-opinion'];
            },

            showTableFooter (){
                return this.$slots['table-footer'];
            },

            showRightForm (){
                return this.$slots['right-form'];
            },

            minusHeightNumber (){
                let num = this.showTableOpinion ? 42 : 0;
                num += this.showTableFooter ? 42 : 0;
                return num;
            }
        },

        methods: {
            toggleSearchMore (){
                this.showSearchMore = !this.showSearchMore;
            }
        },

        mounted (){
//            //拿到当前列表容器
//            let listContainerInstance = this.$getRef(this.listContainerRef);
//
//            if(listContainerInstance){
//                let containerHeight = listContainerInstance.clientHeight;
//                let tableContainerHeight = containerHeight - this.minusHeightNumber;
//
//                debugger
//
//                //展示10条内容的最低高度
//                if(tableContainerHeight > 420){
//
//                }
//            }
        }
    }).build();
</script>

<style lang="scss">
    .list{
        position: relative;
        height: 100%;
        background-color: #ffffff;
        & > .left{
            height: 100%;
            background-color: #ffffff;
        }
        & > .right{
            height: 100%;
            & > .search{
                height: 40px;
                padding: 10px 0 0 10px;
                position: relative;
                border-bottom: 1px solid #efeff1;
                & > .el-form{
                    & > .el-form-item, & > .search-more > div > .el-form-item{
                        margin-bottom: 10px !important;
                        & > .el-form-item__content{
                            & > .el-select, & > .el-date-editor{
                                width: 190px;
                            }
                            & > .el-date-editor--daterange{
                                width: 250px;
                                & input{
                                    width: 45%;
                                }
                            }
                            & > .el-input{
                                & > input{
                                    width: 190px;
                                }
                                & > .el-input-group__prepend{
                                    & > .el-select{
                                        padding: 0 3px;
                                        width: 65px;
                                        & > .el-input{
                                            & > input{
                                                padding: 0 13px 0 0 !important;
                                                text-align: center;
                                            }
                                            & > .el-input__suffix{
                                                right: 0;
                                                & > .el-input__suffix-inner{
                                                    & > i{
                                                        width: 14px;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                &.el-input-group--prepend{
                                    & > input{
                                        width: 118px !important;
                                        padding: 0 7px !important;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            & > .list{
                /*margin-top: 5px;*/
                /*height: calc(100% - 55px);*/
                height: calc(100% - 50px);
                position: relative;
                & > .table-opinion{
                    padding: 7px 10px;
                    & > .el-button{
                        padding: 7px 15px !important;
                    }
                }
                & > .table-content{
                    font-size: 14px !important;
                    & .el-table__body-wrapper{
                        overflow-y: auto !important;
                    }
                    & > .el-table--small td, .el-table--small th{
                        padding: 6px 0 !important;
                        & .el-button--text{
                            padding: 0 !important;
                            position: relative;
                            /*font-size: 14px !important;*/
                            &+.el-button--text{
                                padding-left: 10px !important;
                                margin-left: 5px !important;
                                &:before{
                                    content: '';
                                    width: 1px;
                                    /*height: 14px;*/
                                    height: 12px;
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    background-color: #E9E9E9;
                                }
                            }
                        }
                    }
                    & .table-button{
                        padding: 5px 15px !important;
                    }
                }
                & > .table-footer{
                    position: absolute;
                    width: calc(100% - 20px);
                    padding: 0 10px;
                    bottom: 0;
                    height: 42px;
                    text-align: right;
                    background-color: #FAFAFA;
                    border-top: 1px solid #ebeef5;
                    & > .el-button{
                        float: left;
                        padding: 7px 15px !important;
                    }
                    & > .el-pagination{
                        margin-top: 5px;
                        & > .el-pagination__total, & > .el-pagination__jump, & > .el-pager, & > button > i, & > .el-pagination__jump input{
                            /*font-weight: 300;*/
                        }
                        & > .el-pagination__jump{
                            margin-left: 10px;
                            & input{
                                height: 25px;
                            }
                        }
                    }
                }
            }
            & > .right-form{
                /*width: 350px;*/
                width: 360px;
                display: inline-block;
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                &:before{
                    content: '';
                    width: 10px;
                    height: 100%;
                    background-color: #EAEEF1;
                    float: left;
                }
            }
        }
    }
</style>
