<template>
    <el-cascader
        ref="elCascaderRef"
        :options="cascaderOptions"
        :value="computedValue"
        @change="selectHandler"
        style="width: 100%;"
        :props="props"
        v-bind="$attrs"
    ></el-cascader>
</template>
<script>
    export default {
        registryName: 'select-cascader',

        data (){
            return {
                cascaderOptions: [],
                optionsListMap: {},
                optionsItemMap: {}
            }
        },

        props: {
            value: String,

            url: String,

            source: Array,

            props: {
                type: Object,
                default (){
                    return {
                        label: 'name',
                        value: 'id',
                        disabled:"disable"
                    }
                }
            }
        },

        computed: {
            computedValue (){
                if(this.value){
                    if(Object.keys(this.optionsListMap).length > 0){
                        return this.optionsListMap[this.value];
                    }else{
                        return [];
                    }
                }else{
                    return [];
                }
            }
        },

        methods: {
            loadOptions (url){
                const data = {};

                this.$ajax.json({ url, data }).then(({ data }) => {
                    this.optionsListMap = {};

                    this.optionsItemMap = {};

                    this.$set(this, 'cascaderOptions', this.emptyChildrenHandler(data));
                });
            },

            emptyChildrenHandler(source, parent) {
                source.forEach(item => {
                    let value = item[this.props.value];

                    this.optionsItemMap[value] = item;

                    item.idPath = parent && parent[this.props.value] ? [parent[this.props.value], value] : [value];

                    this.$set(this.optionsListMap, value, item.idPath);

                    if(item.children && item.children.length > 0){
                        item.children = this.emptyChildrenHandler(item.children, item);
                    }else{
                        item.children = undefined;
                    }
                });

                return source;
            },

            selectHandler (val){
                this.$emit('input', val[val.length - 1]);

                this.$nextTick(function () {
                    let instance = this.$getRef('elCascaderRef');

                    this.$emit('selectLabelChange',  instance.presentText);
                });
            }
        },

        watch: {
            url: {
                immediate: true,
                handler (v, o){
                    v && this.loadOptions(v);
                }
            },

            source: {
                immediate: true,
                handler (v){
                    if(v && v.length > 0){
                        this.$set(this, 'cascaderOptions', this.emptyChildrenHandler(v));
                    }
                }
            }
        }
    }
</script>
