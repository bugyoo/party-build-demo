<template>
    <div class="ck-player-wrap" ref="videoWrapRef">
        <div class="video" id="video"></div>
    </div>
</template>

<script>
    import '@/../static/ckplayer/ckplayer.js'

    export default JBoot({
        registryName: 'CkPlayer',

        props: {
            url: {
                required: true,
                type: String
            },

            options: {
                type: Object,
                default (){
                    return {
                        seek: 0,
                        timeScheduleAdjust: 1
                    }
                }
            }
        },

        data() {
            return {}
        },

        computed: {},

        beforeDestroy (){
            this.player && this.player.videoPause();
        },

        mounted (){
            let maskId = this.$openMask(this.$getRef('videoWrapRef'), '正在努力加载资源中...');

            this.player = new ckplayer({
                container: '#video',
                variable: 'player',
                video: this.url,
                poster: this.options.poster,
                html5m3u8: true,
                seek: this.options.seek,
                // volume: 0,
                configJson: {
                    // 是否允许快进
                    timeScheduleAdjust: this.options.timeScheduleAdjust
                }
            });

            this.player.addListener('loadedmetadata', () => {
                this.$closeMask(maskId);
            });

            this.player.addListener('play', () => {
                // console.log(this.player);
                //
                // setTimeout(() => {
                //     this.player.changeVolume(.8);
                // }, 3000);
            });

            this.player.addListener('error', () => {
                this.$warn('加载视频资源失败，请刷新页面重试！');

                this.$closeMask(maskId);
            });
        },

        methods: {},

        watch: {}
    }).build();
</script>

<style lang="scss">
    .ck-player-wrap {
        width: 100%;
        height: 100%;
        & > .video{
            width: 100%;
            height: 100%;
        }
    }
</style>
