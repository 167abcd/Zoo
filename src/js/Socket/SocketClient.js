/**
 * Created by dsh on 3/23/2018.
 *
 *
 *
 */

var  SocketClient= (function () {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,
        ctor: function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                var thiz = this;
                this._isLogined = false;
                this.allListener = {};

                this.lobbySocket = new socket.LobbyClient(2);
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onRecvMessage(messageName, data);
                };

                this.addListener(0, this._onRecvPing, this);
                this._initAllListener();

                setInterval(function () {
                    thiz._pingSchedule();
                }, 5000);
            }
        },

        _pingSchedule: function () {
            if(this.isConnected()){
                if(this._waitingPing){
                    this.lobbySocket.closeLostPing();
                }
                else{
                    var request = {
                        c: 0,
                        d: ""
                    };
                    this.send(request);
                }
            }
        },

        _onRecvPing: function () {
            this._waitingPing = false;
        },

        isLogined: function () {
            return this._isLogined;
        },
        isLoggin: function () {
            return this.isLogined();
        },

        connect: function () {
            this._waitingPing = false;
            this._isLogined = false;
            if (this.lobbySocket) {
                if(cc.sys.isNative){
                    this.lobbySocket.connect(SocketClient.ServerInfo["host"], SocketClient.ServerInfo["port"]);
                }
                else{
                    this.lobbySocket.connect(SocketClient.ServerInfo);
                }
            }
        },

        close: function () {
            if (this.lobbySocket) {
                this.lobbySocket.close();
            }
        },

        send: function (message) {
            if (this.lobbySocket) {
                if(message.c != 0) cc.log("lobbyClient[SEND]: ",message);
                this.lobbySocket.send(JSON.stringify(message));
            }
        },

        onRecvMessage: function (messageName, data) {
            if (messageName === "socketStatus") {
                this.postEvent("LobbyStatus", data);
            }
            else if (messageName === "message") {
                var messageData = JSON.parse(data);
                this.postEvent(messageData["c"], messageData);
                //if(messageData.c != 0)  cc.log("lobbyClient[RECEIVER]: ",data);
                var status = messageData["s"];
                if(status < 0){
                    var msgErr = messageData["m"];
                    if(msgErr){
                        ToastDialog.getInstance().show(msgErr);
                    }
                    else{
                        ToastDialog.getInstance().show("Có lỗi xảy ra[" + status +"]");
                    }
                }
            }
        },

        isConnected: function () {
            if (this.lobbySocket) {
                return (this.lobbySocket.getStatus() === socket.LobbyClient.Connected);
            }
            return false;
        },

        postEvent: function (command, event) {
            var arr = this.allListener[command];
            if (arr) {
                this.isBlocked = true;
                for (var i = 0; i < arr.length;) {
                    var target = arr[i];
                    if (target) {
                        if(target.target){
                            if(target.listener){
                                target.listener.apply(target.target, [command, event]);
                            }
                            else{
                                cc.log("cmd: " + command + " listener null");
                            }
                        }
                        else{
                            if(target.listener){
                                target.listener.apply(command, event);
                            }
                            else{
                                cc.log("cmd: " + command + " listener null");
                            }
                        }
                    }
                    else {
                        arr.splice(i, 1);
                        continue;
                    }
                    i++;
                }
                this.isBlocked = false;
            }
        },

        addListener: function (command, _listener, _target) {
            var arr = this.allListener[command];
            if (!arr) {
                arr = [];
                this.allListener[command] = arr;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].target === _target) {
                    return;
                }
            }
            arr.push({
                listener: _listener,
                target: _target
            });
        },

        removeListener: function (target) {
            for (var key in this.allListener) {
                if (!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for (var i = 0; i < arr.length;) {
                    if (arr[i] && arr[i].target === target) {
                        if (this.isBlocked) {
                            arr[i] = null;
                        }
                        else {
                            arr.splice(i, 1);
                            continue;
                        }
                    }
                    i++;
                }
            }
        },

        /* private listener */
        _initAllListener : function () {
            this.addListener("LobbyStatus", this._onSocketStatus, this);
            this.addListener(1, this._onLogin, this);
            this.addListener(3, this._onDuplicateLogin, this);
        },

        _onSocketStatus: function (cmd, data) {
            cc.log("onSocketStatus: " + data);
            this._isLogined = false;
            if (data === "Connected") {
                if(this._connectSuccessHandler){
                    this._connectSuccessHandler();
                    this._connectSuccessHandler = null;
                }
            }
            else if (data === "ConnectFailure") {
                SceneNavigator.toHome("Không thể kết nối");
            }
            else if (data === "LostConnection") {
                SceneNavigator.toHome("Bạn bị mất kết nối");
            }
        },
        _onDuplicateLogin: function (cmd, data) {
            //{"id":1,"c":3,"s":1,"m":"Tài khoản đăng nhập thành công ở nơi khác!"}
            var status = data["s"];
            if(status >= 0){
                SceneNavigator.toHome(data["m"]);
            }else{
                //catch in onRecvMessage
            }
        },
        _onLogin: function (cmd, data) {
            LoadingDialog.getInstance().hide();
            var status = data["s"];
            if(status >= 0){
                this._isLogined = true;
                PlayerMe.username = data["d"]["Name"];
                PlayerMe.displayName = data["d"]["Alias"];
                PlayerMe.gold = data["d"]["Coin"];
                PlayerMe.vipExp = data["d"]["Vip"];
                PlayerMe.Token = data["d"]["Token"];
                PlayerMe.userId = data["d"]["Id"];
                PlayerMe.avatar = data["d"]["Avatar"];
                setTimeout(function () {
                    SocketClient.getInstance().postEvent("avatarUpdated", null);
                },0);


                // show info in LoginLayer, HomeTopBar, HomeTopBarInfo nua
                if(!PlayerMe.displayName){
                    // var dialog = new SetUsernameDialog();
                    // dialog.show();
                }
            }else{
                //catch in onRecvMessage
            }
        },

        /* global method */
        sendLoginNormal: function (username, password) {
            var request = {
                c: 1,
                d: {
                    name: username,
                    pass: password
                }
            };
            this._sendLogin(request);
        },

        sendLoginFacebook: function (token) {

        },

        sendLoginGooglePlus: function () {

        },

        _sendLogin: function (request) {
            LoadingDialog.getInstance().show();
            request["d"]["des"] = "device";
            if(this.isConnected()){
                this.send(request);
            }
            else{
                var thiz = this;
                this._connectSuccessHandler = function () {
                    thiz._sendLogin(request);
                };
                this.connect();
            }
        },
    });

    Clazz.getInstance = function () {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };

    return Clazz;
})();

if(cc.sys.isNative){
    SocketClient.ServerInfo = {
        host: "35.186.152.146",
        port: 8988
    };
}
else{
    SocketClient.ServerInfo = "ws://35.186.152.146:8989/ws";
}