<template>
    <div class="dy-input-checkbox-container">
        <el-input class="input-one" :disabled="isDisabled" size="small" :placeholder="options.input1Placeholder" :value="value ? value.deptName : ''" @input="val => inputChange(val, 'deptName')"></el-input>
        <el-input class="input-two" :disabled="isDisabled" size="small" :placeholder="options.input2Placeholder" :value="value ? value.fzr : ''" @input="val => inputChange(val, 'fzr')"></el-input>

        <el-checkbox-group class="check-group" :disabled="isDisabled" :value="checkValue">
            <el-checkbox v-for="(item, index) in checkList" :key="index" @change="checked => checkChange(checked, item.deptNam)" :label="item.deptNam">{{item.deptNam}}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
    export default JBoot({
        name: 'dyInputCheckbox',

        componentName: 'dyInputCheckbox',

        inject: {
            isDisabled: { default: false },
            isPreview: { default: false },
            dynamicRoot: { default: undefined }
        },

        props: {
            value: {
                required: true,
            },

            options: {
                required: true,
                type: Object
            },

            queryParams: {
                default (){
                    return {};
                }
            }
        },

        data (){
            return {
                checkList: [],
                checkedMap: {}
            }
        },

        computed: {
            checkValue (){
                return this.value ? this.value.checkValue || [] : []
            }
        },

        methods: {
            loadCheckboxChild (){
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

            checkChange (checked, label){
                let checkValue;

                if(!this.value || !this.value.checkValue || !Array.isArray(this.value.checkValue)){
                    checkValue = [];
                }else{
                    checkValue = [].concat(this.value.checkValue);
                }
                let index = checkValue.indexOf(label);

                if(checked){
                    checkValue.push(label);
                }else{
                    index > -1 && checkValue.splice(index, 1);
                }
                let result = Object.assign({}, this.value, {
                    checkValue
                });
                this.$emit('input', result);
            },

            inputChange (val, prop){
                let result = Object.assign({}, this.value);
                result[prop] = val;
                this.$emit('input', result);
            }
        },

        watch: {
            queryParams (v){
                this.loadCheckboxChild();
            }
        }
    }).build();
</script>

<style lang="scss">
    .dy-input-checkbox-container{
        width: 100%;
        display: flex;
        & > .el-input{
            width: 180px;
            &.input-two{
                width: 180px;
                margin-left: 10px;
            }
        }
        & > .check-group{
            margin-left: 10px;
        }
    }
</style>