var s_home_gameList = s_home_gameList || [
    GameType.GAME_TET_AM,
    GameType.MiniGame_CuopBien_Slot,
    GameType.GAME_Larva,
    GameType.GAME_AOE,
    GameType.MiniGame_Candy_Slot,
    GameType.GAME_XocDia,
    GameType.MiniGame_TaiXiu,
    GameType.MiniGame_Poker,
    GameType.MiniGame_CaoThap
];

var s_home_game_icon_size_small = cc.size(247, 163);
var s_home_game_icon_size_large = cc.size(205, 341);
var s_home_game_icon_size = {};
s_home_game_icon_size[GameType.GAME_TienLenMN] = s_home_game_icon_size_small;
s_home_game_icon_size[GameType.GAME_TLMN_Solo] = s_home_game_icon_size_small;
s_home_game_icon_size[GameType.GAME_Sam] = s_home_game_icon_size_small;
s_home_game_icon_size[GameType.GAME_Sam_Solo] = s_home_game_icon_size_small;
s_home_game_icon_size[GameType.GAME_Phom] = s_home_game_icon_size_small
s_home_game_icon_size[GameType.MiniGame_CaoThap] = s_home_game_icon_size_small;
s_home_game_icon_size[GameType.MiniGame_Poker] = s_home_game_icon_size_small;
s_home_game_icon_size[GameType.MiniGame_TaiXiu] = s_home_game_icon_size_small;
s_home_game_icon_size[GameType.GAME_XocDia] = s_home_game_icon_size_small;
s_home_game_icon_size[GameType.GAME_TaiXiu] = s_home_game_icon_size_small;

s_home_game_icon_size[GameType.GAME_Larva] = s_home_game_icon_size_large;
s_home_game_icon_size[GameType.GAME_AOE] = s_home_game_icon_size_large;
s_home_game_icon_size[GameType.GAME_TET_AM] = s_home_game_icon_size_large;
s_home_game_icon_size[GameType.MiniGame_Candy_Slot] = s_home_game_icon_size_large;
s_home_game_icon_size[GameType.MiniGame_CuopBien_Slot] = s_home_game_icon_size_large;

var s_home_game_group = {};
s_home_game_group[GameType.Group_TLML] = [GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN];
s_home_game_group[GameType.Group_SAM] = [GameType.GAME_Sam_Solo, GameType.GAME_Sam];

(function () {
    //cal gameIcon position
    var p = [];

    var y1 = 265; //small
    var y2 = 88; //small
    var y0 = 177; //large

    var left = 20;
    var padding = 20;

    var xIdx = 0;
    for(var i=0;i<s_home_gameList.length;i++){
        var iconSize = s_home_game_icon_size[s_home_gameList[i]];

        if(iconSize.height === s_home_game_icon_size_large.height){ //largeIcon
            var x = left + iconSize.width/2;
            p.push(cc.p(x, y0));

            left += iconSize.width + padding;
            xIdx = 0;
        }
        else{
            var y = (xIdx === 0) ? y1 : y2;
            var x = left + iconSize.width/2;
            p.push(cc.p(x, y));

            xIdx++;
            if(xIdx > 1){
                xIdx = 0;
                left += iconSize.width + padding;
            }
        }
    }

    window.s_home_game_position = p;
})();

if(!cc.sys.isNative){
    ccui.ScrollView.prototype.isAutoScrolling = function () {
        return this._autoScrolling;
    };
}

