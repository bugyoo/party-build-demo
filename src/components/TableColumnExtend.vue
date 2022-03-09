<script>
    import {TableColumn} from 'element-ui';

    function getPropByPath(obj, path, strict) {
        let tempObj = obj;
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');

        let keyArr = path.split('.');
        let i = 0;
        for (let len = keyArr.length; i < len - 1; ++i) {
            if (!tempObj && !strict) break;
            let key = keyArr[i];
            if (key in tempObj) {
                tempObj = tempObj[key];
            } else {
                if (strict) {
                    throw new Error('please transfer a valid prop path to form item!');
                }
                break;
            }
        }
        return {
            o: tempObj,
            k: keyArr[i],
            v: tempObj ? tempObj[keyArr[i]] : null
        };
    };

    export default {
        name: 'ElTableColumn1',

        registryName: 'el-table-column1',

        mixins: [TableColumn],

        props: {
            attach: Boolean,

            filterType: String,

            mode: String,

            download: Boolean,

            remove: Boolean,

            upload: Boolean
        },

        mounted (){
            if (this.type === 'default') {
                function defaultRenderCell(h, data) {
                    let renderCellFunc;
                    if (this.$scopedSlots.default) {
                        renderCellFunc = () => this.$scopedSlots.default(data)
                    } else {
                        renderCellFunc = (h, {row, column}) => {
                            const property = column.property;
                            const value = property && getPropByPath(row, property).v;
                            if (column) {
                                if (column.formatter) {
                                    return column.formatter(row, column, value);
                                } else {
                                    if (value && Array.isArray(value)) {
                                        return value.join('、');
                                    }
                                }
                            }
                            return value;
                        };
                    }

                    let options = (this.showOverflowTooltip || this.showTooltipWhenOverflow) ? {
                        class: 'cell el-tooltip',
                        style: {
                            width: (data.column.realWidth || data.column.width) - 1 + 'px'
                        }
                    } : {
                        class: 'cell',
                    };

                    return h('div', options, renderCellFunc(h, data));
                }

                function defaultRenderHeader(h, {row, column, $index}) {
                    return h('span', {
                        style: {
                            width: '100%',
                            display: 'inline-block',
                        }
                    }, column.label);
                }

                Object.assign(this.columnConfig, {
                    renderCell: defaultRenderCell.bind(this),
                    renderHeader: defaultRenderHeader.bind(this)
                });
            }
        }
    }
</script>

<style lang="scss">
    .tb-column-attachment-container {
        & i.el-icon-download {
            cursor: pointer;
            font-weight: 800;
            color: #66b1ff;
            &:hover {
                color: #3a8ee6;
            }
        }
        & i.el-icon-close {
            cursor: pointer;
            &:hover {
                font-weight: 700;
                color: red;
            }
        }
    }

    .tb-column-attach_column_new {
        display: table;
        margin: 0 auto;
        /*float: right;*/
        cursor: pointer;
    }

    .tb-column-attach_column {
        width: 65px;
        /*height: 40px;*/
        height: 23px;
        line-height: 23px;
        /*padding-top: 15px;*/
        text-align: center;
        background-color: #e6ebf5;
        cursor: pointer;
        position: relative;
        z-index: 3;
        & i.icon-microsoftexcel {
            font-size: 35px;
            color: #419ea0;
        }
        & div.fileName {
            white-space: nowrap;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        & div.hover-text {
            position: absolute;
            width: 65px;
            bottom: 28px;
            background-color: #22232578;
            color: #ffffff;
            font-weight: 600;
            display: none;
        }
        & i.file-remove {
            position: absolute;
            top: 4px;
            left: 50px;
            font-size: 12px;
            display: none;
        }
        &:hover {
            & i.icon-microsoftexcel {
                color: #4dcbce;
            }
            & div.fileName {
                color: #3A3A3A;
                font-weight: 400;
            }
            & div.hover-text {
                display: block;
            }
            & i.file-remove {
                color: red;
                display: block;
            }
        }
    }
</style>
