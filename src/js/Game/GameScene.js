/**
 * Created by ext on 7/21/2016.
 */

var GameTopBar = cc.Node.extend({
    ctor: function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onExtensionCommand, this);

        var backBt = new ccui.Button("ingame-backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(406, 776);
        this.addChild(backBt);

        var settingBt = new ccui.Button("ingame-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        settingBt.setPosition(1572, backBt.y);
        this.addChild(settingBt);

        var chatBt = new ccui.Button("ingame-chatBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        chatBt.setPosition(1468, backBt.y);
        this.addChild(chatBt);

        this.backBt = backBt;
        this.settingBt = settingBt;
        this.chatBt = chatBt;
    },
    onExit: function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },

    onExtensionCommand: function (messageType, contents) {

    }
});

// var s_sfs_error_msg = s_sfs_error_msg || [];
// /*TLMN*/
// s_sfs_error_msg[1] = "Đánh bài không hợp lệ";
// s_sfs_error_msg[2] = "Bạn không phải chủ phòng";
// s_sfs_error_msg[3] = "Không đủ người chơi để bắt đầu";
// s_sfs_error_msg[4] = "Bạn phải đánh quân bài nhỏ nhất";
// s_sfs_error_msg[5] = "Bạn không thể bỏ lượt";
// s_sfs_error_msg[6] = "Người chơi chưa sẵn sàng";
// s_sfs_error_msg[7] = "Bạn chưa đến lượt";
// s_sfs_error_msg[8] = "Bạn không có 4 đôi thông";
// s_sfs_error_msg[9] = "Bạn không có đủ tiền";
//
// /*PHOM*/
// s_sfs_error_msg[61] = "Không thể ăn bài";
// s_sfs_error_msg[62] = "Không thể hạ bài";
// s_sfs_error_msg[63] = "Không thể gửi bài";
// s_sfs_error_msg[64] = "Không thể bốc bài";