var HomeBroadcastMessage = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("#home_message_bg.png");
        bg.setPosition(cc.p(1000, 755));
        this.addChild(bg);

        var left = 530;
        var right = 2000 - left;

        var clippingMessage = new ccui.Layout();
        clippingMessage.setContentSize(right - left, bg.height);
        clippingMessage.setClippingEnabled(true);
        clippingMessage.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingMessage.setAnchorPoint(cc.p(0.0, 0.0));
        clippingMessage.setPosition(left, bg.y - bg.height/2);
        this.addChild(clippingMessage);

        this.clippingMessage = clippingMessage;
        this.messageBoxWidth = clippingMessage.width;
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("get_top_bar", this._receiveDataTopBar, this);
        this.fetchMessage();
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    _receiveDataTopBar : function (cmd, data) {
        var message = data["content"];
        if(message === "") {
            this.getMessageFiveSecondTime(5);
        }
        else {
            this.addMessage(message);
        }
    },

    addMessage : function (message) {
        var thiz = this;
        var messageBoxWidth = this.messageBoxWidth + 10.0;

        var textStr = "<font face='" + cc.res.font.Roboto_Medium+ "' size='20'>" + message + "</font>";

        var messageLabel = new ccui.RichText();
        messageLabel.initWithXML(textStr, {});
        messageLabel.formatText();
        messageLabel.setPosition(messageBoxWidth + messageLabel.width / 2, this.clippingMessage.height/2);
        this.clippingMessage.addChild(messageLabel);

        var moveSpeed = 75.0;
        var moveWidth = messageBoxWidth + messageLabel.width;
        var duration = moveWidth / moveSpeed;
        var action = new cc.Sequence(new cc.MoveBy(duration, cc.p(-moveWidth, 0)), new cc.CallFunc(function () {
            messageLabel.removeFromParent(true);
        }));
        messageLabel.runAction(action);

        this.stopActionByTag(102);
        var action = new cc.Sequence(new cc.DelayTime((messageLabel.width + 50) / moveSpeed), new cc.CallFunc(function () {
            thiz.fetchMessage();
        }));
        action.setTag(102);
        this.runAction(action);
    },

    fetchMessage : function () {
        if(SocketClient.getInstance().isConnected()){
            var request = {
                c : "get_top_bar"
            };
            SocketClient.getInstance().send(request);
        }
        else{
            this.getMessageFiveSecondTime(2);
        }
    },

    getMessageFiveSecondTime : function (second) {
        var thiz = this;
        this.stopAllActions();
        this.runAction(new cc.Sequence(new cc.DelayTime(second), new cc.CallFunc(function () {
            thiz.fetchMessage();
        })));
    }
});

var home_jackpot_gameId = home_jackpot_gameId || {};
/*(function () {
    for(var key in home_jackpotList){
        if(!home_jackpotList.hasOwnProperty(key)) continue;
        var gameList = home_jackpotList[key];
        for(var i=0;i<gameList.length;i++){
            var gameId = gameList[i];
            if(home_jackpot_gameId[gameId] === undefined){
                home_jackpot_gameId[gameId] = [];
            }
            home_jackpot_gameId[gameId].push(parseInt(key));
        }
    }
})();*/

var HomeGameLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var broadcast = new HomeBroadcastMessage();
        this.addChild(broadcast);

        this._initView();
    },

    _initView: function () {
        var left = 277;
        var bottom = 93;
        var right = 1647;
        var top = 640;

        var listGame = new newui.TableView(cc.size(right - left, (top - bottom)), 1);
        listGame.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listGame.setPadding(27);
        listGame.setBounceEnabled(true);
        listGame.setMargin(0,0,28,28);
        listGame.setScrollBarEnabled(false);
        listGame.setPosition(left, bottom);
        this.listGame = listGame;
        this.addChild(listGame);

        for(var i=0;i<s_home_gameList.length;i++){
            this.addGame(s_home_gameList[i]);
        }
    },

    addGame: function (gameId) {
        var thiz = this;

        var gameButton = new LobbyGameSlotButton(gameId);
        this.listGame.pushItem(gameButton);
        gameButton.addClickEventListener(function () {
            thiz.onTouchGame(gameId);
        });
    },

    onEnter : function () {
        this._super();
        this.startAnimation();
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.startAnimation();
        }
    },

    startAnimation : function () {
        this.listGame.runMoveEffect(3000,0.1,0.0);
    },

    onTouchGame : function (gameId) {
        cc.log("onTouchGame: " + gameId);
    }
});
//HomeGameLayer.defaultTabSelected = 1;

