/**
 * Created by ext on 8/9/2016.
 */

var SceneNavigator = SceneNavigator || {};
SceneNavigator.toHome = function (message) {
    cc.Global.clearPlayerMeData();
    SmartfoxClient.getInstance().close();

    SocketClient.getInstance()._isLoggin = false;
    SocketClient.getInstance()._httpRequestToken = "";

    var homeScene = SceneNavigator.getRunningScene();
    if (homeScene && (homeScene instanceof HomeScene)) {
        homeScene.startHome();
    }
    else {
        homeScene = new HomeScene();
        homeScene.startHome();
        SceneNavigator.replaceScene(homeScene);
    }

    if(cc._mainScene){
        cc._mainScene.removeAllPopup();
    }
    MiniGameNavigator.hideAll();

    if(message){
        MessageNode.getInstance().show(message);
    }
};

SceneNavigator.logout = function () {
    SceneNavigator.toHome();
};

SceneNavigator.toAccountActiveView = function () {
    var dialog = new UserinfoDialog();
    dialog.selectTab = 2;
    dialog.show();
};

SceneNavigator.toLobby = function (message) {
    // SmartfoxClient.getInstance().close();
    //
    // var homeScene = SceneNavigator.getRunningScene();
    // if (homeScene.startLobby) {
    //     homeScene.startLobby();
    // }
    // else {
    //     homeScene = new HomeScene();
    //     homeScene.startLobby();
    //     SceneNavigator.replaceScene(homeScene);
    // }
    //
    // if(message){
    //     MessageNode.getInstance().show(message, null, homeScene.messageLayer);
    // }
};

SceneNavigator.toGame = function (gameId,message) {

};

SceneNavigator.toMiniGame = function (gameId, isReconnect) {
    MiniGameNavigator.showGame(gameId);
    // if(isReconnect){
    //     SocketClient.getInstance().postEvent("miniGameReconnect", null);
    // }
};

SceneNavigator.showLoginNormal = function () {
    // if(!cc.sys.isNative && window.parent.show_popup_login){
    //     window.parent.show_popup_login();
    // }
    // else{
    //     var dialog = new LoginDialog();
    //     dialog.show();
    // }
};

SceneNavigator.showLoginFacebook = function () {
    // if(!cc.sys.isNative && window.parent.login_facebook){
    //     window.parent.login_facebook();
    // }
    // else{
    //     FacebookPlugin.getInstance().showLogin();
    // }
};

SceneNavigator.showSignup = function () {
    // if(!cc.sys.isNative && window.parent.show_popup_login){
    //     window.parent.show_popup_login();
    // }
    // else{
    //     var dialog = new SignupDialog();
    //     dialog.show();
    // }
};

SceneNavigator.showRewardDialog = function () {
    // MessageNode.getInstance().show("Chức năng chưa được mở !");
    // return;

    if(!SocketClient.getInstance().isLoggin()) {
        MessageNode.getInstance().show("Bạn chưa đăng nhập !");
        return false;
    }

    var dialog = new ShopLayer();
    dialog.show();
};


SceneNavigator.showPaymentDialog = function () {
    // MessageNode.getInstance().show("Chức năng chưa được mở !");
    // return;

    if(!SocketClient.getInstance().isLoggin()) {
        MessageNode.getInstance().show("Bạn chưa đăng nhập !");
        return false;
    }

    cc.Global.openURL("https://napbin.com");

    // var dialog = new NapVangLayer();
    // dialog.show();
};


SceneNavigator.startGame = function (gameId, arg1) {
    if(gameId < 100){
        var runningScene = new SceneNavigator.getRunningScene();
        if(!(runningScene instanceof HomeScene)){
            return;
        }
    }

    var moduleName = GameModuleName[gameId];
    var module = ModuleManager.getInstance().getModule(moduleName);
    if(module){
        if(!module.isLoaded()){
            if(module._isLoading === true){
                return;
            }
            module._isLoading = true;
            GlobalEvent.getInstance().postEvent("onLoadModule",
                {
                    module : moduleName,
                    current : 0,
                    target : 100
                }
            );

            var thiz = this;
            var args = arguments;
            SceneNavigator.loadGameWithCallback(gameId, function (success) {
                if(success){
                    SceneNavigator.startGame.apply(thiz, args);
                }
                module._isLoading = false;
            });
            return;
        }
    }
    else{
        //load game no module

    }

    //create game scene
    if(gameId === GameType.GAME_SLOT_FRUIT){
        SceneNavigator.replaceScene(new SlotFruitScene());
    }
    else if(gameId === GameType.GAME_TET_AM){
        SceneNavigator.replaceScene(new TetAmLobbyScene());
    }else {
        MiniGameNavigator.showGame.apply(this, arguments);
    }
};

