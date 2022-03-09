<script>
    import EasyScrollBar from 'easyscroll';

    export default {
        name: 'JScroll',

        registryName: 'JScroll',

        mixins: [ EasyScrollBar ],

        methods: {
            update: function update() {
                let heightPercentage = void 0,
                    widthPercentage = void 0;
                let wrap = this.wrap;
                if (!wrap) return;
                heightPercentage = wrap.clientHeight * 100 / wrap.scrollHeight;
                widthPercentage = wrap.clientWidth * 100 / wrap.scrollWidth;
                this.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : '';
                this.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : '';
                if (this.$refs.refVBar) {
                    if (this.sizeHeight === 0) {
                        this.$refs.refVBar.$el.style.display = "none";
                    } else {
                        this.$refs.refVBar.$el.style.display = "block";
                    }
                }
                if (this.$refs.refHBar) {
                    //存在水平滚动条的情况下
                    if (this.sizeWidth === 0) {
                        this.$refs.refHBar.$el.style.display = "none";
                    } else {
                        this.$refs.refHBar.$el.style.display = "block";
                    }
                }
            }
        }
    }
</script>