var LobbyGameCardButton = ccui.Widget.extend({
    ctor : function (gameId, iconSize) {
        this._super();
        this.setTouchEnabled(true);
        var gameIcon = new cc.Sprite("#lobby_gameIcon_"+ gameId +".png");
        this.moduleName = GameModuleName[gameId];
        if(iconSize){
            this.setContentSize(iconSize);
        }
        else{
            iconSize = gameIcon.getContentSize();
            this.setContentSize(gameIcon.getContentSize());
        }

        gameIcon.setPosition(this.width/2 , this.height/2);
        this.addChild(gameIcon);
        this.gameIcon = gameIcon;

        // // download
        var downloadLayer = new cc.Node();
        downloadLayer.setContentSize(this.getContentSize());
        this.addChild(downloadLayer,1);
        this.downloadLayer = downloadLayer;

        var downloadBar = new cc.ProgressTimer(new cc.Sprite("#lobby_gameIcon_download_1.png"));
        downloadBar.setType(cc.ProgressTimer.TYPE_RADIAL);
        downloadBar.setPosition(downloadLayer.width/2, downloadLayer.height/2);
        downloadLayer.addChild(downloadBar,1);
        this.downloadBar = downloadBar;

        var downloadBarBg = new cc.Sprite("#lobby_gameIcon_download_0.png");
        downloadBarBg.setPosition(downloadBar.getPosition());
        downloadLayer.addChild(downloadBarBg,0);

        var downloadLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, "123");
        downloadLabel.setPosition(downloadBar.getPosition());
        downloadLayer.addChild(downloadLabel,2);
        this.downloadLabel = downloadLabel;

        CreateModuleIconEvent(this);

        if(s_game_available.indexOf(gameId) === -1){
            gameIcon.setEnabled(false);
            this.addClickEventListener(function () {
                MessageNode.getInstance().show("Game sắp ra mắt.");
            });
        }
        else{
            var thiz = this;
            this.addClickEventListener(function () {
                thiz.onTouchGame(gameId);
            });
        }

        var animation = window._createHomeIconAnimation(gameId, iconSize);
        if(animation){
            gameIcon.addChild(animation);
        }
    },

    _onPressStateChangedToPressed: function () {
        this.setScale(1.05);
    },

    _onPressStateChangedToNormal: function () {
        this.setScale(1.0);
    },

    setModuleReady : function (isReady) {
        this.downloadLayer.setVisible(false);
    },

    setModuleUpdate :function (percentage) {
        this.downloadLayer.setVisible(true);
        this.downloadBar.setPercentage(percentage);
        this.downloadLabel.setString(Math.floor(percentage).toString() + "%");
    }
});

var LobbyGameSlotButton = LobbyGameCardButton.extend({
    ctor: function (gameId) {
        this._super(gameId, cc.size(223, 349));
        this._initGameIconJackpot(gameId);
    },

    _initGameIconJackpot : function (gameId) {
        if(home_jackpot_gameId[gameId] === undefined){
            return;
        }

        var line1 = new cc.Sprite("#lobby_gameIcon_line.png");
        line1.setPosition(120, 65);
        this.addChild(line1);

        var line2 = new cc.Sprite("#lobby_gameIcon_line.png");
        line2.setPosition(line1.x, 40);
        this.addChild(line2);

        var jackpot1 = cc.Label.createWithBMFont("res/fonts/home_jackpot_1.fnt", "1000");
        jackpot1.setPosition(120, 78);
        this.addChild(jackpot1);

        var jackpot2 = cc.Label.createWithBMFont("res/fonts/home_jackpot_1.fnt", "10000");
        jackpot2.setPosition(jackpot1.x, 53);
        this.addChild(jackpot2);

        var jackpot3 = cc.Label.createWithBMFont("res/fonts/home_jackpot_1.fnt", "100000");
        jackpot3.setPosition(jackpot1.x, 27);
        this.addChild(jackpot3);

        var allJackpot = [jackpot3, jackpot2, jackpot1];
        for(var i=0;i<allJackpot.length;i++){
            var jackpot = allJackpot[i];
            jackpot._jackpotLabel = jackpot;
            if(home_jackpot_gameId[gameId]){
                var betting = home_jackpot_gameId[gameId][i];
            }
            else{
                var betting = 0;
            }
            JackpotEvent.addEventForTarget(jackpot, gameId, betting);
        }
        var jackpotMultiIcon = new JackpotMultiplyEvent.HomeIcon(gameId);
        jackpotMultiIcon.setPosition(this.width/2, 370);
        this.addChild(jackpotMultiIcon, 10);
    }
});