var IGameScene = IScene.extend({
    ctor: function (initBg) {
        this._super();
        this.sceneLayer.setContentSize(cc.size(2000, 860));

        this.initController();
        this.isOwnerMe = false;

        if(initBg){
            var bg = new cc.Sprite(initBg);
        }
        else{
            var bg = new cc.Sprite("res/Texture/GameBai/cardGameBg.jpg");
        }
        bg.setAnchorPoint(cc.p(0, 1.0));
        this.addChild(bg,-1);
        this.bg = bg;

        var gameTopBar = new GameTopBar();
        this.gameTopBar = gameTopBar;
        this.sceneLayer.addChild(gameTopBar,10);

        var thiz = this;
        gameTopBar.backBt.addClickEventListener(function () {
            thiz.backButtonClickHandler();
        });

        gameTopBar.settingBt.addClickEventListener(function () {
            thiz.onSettingButtonHandler();
        });

        gameTopBar.chatBt.addClickEventListener(function () {
            var dialog = new ChatDialog();
            dialog.onTouchMessage = function (message) {
                thiz.sendChatMessage(message);
            };
            dialog.onTouchEmotion = function (icon) {
                thiz.sendEmotion(icon);
            },
            dialog.show();
        });

      //  this.showGameInfo("GameName", 5000);
    },

    onCanvasResize : function () {
        this._super();
        var scaleY = cc.winSize.height / this.bg.height;
        if(scaleY < 1.0){
            scaleY = 1.0;
        }
        this.bg.setScale(scaleY);
        this.bg.y = cc.winSize.height;
    },

    initController: function () {

    },

    setFreeGameView: function () {
        if(this.playerView){
            for(var i=0;i<this.playerView.length;i++){
                this.playerView[i].setFreeGameView();
            }
        }
        this.betTitle.setColor(cc.color("#ffffff"));
    },

    setOwner : function (username) {
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username === username) {
                this.allSlot[i].setIsOwner(true);
            }else{
                this.allSlot[i].setIsOwner(false);
            }
        }
    },

    showGameInfo: function (gameName, betAmount) {
        var nameTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Bold_48, gameName);
        nameTitle.setScale(29 / 48);
        nameTitle.setAnchorPoint(cc.p(0.0, 0.5));
        nameTitle.setPosition(460, 794);
        this.gameTopBar.addChild(nameTitle);

        var betTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Bold_48, "Mức cược: " + cc.Global.NumberFormat2(betAmount));
        betTitle.setScale(28 / 48);
        betTitle.setAnchorPoint(cc.p(0.0, 0.5));
        betTitle.setColor(cc.color("#ffcb2c"));
        betTitle.setPosition(460, 753);
        this.gameTopBar.addChild(betTitle);
        this.betTitle = betTitle;
    },

    getMaxSlot: function () {
        if (this.playerView) {
            return this.playerView.length;
        }
        return 0;
    },

    backButtonClickHandler: function () {
        if (LoadingDialog.getInstance().isShow()) {
            return;
        }
        if (this.popupLayer.getChildren().length > 0) {
            this.popupLayer.removeAllChildren();
            return;
        }

        if (this._controller) {
            this._controller.requestQuitRoom();
        }
    },
    exitToLobby: function (message) {
        var homeScene = new HomeScene();
        var gameId = s_lobby_subscribe_id[this._lobbyGameName];
        homeScene.startLobby(gameId);
        SceneNavigator.replaceScene(homeScene);
        if (message) {
            MessageNode.getInstance().show(message);
        }
        return homeScene;
    },
    exitToGame: function (message) {
        var homeScene = new HomeScene();
        homeScene.startGame();
        SceneNavigator.replaceScene(homeScene);
        if (message) {
            MessageNode.getInstance().show(message);
        }
        return homeScene;
    },

    onExit: function () {
        this._super();
        SoundPlayer.stopAllSound();
        if (this._controller) {
            this._controller.releaseController();
            this._controller = null;
        }
    },

    onEnter : function () {
        this._super();
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                if(cc.sys.isNative){
                    if (parseKeyCode(keyCode) === cc.KEY.back) {
                        thiz.backButtonClickHandler();
                    }
                }
                else{
                    if(keyCode === cc.KEY.escape){
                        thiz.backButtonClickHandler();
                    }
                }
            }
        }, this);

      //  FloatButton.getInstance().show(this.floatButtonLayer);
        FloatButton.getInstance().setVisible(true);
    },

    showErrorMessage: function (message, scene) {
        // if (scene) {
        //     MessageNode.getInstance().show(message, null, scene);
        // }
        // else {
        //     MessageNode.getInstance().show(message);
        // }
        MessageNode.getInstance().show(message);
    },

    onSettingButtonHandler : function () {
        var dialog = new SettingDialog();
        dialog.showWithAnimationMove();
    },

    sendChatMessage: function (message) {
        if (this._controller) {
            this._controller.sendChat(message);
        }
    },

    sendEmotion : function (icon) {
        if (this._controller) {
            this._controller.sendChatEmotion(icon);
        }
    },

    showLoading: function (message) {

    },

    updateGold: function (username, gold) {
        var goldNumber = gold;
        if (typeof gold === "string") {
            goldNumber = parseInt(gold);
        }
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username) {
                this.allSlot[i].setGold(goldNumber);
                return;
            }
        }
    },

    changeGoldEffect: function (username, deltaGold) {
        var slot = this.getSlotByUsername(username);
        if(slot){
            slot.runChangeGoldEffect(deltaGold);
        }
    },

    getSlotByUsername: function (username) {
        if(!this.allSlot){
            return null;
        }
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username) {
                return this.allSlot[i];
            }
        }
        return null;
    },

    fillPlayerToSlot: function (playerList) {
        this.allSlot = this.playerView;
        for (var i = 0; i < this.allSlot.length; i++) {
            this.allSlot[i] = this.playerView[i];
            var data = playerList[i];

            this.allSlot[i].stopTimeRemain();
            this.allSlot[i].userIndex = data.userIndex;

            if (data.username == "") {
                this.allSlot[i].setEnable(false);
            }
            else {
                this.allSlot[i].setEnable(true);
                this.allSlot[i].setUsername(data.username);
                this.allSlot[i].setGold(data.gold);
                this.allSlot[i].setAvatar(data.avt);
                this.allSlot[i].spectator = data.spectator;
                this.allSlot[i].setInfo(data["info"]);
            }
        }
    },

    userJoinRoom: function (info) {
        SoundPlayer.playSound("join_room");

        for (var i = 0; i < this.allSlot.length; i++) {
            if (info.index == this.allSlot[i].userIndex) {
                this.allSlot[i].setEnable(true);
                this.allSlot[i].userIndex = info.index;
                this.allSlot[i].stopTimeRemain();
                this.allSlot[i].setUsername(info.username);
                this.allSlot[i].setGold(info.gold);
                this.allSlot[i].setAvatar(info.avt);
                this.allSlot[i].setInfo(info["info"]);

                return;
            }
        }

        // var meIndex = this.allSlot[0].userIndex;
        // var slot = info.index - meIndex;
        // if(slot < 0){
        //     slot += this.allSlot.length;
        // }
        //
        // this.allSlot[slot].setEnable(true);
        // this.allSlot[slot].userIndex = info.index;
        // this.allSlot[slot].stopTimeRemain();
        // this.allSlot[slot].setUsername(info.username);
        // this.allSlot[slot].setGold(info.gold);
    },

    userExitRoom: function (username) {
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username) {
                this.allSlot[i].setEnable(false);
                this.allSlot[i].stopTimeRemain();
                break;
            }
        }
    },

    updateRegExitRoom: function (exit) {
        if (exit) {
            this.gameTopBar.backBt.loadTextureNormal("ingame-backBt-active.png", ccui.Widget.PLIST_TEXTURE);
        }
        else {
            this.gameTopBar.backBt.loadTextureNormal("ingame-backBt.png", ccui.Widget.PLIST_TEXTURE);
        }

    },

    onChatMessage: function (username, message) {
      //  cc.log("chat: " + username + " - " + message);
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username === username) {
                this.allSlot[i].chatView.show(message);
                break;
            }
        }
    },

    onChatEmotion : function (username, message) {
       // cc.log("onChatEmotion: " + username + " - " + message);
      //  cc.log("chat: " + username + " - " + message);
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username === username) {
                this.allSlot[i].showChatEmotion(message);
                break;
            }
        }
    },

    onSFSExtension: function () {

    },
    performChangeRewardFund: function (value) {
        if (this.huThuongValueLabel) {
            this.huThuongValueLabel.setString(cc.Global.NumberFormat1(value));
        }
    },
    performAssetChange: function (amount, goldAfter, username) {
        var slot = this.getSlotByUsername(username);
        if (slot){
            if(goldAfter !== null && goldAfter !== undefined){
                slot.setGold(goldAfter);
            }
        }

        // var changeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "");
        // changeLabel.setString(amount > 0 ? ("+" + amount) : amount);
        // changeLabel.setColor(cc.color(amount > 0 ? "#ffde00" : "#c52829"));
        // changeLabel.setPosition(slot.avt.getPosition());
        // if (username == PlayerMe.username)
        //     this.sceneLayer.addChild(changeLabel);
        // else
        //     slot.addChild(changeLabel);
        //
        // if (goldAfter)
        //     slot.setGold(goldAfter);
        //
        // var moveAction = new cc.MoveTo(1.0, slot.avt.x, slot.avt.y + 50);
        // var removeAction = new cc.CallFunc(function () {
        //     changeLabel.removeFromParent(true);
        // });
        // changeLabel.runAction(new cc.Sequence(moveAction, removeAction));
    }
});

