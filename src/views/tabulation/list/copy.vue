<template>
    <el-dialog
            :append-to-body="true"
            title="获取地址110"
            :visible.sync="visible"
            width="40%"
            :close-on-click-modal="false">
        <el-row style="margin: 10px 0 15px 0">
            <el-col :span="4">
                <span style="vertical-align: middle">地址信息：</span>
            </el-col>
            <el-col :span="20">
                <el-input id="encryptionCode" placeholder="请输入资源名称" clearable v-model="this.parentParam.url"  style="width:100%" readonly></el-input>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="visible = false">关 闭</el-button>
                    <el-button type="primary" @click="copyCode()">复 制</el-button>
                </span>
    </el-dialog>
</template>
<script>
    export default JBoot({
        components: {
            // 'add': require('./add').default
        },

        props: {},

        data() {
            return {
            }
        },
        computed: {},
        methods: {
            //复制下载地址
            copyCode(){
                let oInput = document.createElement('input');
                oInput.value = this.parentParam.url;
                document.body.appendChild(oInput);
                oInput.select();
                if(document.execCommand("Copy")) {
                    this.$message({type: 'success', message: '复制成功'});
                }else{
                    this.$warn('复制失败');
                }
                oInput.className = 'oInput';
                oInput.style.display = 'none';
                oInput.remove();
            },
        },

        watch: {}
    }).form().build();
</script>
