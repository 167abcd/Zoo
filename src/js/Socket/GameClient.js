/**
 * Created by 123456 on 6/23/2016.
 *
 *
 *
 */

var GameClient = (function () {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,
        ctor: function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                var thiz = this;

                this.allListener = {};
                this.serverIndex = 100;
                this._isLoggin = false;

                this.lobbySocket = new socket.SocketIO();
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);
                };

                this.httpGateway = s_lobby_http_gateway;
                this.httpClient = new HttpClient();
                this.httpClient.onEvent = function (command, data) {
                    thiz.onHttpEvent(command, data);
                };

                FacebookPlugin.getInstance().onLoginFinished = function (returnCode, userId, accessToken) {
                    if(returnCode === 0){
                        LoadingDialog.getInstance().show("Đang đăng nhập");
                        thiz.sendLogin(accessToken);
                    }
                    else{
                        LoadingDialog.getInstance().hide();
                        if(returnCode > 0){
                            MessageNode.getInstance().show("Lỗi đăng nhập facebook");
                        }
                    }
                };

                if(cc.sys.isNative){
                    SystemPlugin.getInstance().onBuyItemFinishAndroid = function (returnCode, signature, json) {
                        thiz.onBuyItemFinishAndroid(returnCode, signature, json);
                    };

                    SystemPlugin.getInstance().onBuyItemFinishIOS = function (returnCode, data) {
                        thiz.onBuyItemFinishIOS(returnCode, data);
                    };
                }


                SystemPlugin.getInstance().onTakeImageData = function (imgObject) {
                    var ratio = imgObject.getWidth() / imgObject.getHeight();
                    if(ratio <= 9/16 || ratio >= 16/9){
                        MessageNode.getInstance().show("Tỉ lệ ảnh không quá 16:9");
                        return;
                    }

                    thiz._cropAvatarBeforeUpload(imgObject);

                };

                this._httpRequestToken = null;
                this._initAllListener();
                // cc.director.getScheduler().scheduleUpdate(this, 0, false);
                this.connect();
            }
        },

        _cropAvatarBeforeUpload : function (imgObject) {
            //crop
            var thiz = this;
            var w = imgObject.getWidth();
            var h = imgObject.getHeight();
            if(w > h){
                var rect = cc.rect(Math.floor( w/2 - h/2), 0, h, h);
            }
            else{
                var rect = cc.rect(0, Math.floor(h/2 - w/2), w, w);
            }
            imgObject.retain();
            imgObject.crop(rect, function () {
                thiz._resizeAvatarBeforeUpload(imgObject);
            });
        },

        _resizeAvatarBeforeUpload : function (imgObject) {
            var thiz = this;
            var sendFunc = function () {
                var request = {
                    command : "update_avatar",
                    content : imgObject.saveToJPEG()
                };
                thiz.sendHttpPostRequest(request);
            };

            var maxSize = 125.0;
            if(imgObject.getWidth() > maxSize && imgObject.getHeight() > maxSize){
                var scaleX = maxSize / imgObject.getWidth();
                var scaleY = maxSize / imgObject.getHeight();
                var scale = scaleX < scaleY ? scaleX : scaleY;
                var newSize = cc.size(Math.floor(imgObject.getWidth() * scale), Math.floor(imgObject.getHeight() * scale));
                imgObject.resizeTo(newSize, function () {
                    sendFunc();
                    imgObject.release();
                });
            }
            else{
                sendFunc();
                imgObject.release();
            }
        },

        onBuyItemFinishAndroid : function (returnCode, signature, json) {
            // LoadingDialog.getInstance().hide();
            if(returnCode === 0){
                var request = {
                    command : "in_app_verify",
                    data: json,
                    signature: signature,
                    osId : 2
                };
                this.sendHttpPostRequest(request);
            }
        },

        onBuyItemFinishIOS : function (returnCode, data) {
            // LoadingDialog.getInstance().hide();
            if(returnCode === 0){
                var request = {
                    command: "in_app_verify",
                    osId: 1,
                    data: data
                };
                this.sendHttpPostRequest(request);
            }
        },

        send: function (message) {
            if (this.lobbySocket) {
                cc.log(message);
                this.lobbySocket.send(JSON.stringify(message));
            }
        },

        sendHttpGetRequest: function (message, tag) {
            this.sendHttpGetRequestUrl(this.httpGateway, message, tag);
        },

        sendHttpGetRequestUrl : function (url, message, tag) {
            if(this.httpClient){
                message["bundle"] = SystemPlugin.getInstance().getPackageName();
                var cmd = message["command"];
                if(cmd && s_http_request_no_token.indexOf(cmd) === -1){
                    if(this._httpRequestToken){
                        message["auth"] = this._httpRequestToken;
                        this.httpClient.sendGetRequest(url, message, tag);
                    }
                    else{
                        // cc.log("chua login");
                        MessageNode.getInstance().show("Bạn cần đăng nhập để thực hiện chức năng này !");
                    }
                }
                else{
                    this.httpClient.sendGetRequest(url, message, tag);
                }
            }
        },

        sendHttpPostRequest: function (message, tag) {
            this.sendHttpPostRequestUrl(this.httpGateway, message, tag);
        },

        sendHttpPostRequestUrl : function (url, message, tag) {
            if(this.httpClient){
                message["bundle"] = SystemPlugin.getInstance().getPackageName();
                var cmd = message["command"];
                if(cmd && s_http_request_no_token.indexOf(cmd) === -1){
                    if(this._httpRequestToken){
                        message["auth"] = this._httpRequestToken;
                        this.httpClient.sendPostRequest(url, message, tag);
                    }
                    else{
                        // cc.log("chua login");
                        MessageNode.getInstance().show("Bạn cần đăng nhập để thực hiện chức năng này !");
                    }
                }
                else{
                    this.httpClient.sendPostRequest(url, message, tag);
                }
            }
        },

        close: function () {
            if (this.lobbySocket) {
                this.lobbySocket.close();
            }
        },
        connect: function () {
            this._isLoggin = false;
            if (this.lobbySocket) {
                PlayerMe.avatar = "";

                if(this.serverIndex >= GameClient.Server.length){
                    /*swap random server*/
                    for(var i = 0;i<GameClient.Server.length;i++){
                        var max = GameClient.Server.length - 1;
                        var min = i;
                        var idx = Math.round(Math.random() * (max - min) + min);
                        if(idx !== i){
                            //swap
                            var temp = GameClient.Server[i];
                            GameClient.Server[i] = GameClient.Server[idx];
                            GameClient.Server[idx] = temp;
                        }
                        // cc.log("idx: " + idx);
                    }
                    this.serverIndex = 0;
                }
                this.lobbySocket.connect(GameClient.Server[this.serverIndex]);

                this.serverIndex++;
            }
        },
        isConnected: function () {
            if (this.lobbySocket) {
                return (this.lobbySocket.getStatus() === socket.LobbyClient.Connected);
            }
            return false;
        },
        isLoggin : function () {
            return this._isLoggin;
        },
        onEvent: function (messageName, data) {
            if (messageName === "socketStatus") {
                this.postEvent("LobbyStatus", data);
            }
            else if (messageName === "message") {
                var messageData = JSON.parse(data);
                this.postEvent(messageData["c"], messageData);
            }
        },
        onHttpEvent: function (command, event) {
            var cmd = "http_" + command;
            if(event["status"] !== undefined){
                if(event["status"] !== 0){
                    LoadingDialog.getInstance().hide();
                    if(event["message"]){
                        // LoadingDialog.getInstance().hide();
                        //  cc.log("http error : "+ event["message"]);
                        MessageNode.getInstance().show(event["message"]);
                    }
                    else{
                        LobbyClient.HttpErrorHandle(event["status"]);
                    }
                }
            }
            this.postEvent(cmd, event);
        },
        postEvent: function (command, event) {
            cc.log(event);
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
        addHTTPListener: function (command, _listener, _target) {
            var cmd = "http_" + command;
            this.addListener(cmd, _listener, _target);
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
        /*****/
        checkIMEI: function () {
            if (!PlayerMe.IMEI) {
                if(cc.sys.os === cc.sys.OS_ANDROID){
                    PlayerMe.IMEI = SystemPlugin.getInstance().getAdsId();
                }
                else{
                    PlayerMe.IMEI = SystemPlugin.getInstance().getDeviceUUIDWithKey(PlayerMe.DeviceIDKey);
                }

                if (!PlayerMe.IMEI) {
                    MessageNode.getInstance().show("Thiết bị không được hỗ trợ");
                    LoadingDialog.getInstance().hide();
                    return false;
                }
            }
            return true;
        },

        _addClientInfoToRequest : function (request) {
            request["bundle"] = SystemPlugin.getInstance().getPackageName();
            request["version"] = SystemPlugin.getInstance().getVersionName();
            request["os"] = ApplicationConfig.PLATFORM;

            if(PlayerMe.IMEI){
                request["imei"] = PlayerMe.IMEI;
            }

            request["clientId"] = "clientId"; //adsId
            request["statisticId"] = "statisticId"; //facebookId
            return request;
        },

        sendLogin : function (username, password) {
            if(!this.checkIMEI()){
                return;
            }

            var request = {
                command : "login"
            };
            this._addClientInfoToRequest(request);
            if(password === undefined){
                //fb login
                request["type"] = "facebook";
                request["accessToken"] = username;
            }
            else{
                request["type"] = "normal";
                request["username"] = username;
                request["password"] = password;

                this._loginFinishedHandler = function () {
                    // cc.Global.setSaveUsername(username);
                    // cc.Global.setSavePassword(password);
                };
            }
            this.sendHttpGetRequest(request);
            LoadingDialog.getInstance().show("Đang đăng nhập...");
        },
        sendLogout : function () {
            var request = {
                c : "logout"
            };
            SocketClient.getInstance().send(request);
        },

        sendRegister : function (username, password, captchaKey, captchaAnswer, nickname) {
            if(!this.checkIMEI()){
                return;
            }

            var request = {
                command : "register",
                username : username,
                password : password,
                nickname : nickname,
                captchaKey : captchaKey,
                captchaAnswer : captchaAnswer
            };
            this._addClientInfoToRequest(request);
            this.sendHttpGetRequest(request);

            this._loginFinishedHandler = function () {
                // cc.Global.setSaveUsername(username);
                // cc.Global.setSavePassword(password);
            };
        },

        _sendSocketLogin : function (token) {
            if(window._sfsServer === undefined){
                var thiz = this;
                this._requestGetConfig(function (success) {
                    if(success){
                        thiz._sendSocketLogin(token);
                    }
                    else{
                        LoadingDialog.getInstance().hide();
                        MessageNode.getInstance().show("Không lấy được cấu hình máy chủ");
                    }
                });
                return;
            }
            if(token){
                this._httpRequestToken = token;
                var handler = function () {
                    var request = {
                        c : "login",
                        token : token
                    };
                    SocketClient.getInstance().send(request);
                };
                if(this.isConnected()){
                    handler();
                }
                else{
                    this._connectedHandler = handler;
                    this.connect();
                }
            }
        },

        _requestGetConfig: function (cb) {
            var request = {command : "get_static_config"};
            this.httpClient.sendGetRequestWithCallback(s_lobby_http_gateway, request,
                function (status, responseText) {
                    if(status >= 200 && status <= 207) {
                        try{
                            var data = JSON.parse(responseText);
                            var sfsServersData = data["sfsServers"];
                            var sfsServer = {};

                            for(var i=0;i<sfsServersData.length;i++){
                                var serverId = sfsServersData[i]["id"];
                                if(cc.sys.isNative){
                                    var host = sfsServersData[i]["host"];
                                    var port = sfsServersData[i]["tcpPort"];
                                    var serverInfo = {
                                        host : host,
                                        port : port
                                    };
                                }
                                else{
                                    var wsUrl = sfsServersData[i]["webSocket"];
                                    var serverInfo = {
                                        webSocketUrl : wsUrl
                                    };
                                }
                                sfsServer[serverId] = serverInfo;
                            }
                            window._sfsServer = sfsServer;
                            //window._sfsXocdia = sfsServer["1"];
                            //window._sfsTaixiu = sfsServer["1"];
                        }
                        catch (err){
                            cb(false);
                            return;
                        }
                        cb(true);
                    }
                    else{
                        cb(false);
                    }
                });
        },

        _sendRegisterPush : function () {
            var token = SystemPlugin.getInstance().getPushNotificationToken();
            if(token && token != ""){
                var request = {
                    sandbox : true,
                    command : "register_push",
                    token : token,
                    os : ApplicationConfig.PLATFORM,
                    bundle : SystemPlugin.getInstance().getPackageName()
                };
                this.sendHttpGetRequest(request);
            }
        },
        //
        _initAllListener : function () {
            this.addHTTPListener("login", this._onHttpLogin, this);
            this.addHTTPListener("login2", this._onHttpLogin2, this);
            this.addHTTPListener("register", this._onHttpRegister, this);
            this.addHTTPListener("update_password", this._onUpdatePassword, this);
            this.addHTTPListener("update_nickname", this._onUpdateDisplayName, this);

            this.addListener("LobbyStatus", this._onSocketStatus, this);
            this.addListener("err", this._onSocketError, this);
            this.addListener("login", this._onSocketLogin, this);
            this.addListener("sfsInfoUpdated", this._onSfsInfoUpdated, this);
            this.addListener("logout", this._onSocketLogout, this);
            this.addListener("ua", this._onUpdateAsset, this);
            this.addListener("uInfo", this._onUserInfo, this);
            this.addListener("uJackpot", this._onUpdateJackpot, this);
            this.addListener("inboxUnReadCount", this._onUpdateCountInbox, this);
            this.addListener("kicked", this._onUserKicked, this);
            this.addListener("avatarUpdated", this._onUpdateAvatar, this);
            this.addListener("1310", this._onOpenWheel, this);
            this.addListener("1020", this._onCallTuLinh, this);
        },

        _onSocketLogout : function (cmd, data) {
            var status = data["stt"];
            if(status === 0){
                //logout ok
                this._isLoggin = false;
                SceneNavigator.logout();
            }
        },

        _onHttpLogin : function (cmd, data) {
            if(data){
                var status = data["status"];
                if(status === 0){
                    if(data["data"]["openLogin2"]){
                        PlayerMe.isLogin2 = true;
                        this._httpRequestToken = data["data"]["token"];

                        LoadingDialog.getInstance().hide();
                        var dialog = new DangNhapBuoc2Dialog();
                        dialog.show();
                    }
                    else{
                        PlayerMe.isLogin2 = false;
                        this._sendSocketLogin(data["data"]["token"]);
                    }
                }
            }
        },

        _onHttpLogin2: function (cmd, data){
            if(data && data["status"] === 0){
                this._sendSocketLogin(data["data"]["token"]);
            }
            else{
                this._httpRequestToken = "";
            }
        },

        _onHttpRegister : function (cmd, data) {
            if(data){
                var status = data["status"];
                if(status === 0){
                    this._sendSocketLogin(data["data"]["token"]);
                }
            }
        },

        _onUpdatePassword : function (cmd, data) {
            if(data && data["status"] === 0){
                //update token
                this._httpRequestToken = data["data"]["token"];
            }
        },

        _onUpdateDisplayName : function (cmd, data) {
            if(data && data["status"] === 0){
                PlayerMe.displayName = data["data"]["nickname"];
                PlayerMe.username = PlayerMe.displayName;
            }
        },

        _onSocketStatus : function (cmd, data) {
            this._isLoggin = false;
            if (data === "Connected") {
                if (this._connectedHandler) {
                    this._connectedHandler();
                    this._connectedHandler = null;
                }
            }
            else if (data === "ConnectFailure") {
                if(this.serverIndex >= s_lobbyServer.length){
                    LoadingDialog.getInstance().hide();
                    SceneNavigator.toHome("Mất kết nối máy chủ");
                }
                else{
                    this.connect();
                }
            }
            else if (data === "LostConnection") {
                LoadingDialog.getInstance().hide();
                SceneNavigator.toHome("Mất kết nối máy chủ");
            }
        },

        _onUpdateJackpot : function (cmd, data) {
            var gameId = s_GameId[data["g"]];
            if(gameId){
                var betting = data["bet"];

                var jackpotId = gameId.toString() + "_" + betting.toString();
                GameInfo.Jackpot[jackpotId] = data["value"];
            }
        },

        _onSocketError : function (cmd, data) {
            var msg = data["msg"];
            cc.log("msg: " + msg);
            MessageNode.getInstance().show(msg);
            // var errorCode = data["code"];
        },

        _onSocketLogin : function (cmd, data) {
            cc.log(data);
            LoadingDialog.getInstance().hide();
            var status = data["stt"];
            if(status === 0){
                this._isLoggin = true;
                //login ok
                PlayerMe.username = data["data"]["un"];
                PlayerMe.displayName = data["data"]["nn"];
                PlayerMe.username = PlayerMe.displayName;
                if(PlayerMe.displayName){
                    PlayerMe.username = PlayerMe.displayName;
                }
                PlayerMe.loginType = data["data"]["type"];
                PlayerMe.SFS.info = data["data"]["sfsInfo"];
                PlayerMe.SFS.signature = data["data"]["signature"];
                //SceneNavigator.toLobby();


                if(this._loginFinishedHandler){
                    this._loginFinishedHandler();
                    this._loginFinishedHandler = null;
                }

                var reconnect = data["data"]["reconnect"];
                if(reconnect){
                    var serverId = data["data"]["sfsServerId"];
                    var serverInfo = window._sfsServer[serverId];
                    SmartfoxClient.getInstance().findAndJoinRoom(serverInfo);
                }

                SceneNavigator.startGame(GameType.MiniGame_TaiXiu);
            }
        },

        _onOpenWheel:function (cmd, message) {
            // var homeScene = SceneNavigator.getRunningScene();
            // if(message["ch"] == "mini_luckywheel" && homeScene.startHome){
            //     var luotConlau  = message["data"]["8"];
            //     if(luotConlau>0){
            //         setTimeout(function () {
            //            SceneNavigator.startGame(GameType.MiniGame_Vong_Quay_May_Man);
            //         },200);
            //     }
            // }
        },
        _onCallTuLinh:function (cmd, message) {
            if(message["ch"] == "mini_taixiu" ) {

                if(this.arrTuLinh == undefined){
                    this.arrTuLinh = [];
                }
                var messageNew = message;

                if(this.arrTuLinh.length < 3){
                    this.arrTuLinh.push(messageNew);
                }
                if(this.arrTuLinh.length == 1){
                    this.callTuLinh();
                }

            }
        },

        callTuLinh:function () {
            if(this.arrTuLinh==0){
                return;
            }
            var message = this.arrTuLinh[0];
            var id = message["data"]["2"];
            var gold = message["data"]["1"];
            var numberDay = message["data"]["5"];
            var nickname = message["data"]["3"];
            var nameTulinh = message["data"]["4"];


            var thiz  = this;
            var tuLinh = new TuLinhGoiHon(id,gold,nickname,numberDay,nameTulinh);
            tuLinh._finish = function () {
                thiz.arrTuLinh.splice(0,1);
                thiz.callTuLinh();
            },
                tuLinh.show();
        },

        _onOpenProfile:function (cmd, message) {
            var homeScene = SceneNavigator.getRunningScene();
            if(homeScene.startHome){
                var dialog = new ProfineLayer();
                dialog.show();
            }
        },

        _onSfsInfoUpdated: function (cmd, data) {
            if(data["sfsInfo"]){
                PlayerMe.SFS.info = data["sfsInfo"];
            }

            if(data["signature"]){
                PlayerMe.SFS.signature = data["signature"];
            }
        },

        _onUserKicked : function (cmd, data) {
            SceneNavigator.toHome(data["r"]);
            this._isLoggin = false;
        },

        _onUpdateAsset : function (cmd, data) {
            cc.log(data);
            if(data["type"] === 1){
                PlayerMe.gold = data["value"];
                //PlayerMe.goldFree = PlayerMe.gold;
            }
            else if(data["type"] === 7){
                PlayerMe.vipExp = data["value"];
            }
            else if(data["type"] === 5){
                PlayerMe.goldFree = data["value"];
            }
            else if(data["type"] === 10)
            {
                PlayerMe.goldBank = data["value"];
            }
        },

        _onUpdateAvatar : function (cmd, data) {
            if(data["url"])
            {
                PlayerMe.avatar = data["url"];
            }
            else
            {
                PlayerMe.avatar = "";
            }

        },

        _onUserInfo : function (cmd, data) {
            cc.log(data);

            var childObj = data["data"];
            var childObj2 = childObj["userInfo"];
            if(childObj2["verifiedPhone"]){
                PlayerMe.phoneNumber = childObj2["verifiedPhone"];
            }
            else
            {
                PlayerMe.phoneNumber = "";
            }
        },
        _onUpdateCountInbox : function (cmd, data) {
            PlayerMe.messageCount = data["data"]["numberUnRead"];
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

GameClient.Server = [
    //"http://45.77.168.151:6001"
    //"http://45.77.168.151:3000"//api.zikclub.com
    "https://io.zikclub.com"
];