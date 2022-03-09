<template>
    <div class="tree-layout-container">
        <div class="tree-container back-white box-shadow" :ref="treeLayoutTreeRef">
            <el-input v-if="search" class="search-input" size="mini" placeholder="输入名称进行搜索..." v-model="filterNodeValue"
                      prefix-icon="el-icon-search" clearable></el-input>
            <el-tree :ref="treeRef" :data="treeData" :props="treeProps" highlight-current :expand-on-click-node="false"
                     @node-click="nodeItemClick"
                     :default-expanded-keys="defaultExpandedIds" node-key="id" :filter-node-method="filterNodeMethod">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="label-container" :style="{ width: nodeLabelWidth}">{{ node.label }}</span>
                    <span class="opinion-container">
                        <i class="el-icon-circle-plus-outline" v-if="showOpinion('add')" title="添加子节点" @click.prevent.stop="appendChildrenNode(node)"></i>
                        <i class="el-icon-remove-outline" v-if="node.data.id !== 0 && showOpinion('remove')" title="删除子节点" @click.prevent.stop=""></i>
                        <i class="el-icon-edit-outline" v-if="showOpinion('edit')" title="编辑节点" @click.prevent.stop=""></i>
                        <slot name="tree-opinion"></slot>
                    </span>
                  </span>
            </el-tree>
        </div>
        <div class="content-container">
            <slot></slot>
        </div>

        <el-dialog custom-class="treeNodeEditDialog" width="450px" :visible.sync="nodeDialogFlag" title="树节点信息" @closed="show" @submit.native.prevent>
            <el-form :ref="editFormRef" :model="formData" label-width="80px" :rules="rules">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入节点名称"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="formData.sort" controls-position="right" :min="0" :max="999"></el-input-number>
                </el-form-item>
                <el-form-item label="描述内容" prop="remark">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入描述内容"
                            v-model="formData.remark">
                    </el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button type="success" class="button-wide" @click="submitHandler">确定</el-button>
                <el-button type="info" class="button-wide" @click="nodeDialogFlag = false;">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default JBoot({
        name: 'treeLayout',

        componentName: 'treeLayout',

        registryName: 'tree-layout',

        props: {
            treeData: {
                required: true,
                type: Array
            },

            treeProps: Object,

            defaultExpandedKeys: Array,

            opinion: {
                required: false,
                default (){
                    return ['add', 'remove', 'edit'];
                }
            },

            search: Boolean,

            defaultSelectedKey: {
                required: false
            }
        },

        data (){
            return {
                moduleName: 'category',
                getMethod: 'getCategoryInfo',
                submitMethod: 'saveCategoryInfo',
                editFormRef: 'nodeEditRef',
                treeLayoutTreeRef: 'treeLayoutTreeRef',
                treeRef: 'treeRef',
                rules: {
                    name: [
                        { required: true, message: '请输入节点名称', trigger: 'change' }
                    ],
                    sort: [
                        { required: true, message: '请输入节点排序', trigger: 'change' }
                    ],
                    remark: [
                        { min: 0, max: 255, message: '节点描述只允许输入0-255个字符', trigger: 'change' }
                    ]
                },
                nodeDialogFlag: false,
                currentSelectedNode: undefined, //当前选中的node
                currentOpinionNode: undefined, //当前操作的节点
                filterNodeValue: '',
                defaultExpandedIds: []
            }
        },

        computed: {
            treeInstance (){
                return this.$getRef(this.treeRef);
            },

            nodeLabelWidth (){
                let width = 8;
                if(this.opinion && this.opinion instanceof Array){
                    width += this.opinion.length * 19;
                }
                return `calc(100% - ${width}px)`;
            }
        },

        mounted (){
            this.$nextTick(function () {
                this.refreshTreeData();
            });
        },

        methods: {
            /**
             * 是否展示操作按钮
             */
            showOpinion (type){
                if(this.opinion && this.opinion instanceof Array){
                    return this.opinion.includes(type);
                }

                return false;
            },

            /**
             * 添加子节点
             * @param node
             */
            appendChildrenNode (node){
                this.currentOpinionNode = node;
                this.nodeDialogFlag = true;
            },

            /**
             * 初始化排序默认值
             */
            afterInitFormData (){
                this.$set(this.formData, 'sort', this.formData.sort || 999);
            },

            /**
             * 获取提交信息
             */
            getEditFormDataInfo (){
                let parentId = this.formData.parentId || (this.currentOpinionNode ? this.currentOpinionNode.data.id : 0) || 0;
                return Object.assign({}, this.formData, {
                    type: 'special',
                    parentId
                });
            },

            //提交成功之后的处理
            submitSuccess (response){
                this.$success("提交成功");
                this.nodeDialogFlag = false;
                this.refreshTreeData();
                this.__formInit();
            },

            /**
             * 刷新树
             */
            refreshTreeData (){
                if(this.$parent){
                    let maskId = this.$openMask(this.treeLayoutTreeRef);
                    this.$busBroadcast('treeLayout.refresh', maskId);
//                    this.$parent && this.$parent.$emit('treeLayout.refresh', maskId);
                }
            },

            /**
             * 树节点点击
             */
            nodeItemClick (data, node, root){
                this.currentSelectedNode = node;
                this.$busBroadcast('treeLayout.node.click', node.data);
//                this.$parent && this.$parent.$emit('treeLayout.node.click', node.data);
            },

            /**
             * 节点过滤方法
             * @param value
             * @param data
             */
            filterNodeMethod (value, data){
                return !value || (data[this.treeProps.label || 'name'] && data[this.treeProps.label || 'name'].includes(value));
            }
        },

        watch: {
            treeData: {
                deep: true,
                immediate: true,
                handler (v, o){
                    v && v.length > 0 && this.$nextTick(function () {
                        if(!this.currentSelectedNode){
                            let key;
                            if(this.defaultSelectedKey !== undefined){
                                this.treeInstance.setCurrentKey(this.defaultSelectedKey);
                                key = this.defaultSelectedKey;
                            }else{
                                let node = this.treeInstance.getNode(v[0].id);
                                this.treeInstance.setCurrentNode(node.data);
//                                this.$parent && this.$parent.$emit('treeLayout.node.click', node.data);
                                this.$busBroadcast('treeLayout.node.click', node.data);
                                key = node.data.id;
                            }

                            if(!this.defaultExpandedKeys || this.defaultExpandedKeys.length === 0){
                                this.defaultExpandedIds = [key];
                            }else{
                                this.defaultExpandedIds = this.defaultExpandedKeys;
                            }
                        }
                    });
                }
            },

            filterNodeValue (v, o){
                if(this.treeInstance){
                    this.treeInstance.filter(v);
                }
            }
        }
    }).form().build();
