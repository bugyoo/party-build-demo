let socketInstance, isFirstBreakLink = undefined;


const GateWaySocket = {
    wsURL: undefined,

    /**
     * 创建连接
     * @param userId
     * @param vm
     */
    createConnect (userId, vm){
        let wsBaseUrl = process.env.NODE_ENV === 'production' ? window.location.host + '/__api' : '127.0.0.1:9090';

        this.wsURL = `ws://${wsBaseUrl}/api/ws/plugins/telemetry`;
        // this.wsURL = `ws://127.0.0.1/__api/api/ws/plugins/telemetry`;

        if(userId){
            //建立webSocket连接
            socketInstance = new WebSocket(GateWaySocket.wsURL);

            bindSocketEvent(vm, userId);
        }
    },

    /**
     * 关闭连接
     */
    closeConnect (){
        socketInstance && socketInstance.close();
    }
};

function bindSocketEvent(vm, userId) {
    //打开webSocket连接时，回调该函数
    socketInstance.onopen = function () {
        if(isFirstBreakLink === false){
            isFirstBreakLink = true;

            vm.$notify({
                title: '实时数据连接成功',
                // message: "实时数据连接成功",
                type: 'success',
                offset: 60
            });
        }

        vm.$busListener && vm.$busListener.call({
            _uid: Date.now()
        }, 'socket.message.send', sendMessage);

        vm.$busBroadcast('socket.message.send', {
            type: 'index-real-data'
        });
        vm.$busBroadcast('socket.message.send', {
            type: 'index-real-warn'
        });

        function sendMessage(message) {
            try {
                socketInstance && socketInstance.send(JSON.stringify(message));
            }catch (e) {
                console.log('' +
                    '，序列化失败，发送内容：', message);
            }
        }

        setInterval(function () {
            sendMessage({ type: 'heartbeat' });
        }, 15 * 1000);
    };

    //关闭socket连接时，回调该函数
    socketInstance.onclose = function (e) {
        if(isFirstBreakLink === undefined){
            isFirstBreakLink = false;

            vm.$notify({
                title: '警告',
                message: "实时数据断开连接，正在尝试重连...",
                type: 'warning',
                offset: 60
            });
        }

        socketInstance && socketInstance.close();

        setTimeout(()=>{
            socketInstance = new WebSocket(GateWaySocket.wsURL);

            bindSocketEvent(vm, userId);
        },5000);

        //关闭连接
        console.log("onclose");
    };

    //接收信息
    socketInstance.onmessage = function (messageEvent) {
        try {
            let { type, detail, notifyUserId } = JSON.parse(messageEvent.data);

            ['device-offline', 'device-online'].includes(type) &&
            console.log(`[socket] type: ${type}, notifyUserId: ${notifyUserId}, currentUserId: ${userId}`);

            if(!!notifyUserId && notifyUserId !== userId) return;

            switch (type) {
                case 'notice-warn':
                    if (userId === detail.accountId) {
                        vm.$pushText2VoiceNotification({
                            text: detail.remark,
                            callback() {
                                vm.$notify({
                                    title: '警告',
                                    message: ` ${detail.remark}`,
                                    type: 'warning',
                                    offset: 60
                                });
                            }
                        });
                    }
                    break;
                case "device-online":
                    console.log("设备上线");
                    break;
                case 'index-realtime-warn':
                    vm.$busBroadcast('index-realtime-warn', detail);
                    break;
                case 'index-realtime-data':
                    vm.$busBroadcast('index-realtime-data', detail);
                    break;
                case 'monitor-data':
                    vm.$busBroadcast('monitor-data', detail);
                    break;
                case 'monitor-chart':
                    vm.$busBroadcast('monitor-data', detail);
                    break;
                case 'device-offline':
                    vm.$busBroadcast('device-offline', detail);
                    break;
            }
        } catch (e) {
            console.log('反序列化socket消息失败，返回内容：', messageEvent);
        }
    }


}

export default GateWaySocket;
