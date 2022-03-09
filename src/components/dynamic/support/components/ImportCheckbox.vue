<template>
    <el-checkbox-group v-model="checkValue">
        <el-checkbox v-for="(item, index) in checkList" :key="index" :label="getCheckOptionLabel(item)"></el-checkbox>
    </el-checkbox-group>
</template>

<script>
    export default JBoot({
        props: {
            disabled: Boolean,

            options: Object,

            queryParams: Object,

            value: { required: true }
        },

        data (){
            return {
                checkList: [],
                checkValue: []
            }
        },

        computed: {
            importTabCode (){
                return this.options.importForTab;
            },

            checkOptionLabel (){
                return this.options.optionLabel;
            }
        },

        mounted (){
            this.initImportData();
        },

        methods: {
            initImportData (){
                if(!this.importTabCode){
                    this.$warn('使用importCheckbox组件时，未设置[config.importForTab]属性!');
                    return;
                }

                this.$api('form-data', 'getFormDataInfo', Object.assign({}, this.queryParams, {
                    tabCode: this.options.importForTab,
                    pageNum: 0,
                    pageSize: 0,
                    definitionType: undefined,
                    companyId: this.$routerParamsDecrypt(this.$route.params.routeParams).companyId
                })).then(({ data }) => {
                    let list = data.list || [];

                    this.checkList = list.map(item => {
                        try{
                            return JSON.parse(item.dataJson);
                        }catch (e){}
                    }).filter(item => item);
                });
            },

            getCheckOptionLabel (item){
                if(!this.checkOptionLabel){
                    this.$warn('使用importCheckbox组件时，未设置[config.optionLabel]属性!');
                    return;
                }

                return item ? item[this.checkOptionLabel] : '未获取到值';
            },

            toggleOptionChecked (item, checked){
            }
        },

        watch: {
            value: {
                immediate: true,
                deep: true,
                handler (v, o){
                    let result = [];

                    if(v && Array.isArray(v)){
                        result = v;
                    }

                    this.$set(this, 'checkValue', result);
                }
            },

            checkValue: {
                immediate: true,
                deep: true,
                handler (v, o){
                    this.$emit('input', v);
                }
            }
        }
    }).build();
</script>