IGameScene.s_GameId = {};
IGameScene.s_GameId["tlmn_tudo"] = GameType.GAME_TienLenMN;
IGameScene.s_GameId["tlmn_solo"] = GameType.GAME_TLMN_Solo;
IGameScene.s_GameId["sam_tudo"] = GameType.GAME_Sam;
IGameScene.s_GameId["sam_solo"] = GameType.GAME_Sam_Solo;
IGameScene.s_GameId["Phom"] = GameType.GAME_Phom;
IGameScene.s_GameId["ChinesePoker"] = GameType.GAME_MauBinh;
IGameScene.s_GameId["ThreeCards"] = GameType.GAME_BaCay;
IGameScene.s_GameId["Poker"] = GameType.GAME_Poker;
IGameScene.s_GameId["ShakeDisk"] = GameType.GAME_XocDia;
IGameScene.s_GameId["TaiXiu"] = GameType.GAME_TaiXiu;

IGameScene.s_GameId["tlmn_tudo_silver"] = GameType.GAME_TienLenMN;
IGameScene.s_GameId["tlmn_solo_silver"] = GameType.GAME_TLMN_Solo;
IGameScene.s_GameId["sam_tudo_silver"] = GameType.GAME_Sam;
IGameScene.s_GameId["sam_solo_silver"] = GameType.GAME_Sam_Solo;
IGameScene.s_GameId["Phom_silver"] = GameType.GAME_Phom;
IGameScene.s_GameId["ChinesePoker_silver"] = GameType.GAME_MauBinh;
IGameScene.s_GameId["ThreeCards_silver"] = GameType.GAME_BaCay;
IGameScene.s_GameId["Poker_silver"] = GameType.GAME_Poker;
IGameScene.s_GameId["ShakeDisk_silver"] = GameType.GAME_XocDia;
IGameScene.s_GameId["TaiXiu_silver"] = GameType.GAME_TaiXiu;

