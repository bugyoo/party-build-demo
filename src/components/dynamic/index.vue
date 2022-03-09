<template>
    <div class="dynamic-form_container">
        <!-- 表单 -->
        <dform v-bind="$attrs" :ref="dFormRef" v-if="isCreateForm" :options="formOptions"></dform>

        <!-- 表格 -->
        <dtable v-bind="$attrs" :ref="dTableRef" v-if="isCreateTable" :options="tableOptions"></dtable>

        <dtabs v-bind="$attrs" :ref="dTabsRef" v-if="isCreateTabs" :options="tabsOptions"></dtabs>
    </div>
</template>

<script>
    Array.prototype.chunk = function (chunkLength) {
        let result = [];
        for(let i=0; i<this.length; i=i+chunkLength){
            result.push(this.slice(i, i+chunkLength));
        }
        return result;
    };

    Array.prototype.chunkDesc = function (chunkLength) {
        let result = [];
        for(let i=this.length; i>=0; i=i - chunkLength){
            let startIndex = i - chunkLength;

            result.push(this.slice(startIndex < 0 ? 0 : startIndex, i));
        }
        return result.reverse();
    };

    export default JBoot({
        name: 'dynamicForm',

        componentName: 'dynamicForm',

        registryName: 'dynamic-form',

        components: {
            'dform': require('./support/Form.vue').default,
            'dtable': require('./support/Table.vue').default,
            'dtabs': require('./support/Tabs.vue').default
        },

        provide (){
            return {
                dynamicRoot: this.cInstance,

                isDisabled: this.isDisabled !== undefined ? this.isDisabled : this.disabled ,

                isPreview: this.isPreview !== undefined ? this.isPreview : this.preview
            };
        },

        inject: {
            isDisabled: { default: undefined },
            isPreview: { default: undefined },
        },

        props: {
            //配置信息
            options: {
                required: true
            },

            //是否禁用(禁用时，新增、保存等相关按钮全部消失，同时不可编辑)
            disabled: Boolean,

            //是否预览(预览时，可以有新增等按钮展示以及事件，但不允许出现提交、保存相关按钮。同时不可编辑)
            preview: Boolean,

            //父节点
            parent: Object,

            //回显数据
            echoData: [Object, Function]
        },

        data (){
            return {
                dFormRef: 'dFormRef',
                dTableRef: 'dTableRef',
                dTabsRef: 'dTabsRef',
                submitParams: {}
            }
        },

        computed: {
            /**
             * 是否创建form
             * @return {*|boolean}
             */
            isCreateForm (){
                return this.options && this.options.form && this.options.form.fields && Object.keys(this.options.form.fields).length > 0;
            },

            /**
             * 是否创建table
             * @return {*|boolean}
             */
            isCreateTable (){
                return this.options && this.options.table && this.options.table.fields && Object.keys(this.options.table.fields).length > 0;
            },

            /**
             * 是否创建tab
             * @return {*|boolean}
             */
            isCreateTabs (){
                return this.options && this.options.tabs && this.options.tabs.fields && Object.keys(this.options.tabs.fields).length > 0;
            },

            /**
             * 获取form的配置信息
             * @return {options.form|{name}}
             */
            formOptions (){
                return {
                    config: this.options.form.config || {},
                    fields: this.options.form.fields || {}
                };
            },

            /**
             * 获取table的配置信息
             * @return {options.table|{name}}
             */
            tableOptions (){
                return {
                    config: this.options.table.config || {},
                    fields: this.options.table.fields || {}
                };
            },

            /**
             * 获取tabs的配置信息
             * @return {options.tabs|{name}}
             */
            tabsOptions (){
                return {
                    config: this.options.tabs.config || {},
                    fields: this.options.tabs.fields || {}
                };
            },

            /**
             * 表单实例
             */
            formInstance (){
                return this.$getRef(this.dFormRef);
            },

            /**
             * 列表实例
             */
            tableInstance (){
                return this.$getRef(this.dTableRef);
            },

            /**
             * 标签页实例
             */
            tabsInstance (){
                return this.$getRef(this.dTabsRef);
            },

            /**
             * 当前实例
             */
            cInstance (){
                return this;
            }
        },

        methods: {
            /**
             * 加载数据
             */
            loadData (params){
                if(this.isPreview) return this;

                this.$children.forEach(instance => instance.loadData(params));

                return this;
            },

            /**
             * 设置提交携带的参数
             * @param params
             */
            setSubmitParams (params){
                this.$set(this, 'submitParams', params);

                this.$children.forEach(instance => {
                    instance.setSubmitParams(params);
                });

                return this;
            }
        }
    }).build();
</script>

<style lang="scss">
    .dynamic-form_container{
        width: 100%;
        height: 100%;
        & > .dynamic-table-container{
            height: 100%;
            & > .cm-list-content-layout{
                height: calc(100% - 45px);
            }
        }
        & > .dynamic-tabs-container{
            & > .el-tabs__content{
                height: calc(100% - 69px);
                overflow: auto;
                & > .el-tab-pane{
                    height: 100%;
                }
            }
        }
        & > .dynamic-form-container{
        }
    }
</style>
