<template>
    <div class="no-authority-wrap">
        <img src="~@/assets/no-authority/personal.png" alt="401">

        <p class="code-wrap">401</p>

        <p class="message-wrap">啊哦，您当前登录的账号未分配角色，请联系管理员！</p>

        <div class="button-wrap">
            <el-button type="primary" @click="handleLogout">退出登录</el-button>
        </div>
    </div>
</template>

<script>
    export default JBoot({
        props: {},

        data() {
            return {}
        },

        computed: {},

        methods: {
            handleLogout (){
                this.$isOk('退出登录', '您确定要退出登录吗？').then(() => {
                    this.$api('user', 'logout').then(({ success }) => {
                        if(success){
                            let { logoutUrl } = this.otherInfo.frontConfig;

                            window.location.href = logoutUrl + '?redirect_uri=' + window.location.origin;
                        }
                    });
                });
            }
        },

        watch: {}
    }).store('otherInfo').build();
</script>

<style lang="scss">
    .no-authority-wrap {
        width: 100%;
        height: 100%;
        text-align: center;
        & > img{
            margin-top: 50px;
            width: 300px;
            height: 350px;
        }
        & > .code-wrap{
            color: #000000d9;
            font-size: 24px;
            margin-top: 30px;
        }
        & > .message-wrap{
            margin-top: 5px;
            font-size: 14px;
            color: #909399;
        }
        & > .button-wrap{
            margin-top: 30px;
        }
    }
</style>