IGameScene.s_GameName = {};
IGameScene.s_GameName[GameType.GAME_TLMN_Solo] = "TLMN ĐẾM LÁ SOLO";
IGameScene.s_GameName[GameType.GAME_TienLenMN] = "TIẾN LÊN MIỀN NAM";
IGameScene.s_GameName[GameType.GAME_Sam] = "SÂM LỐC";
IGameScene.s_GameName[GameType.GAME_Sam_Solo] = "SÂM SOLO";
IGameScene.s_GameName[GameType.GAME_XocDia] = "XÓC ĐĨA";
IGameScene.s_GameName[GameType.GAME_TaiXiu] = "TÀI XỈU";
IGameScene.s_GameName[GameType.GAME_MauBinh] = "MẬU BINH";
IGameScene.s_GameName[GameType.GAME_Phom] = "PHỎM";
IGameScene.s_GameName[GameType.GAME_BaCay] = "BA CÂY NHẤT ĂN TẤT";
IGameScene.s_GameName[GameType.GAME_Poker] = "Poker";
IGameScene.s_GameName[GameType.GAME_Lieng] = "LIÊNG";
IGameScene.s_GameName[GameType.GAME_BaCayChuong] = "BA CÂY CHƯƠNG";
IGameScene.s_GameName[GameType.GAME_SLOT_FRUIT] = "SlotFruit";

IGameScene.createGame = function (gameName, betting) {
    var gameId = IGameScene.s_GameId[gameName];
    var gameScene = null;

    if (gameId === GameType.GAME_TienLenMN) {
        gameScene = new TienLen();
    }
    else if (gameId === GameType.GAME_Sam) {
        gameScene = new Sam();
    }
    else if (gameId === GameType.GAME_Phom) {
        gameScene = new Phom();
    }
    else if (gameId === GameType.GAME_TLMN_Solo) {
        gameScene = new TLMNSolo();
    }
    else if (gameId === GameType.GAME_Sam_Solo) {
        gameScene = new SamSolo();
    }
    else if (gameId === GameType.GAME_XocDia) {
        gameScene = new XocDiaScene();
    }
    else if (gameId === GameType.GAME_TaiXiu) {
        gameScene = new TaiXiuScene();
    }
    else if (gameId === GameType.GAME_BaCay) {
        gameScene = new BaCay();
    }
    else if (gameId === GameType.GAME_MauBinh) {
        gameScene = new MauBinh();
    }
    else if (gameId === GameType.GAME_Poker) {
        gameScene = new Poker();
    }

    if(gameScene){
        gameScene._lobbyGameName = gameName;
        gameScene.showGameInfo(IGameScene.s_GameName[gameId], betting);
        if(gameName.endsWith("_silver")){
            cc.log("init free game");
            gameScene.setFreeGameView();
        }
    }

    return gameScene;
};