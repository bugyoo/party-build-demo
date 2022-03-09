<template>
    <el-dialog
            :visible.sync="visible"
            width="350px"
            title="修改用户密码"
            custom-class="user-change-password-container">
        <el-form :ref="editFormRef" :model="formData" label-width="80px" :rules="rules" @submit.native.prevent>
            <el-form-item label="旧密码" prop="oldPassword" v-if="parentParam.showOldPassword">
                <el-input v-model="formData.oldPassword" placeholder="请输入旧密码"></el-input>
            </el-form-item>

            <el-form-item label="新密码" prop="password">
                <el-input v-model="formData.password" placeholder="请输入新密码"></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword" ref="confirmPasswordItemRef">
                <el-input v-model="formData.confirmPassword" placeholder="请输入确认密码"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer">
            <el-button type="success" class="button-wide" @click="submitHandler">确定</el-button>
            <el-button type="info" class="button-wide" @click="visible = false;">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default JBoot({
        registryName: 'change-password',

        data (){
            return {
                moduleName: 'personal',
                submitMethod: 'modifyPassword',
                editFormRef: 'changePasswordFormRef',
                rules: {
                    oldPassword: [
                        { required: true, message: '请输入旧密码' }
                    ],
                    password: [
                        { required: true, message: '请输入要修改的新密码' },
                        { validator: (rule, value, callback) => {
                            if(this.formData.confirmPassword){
                                let confirmItemInstance = this.$getRef('confirmPasswordItemRef');
                                if(confirmItemInstance && confirmItemInstance.validate && typeof confirmItemInstance.validate === 'function'){
                                    confirmItemInstance.validate();
                                }
                            }

                            callback();
                        } }
                    ],
                    confirmPassword: [
                        { required: true, message: '请输入确认密码' },
                        { validator: (rule, value, callback) => {
                            if(!this.formData.password){
                                callback();
                            }else if(value && this.formData.password !== value){
                                callback(new Error('两次密码输入不一致'));
                            }else{
                                callback();
                            }
                        } }
                    ]
                }
            }
        },

        methods: {
            initForm (){
                this.resetFormDataInfo();
            },

            //获取表单数据
            getEditFormDataInfo (){
                return {
                    id: this.id,
                    oldPassword: this.formData.oldPassword,
                    password: this.formData.password
                };
            }
        }
    }).form().build();
</script>

<style lang="scss">
    .user-change-password-container{
        & > .el-dialog__body{
            padding: 10px 15px;
        }
    }
</style>