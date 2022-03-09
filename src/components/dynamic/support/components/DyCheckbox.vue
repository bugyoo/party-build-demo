<template>
    <el-checkbox-group v-bind="$attrs" :value="value">
        <el-checkbox v-for="(checkLabel, checkI) in Object.keys(options)" :key="checkLabel" :label="options[checkLabel].value" @change="checkChange(checkLabel, $event)">{{checkLabel}}</el-checkbox>
    </el-checkbox-group>
</template>

<script>
    const SelectedKey = 'selected', UnSelectedKey = 'unSelected';

    export default {
        props: {
            value: { required: true },

            options: {
                required: true,
                type: Object
            }
        },

        inject: {
            elForm: { default : undefined },
            dyRefs: { default: undefined }
        },

        methods: {
            checkChange (label, checked){
                let checkedValue = [];

                if(checked){
                    checkedValue = checkedValue.concat(this.value);

                    !checkedValue.includes(label) && checkedValue.push(label);
                }else{
                    checkedValue = (this.value || []).filter(item => item !== label);
                }

                this.$emit('input', checkedValue);
            },

            getScript (prop, type){
                return ((this.options[prop] || {}).script || {})[type];
            },

            executeScript (prop, type){
                let script = this.getScript(prop, type);

                script && script.split(';').forEach(item => (new Function("return " + item)).call(this));
            }
        },

        watch: {
            value: {
                handler (v, o){
                    let addArr = [];
                    let removeArr = [];

                    if(v.length > 0){ //本次选择了值
                        if(!o || o.length === 0){ //上次没选择值
                            addArr = addArr.concat(v); //所有的都是新增
                        }else{ //上次选择了值
                            addArr = addArr.concat(v.filter ? v.filter(item => !o.includes(item)) : []);//上次不包含本次的 算作新增

                            removeArr = removeArr.concat(o.filter ? o.filter(item => !v.includes(item)) : []); //本次不包含上次的 则算作删除
                        }
                    }else if(o && o.length > 0){ //本次没有值了 并且 上次选择了值
                        removeArr = removeArr.concat(o);
                    }

                    //执行取消脚本
                    removeArr.forEach(item => this.executeScript(item, UnSelectedKey));

                    //执行添加脚本
                    addArr.forEach(item => this.executeScript(item, SelectedKey));
                }
            }
        }
    }
</script>