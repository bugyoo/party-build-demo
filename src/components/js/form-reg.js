/**
 * Created by litao on 2018/10/29.
 */
export default {
    /**
     * 邮箱验证
     * @param rule
     * @param value
     * @param callback
     */
    email: function (rule, value, callback) {
        if(!value || /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)){
            callback();
        }else{
            callback(new Error('请输入正确的邮箱！'));
        }
    },

    /**
     * 英文字符验证
     * @param rule
     * @param value
     * @param callback
     */
    english: function (rule, value, callback) {
        if(!value || /^[a-zA-Z]+$/.test(value)){
            callback();
        }else{
            callback(new Error('只允许输入英文字符！'));
        }
    },

    /**
     * 中文字符验证
     * @param rule
     * @param value
     * @param callback
     */
    chinese: function (rule, value, callback) {
        if(!value || /^[\u4e00-\u9fa5]+$/.test(value)){
            callback();
        }else{
            callback(new Error('只允许输入中文字符！'));
        }
    }
}