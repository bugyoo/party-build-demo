/**
 * Created by litao on 2018/11/27.
 */
export default {
    form: {},
    table: {},
    tabs: {
        config: {},
        fields: {
            "baseData": {
                config: {
                    label: "基本信息"
                },
                fields: {
                    form: {
                        config: {
                            submitButtonPosition: 'center'
                        },
                        fields: {
                            'cmpName': {
                                label: "公司名称"
                            },
                            'cmpCode': {
                                label: "公司编码"
                            },
                            'regAddress': {
                                label: "注册地址"
                            },
                            'bgAddress': {
                                label: "办公地址"
                            },
                            'zjlName': {
                                label: "总经理姓名"
                            },
                            'glzName': {
                                label: "管理者姓名"
                            },
                            'linkName': {
                                label: "联系人姓名"
                            },
                            'linkPhone': {
                                label: "联系电话"
                            },
                            'cz': {
                                label: "传真"
                            },
                            'phone': {
                                label: "电话"
                            },
                            "rztx": {
                                label: '认证体系',
                                _type: 'dySelect',
                                config: { multiple: true },
                                options: {
                                    ISO27001: {
                                        value: "ISO27001",
                                        script: {
                                            selected: "document.querySelector('[dynamic-item=\"ISO27001rzfw\"]').style.display = 'block';document.querySelector('[dynamic-item=\"ISO27001fgrs\"]').style.display = 'block'",
                                            unSelected: "document.querySelector('[dynamic-item=\"ISO27001rzfw\"]').style.display = 'none';document.querySelector('[dynamic-item=\"ISO27001fgrs\"]').style.display = 'none'"
                                        }
                                    },
                                    ISO20000: {
                                        value: "ISO20000",
                                        script: {
                                            selected: "document.querySelector('[dynamic-item=\"ISO20000rzfw\"]').style.display = 'block';document.querySelector('[dynamic-item=\"ISO20000fgrs\"]').style.display = 'block'",
                                            unSelected: "document.querySelector('[dynamic-item=\"ISO20000rzfw\"]').style.display = 'none';document.querySelector('[dynamic-item=\"ISO20000fgrs\"]').style.display = 'none'"
                                        }
                                    }
                                }
                            },
                            "ISO20000rzfw": {
                                hidden: true,
                                label: 'ISO20000认证范围'
                            },
                            "ISO20000fgrs": {
                                hidden: true,
                                label: 'ISO20000覆盖人数'
                            },
                            "ISO27001rzfw": {
                                hidden: true,
                                label: 'ISO27001认证范围'
                            },
                            "ISO27001fgrs": {
                                hidden: true,
                                label: 'ISO27001覆盖人数'
                            },
                            'zxForm': {
                                label: '咨询表单',
                                _type: 'checkbox',
                                options: {
                                    "软件开发": "rjkf",
                                    "系统集成": "xtjc",
                                    "数据处理": "sjcl",
                                    "软件运维": "rjyw",
                                    "硬件运维": "yjyw",
                                    "呼叫中心": "hjzx"
                                }
                            }
                        }
                    }
                }
            },
            "deptInfo": {
                config: {
                    label: "部门信息"
                },
                fields: {
                    table: {
                        config: {
                            rowCol: 1,
                            submitButtonPosition: 'right',
                            buttons: [
                                'edit',
                                'delete'
                            ]
                        },
                        fields: {
                            deptNam: {
                                label: "部门名称"
                            },
                            fzr: {
                                label: "负责人"
                            },
                            personal: {
                                label: "员工"
                            }
                        }
                    }
                }
            },
            "projectList": {
                config: {
                    label: "项目清单"
                },
                fields: {
                    table: {
                        config: {
                            rowCol: 2,
                            submitButtonPosition: 'right'
                        },
                        fields: {
                            projectName: {
                                label: '项目名称'
                            },
                            projectCode: {
                                label: '项目编号'
                            },
                            remark: {
                                label: '项目描述'
                            },
                            startDate: {
                                label: '开始时间'
                            },
                            endDate: {
                                label: '结束时间'
                            },
                            fzr: {
                                label: '负责人'
                            }
                        }
                    }
                }
            },
            "yunweiList": {
                config: {
                    label: "运维清单"
                },
                fields: {
                    table: {
                        config: {
                            rowCol: 1,
                            submitButtonPosition: 'right'
                        },
                        fields: {
                            projectName: {
                                label: '项目名称'
                            },
                            fzr: {
                                label: '负责人'
                            },
                            remark: {
                                label: '概述'
                            }
                        }
                    }
                }
            },
            "jichengList": {
                config: {
                    label: "集成清单"
                },
                fields: {
                    table: {
                        config: {
                            rowCol: 1,
                            submitButtonPosition: 'right'
                        },
                        fields: {
                            projectName: {
                                label: '项目名称'
                            },
                            fzr: {
                                label: '负责人'
                            },
                            remark: {
                                label: '概述'
                            }
                        }
                    }
                }
            },
            "roster": {
                config: {
                    label: "花名册"
                },
                fields: {
                    table: {
                        config: {
                            rowCol: 2,
                            submitButtonPosition: 'right'
                        },
                        fields: {
                            name: {
                                label: '人员姓名'
                            },
                            deptName: {
                                label: '所在部门'
                            },
                            date: {
                                label: '日期'
                            },
                            type: {
                                label: '类型'
                            },
                            remark: {
                                label: '备注'
                            },
                        }
                    }
                }
            },
            "other": {
                config: {
                    label: "其他"
                },
                fields: {
                    table: {
                        config: {
                            rowCol: 2,
                            submitButtonPosition: 'right'
                        },
                        fields: {
                            projectName: {
                                label: '项目名称'
                            },
                            projectCode: {
                                label: '项目编号'
                            },
                            remark: {
                                label: '项目描述'
                            },
                            startDate: {
                                label: '开始时间',
                                _type: 'date'
                            },
                            endDate: {
                                label: '结束时间',
                                _type: 'date'
                            },
                            fzr: {
                                label: '负责人'
                            }
                        }
                    }
                }
            }
        }
    }
}