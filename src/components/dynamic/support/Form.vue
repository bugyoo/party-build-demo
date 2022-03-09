<template>
    <el-form :ref="dyFormRef" v-bind="options.config" :model="formData" style="overflow: hidden;" class="dynamic-form-container">
        <el-row v-for="(row, rowI) in formFieldRows" :key="rowI" :gutter="options.config.gutter || 20">
            <el-col v-for="(prop, propI) in row" v-if="options.fields[prop]" :key="`${rowI}${propI}`" :span="calcColSpan(prop)">
                <el-form-item :dynamic-item="prop" :label="options.fields[prop].label" :prop="prop" v-show="(options.fields[prop].config && !options.fields[prop].config.hidden) || !options.fields[prop].config">
                    <!-- date -->
                    <el-date-picker :ref="generateRefs(prop)" v-if="options.fields[prop]._type === 'date'" :disabled="checkDisabled(options.fields[prop])" :placeholder="getPlaceholder(options.fields[prop])" v-model="formData[prop]" valueFormat="yyyy-MM-dd" style="width: 100%;" v-bind="options.fields[prop].config" v-on="bindItemEvents(prop)"></el-date-picker>

                    <!-- el-checkbox-group -->
                    <el-checkbox-group :ref="generateRefs(prop)" v-else-if="options.fields[prop]._type === 'checkbox' && handlerArrayValue(prop)" :disabled="checkDisabled(options.fields[prop])" v-model="formData[prop]" v-bind="options.fields[prop].config">
                        <template v-if="options.fields[prop].options">
                            <el-checkbox v-for="(checkLabel, checkI) in Object.keys(options.fields[prop].options)" :key="checkI" :label="options.fields[prop].options[checkLabel]">{{checkLabel}}</el-checkbox>
                        </template>
                    </el-checkbox-group>

                    <!-- importCheckbox -->
                    <import-checkbox :ref="generateRefs(prop)" v-else-if="options.fields[prop]._type === 'importCheckbox' && handlerArrayValue(prop)" :disabled="checkDisabled(options.fields[prop])" v-model="formData[prop]" :options="options.fields[prop].config" :queryParams="queryParams"></import-checkbox>

                    <!-- inputCheckbox -->
                    <dy-input-checkbox :ref="generateRefs(prop)" v-else-if="options.fields[prop]._type === 'inputCheckbox'" :disabled="checkDisabled(options.fields[prop])" v-model="formData[prop]" :options="options.fields[prop].config" :queryParams="queryParams"></dy-input-checkbox>

                    <!-- dy-select -->
                    <dy-select :ref="generateRefs(prop)" v-else-if="options.fields[prop]._type === 'dySelect' && handlerArrayValue(prop)" :disabled="checkDisabled(options.fields[prop])" :placeholder="getPlaceholder(options.fields[prop])" v-model="formData[prop]" :options="options.fields[prop].options" v-bind="options.fields[prop].config"></dy-select>

                    <!-- dy-checkbox -->
                    <dy-checkbox :ref="generateRefs(prop)" v-else-if="options.fields[prop]._type === 'dyCheckbox' && handlerArrayValue(prop)" :disabled="checkDisabled(options.fields[prop])" :placeholder="getPlaceholder(options.fields[prop])" v-model="formData[prop]" :options="options.fields[prop].options" v-bind="options.fields[prop].config"></dy-checkbox>

                    <!-- select -->
                    <el-select :ref="generateRefs(prop)" v-else-if="options.fields[prop]._type === 'select' && handlerArrayValue(prop)" :disabled="checkDisabled(options.fields[prop])" :placeholder="getPlaceholder(options.fields[prop])" v-model="formData[prop]" style="width: 100%;" v-bind="options.fields[prop].config">
                        <el-option v-for="(item, index) in options.fields[prop].options" :key="index" :label="item" :value="index"></el-option>
                    </el-select>

                    <!-- import-select -->
                    <import-select :ref="generateRefs(prop)" v-else-if="options.fields[prop]._type === 'importSelect' && handlerArrayValue(prop)" :disabled="checkDisabled(options.fields[prop])" :placeholder="getPlaceholder(options.fields[prop])" v-model="formData[prop]" :options="options.fields[prop].options" style="width: 100%;" v-bind="options.fields[prop].config">
                    </import-select>

                    <!-- textarea -->
                    <el-input :ref="generateRefs(prop)" v-else-if="options.fields[prop]._type === 'textarea'" type="textarea" resize="none" :rows="3" :disabled="checkDisabled(options.fields[prop])" :placeholder="getPlaceholder(options.fields[prop])" v-model="formData[prop]" v-bind="options.fields[prop].config">
                    </el-input>

                    <!-- input -->
                    <el-input :ref="generateRefs(prop)" v-else="" :disabled="checkDisabled(options.fields[prop])" :placeholder="getPlaceholder(options.fields[prop])" v-model="formData[prop]" v-bind="options.fields[prop].config"></el-input>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :style="{
                textAlign: options.config.submitButtonPosition || 'center',
                marginBottom: '15px'
            }">
                <el-button v-if="!isDisabled && !isPreview" type="primary" class="button-wide" @click="submitHandler">提交</el-button>
                <el-button v-if="parentRoot && parentRoot.type === 'dialog'" class="button-wide" @click="closeDialog">关闭</el-button>
                <el-button v-else-if="!isPreview && !isDisabled" class="button-wide" @click="resetHandler">重置</el-button>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
    const oneRowTypes = ['checkbox', 'inputCheckbox', 'dyCheckbox', 'textarea', 'importCheckbox'];

    export default JBoot({
        name: 'dynamicDForm',

        componentName: 'dynamicDForm',

        components: {
            'dy-input-checkbox': require('./components/InputCheckbox.vue').default,
            'dy-select': require('./components/DySelect.vue').default,
            'dy-checkbox': require('./components/DyCheckbox.vue').default,
            'import-select': require('./components/ImportSelect.vue').default,
            'import-checkbox': require('./components/ImportCheckbox.vue').default
        },

        provide (){
            return {
                dyRefs: this.dyRefsMap
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
                dyFormRef: 'dyFormRef',
                formId: undefined,
                dyRefsMap: {},
                formData: {

                }
            }
        },

        computed: {
            /**
             * 获取表单字段按行分割的结果集
             */
            formFieldRows (){
                let rowCol = this.options.config.rowCol || 4;

                let onwLine = [];

                //处理需要单独一行的类型
                let result = Object.keys(this.options.fields).filter(key => {
                    if(oneRowTypes.includes(this.options.fields[key]._type || '')){
                        onwLine.push(key);
                    }else{
                        return true;
                    }
                });

                result = result.chunk(rowCol);

                onwLine.forEach(key => result.push([key]));

                return result;
            },

            /**
             * form实例
             */
            formInstance (){
                return this.$getRef(this.dyFormRef);
            },

            /**
             * 父级根节点
             */
            parentRoot (){
                return this.$parent ? this.$parent.parent : undefined;
            },

            /**
             * 是否为列表的编辑内容
             */
            isTableChild (){
                return this.tableInstance !== undefined && this.tableInstance.dialogInstance !== undefined;
            }
        },

        mounted (){
            this.updateEchoData();

            if(this.parentRoot && this.parentRoot.instance){
                this.setSubmitParams(this.parentRoot.instance.submitParams);
            }
        },

        methods: {
            /**
             * 绑定item事件
             */
            bindItemEvents (prop){
                let eventMap = this.options.fields[prop]._event || {};

                if(eventMap && Object.keys(eventMap).length > 0){
                    let result = {};

                    Object.keys(eventMap).forEach(eventName => {
                        result[eventName] = (new Function("return " + eventMap[eventName])).bind(this);
                    });

                    return result;
                }

                return {};
            },

            /**
             * 生成refs
             */
            generateRefs (prop){
                prop && this.$set(this.dyRefsMap, prop, (function (form) {
                    return {
                        options: form.options.fields[prop],
                        instance: form.$getRef(prop)
                    };
                })(this));

                return prop;
            },

            /**
             * 是否禁用
             */
            checkDisabled (item){
                return item && item.config && item.config.disabled !== undefined ? !!item.config.disabled : this.isDisabled;
            },

            /**
             * 更新回显数据
             */
            updateEchoData (){
                let maskId = this.$openMask(this.formInstance);

                if(this.dynamicRoot && this.dynamicRoot.echoData){
                    let properType = Object.prototype.toString.call(this.dynamicRoot.echoData).toLowerCase();

                    if(properType === '[object object]'){
                        this.formData = this.dynamicRoot.echoData;
                        this.formId = this.formData.id;
                    }else if(properType === '[object function]'){
                        this.dynamicRoot.echoData().then(data => {
                            this.formData = data;
                            this.formId = this.formData.id;
                        })
                    }
                }

                this.$closeMask(maskId);
            },

            /**
             * 获取placeholder
             * @param item
             * @return {string|string|string|string|string}
             */
            getPlaceholder (item){
                return item.placeholder || `请输入${item.label}`;
            },

            /**
             * 加载数据
             * @param params
             */
            loadData (params){
                if(this.isPreview || !this.$route.params.routeParams || (this.$route.params.routeParams && !this.$routerParamsDecrypt(this.$route.params.routeParams).companyId)) return;

                this.formId = undefined;

                this.setQueryParams(params);

                console.log('[dform]开始加载数据，传入参数为：', JSON.stringify(params));

                this.refreshForm();

                return this;
            },

            /**
             * 刷新表单
             */
            refreshForm (){
                if(this.isPreview) return;

                let maskId = this.$openMask(this.formInstance);

                this.$api('form-data', 'getFormDataInfo', Object.assign({}, this.queryParams, {
                    tabCode: this.tabInstance ? this.tabInstance.activeTab : undefined,
                    mainFlag: this.tabInstance ? this.tabInstance.currentTabIsMain ? '1' : '0' : '0',
                    pageNum: 1,
                    pageSize: 1
                })).then(response => {
                    this.$closeMask(maskId);

                    try{
                        let data = response.data.list[0] || {};
                        this.$set(this, 'formData', JSON.parse(data.dataJson));
                        this.formId = data.id;
                    }catch (e){}
                });
            },

            /**
             * 提交数据
             */
            submitHandler (){
                let submitParams = Object.assign({}, this.submitParams, {
                    mainFlag: this.tabInstance ? this.tabInstance.currentTabIsMain ? '1' : '0' : '0',
                    tabCode: this.tabInstance ? this.tabInstance.activeTab : undefined,
                    dataJson: JSON.stringify(this.formData),
                    id: this.formId
                });

                let maskId = this.$openMask(this.formInstance);

                this.$api('form-data', 'saveFormDataInfo', submitParams).then(response => {
                    this.$closeMask(maskId);
                    this.closeDialog();
                    this.refreshData();
                    this.$success('保存成功');
                    if(submitParams.mainFlag === '1'){
                        let currentParams = this.$routerParamsDecrypt(this.$route.params.routeParams || {});

                        this.$jump({
                            name: this.$route.name,
                            params: this.$routerParamsEncrypt(Object.assign(currentParams, {
                                companyId: response.data.companyId,
                                definitionId: response.data.definitionId,
                                definitionName: response.data.definitionName,
                            }))
                        });
                    }
                });
            },

            /**
             * 重置数据
             */
            resetHandler (){
                this.formInstance.resetFields();
            },

            /**
             * 关闭父节点弹框
             */
            closeDialog (){
                this.isTableChild && (this.tableInstance.dialogInstance.$emit('update:visible', false));
            },

            /**
             * 刷新数据
             */
            refreshData (){
                if(this.isTableChild){ //刷新列表
                    this.tableInstance.refreshTable()
                }else{ //刷新当前页
                    this.refreshForm();
                }
            },

            /**
             * 处理数组类型的的value
             */
            handlerArrayValue (prop){
                let option = this.options.fields[prop];
                let config = option.config;
                if((config && config.multiple) || (option && ['checkbox'].includes(option._type))){
                    let value = this.formData[prop];

                    this.$set(this.formData, prop, (value ? Array.isArray(value) ? value : [value] : []));
                }

                return true;
            },

            /**
             * 计算col的span值
             * @param prop
             */
            calcColSpan (prop){
                if(this.options.fields[prop].colSpan){
                    return this.options.fields[prop].colSpan;
                }

                if(oneRowTypes.includes(this.options.fields[prop]._type)){
                    return 24;
                }
                return 24 / (this.options.config.rowCol || 4);
            }
        },

        watch: {
            formData: {
                immediate: true,
                deep: true,
                handler (v, o){
                    console.log('formData改变了，值为:', JSON.stringify(v));
                }
            }
        }
    }).build();
</script>
