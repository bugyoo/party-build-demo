<template>
    <div class="frame-container" :class="{'min-width': isMinWidth}">
        <!-- base-icon -->
        <ev-importFile href="//at.alicdn.com/t/font_1078828_tpsdzarm1n.css" type="css"></ev-importFile>

        <!-- template-icon -->
        <ev-importFile href="//at.alicdn.com/t/font_1611452_n9tii6ml0c.css" type="css"></ev-importFile>

        <!-- project-icon -->
        <ev-importFile href="//at.alicdn.com/t/font_1804771_osgshmn4029.css" type="css"></ev-importFile>

        <router-view></router-view>
    </div>
</template>

<script>
    export default JBoot({
        computed: {
            isMinWidth (){
                return !this.$route.path.startsWith('/invite') && !this.$route.path.startsWith('/h5');
            }
        },

        mounted (){
//            /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) && this.$warn('手机浏览某些页面会存在问题，推荐pc端查看！', 3000);
        }
    }).build();
</script>

<style lang="scss">
    .frame-container{
        width: 100%;
        height: 100%;
        /*font-family: 'SF UI Text Light', 'Helvetica Neue', 'HelveticaNeue', Helvetica, Arial, Verdana, sans-serif;*/
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,"\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-weight: 400;
        &.min-width{
            overflow-x: auto;
            & > div{
                min-width: 1366px;
            }
        }
    }
</style>
