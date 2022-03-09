/**
 * Created by litao on 2019/2/28.
 */
const path = require('path');
const server = require('pushstate-server');
const sourcePath = path.resolve(__dirname, '../../');
console.log('sourcePath: ', sourcePath);

server.start({
    port: 9526,
    directory: sourcePath,
    file: './index.html'
});
console.log(`> 启动服务成功，地址： http://localhost:9526 \n`);