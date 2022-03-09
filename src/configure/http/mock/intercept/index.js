/**
 * key is request URL
 * value is response handler function
 * @type {{}}
 */
export default Object.assign([
    '/api/user/configure',
    '/api/user/info',
    '/logout',
    '/api/dict/query',
    '/api/dict/queryChildren',
    '/api/dict/getOne',
    '/api/dict/save',
    '/api/dict/delete',
    '/api/tabulation/list',
    '/api/tabulation/delete',
    '/api/tabulation/sex',
].reduce((result, url) => Object.assign(result, { [url]: request => generateResponseResult(url, request) }), {}), {});

const exDataMap = {

};

function generateResponseResult(path, request, { success = true, code = 200, message } = {}) {
    let data = {};

    try {
        data = require(`../response${path}`).default;

        if(data && typeof data === 'function') data = data(JSON.parse(request.body || "{}"));
    } catch (e) {
        console.log(`未找到mock返回文件，默认返回空对象 ===> ${path}`);
    }

    let targetResult = {} ;

    if( data ){
        if ( data.pagesize && (data.datalist || data.data)) {
            targetResult = Object.assign({}, {
                success,
                code,
                message,
                exData: exDataMap[path]
            }, data);
        } else {
            targetResult = Object.assign({}, {
                success,
                code,
                message,
                exData: exDataMap[path]
            }, {
                data
            });
        }
    }

    console.log('mock targetResult========'+JSON.stringify(targetResult))

    return targetResult ;

}
