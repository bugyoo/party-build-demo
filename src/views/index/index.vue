<template>
    <div class="home">
        <img class="home-img" src="~@/assets/layout/组 5.png" alt="" />
        <div class="home-text">
            <span>{{ sayHelloText }}欢迎来到管理系统~</span>
        </div>
        <p class="home-say">
            “乡村振兴不是坐享其成，等不来、也送不来，要靠广大农民奋斗。村党支部要成为帮助农民致富、
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;维护农村稳定、推进乡村振兴的坚强战斗堡垒。”
        </p>
        <p class="home-people">——习近平</p>
    </div>
</template>

<script>
    export default JBoot({
        props: {},

        data() {
            return {};
        },

        computed: {
            sayHelloText() {
                let text,
                    now = new Date(),
                    hour = now.getHours();

                if (hour < 6) {
                    text = "凌晨好";
                } else if (hour < 9) {
                    text = "早上好";
                } else if (hour < 12) {
                    text = "上午好";
                } else if (hour < 14) {
                    text = "中午好";
                } else if (hour < 17) {
                    text = "下午好";
                } else if (hour < 19) {
                    text = "傍晚好";
                } else if (hour < 22) {
                    text = "晚上好";
                } else {
                    text = "夜里好";
                }

                return text + "，";
            }
        },

        methods: {},

        watch: {}
    }).build();
</script>

<style lang="scss">
    .home {
        width: 704px;
        height: 150px;
        margin: auto;
        margin-top: 80px;
        & > .home-img {
            display: block;
            width: 120px;
            height: 120px;
            margin: auto;
        }
        .home-text {
            margin-left: 250px;
            margin-top: 48px;
            width: 204px;
            height: 14px;
            font-size: 13px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 23px;
            color: rgba(51, 51, 51, 1);
            opacity: 1;
        }
        .home-say {
            margin: 0 auto;
            margin-top: 61px;
            width: 704px;
            height: 47px;
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 27px;
            color: rgba(170, 170, 170, 1);
            opacity: 1;
        }
        .home-people {
            margin-left: 592px;
            margin-top: 18px;
            width: 124px;
            height: 24px;
            font-size: 24px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 41px;
            color: rgba(170, 170, 170, 1);
            opacity: 1;
        }
    }
</style>