</script>

<style lang="scss">
    .tree-layout-container{
        height: 100%;
        width: 100%;
        display: inline-flex;
        /*display: flex;*/
        /*position: absolute;*/
        position: relative;
        & > .tree-container{
            width: 200px;
            /*flex: 0 0 200px;*/
            box-shadow: 2px 0 12px 1px #e8e8e8;
            padding: 10px;
            background-color: #ffffff;
            overflow-y: auto;
            & > .search-input{
                margin-bottom: 5px;
                & > input{
                    padding-left: 20px;
                }
                & > .el-input__prefix > .el-input__icon{
                    width: 15px;
                }
            }
            & > .el-tree {
                & > .el-tree-node{
                    & .el-tree-node__children{
                        overflow: inherit;
                    }
                    & .el-tree-node__content{
                        & > .el-tree-node__expand-icon{
                            font-size: 16px;
                            padding: 2px;
                        }
                        & > .custom-tree-node {
                            width: 100%;
                            height: 26px;
                            line-height: 26px;
                            display: inline-block;
                            & > span.label-container {
                                font-size: 14px;
                                width: calc(100% - 65px);
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                display: inline-block;
                            }
                            & > span.opinion-container {
                                float: right;
                                margin-right: 5px;
                                & > i {
                                    color: #c5c5c5;
                                    cursor: pointer;
                                    &:hover {
                                        font-weight: 500;
                                        color: #303133;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        & > .content-container{
            /*flex: 1 1 auto;*/
            width: calc(100% - 200px);
            overflow: hidden;
        }
        & > .el-dialog__wrapper > .treeNodeEditDialog > .el-dialog__body > .el-form{
            & > .el-form-item:last-child{
                margin-bottom: 0 !important;
            }
        }
    }
</style>