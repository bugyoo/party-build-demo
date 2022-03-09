<template>
    <el-select v-bind="$attrs" :value="value" @change="$emit('input', $event)" style="width: 100%;">
        <el-option v-for="(item, index) in options" :key="index" :value="options[index].value" :label="index"></el-option>
    </el-select>
</template>

<script>
    const SelectedKey = 'selected', UnSelectedKey = 'unSelected';

    export default {
        name: 'dySelect',

        componentName: 'dySelect',

        inject: {
            elForm: { default : undefined }
        },

        props: {
            value: { required: true },

            options: {
                required: true,
                type: Object
            }
        },

        data (){
            return {
                selectValue: this.value && Array.isArray(this.value) ? [] : ''
            }
        },

        methods: {
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
                    if(this.$attrs.multiple){
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
                    }else{
                        //执行上次的取消脚本
                        this.executeScript(o, UnSelectedKey);

                        //执行本次的添加脚本
                        this.executeScript(v, SelectedKey);
                    }
                }
            }
        }
    };
</script>