/**
 * Created by ext on 7/15/2017.
 */


var HomeTopAdBanner = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setContentSize(1255, 175);
        this.setAnchorPoint(cc.p(0.5, 0.5));
    },

    _initWithTexture: function (tex) {
        if(tex && this.mSprite === undefined){
            var img = new cc.Sprite(tex);
            var scaleY = this.height / img.height;
            if(scaleY < 1.0){
                img.setScale(scaleY);
            }
            img.setPosition(this.width/2, this.height/2);
            this.addChild(img);
            this.mSprite = img;
        }
    },

    onEnter : function () {
        this._super();

        var url = "";
        var thiz = this;
        TextureDownloader.load(url, function (tex) {
            thiz._initWithTexture(tex);
        });
    }
});

var HomeLogo = cc.Node.extend({
    ctor : function () {
        this._super();

        var logo = new cc.Sprite("#home_topBar_logo.png");
        logo.setPosition(74, 797);
        this.addChild(logo);

        var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, "Hotline: ");
        label1.setColor(cc.color("#ffffff"));
        label1.setAnchorPoint(cc.p(0.0, 0.5));
        label1.setPosition(143, 795);
        this.addChild(label1);

        var label2 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, GameConfig.hotline);
        label2.setColor(cc.color("#fff000"));
        label2.setAnchorPoint(cc.p(0.0, 0.5));
        label2.setPosition(213, 795);
        this.addChild(label2);
    }
});

var HomeScene = IScene.extend({
    ctor : function () {
        this._super();
        cc.log("test home");
        //this.sceneLayer.setContentSize(cc.size(2000, 860));

        var thiz = this;

        var bg = new cc.Sprite("res/Texture/Home/web.jpg");
        bg.setAnchorPoint(cc.p(0,1));
        bg.setPosition(0, cc.winSize.height);
        this.addChild(bg,-1);
        this.bg = bg;




       /* var lobbyLayer = new cc.Node();
        var homeLobbyLayer = new HomeLobbyLayer();
        //var homeChatLayer = new HomeChatLayer();
        lobbyLayer.addChild(homeLobbyLayer);
        //lobbyLayer.addChild(homeChatLayer);
        this.sceneLayer.addChild(lobbyLayer);
        lobbyLayer.startWithGameId = function (gameId) {
            homeLobbyLayer.startWithGame(gameId);
        };
        var _func = lobbyLayer.setVisible;
        lobbyLayer.setVisible = function (visible) {
            _func.apply(lobbyLayer, [visible]);
            homeLobbyLayer.setVisible(visible);
            //homeChatLayer.setVisible(visible);
        };

        lobbyLayer.unSubscribe = function () {
            homeLobbyLayer.unSubscribe();
        };
        this.lobbyLayer = lobbyLayer;*/

        var gameLayer = new HomeGameLayer();
        this.sceneLayer.addChild(gameLayer);
        this.gameLayer = gameLayer;
        gameLayer.onTouchGame = function (gameId) {
            thiz.onTouchGame(gameId);
        };

        return;
        this.addChild(new WebBottomBar(), -1);

        var topBarLayer = new HomeTopBarLayer();
        topBarLayer.loginLayer.btn_back.setVisible(false);
        topBarLayer.backButtonHandler = function () {
            thiz.backButtonHandler();
        };
        this.sceneLayer.addChild(topBarLayer, 1);
        this.topBarLayer = topBarLayer;

        var bottomBar = new LobbyBottomBar();
        this.addChild(bottomBar);
        this.bottomBar = bottomBar;
        this.bottomBar.setVisible(false);
        SceneNavigator.addBackKeyEvent(this);

        this.startHome();
    },

    onCanvasResize : function () {
        this._super();
        var scaleY = cc.winSize.height / this.bg.height;
        if(scaleY < 1.0){
            scaleY = 1.0;
        }
        this.bg.setScale(scaleY);
        this.bg.setPosition(0, cc.winSize.height);
        //this.bottomBar.setPosition(this.bottomBar.width/2,  cc.winSize.height - 475);
    },

    _onKeyBackHandler : function () {
        if(SocketClient.getInstance().isLoggin())
        {
            this.backButtonHandler();
        }
        else {
            if(cc.sys.isNative)
            {
                SystemPlugin.getInstance().exitApp();
            }
        }

        return true;
    },

    backButtonHandler : function () {
        if(this.lobbyLayer.isVisible()){
            this.startGame();
        }
        else if(SocketClient.getInstance().isLoggin()){
            SocketClient.getInstance().sendLogout();
        }
        else{

        }
    },

    startHome : function () {
        this.topBarLayer.startHome();
        this.lobbyLayer.setVisible(false);
        if(!this.gameLayer.isVisible()){
            this.gameLayer.setVisible(true);
        }
        this.popupLayer.removeAllChildren(true);
    },

    startGame : function () {
        this.topBarLayer.startLobby();
        this.lobbyLayer.setVisible(false);
        if(!this.gameLayer.isVisible()){
            this.gameLayer.setVisible(true);
        }
        this.popupLayer.removeAllChildren(true);
    },

    startLobby : function (gameId) {
        this.topBarLayer.startLobby();
        this.lobbyLayer.setVisible(true);
        this.gameLayer.setVisible(false);
        this.popupLayer.removeAllChildren(true);
        this.lobbyLayer.startWithGameId(gameId);
    },

    onTouchGame : function (gameId) {
        if(!this.gameLayer.isVisible()){
            return;
        }

        if(!SceneNavigator.isGameAvailable(gameId)){
            return;
        }

        if(gameId > 1000){ //group

        }
        else{
            if(gameId > 100){ //minigame
                SceneNavigator.startGame(gameId);
            }
            else{ //gamelobby
                if(GameType.GameNoChannel.indexOf(gameId) === -1){
                    var thiz = this;
                    SceneNavigator.loadGameWithCallback(gameId, function () {
                        if(!thiz.gameLayer.isVisible()){
                            return;
                        }
                        thiz.startLobby(gameId);
                    });
                }
                else{
                    SceneNavigator.startGame(gameId);
                }
            }
        }

    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("login", this._onSocketLogin, this);
        SocketClient.getInstance().addListener("uInfo", this._onUserInfo, this);
        this.showDialogTaoNhanVat();
        if(this._showGiftcode) {
            this.showGiftCodePop();
        }

        // SoundPlayer.playSoundLoop("nhacnen_lobby");
    },

    _onSocketLogin : function (cmd, data) {
        var status = data["stt"];
        if(status === 0){
            //login ok
            this.showDialogTaoNhanVat();
        }
    },

    showDialogTaoNhanVat : function () {
        if(SocketClient.getInstance().isLoggin()){
            if(PlayerMe.displayName){

            }
            else{
                var taonhanvat = new TaoNhanVatDialog();
                taonhanvat.showWithAnimationMove();
            }
        }
    },

    _onUserInfo : function (cmd, data) {
      TaoNhanVatDialog.showSuKien();
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
        SoundPlayer.stopAllSound();
    },

    showGiftCodePop : function () {
        this._showGiftcode = false;
        var giftcodepop = new GiftCodeLayer();
        giftcodepop.show();
    }
});