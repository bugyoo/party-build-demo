<template>
    <el-dialog
            custom-class="components-preview-pdf-wrap"
            :visible.sync="visible"
            :title="title"
            append-to-body
            :width="width"
            top="5vh"
            @closed="handleClosed"
    >
        <iframe v-if="!!previewURL" ref="previewPdfIframeRef" :src="previewURL" width="100%" height="100%" frameborder="0"></iframe>
    </el-dialog>
</template>

<script>
    export default JBoot({
        registryName: 'preview-pdf',

        props: {
            title: {
                default (){
                    return 'PDF预览'
                }
            },

            width: {
                default (){
                    return '850px';
                }
            }
        },

        data() {
            return {
                serverURL: '../../static/pdf/web/viewer.html',
                pdfURL: undefined,
                visible: false
            }
        },

        computed: {
            previewURL (){
                return this.pdfURL ? this.serverURL + '?file=' + encodeURIComponent(this.pdfURL) : undefined;
            }
        },

        methods: {
            open (pdfURL){
                this.visible = true;

                this.pdfURL = pdfURL;

                this.$nextTick(function () {
                    let previewPdfIframeInstance = this.$getRef('previewPdfIframeRef');

                    let loadMaskId = this.$openMask(document.querySelector('.components-preview-pdf-wrap > .el-dialog__body'), '正在加载...');

                    previewPdfIframeInstance.contentWindow.addEventListener('pdfLoaded', () => {
                        loadMaskId && this.$closeMask(loadMaskId);

                        this.$emit('load');
                    });
                });
            },

            handleClosed (){
                this.pdfURL = undefined;
            }
        },

        watch: {}
    }).build();
</script>

<style lang="scss">
    .components-preview-pdf-wrap {
        & > .el-dialog__body{
            padding: 0 !important;
            height: 80vh;
        }
    }
</style>