var s_loadGameCallbackInstanceId = 0;
SceneNavigator.loadGameWithCallback = function (gameId, cb) {
    var moduleName = GameModuleName[gameId];
    var module = ModuleManager.getInstance().getModule(moduleName);
    if(!module.isLoaded()){
        s_loadGameCallbackInstanceId++;
        var obj = {
            instanceId : s_loadGameCallbackInstanceId
        };
        obj.finishedCallback = function (eventName, data) {
            if(data["module"] === moduleName) {
                var status = data["status"];
                if (status === ModuleStatus.LoadResourceFinished) {
                    GlobalEvent.getInstance().removeListener(obj);
                    cb(true);
                }
                else if (
                    status === ModuleStatus.UpdateFailure ||
                    status === ModuleStatus.LoadResourceFailure
                ) {
                    GlobalEvent.getInstance().removeListener(obj);
                    cb(false);
                    // setTimeout(function () {
                    //     SceneNavigator.loadGameWithCallback(cb);
                    // }, 1000);
                }
            }
        };
        GlobalEvent.getInstance().addListener("onLoadModuleStatus", obj.finishedCallback, obj);
        module.loadModule();
    }
    else{
        cb(true);
    }
};

SceneNavigator.addBackKeyEvent = function (target) {
    //init global key boardlistener
    if(!SceneNavigator._initGlobalKeyboardEvent){
        SceneNavigator._initGlobalKeyboardEvent = true;

        var listener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                if(cc.sys.isNative){
                    if (parseKeyCode(keyCode) === cc.KEY.back) {
                        //cc.log("deptrai1");
                        cc.eventManager.dispatchCustomEvent("keyBackPressed", {used : false});
                    }
                }
                else{
                    if(keyCode === cc.KEY.escape){
                       // cc.log("deptrai2");
                        cc.eventManager.dispatchCustomEvent("keyBackPressed", {used : false});
                    }
                }
            }
        });
        cc.eventManager.addListener(listener, 1);
    }


    if(target._onKeyBackHandler === undefined){
        target._onKeyBackHandler = function () {
            cc.log("onKeyBackHandler");
        };
    }

    var _onEnter = target.onEnter;
    var _onExit = target.onExit;

    target.onEnter = function () {
        _onEnter.apply(target, arguments);

        cc.eventManager.addListener({
            event: cc.EventListener.CUSTOM,
            eventName : "keyBackPressed",
            callback : function (e) {
                if(!e._userData["used"]){
                    if(target._onKeyBackHandler()){
                        e._userData["used"] = true;
                    }
                }
            }
        }, target);
    };

    target.onExit = function () {
        _onExit.apply(target, arguments);
        cc.eventManager.removeListeners(target);
    };

};

SceneNavigator.isGameAvailable = function (gameId) {
    if(s_game_available.indexOf(gameId) < 0){
        MessageNode.getInstance().show("Game sắp ra mắt !");
        return false;
    }

    if(s_game_no_login.indexOf(gameId) < 0){
        if(!SocketClient.getInstance().isLoggin()) {
            MessageNode.getInstance().show("Bạn chưa đăng nhập !");
            return false;
        }
    }

    return true;
};

cc._mainScene = null;

SceneNavigator.replaceScene = function (newScene) {
    if(cc._mainScene === null){
        cc._mainScene = new MainScene();
        cc.director.replaceScene(cc._mainScene);
    }
    cc._mainScene.replaceScene(newScene);
};

SceneNavigator.getRunningScene = function () {
    if(cc._mainScene === null){
        cc._mainScene = new MainScene();
        cc.director.replaceScene(cc._mainScene);
    }
    return cc._mainScene.getRunningScene();
};

window._cc_finished_Loading = function () {
    //SystemPlugin.getInstance().enableMipmapTexture("res/Texture/Card.png");
    SoundPlayer.setSoundVolume(cc.Global.GetSetting("sound",true) ? 1.0 : 0.0);
    //SocketClient.getInstance()._sendRegisterPush();
    SceneNavigator.replaceScene(new HomeScene());

    /*test*/
    //GameClient.getInstance();

    /*if(window.parent.token){
        SocketClient.getInstance()._sendSocketLogin(window.parent.token);
    }*/
};

SceneNavigator.resizeEvent = function (view) {
    var _onEnter = view.onEnter;
    if(view.onCanvasResize === undefined){
        view.onCanvasResize = function () {
            cc.log("onCanvasResize")
        };
    }
    view.onEnter = function () {
        _onEnter.apply(view, arguments);

        view.onCanvasResize();
        cc.eventManager.addListener({
            event: cc.EventListener.CUSTOM,
            eventName : "canvas-resize",
            callback : function () {
                view.onCanvasResize();
            }
        }, view);
    };
};