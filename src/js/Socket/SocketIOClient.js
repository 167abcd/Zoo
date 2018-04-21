
/**
 * Created by cocos2d on 11/9/2016.
 */

(function(){
    var SocketIO = cc.Class.extend({
        ctor : function () {
            this.wsocket = null;
            this.socketStatus = SocketIO.NotConnection;
            this._waitingPing = false;

            var thiz = this;
            function onTimerTick() {
                thiz.updatePing();
            }
            setInterval(onTimerTick, 5000); // 5s
        },
        updatePing : function () {
            // if(this.wsocket && this.socketStatus === SocketIO.Connected){
            //     if(this._waitingPing){
            //         //lost ping
            //         cc.log("[SocketIO] lost PING");
            //         this.closeSocket();
            //         this.setSocketStatus(SocketIO.LostConnection);
            //     }
            //     else{
            //         //send ping
            //         var pingMessage = {
            //             c : "ping"
            //         };
            //         this.send(JSON.stringify(pingMessage));
            //         this._waitingPing = true;
            //         this._sendPingTime = Date.now();
            //     }
            // }
        },
        connect : function (url) {
            if(this.wsocket){
                this.close();
            }
            this.setSocketStatus(SocketIO.Connecting);

            // var connectionOptions =  {
            //     "force new connection" : true,
            //  //   "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            //  //   "timeout" : 10000, //before connect_error and connect_timeout are emitted.
            //     "transports" : ["websocket"]
            // };

          // var wsocket = io(url, connectionOptions);

            var wsocket = io.connect(url);
            this.wsocket = wsocket;

            var thiz = this;

            // this.wsocket.onopen = function (event) {
            //     //  cc.log("onOpen: "+event.type);
            //     if(thiz.socketStatus === SocketIO.Connecting){
            //         thiz._waitingPing = false;
            //         thiz.setSocketStatus(SocketIO.Connected);
            //     }
            // };
            // this.wsocket.onmessage = function (event) {
            //     //  cc.log("onmessage: "+event.type);
            //     thiz.onRecvMessage(event.data);
            // };
            // this.wsocket.onerror = function (event) {
            //     thiz.closeSocket();
            //     if(thiz.socketStatus === SocketIO.Connecting){
            //         thiz.setSocketStatus(SocketIO.ConnectFailure);
            //     }
            //     else if(thiz.socketStatus === SocketIO.Connected){
            //         thiz.setSocketStatus(SocketIO.LostConnection);
            //     }
            // };
            // this.wsocket.onclose = function (event) {
            //     thiz.closeSocket();
            //     if(thiz.socketStatus === SocketIO.Connecting){
            //         thiz.setSocketStatus(SocketIO.ConnectFailure);
            //     }
            //     else if(thiz.socketStatus === SocketIO.Connected){
            //         thiz.setSocketStatus(SocketIO.LostConnection);
            //     }
            // };

            var onOpenHandler = function () {
                if(thiz.socketStatus === SocketIO.Connecting){
                    thiz._waitingPing = false;
                    thiz.setSocketStatus(SocketIO.Connected);
                }
            };

            var onErrorHandler = function () {
                thiz.closeSocket();
                if(thiz.socketStatus === SocketIO.Connecting){
                    thiz.setSocketStatus(SocketIO.ConnectFailure);
                }
                else if(thiz.socketStatus === SocketIO.Connected){
                    thiz.setSocketStatus(SocketIO.LostConnection);
                }
            };

            var onMessageHandler = function (data) {
                thiz.onRecvMessage(data);
            };

            wsocket.on('connect', function () {
                cc.log("[SocketIO] connect: ", arguments);
                onOpenHandler();
            });

            wsocket.on('connect_error', function () {
                cc.log("[SocketIO] connect_error: ", arguments);
                onErrorHandler();
            });

            wsocket.on('connect_timeout', function () {
               // cc.log("connect_timeout: ", arguments);
                onErrorHandler();
            });

            wsocket.on('disconnect', function () {
                cc.log("[SocketIO] disconnect: ", arguments);
                onErrorHandler();
            });

            wsocket.on('publish', function (msg) {
                onMessageHandler(msg);
            });
        },
        close : function () {
            this.closeSocket();
            if(this.socketStatus === SocketIO.Connected){
                this.setSocketStatus(SocketIO.Closed);
            }
        },
        closeSocket : function () {
            if(this.wsocket){
                this.resetSocket();
                this.wsocket.close();
                this.wsocket = null;
            }
        },
        resetSocket : function () {
            if(this.wsocket){
                // this.wsocket.onopen = 0;
                // this.wsocket.onmessage = 0;
                // this.wsocket.onerror = 0;
                // this.wsocket.onclose = 0;
            }
        },
        setSocketStatus : function (status) {
            this.socketStatus = status;
            if(this.onEvent){
                this.onEvent("socketStatus", SocketIO.StatusName[this.socketStatus]);
            }
        },
        onRecvMessage : function (data) {
            var obj = JSON.parse(data);

            var cmd = obj["c"];
            if(cmd === "ping"){
                var latency = Date.now() - this._sendPingTime;
                cc.log("[SocketIO] Recv PING: "+latency.toString() + "ms");

                this._waitingPing = false;
            }
            else{
                if(this.onEvent) {
                    this.onEvent("message", data);
                    //console.log(obj);
                    cc.log("[SocketIO] onRecvMessage: "+data);
                }
            }
        },
        getStatus : function () {
            return this.socketStatus;
        },
        send : function (data) {
            if(this.wsocket && this.socketStatus === SocketIO.Connected){
                this.wsocket.emit('message', data);
            }
        }
    });

    SocketIO.NotConnection = 0;
    SocketIO.Connecting = 1;
    SocketIO.Connected = 2;
    SocketIO.ConnectFailure = 3;
    SocketIO.LostConnection = 4;
    SocketIO.Closed = 5;

    SocketIO.StatusName = SocketIO.StatusName || {};
    SocketIO.StatusName[SocketIO.NotConnection] = "NotConnected";
    SocketIO.StatusName[SocketIO.Connecting] = "Connecting";
    SocketIO.StatusName[SocketIO.Connected] = "Connected";
    SocketIO.StatusName[SocketIO.ConnectFailure] = "ConnectFailure";
    SocketIO.StatusName[SocketIO.LostConnection] = "LostConnection";
    SocketIO.StatusName[SocketIO.Closed] = "Closed";

    window.socket = window.socket || {};
    window.socket.SocketIO = SocketIO;
})();

