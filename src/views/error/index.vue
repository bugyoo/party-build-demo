<template>
    <div class="error-index-wrap">
        <ev-iconFont icon="icon-yichang"></ev-iconFont>

        <p>啊哦，服务器好像出现了一点故障，工程师正在抢修中...</p>

        <p class="button-wrap">
            <span v-if="errorPageRouteObj && errorPageRouteObj.path" class="back-prev-page" @click="jumpHandler(errorPageRouteObj)">回到之前页面</span>
            <span class="back-index-page" @click="jumpHandler('/')">去首页({{ backIndexTime }}s)</span>
        </p>
    </div>
</template>

<script>
    export default JBoot({
        props: {
            errorPageRoute: String
        },

        data() {
            return {
                backIndexTime: 5
            }
        },

        computed: {
            errorPageRouteObj (){
                try {
                    return this.$decrypt(this.errorPageRoute);
                } catch (e) {}
            }
        },

        mounted (){
            this.startInterval();
        },

        methods: {
            jumpHandler (routeParam){
                this.stopInterval();

                this.$jump(routeParam);
            },

            startInterval (){
                this.intervalId = setInterval(() => {
                    if(this.backIndexTime === 1){
                        this.stopInterval();

                        this.$jump('/');
                    }else{
                        this.backIndexTime -= 1;
                    }
                }, 1000);
            },

            stopInterval (){
                this.intervalId && clearInterval(this.intervalId);
            }
        },

        watch: {}
    }).build();
</script>

<style lang="scss">
    .error-index-wrap {
        text-align: center;
        background-color: #ecf5ff;
        height: 100%;
        width: 100%;
        color: #f56c6c;
        & > i{
            display: inline-block;
            margin-top: 100px;
            font-size: 110px;
        }
        & > p{

        }
        & > .button-wrap{
            margin-top: 20px;
            font-size: 14px;
            cursor: pointer;
            & > span:hover{
                font-weight: 500;
            }
            & > .back-prev-page{
                color: #909399;
            }
            & > .back-index-page{
                color: #409eff;
                text-decoration: underline;
                margin-left: 10px;
            }
        }
    }
</style>
