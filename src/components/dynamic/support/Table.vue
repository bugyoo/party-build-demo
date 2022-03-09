<template>
   <div class="dynamic-table-container">
       <list-head-layout style="padding: 0;">
           <list-head-opinion-layout style="right: 0; bottom: 8px;">
               <el-button v-if="!isDisabled || isPreview" type="primary" @click="openDialog()">新增</el-button>
           </list-head-opinion-layout>
       </list-head-layout>

       <list-content-layout>
           <el-table :ref="dyTableRef" :data="tableData.list" class="background-table" height="100%">
               <el-table-column show-overflow-tooltip v-for="(prop, index) in Object.keys(options.fields)" v-if="checkFieldShow(prop)" :key="index" :prop="prop" :label="getColumnLabel(options.fields[prop])"></el-table-column>

               <el-table-column label="操作" width="145px" v-if="showTableOpinionButtons">
                   <template slot-scope="props">
                       <el-button v-if="showButton('edit')" class="in-table-button" @click="openDialog(props.row)">编辑</el-button>
                       <el-button v-if="showButton('delete')" class="in-table-button" @click="removeInfoItem(props.row)">删除</el-button>
                   </template>
               </el-table-column>
           </el-table>

           <list-page-layout>
               <el-pagination background layout="total, prev, pager, next, sizes" :total="tableData.total"
                              :page-size="tableData.pageSize"
                              @current-change="refreshTable($event)"
                              @size-change="refreshTable(undefined, $event)"></el-pagination>
           </list-page-layout>
       </list-content-layout>

       <el-dialog :ref="dyDialogRef" title="填写记录详情" :visible.sync="infoDialogFlag" @opened="dialogOpenAfter" @close="infoDialogClose">
           <dynamic-form :ref="infoDynamicFormRef" v-if="infoDialogFlag" :options="infoDynamicFormOption" :parent="{
               type: 'dialog',
               instance: cInstance
           }" :echoData="echoData"></dynamic-form>
       </el-dialog>
   </div>
</template>

<script>
    export default JBoot({
        name: 'dynamicTable',

        componentName: 'dynamicTable',

        provide (){
            return {
                tableInstance: this
            };
        },

        inject: ['isDisabled', 'isPreview', 'tabInstance'],

        props: {
            options: Object
        },

        mixins: [ require('./mixins/index').default ],

        data (){
            return {
                dyTableRef: 'dyTableRef',
                dyDialogRef: 'dyDialogRef',
                infoDialogFlag: false,
                infoDynamicFormRef: 'infoDynamicFormRef',
                infoDynamicFormOption: {},
                echoData: {},
                tableData: {
                    list: [],
                    pageNum: 1,
                    pageSize: 15,
                    total: 0
                }
            }
        },

        computed: {
            tableInstance (){
                return this.$getRef('dyTableRef');
            },

            dialogInstance (){
                return this.$getRef('dyDialogRef');
            },

            infoDynamicFormInstance (){
                return this.$getRef(this.infoDynamicFormRef);
            },

            cInstance (){
                return this;
            },

            showTableOpinionButtons (){
                return !this.options.config.buttons || (this.options.config.buttons  && this.options.config.buttons.length > 0);
            }
        },

        methods: {
            /**
             * 列表是否隐藏
             */
            checkFieldShow (prop){
                if(prop && this.options.fields[prop].config){
                    let listHidden = this.options.fields[prop].config.listHidden || false;
                    return !listHidden;
                }

                return true;
            },

            /**
             * 展示button
             * @param buttonCode
             */
            showButton (buttonCode){
                return !this.options.config.buttons || this.options.config.buttons.includes(buttonCode);
            },

            /**
             * 加载数据
             * @param params
             */
            loadData (params){
                if(this.isPreview || !this.$route.params.routeParams || (this.$route.params.routeParams && !this.$routerParamsDecrypt(this.$route.params.routeParams).companyId)) return;

                console.log('[dtable]开始加载数据，传入参数为：', JSON.stringify(params));

                this.setQueryParams(params);

                this.refreshTable();

                return this;
            },

            /**
             * 刷新列表
             */
            refreshTable (pageNum = this.tableData.pageNum, pageSize = this.tableData.pageSize){
                if(this.isPreview) return;

                let maskId = this.$openMask(this.tableInstance);

                this.$api('form-data', 'getFormDataInfo', Object.assign({
                    pageNum,
                    pageSize
                }, this.queryParams, {
                    tabCode: this.tabInstance.activeTab,
                    mainFlag: this.tabInstance.currentTabIsMain ? '1' : '0'
                })).then(({ data }) => {
                    this.$closeMask(maskId);

                    this.$set(this, 'tableData', {
                        list: (data.list || []).map(item => {
                            return Object.assign({}, JSON.parse(item.dataJson), {
                                id: item.id
                            })
                        }).filter(item => item),
                        pageNum: data.pageNum || 0,
                        pageSize: data.pageSize || 0,
                        total: data.total || 0
                    });
                });
            },

            /**
             * 获取column的label
             * @param column
             */
            getColumnLabel (column){
                return column ? column.label || '无列名' : '无列名';
            },

            /**
             * 新增记录
             */
            openDialog (data){
                this.echoData = data;

                this.infoDialogFlag = true;

                this.infoDynamicFormOption = {
                    form: this.options
                };
            },

            /**
             * 设置弹框内部的数据
             */
            dialogOpenAfter (){
                this.infoDynamicFormInstance && this.infoDynamicFormInstance.setSubmitParams(this.submitParams);
            },

            /**
             * 弹框关闭的时候
             */
            infoDialogClose (){
                this.infoDynamicFormInstance && Object.values(this.infoDynamicFormInstance.formInstance.dyRefsMap || {}).filter(item => item.options && item.options.options && ['dyCheckbox'].includes(item.options._type)).forEach(item => {
                    Object.values(item.options.options || {}).filter(child => child.script).forEach(child => {
                        let { unSelected } = child.script || {};

                        unSelected && (new Function("return " + unSelected)).call(item.instance[0]);
                    });
                });
            },

            /**
             * 删除处理
             * @param item
             */
            removeInfoItem (item){
                this.$isOk('删除条目', '您确定要删除条目吗？').then(() => {
                    !this.isDisabled && !this.isPreview && this.$api('form-data', 'removeDataInfo', [
                        { id: item.id }
                    ]).then(response => {
                        this.$success('删除成功');
                        this.refreshTable();
                    });
                })
            }
        }
    }).build();
</script>
