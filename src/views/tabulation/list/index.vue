<template>
    <ListLayout class="tabulation-index-wrap" title="表格管理" :topRightWidth="635">

        <el-form slot-scope="props" slot="top-right" :ref="queryFormRef" inline class="search-form" :model="queryFormData"
                 label-width="70px" @submit.native.prevent size="mini">
            <el-form-item prop="name" label-width="0">
                <el-input type="text" v-model="queryFormData.name" clearable style="width: 230px;"
                          placeholder="请输入人员名称">
                    <el-button slot="append" icon="el-icon-search" @click="queryHandler"></el-button>
                </el-input>
            </el-form-item>

             <el-form-item>
                <el-button type="info" plain @click="queryHandler">查询</el-button>
                <el-button type="danger" plain @click="batchDeleteHandler()">批量删除</el-button>
                 <el-button type="primary" plain @click="props.toggleSearchMoreVisible()" icon="el-icon-sort">更多查询</el-button>
            </el-form-item>
        </el-form>
        <SearchMore slot="search-more"  :model="queryFormData" :ref="queryFormRef" label-width="70px">
            <el-form-item label="年龄：" prop="age">
                <!-- <tree-select style="width: 193px" v-model="queryFormData.auditOrgId" clearable clearValueText="" :options="auditTreeList" placeholder="请选择审核单位"></tree-select> -->
                <el-input type="text" v-model="queryFormData.age" clearable style="width: 230px;"
                          placeholder="请输入年龄"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
                <select-dict url="/api/tabulation/sex" placeholder="请选择性别" clearable
                             v-model="queryFormData.sex" :props="{label:'name',value:'code'}"></select-dict>
            </el-form-item>
        </SearchMore>
        <el-table slot="table" class="background-table" :ref="tableRef" :data="page.list" @selection-change="handleSelectionChange" height="100%" border>
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="序号" type="index"></el-table-column>

            <el-table-column show-overflow-tooltip align="center" label="姓名" prop="username"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="年龄" prop="age"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="性别" prop="sex"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="状态" prop="status">
                <template slot-scope="props">
                    <el-tag type="success" v-if="props.row.status" style="color: green; font-weight: 500;">
                        正常
                    </el-tag>
                    <el-tag type="danger" v-else  style="color: red; font-weight: 500;" >
                        <span>异常</span>
                        <el-tooltip effect="dark"   placement="top-end">
                            <div slot="content">
                                　<span>系统错误</span>
                            </div>
                            <i class="el-icon-question"/>
                        </el-tooltip>
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="附件" prop="file">
                <template slot-scope="props">
                    <span v-if="(props.row.file || '').toLowerCase().endsWith('.pdf')" @click="$getRef('previewPdfRef').open(props.row.file)" style="cursor: pointer">
                        {{props.row.file}}
                    </span>
                    <span v-if="(props.row.file || '').toLowerCase().endsWith('.jpg') ||(props.row.file || '').toLowerCase().endsWith('.png') ||(props.row.file || '').toLowerCase().endsWith('.jpeg')"  @click.prevent.stop="_previewImage(props.row.file)" style="cursor: pointer">
                        {{props.row.file}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="操作" align="center" width="250px">
                <template slot-scope="props">
                    <el-button type="primary" plain
                               @click="getFileUrl(props.row.file)">获取
                    </el-button>
                    <el-button type="danger" plain class="in-text-button in-text-remove"
                               @click="deleteHandler({ id: props.row.id })">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination slot="page" background layout="total, prev, pager, next" :total="page.total"
                       :page-size="page.pageSize"
                       :current-page.sync="page.pageNum"
                       @current-change="pageNoToggleHandler"
                       @size-change="pageSizeToggleHandler"></el-pagination>

        <!--<add :ref="dialogRef"></add>-->
        <preview-pdf ref="previewPdfRef" ></preview-pdf>
        <copy ref="CopydialogRef"></copy>
    </ListLayout>
</template>

<script>
    export default JBoot({
        components: {
            // 'add': require('./add').default
            copy: require('./copy').default
        },

        props: {},

        data() {
            return {
                moduleName: 'tabulation',
                listMethod:'queryByPage',
                deleteMethod: 'delete',
                multipleSelection:[]
            }
        },

        computed: {},
        methods: {
            //吊起弹框
            getFileUrl(fileUrl){
                this.$getRef('CopydialogRef').show({url:fileUrl})
            },
            //选中值状态
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
            },
            //批量删除数据
            batchDeleteHandler (){
                if(this.multipleSelection.length === 0){
                    this.$warn('请选择需要删除的数据');
                    return;
                }
                this.deleteHandler(this.multipleSelection);
            },
        },

        watch: {}
    }).store('userInfo').module('pager','preview').list().build();
</script>

<style lang="scss">
    .tabulation-index-wrap {


    }
</style>
