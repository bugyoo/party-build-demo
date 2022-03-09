<template>
    <el-tabs :style="{
            width: '100%',
            height: '100%'
        }" type="border-card" v-model="activeTab" class="dynamic-tabs-container">
        <el-tab-pane v-for="(tabName, tabIndex) in Object.keys(options.fields)" :key="tabIndex" :name="tabName" :label="getTabPaneLabel(options.fields[tabName])" :disabled="!isPreview && $route.params.routeParams && !$routerParamsDecrypt($route.params.routeParams).companyId">
            <dynamic-form :ref="dynamicFormRef" v-if="tabName === activeTab" :options="options.fields[tabName].fields"  :parent="{
               type: 'tabs',
               instance: cInstance
           }"></dynamic-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    export default JBoot({
        name: 'dynamicTab',

        componentName: 'dynamicTab',

        provide (){
            return {
                tabInstance: this
            };
        },

        inject: {
            isDisabled: { default: false },
            isPreview: { default: false },
            tabInstance: { default: undefined },
            tableInstance: { default: undefined },
            dynamicRoot: { default: undefined }
        },

        props: {
            options: Object
        },

        mixins: [ require('./mixins/index').default ],

        data (){
            return {
                dynamicFormRef: 'dynamicFormRef',
                activeTab: this.options ? Object.keys(this.options.fields)[0] : undefined,
                tabData: {

                }
            }
        },

        computed: {
            dynamicFormList (){
                return this.$getRef(this.dynamicFormRef) || [];
            },

            currentTabIsMain (){
                return Object.keys(this.options.fields).indexOf(this.activeTab) === 0;
            },

            cInstance (){
                return this;
            }
        },

        methods: {
            /**
             * 加载数据
             * @param params
             */
            loadData (params){
                params = params || this.queryParams || {};

                console.log('[dtabs]开始加载数据，传入参数为：', JSON.stringify(params));

                this.setQueryParams(params);

                this.dynamicFormList.forEach(instance => instance.loadData(params));

                return this;
            },

            /**
             * 获取tabPane的label
             * @param item
             */
            getTabPaneLabel (item){
                item.config = item.config || {};
                return item.config.label || '无标签名称';
            }
        },

        watch: {
            activeTab: {
                handler (){
                    //等切换完毕之后请求
                    this.$nextTick(function () {
                        this.loadData(this.queryParams);

                        this.dynamicFormList.forEach(instance => instance.setSubmitParams(this.submitParams));
                    });
                }
            },

            submitParams: {
                handler (v){
                    this.dynamicFormList.forEach(instance => instance.setSubmitParams(v));
                }
            }
        }
    }).build();
</script>