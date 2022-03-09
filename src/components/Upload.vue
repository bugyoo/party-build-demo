<template>
    <div class="component-upload-container">
        <!-- 图片展示 -->
        <template v-if="image">
            <template v-if="multiple">
                <!--<span v-for="(item, index) in value">{{item}}</span>-->
                <img v-for="(item, index) in value" :src="item.url" :style="{
                    width,
                    height,
                    marginRight: '5px'
                }" @click="$openNewWindow(item.url)">
            </template>
            <template v-else>
                <!--<img :src="value" style="width: 100%; height: 100%;">-->
            </template>
        </template>
        <template v-else-if="$attrs.showFileList">
            <ul v-if="value && value.length > 0" class="component-attach-list">
                <li class="component-attach-item" v-for="(item, index) in value" v-if="item && item.oldname">
                    <ev-attachTypeIcon :type="$getAttachTypeByName(item.oldname)"></ev-attachTypeIcon>
                    <span :title="item.oldname">{{item.oldname}}</span>
                    <ev-attachDownLoad :url="item.url"></ev-attachDownLoad>
                    <ev-attachRemove @click.native="removeConfirm(item)"></ev-attachRemove>
                </li>
            </ul>
        </template>

        <el-upload
                v-bind="$attrs"
                ref="fileUploadRef"
                class="upload-container-class"
                :class="{'image': image}"
                :action="url ||'/sys/attachment/upload'"
                :headers="uploadHeaders"
                :before-upload="beforeUploadHandler"
                :on-success="uploadSuccessHandler"
                :on-error="uploadErrorHandler"
                :show-file-list="false"
                :style="image ? {
                    width,
                    height,
                    lineHeight: height
                } : {}"
                :file-list="fileList">
            <slot>
                <template v-if="image">
                    <i v-if="multiple" class="el-icon-plus"></i>
                    <template v-else="">
                        <img v-if="value" :src="value">
                        <template v-else="">
                            <i v-if="!$attrs.disabled" class="el-icon-plus" :title="title"></i>
                            <span v-else="" style="font-size: 12px; color: #999;">暂无图片</span>
                        </template>
                    </template>
                </template>
                <template v-else>
                    <template v-if="multiple">
                        <a target="_blank" class="file-item-link" v-for="(item, index) in value || []" :key="index" :href="item.name || item.oldname || item" :title="item.name || item.oldname || item">{{ item.name || item.oldname || item }}</a>
                    </template>
                    <template v-else-if="value">
                        <a target="_blank" class="file-item-link" :title="value.name || value.oldname || value" :href="value.name || value.oldname || value">{{ value.name || value.oldname || value }}</a>
                    </template>

                    <i class="el-icon-upload upload-icon" :title="title"></i>
                </template>
            </slot>

            <slot slot="tip" name="tip"></slot>
        </el-upload>
    </div>
</template>

<script>
    export default JBoot({
        name: 'upload',

        componentName: 'upload',

        registryName: 'upload',

        inject: ['elFormItem'],

        props: {
            url: String,
            title: {
                type: String,
                default: '点击选择文件上传'
            },
            value: {
                required: true,
            },
            echoFileRemove: {
                type: Function,
                default(file) {
                    return this.$api('common', 'removeAttach', [{id: file.id}]).catch(error => {
                        let errorMsg = error ? error.message || error.msg : '删除异常！';
                        this.$error(errorMsg);
                    });
                }
            },
            image: Boolean,
            multiple: Boolean,
            width: {
                type: String,
                default: '100px'
            },
            height: {
                type: String,
                default: '100px'
            },
            beforeUpload: Function,
            uploadSuccess: Function
        },

        data() {
            return {
                fileList: [],
                uploadList: [],
                attachList: []
            }
        },

        computed: {
            uploadHeaders() {
                let headers = {};

                headers[this.$token.getTokenKey()] = this.$token.getToken();

                return headers;
            },

            uploadFiles() {
                return this.attachList.concat(this.value).filter(item => item);
            },

            uploadInstance() {
                return this.$getRef('fileUploadRef');
            }
        },

        methods: {
            beforeUploadHandler(file) {

                this.beforeUpload && this.beforeUpload();
                this.uploadList.push(file.uid);

            },

            uploadSuccessHandler(response, file, fileList) {
                if (response) {
                    if (response.success) {
                        this.attachList.push(response.data);
                        this.uploadSuccess && this.uploadSuccess();
                    }else{
                        this.$error(response.message || '上传异常，请重试！');
                    }
                } else {
                    this.$error('上传异常，请重试！');
                }
                this.checkUploadComplete(file);
            },

            uploadErrorHandler(error, file, fileList) {

                this.checkUploadComplete(file);

                let errorMsg = '上传异常，请重试！';

                if (error && error.message) {
                    try {
                        let errorObj = JSON.parse(error.message);
                        let message = errorObj.message || errorObj.msg;
                        if (message) errorMsg = message;
                    } catch (e) {
                    }
                }

                this.$error(errorMsg);
            },

            checkUploadComplete(file) {
                this.uploadList = this.uploadList.filter(item => item !== file.uid);

                if (this.uploadList.length === 0) {
                    let result = this.uploadFiles;
                    if (this.image && !this.multiple) {
                        result = (result[0] || {}).url;
                    }
                    this.$emit('input', result);
                    if (this.elFormItem) {
                        this.elFormItem.$emit('el.form.change', result);
                    }
                    this.clearFiles();
                }
            },

            removeConfirm(file) {
                this.$isOk('删除确认', '是否要删除该文件？').then(() => {
                    this.removeFileHandler(file);
                })
            },

            removeFileHandler(file) {
                if (file.id) { //已保存过的
                    let _promise = this.echoFileRemove(file);
                    if (!(_promise instanceof Promise)) {
                        this.$error(`[echoFileRemove]配置必须返回一个Promise对象！`);
                    } else {
                        _promise.then(() => {
                            this.$emit('input', this.uploadFiles.filter(item => item.uid !== file.uid));
                            this.clearFiles();
                        });
                    }
                } else { //新上传的
                    this.$emit('input', this.uploadFiles.filter(item => item.uid !== file.uid));
                    this.clearFiles();
                }
            },

            clearFiles() {
                if (this.uploadInstance) {
                    this.uploadInstance.clearFiles();
                }
                this.attachList = [];
            }
        },

        watch: {
            value: {
                immediate: true,
                handler(v, o) {
                    if (this.image) return;

                    if(this.multiple){
                        this.fileList = v || [];
                    }else{
                        this.fileList = v ? [{ uri: v }] : [];
                    }
                }
            }
        }
    }).build();
</script>

<style lang="scss">
    .component-upload-container {
        & > .component-attach-list {
            list-style: none;
            margin: 0;
            padding: 0;
            line-height: 14px;
            margin-top: 9px !important;

            & > .component-attach-item {
                display: inline-block;
                margin: 0 10px 10px 0;

                & > span {
                    float: left;
                    max-width: 200px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }

        & > .upload-container-class {
            & > .el-upload {
                & > .upload-icon {
                    font-size: 16px;
                    cursor: pointer;
                    color: #2196F3;
                    font-weight: 500;

                    &:hover {
                        color: #03a9f4;
                    }
                }
            }

            &.image > .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                width: 100%;
                height: 100%;
                text-align: center;
                font-size: 25px;

                &:hover {
                    border-color: #03a9f4;
                    color: #03a9f4;
                }

                & > img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .file-item-link{
            display: inline-block;
            width: 120px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: middle;
        }
    }
</style>
