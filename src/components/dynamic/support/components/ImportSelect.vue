<template>
    <el-select v-bind="$attrs" :value="value">
        <el-option v-for="(item, index) in selectOptions" :key="index"></el-option>
    </el-select>
</template>

<script>
    export default {
        props: {
            value: { required: true },

            options: {
                required: true
            }
        },

        data (){
            return {
                selectOptions: []
            }
        },

        methods: {
            loadSelectOptions (){
                this.$api('form-data', 'getFormDataInfo', {
                    tabCode: this.options.importForTab,
                    pageNum: 0,
                    pageSize: 0,
                    definitionType: undefined
                }).then(({ data }) => {
                })
            }
        },

        watch: {
            options: {
                immediate: true,
                handler (v, o){
                    v && v.importForTab && this.loadSelectOptions();
                }
            }
        }
    }
</script>