<template>
    <div class="form">
        <slot></slot>
    </div>
</template>

<script>
    export default JBoot({
        registryName: 'FormLayout'
    }).build();
</script>

<style lang="scss">
    .form{
        height: 100%;
        overflow-y: auto;
        background-color: #ffffff;
        & > .el-tabs{
            height: calc(100% - 2px);
            box-shadow: none !important;
            & > .el-tabs__content{
                padding: 0 !important;
                height: calc(100% - 39px);
                & > .el-tab-pane{
                    height: 100%;
                    overflow-y: auto;
                }
            }
        }
        & .el-form{
            & .is-disabled{
                & .el-input__inner, & .el-textarea__inner{
                    background-color: #fbfbfb;
                    border-color: #e6e6e6;
                    color: #636363;
                }
                & .el-cascader__label{
                    color: #636363 !important;
                    & > span{
                        color: #7d7d7d;
                    }
                }
            }
        }
        & .content-block{
            width: 100%;
            & > .block-title{
                display: block;
                height: 40px;
                line-height: 40px;
                padding-left: 20px;
                background-color: #D6E7F4;
                color: #303133;
                /*font-weight: 600;*/
                font-size: 14px;
            }
            & > .block-content{
                padding: 20px;
                height: calc(100% - 90px);
                overflow-y: auto;
            }
        }
    }
    .right-form{
        & .block-title{
            height: 50px !important;
            line-height: 50px !important;
            color: #707379 !important;
            /*font-weight: 300 !important;*/
            font-size: 16px !important;
        }
    }
</style>
