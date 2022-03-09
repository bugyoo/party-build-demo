<template>
    <ListLayout title="字典管理">
        <el-button slot="top-right" type="primary" plain @click="createHandler(`新增字典项`)">新增</el-button>

        <tree-table slot="table" :ref="tableRef" :data="page.list" lazy :load="handleLoad" height="100%" @selection-change="selectionHandler">
            <el-table-column show-overflow-tooltip label="字典编码" prop="code"></el-table-column>
            <el-table-column show-overflow-tooltip label="备注" prop="remark"></el-table-column>
            <el-table-column label="创建时间" width="142px">
                <template slot-scope="props">
                    {{props.row.createTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}


                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="props">
                    <el-button class="in-table-button"
                               @click="editHandler(props.row.id, `编辑【${props.row.name}】字典项`)">编辑

                    </el-button>
                    <el-button class="in-table-button"
                               @click="deleteHandler([{ id: props.row.id }])">删除

                    </el-button>
                    <el-button class="in-table-button"
                               @click="createHandler(`添加子节点至【${props.row.name}】`, { parentNode: props.row })"
                               v-if="props.row.parentId === '0'||props.row.parentPath.indexOf('e0bd2f58e5e74bd0af74233e0aac6e1c')>=0">添加下级

                    </el-button>


                </template>
            </el-table-column>
        </tree-table>

        <edit :ref="dialogRef"></edit>
    </ListLayout>
</template>

<script>
    export default JBoot({
        components: {
            'edit': require('./edit.vue').default
        },

        data (){
            return {
                moduleName: 'dict',
                listMethod: 'queryDictList',
                deleteMethod: 'removeDict',
            }
        },

        methods: {
            handleLoad (row, treeNode, resolve){
                this.$api('dict', 'queryChildren', { parentId: row.id }).then(response => {
                    resolve(response.data || []);
                });
            }
        }
    }).module('pager').list().build();
</script>
