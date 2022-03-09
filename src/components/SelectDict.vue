<template>
    <el-select v-model="selectedValue" v-bind="$attrs" :default-first-option="true" v-on="$listeners">
        <template v-if="$scopedSlots.default">
            <slot name="before"></slot>
            <slot v-for="(item, index) in dictData" :item="item" :index="index"></slot>
            <slot name="after"></slot>
        </template>
        <template v-else-if="sourceIsArray">
            <slot name="before"></slot>
            <el-option v-for="(item, index) in dictData" :key="index" :label="item[props.label] "
                       :value="item[props.value]"/>
            <slot name="after"></slot>
        </template>
        <template v-else="">
            <slot name="before"></slot>
            <el-option v-for="(item, index) in dictData" :key="index" :label="item" :value="index"/>
            <slot name="after"></slot>
        </template>
    </el-select>
</template>

<script>
    let selectDictConfig = {
        componentName: 'SelectDict',

        registryName: 'select-dict',

        props: {
            value: {
                required: true
            },

            code: String,

            url: String, //自定义url 优先级最高

            method: { //自定义url时的请求方式， 默认get
                type: String,
                default() {
                    return 'post'
                }
            },
            isJson: { //自定义url时的请求方式， 默认get
                type: Boolean,
                default() {
                    return false
                }
            },

            param: Object, //自定义url时的请求参数

            defaultSelectFirst: Boolean, //是否默认选中第一个

            props: {
                type: Object,
                default() {
                    return {
                        label: 'label',
                        value: 'name'
                    }
                }
            }
        },

        data() {
            return {
                sourceIsArray: false,
                selectedValue: '',
                dictData: [],
                defaultUrl: '/sys/dict/list/'
            }
        },

        mounted() {
            this.__init();
        },

        methods: {
            __init() {
                this.$ajax({
                    isJson: this.isJson,
                    url: this.defaultUrl,
                    method: this.method || 'get',
                    data: this.param || {}
                }).then(response => {
                    this.dictData = response.datalist || response.data || {};

                    this.sourceIsArray = Object.prototype.toString.call(this.dictData).toLowerCase() === '[object array]';

                    this.$emit('on-load', this.dictData);

                    this.setDefaultSelectValue();
                })
            },

            setDefaultSelectValue() {
                if (this.defaultSelectFirst && !this.value) {
                    let val = this.sourceIsArray ?
                        this.dictData[0] ? this.dictData[0][this.props.value] : undefined :
                        Object.keys(this.dictData)[0];
                    this.$set(this, 'selectedValue', val);
                    this.$emit("change", val)
                }
            }
        },

        watch: {
            value: {
                immediate: true,
                handler(v, o) {
                    this.selectedValue = v;
                    (!v || v.length === 0) && this.defaultSelectFirst && this.setDefaultSelectValue();
                }
            },

            url: {
                immediate: true,
                handler(v, o) {
                    if (v) {
                        this.defaultUrl = v;
                    }
                }
            },

            code: {
                immediate: true,
                handler(v, o) {
                    if (v) {
                        this.defaultUrl += v;
                    }
                }
            },

            selectedValue(v, o) {
                if (!this.disabled) {
                    this.$emit('input', v);
                    this.$emit('change	', v);
                    let parent = this.$parent || this.$root;
                    let name = parent.$options.componentName;

                    while (parent && (!name || name !== 'ElFormItem')) {
                        parent = parent.$parent;

                        if (parent) {
                            name = parent.$options.componentName;
                        }
                    }
                    if (parent) {
                        parent.$emit.apply(parent, ['el.form.change'].concat(v));
                    }
                }
            }
        }
    };

    export default selectDictConfig;
</script>
