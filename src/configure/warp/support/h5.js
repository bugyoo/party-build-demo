/**
 * Created by litao on 2018/11/22.
 */
export default {
    computed: {
        currentRouteName (){
            return this.$route ? this.$route.meta ? this.$route.meta.title ? this.$route.meta.title + ' - ' : '' : '' : '';
        }
    },

    mounted (){
        this.changeBrowserTitle();

        this.getH5QrCode();
    },

    methods: {
        /**
         * 改变浏览器标题
         */
        changeBrowserTitle (){
            window.document.title = `${this.currentRouteName}物业管理中心`;
        },

        /**
         * 登录或注册
         */
        loginOrRegistry (){
            if(!this.loginFormData.msgCode){
                this.errorMsg = '请输入验证码';
            }else if(this.loginFormData.msgCode.length !== 4){
                this.errorMsg = '验证码为4位数';
            }else{
                this.errorMsg = undefined;
            }

            if(!this.errorMsg) {
                this.$api('user', 'login', this.loginFormData).then(response => {
                    //设置token
                    this.$token.set(response.data);

                    this.loginAfter && this.loginAfter();
                });
            }
        },

        /**
         * 获取h5页面的二维码
         */
        getH5QrCode (){
            let h5QrCodeDom = document.getElementById('h5QrCode');

            h5QrCodeDom && this.$api('article', 'queryInfoByEntity', {
                fieldType: 'h5QrCode'
            }).then(response => {
                h5QrCodeDom.src = response.data.titleImg;
            });
        }
    }
}