<template>
    <el-table ref="treeTableBaseRef" height="100%" class="tree-table__container" :data="formatData" :row-style="showRow"
              v-bind="$attrs"
              @selection-change="(args) => $emit('selection-change', args)" @select="selectHandler"
              :header-row-class-name="headerRowClassName">
        <el-table-column v-if="columns.length===0" :width="expandWidth">
            <template slot-scope="scope">
                <template v-for="(space, index) in scope.row._level">
                    <span class="ms-tree-space" :key="space"></span>
                    <!--<span :class="renderLineHandler(scope.row, index)"/>-->
                </template>
                <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right"></i>
          <i v-else class="el-icon-caret-bottom"></i>
        </span>
                <slot name="prefixIcon" :item="scope.row"></slot>
            </template>
        </el-table-column>
        <el-table-column v-else v-for="(column, index) in columns" :key="column.value" :label="column.text"
                         :width="column.width">
            <template slot-scope="scope">
                <template v-for="(space, index) in scope.row._level">
                    <span class="ms-tree-space" :key="space"></span>
                    <!--<span :class="renderLineHandler(scope.row, index)"/>-->
                </template>
                <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right"></i>
          <i v-else class="el-icon-caret-bottom"></i>
        </span>
                <slot name="prefixIcon" :item="scope.row"></slot>
                {{scope.row[column.value]}}


            </template>
        </el-table-column>
        <slot></slot>
    </el-table>
</template>

<script>
    import treeToArray from './js/eval'
    export default {
        name: 'treeTableOld',
        componentName: 'treeTableOld',
        registryName: 'tree-table-old',
        props: {
            data: {
                type: [Array, Object],
                required: true
            },
            columns: {
                type: Array,
                default: () => []
            },
            evalFunc: Function,
            evalArgs: Array,
            expandAll: {
                type: Boolean,
                default: false
            },
            expandWidth: {
                type: String,
                default (){
                    return "150"
                }
            },
            headerRowClassName: String,
            isCascade: Boolean
        },
        computed: {
            // 格式化数据源
            formatData: function () {
                let tmp
                if (!Array.isArray(this.data)) {
                    tmp = [this.data]
                } else {
                    tmp = this.data
                }
                const func = this.evalFunc || treeToArray
                const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
                return func.apply(null, args).map(item => Object.assign(item, {
                    _child: item.children,
                    children: undefined,
                }));
            }
        },
        methods: {
            showRow: function (row) {
                const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
                row.row._show = show
                if(!show){
                    row.row.bc = 'background-color: #f3faff; ';
                }
                return (row.row.bc || '') + (show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;')
            },
            // 切换下级是否展开
            toggleExpanded: function (trIndex) {
                const record = this.formatData[trIndex];
                record._expanded = !record._expanded;
            },
            // 图标显示
            iconShow(index, record) {
                return (index === 0 && record._child && record._child.length > 0)
            },

            renderLineHandler (row, index){
                if (row.parent && row.parent._expanded) {
                    if (row._level - 1 > index) {
                        if (index > 0 || row._level === 2) { // && row.parent.children.indexOf(row) === row.parent.children.length - 1
                            let inIndex = -1;
                            row.parent._child.forEach((item, index) => {
                                if (inIndex === -1 && item.id === row.id) {
                                    inIndex = index;
                                }
                            });
                            if (inIndex > -1 && inIndex === row.parent._child.length - 1) {
                                row.__isLast = true;
                                return 'tree-table__children-line_last';
                            } else {
                                return 'tree-table__children-line';
                            }
                        } else if (!row.parent.__isLast) {
                            return 'tree-table__children-line';
                        }
                    }
                }
            },

            selectHandler (selections, row){
                let tableInstance = this.$getRef('treeTableBaseRef');

                if (this.isCascade && tableInstance) {
                    parentHandler(row);
                    childrenHandler(row);
                }
                this.$emit('select', selections, row);

                function parentHandler(item) {
                    if(item && item.parentId){ //处理父节点状态
                        let parent = tableInstance.data.filter(d => d.id === item.parentId)[0];
                        if (!parent) return;
                        let isSelection = parent._child.filter(item => selections.indexOf(item) !== -1).length > 0;
                        tableInstance.toggleRowSelection(parent, isSelection);
                        parentHandler(parent);
                    }
                }

                function childrenHandler(item) {
                    if(item && item._child && item._child.length > 0){
                        let self = tableInstance.data.filter(d => d.id === item.id)[0];
                        if(!self) return;
                        self._child.forEach(d => {
                            tableInstance.toggleRowSelection(d, selections.includes(item));
                            childrenHandler(d);
                        });
                    }
                }
            }
        }
    }
</script>
<style rel="stylesheet/css">
    @keyframes treeTableShow {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @-webkit-keyframes treeTableShow {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>

<style lang="scss" rel="stylesheet/scss">
    $color-blue: #2196F3;
    $space-width: 18px;
    .tree-table__container .ms-tree-space {
        position: relative;
        top: 1px;
        display: inline-block;
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        width: $space-width;
        height: 14px;
        &::before {
            content: ""
        }
    }

    .tree-table__container .processContainer {
        width: 100%;
        height: 100%;
    }

    .tree-table__container td {
        line-height: 26px;
    }

    .tree-table__container .tree-ctrl {
        position: relative;
        cursor: pointer;
        color: $color-blue;
        margin-left: -$space-width;
    }

    .tree-table__container .tree-table__children-line, .tree-table__container .tree-table__children-line_last {
        margin-left: -12px;
        width: 10px;
        height: 15px;
        display: inline-block;
    }

    .tree-table__container .tree-table__children-line {
        border-left: 1px #2196F3 dashed;
    }

    .tree-table__container .tree-table__children-line_last {
        border-left: 1px #2196F3 dashed;
        border-bottom: 1px #2196F3 dashed;
    }
</style>
