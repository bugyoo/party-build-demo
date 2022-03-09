<template>
    <el-cascader
            :ref="cascader"
            :options="options"
            :props="setting"
            v-model="selectedValue"
            @change="handleChange">
    </el-cascader>
</template>

<script>
    let selectDictConfig = {
        componentName: 'SelectProCategory',

        registryName: 'select-pro-category',

        props: {
            value: {
                required: true
            },
            handleChange: {
                type: Function,
                default(data) {
                    console.log(data)


                }
            },

            url: String, //自定义url 优先级最高

            method: { //自定义url时的请求方式， 默认get
                type: String,
                default() {
                    return 'post'
                }
            },

            param: Object, //自定义url时的请求参数
        },

        data() {
            return {
                defaultUrl: '/pro/category/cascader',
                setting: {
                    label: "name",

                    value: "id"
                },
                options: [],
                selectedValue:[],
                cascader:"cascader",
                result:null
            };
        },

        mounted() {
            this.__init();
            console.log("amounted")
        },

        methods: {
            __init() {
                var _this = this;
                this.$ajax({
                    url: this.defaultUrl,
                    method: this.method || 'get',
                    data: this.param || {},
                    isJson: true
                }).then(response => {
                    console.log("loaded")
                    this.options = response.data;
                })
            },
            findPath(options){
                for (var i=0;i<options.length;i++) {
                    console.log(options[i].name)
                    if(options[i].id === this.value){
                      return options[i].parentPath;
                    }else{
                        if(options[i].children && options[i].children.length>0){
                            var findValue= this.findPath(options[i].children)
                            if(findValue){
                                return findValue;
                            }
                        }

                    }

                }
            }

        },

        watch: {
            value: {
                handler (v, o){
                    if(v && this.options.length>0){

                        if(this.selectedValue.length<=0){
                            var path=this.findPath(this.options)
                            this.selectedValue=path.split(",");
                            this.selectedValue.shift();
                        }

                    }

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
            options:{
                handler (v, o){
                    if(this.value){
                        var path=this.findPath(this.options)
                        this.selectedValue=path.split(",");
                        this.selectedValue.shift();
                    }


                }
            },
            selectedValue(v, o) {
                if (!this.disabled) {


                    this.$emit('input', this.selectedValue[this.selectedValue.length-1]);
                    this.$emit('load', this.selectedValue[this.selectedValue.length-1]);


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
