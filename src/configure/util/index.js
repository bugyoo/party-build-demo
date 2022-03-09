let durationToDisplay = function(durationObj){
    if( !durationObj ){
        return ''
    }

    let seconds = Number(durationObj) ;
    let hour = parseInt(seconds / 3600) ;
    let minute = parseInt( (seconds - hour*3600) / 60 )
    let second = (seconds - hour*3600 - minute * 60) ;

    return hour.toString().leftPad(2,'0') + ':' + minute.toString().leftPad(2,'0') + ':' + second.toString().leftPad(2,'0') ;
}

let dateFormat = function dateFormat(fmt, date) {
    date = date || new Date()
    if(typeof date ==='string'){
        date = new Date(date);
    }

    fmt = fmt || 'YYYY-mm-dd'
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

// 全局配置
let globalConfig = {

}

//判断按钮是否有权限显示
let viewButton = function(buttonName){
	
	let roleCode = sessionStorage.getItem('$fosung-cloud-front-current-org-role-code');
	
	//资源报送角色，不显示打包下载
	if( roleCode ==='1001203792189394944' && buttonName === 'dbxz'){
		 return false;
	}
    if( roleCode ==='2020022801' && buttonName === 'isView'){
        return false;
    }
    if( roleCode ==='2020022801' && buttonName === 'xgpx'){
        return false;
    }
    if( roleCode ==='1012450396420050946' && buttonName === 'isView'){
        return false;
    }
    if( roleCode ==='1012450396420050946' && buttonName === 'xgpx'){
        return false;
    }
    if( roleCode ==='1001203792189394944' && buttonName === 'isView'){
        return false;
    }
    if( roleCode ==='1001203792189394944' && buttonName === 'xgpx'){
        return false;
    }
    if( roleCode ==='1002450396420050944' && buttonName === 'isView'){
        return false;
    }
    if( roleCode ==='1002450396420050944' && buttonName === 'xgpx'){
        return false;
    }
	return true;
	
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {

    let timeout, args, context, timestamp, result

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function(...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

export default {

    install : function(){
        String.prototype.leftPad=function(len,ch){
            ch= typeof(ch)==='undefined' ? ' ' : ch ;

            let s = String(this);

            // console.log('============'+s)

            while(s.length<len){
                s = ch + s ;
            }

            return s;
        }

        window.UtilDisplay = {
            durationToDisplay ,
            dateFormat ,
            globalConfig,
			viewButton
        }
    }


}
