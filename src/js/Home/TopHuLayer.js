/**
 * Created by ext on 7/6/2016.
 */

var s_JackpotName = s_JackpotName || {};
s_JackpotName[GameType.MiniGame_Poker] = "MiniPoker";
s_JackpotName[GameType.MiniGame_VideoPoker] = "VideoPoker";
s_JackpotName[GameType.MiniGame_Vong_Quay_May_Man] = "Vòng quay";
s_JackpotName[GameType.MiniGame_CaoThap] = "Cao Thấp";
s_JackpotName[GameType.MiniGame_TaiXiu] = "Mini Tài xỉu";
s_JackpotName[GameType.MiniGame_Candy_Slot] = "Bắn trứng";
s_JackpotName[GameType.GAME_Larva] = "Long cung";
s_JackpotName[GameType.GAME_AOE] = "Kim tự tháp";
s_JackpotName[GameType.GAME_TET_AM] = "Cowboy";
s_JackpotName[GameType.MiniGame_CuopBien_Slot] = "Boom";

var home_jackpot_betting = home_jackpot_betting ||[
    100,
    1000,
    10000,
    50000,
    100000,
    500000
];

var home_jackpotList = home_jackpotList || {};
home_jackpotList[100] = [
    GameType.MiniGame_Poker,
    GameType.MiniGame_Candy_Slot,
    GameType.GAME_Larva,
    GameType.GAME_AOE,
    GameType.GAME_TET_AM,
    GameType.MiniGame_CuopBien_Slot
];

home_jackpotList[1000] = [
    GameType.MiniGame_Poker,
    GameType.MiniGame_Candy_Slot,
    GameType.MiniGame_CaoThap,
    GameType.GAME_Larva,
    GameType.GAME_AOE,
    GameType.GAME_TET_AM,
    GameType.MiniGame_CuopBien_Slot
];

home_jackpotList[10000] = [
    GameType.MiniGame_Poker,
    GameType.MiniGame_Candy_Slot,
    GameType.MiniGame_CaoThap,
    GameType.GAME_Larva,
    GameType.GAME_AOE,
    GameType.GAME_TET_AM,
    GameType.MiniGame_CuopBien_Slot
];

home_jackpotList[50000] = [
    GameType.MiniGame_CaoThap
];

home_jackpotList[100000] = [
    GameType.MiniGame_CaoThap
];

home_jackpotList[500000] = [
    GameType.MiniGame_CaoThap
];

var JackpotFloatButton = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));

        var button = new ccui.Button("home_jackpot_bt_2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.setContentSize(button.getContentSize());
        button.setPosition(this.width/2, this.height/2);
        this.addChild(button,1);

        var jackpot = new HomeJackpotLayer();
        jackpot.setPosition(button.width/2 - jackpot.width/2, -5);
        this.addChild(jackpot);

        button.addClickEventListener(function () {
            if(jackpot.isShow()){
                jackpot.hide();
            }
            else{
                jackpot.show();
            }
        });

        SceneNavigator.resizeEvent(this);
    },

    onCanvasResize : function () {
        this.x = 2000 - 175;
        this.y = cc.winSize.height - 194;
    }
});

var HomeJackpotLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        this.tabSelectedIndex = 0;
        this.allMiniLayer = [];

        this.initMiniGame();
    },

    initMiniGame: function () {
        var thiz = this;

        var top = 431;
        var bottom = 18;
        var left = 17;
        var right = 295;

        var bg = new cc.Sprite("#home_jackpot_bg_1.png");
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.0, 1.0));
        bg.setPosition(this.width/2, this.height/2);

        var clippingMessage = new ccui.Layout();
        clippingMessage.setContentSize(this.getContentSize());
        clippingMessage.setClippingEnabled(true);
        clippingMessage.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingMessage.setAnchorPoint(cc.p(0.0, 0.0));
        clippingMessage.setPosition(0, 0);
        this.addChild(clippingMessage);

        var jackpotLayer = new cc.Node();
        clippingMessage.addChild(jackpotLayer);
        this.jackpotLayer = jackpotLayer;

        jackpotLayer.addChild(bg);

        var goldTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "1000");
        goldTitle.setColor(cc.color("#fff000"));
        goldTitle.setPosition(156, 461);
        jackpotLayer.addChild(goldTitle);
        this.goldTitle = goldTitle;

        var leftBt = new ccui.Button("home-minigame-leftBt.png","","", ccui.Widget.PLIST_TEXTURE);
        leftBt.setPosition(35, 460);
        jackpotLayer.addChild(leftBt);

        var rightBt = new ccui.Button("home-minigame-leftBt.png","","", ccui.Widget.PLIST_TEXTURE);
        rightBt.setPosition(277, leftBt.y);
        rightBt.setFlippedX(true);
        jackpotLayer.addChild(rightBt);

        //add pageview
        var miniGameLayer = new ccui.PageView();
        miniGameLayer.setContentSize(cc.size(right-left, top-bottom));
        miniGameLayer.setAnchorPoint(cc.p(0.0, 0.0));
        miniGameLayer.setBounceEnabled(true);
        miniGameLayer.setPosition(left, bottom);
        jackpotLayer.addChild(miniGameLayer);
        this.miniGameLayer = miniGameLayer;

        for (var i = 0; i < home_jackpot_betting.length; i++) {
            var listGame = new newui.TableView(miniGameLayer.getContentSize(), 1);
            listGame.setDirection(ccui.ScrollView.DIR_VERTICAL);
            listGame.setBounceEnabled(true);
            listGame.setScrollBarEnabled(false);
            miniGameLayer.addPage(listGame);
            this.allMiniLayer.push(listGame);

            var betting = home_jackpot_betting[i];
            var gameList = home_jackpotList[betting];

            for (var j = 0; j < gameList.length; j++) {
                this.addItem(listGame, gameList[j], betting);
            }
        }

        miniGameLayer.addEventListener(function () {
            var i = miniGameLayer.getCurrentPageIndex();
            thiz.selectTab(i, false);
        });

        leftBt.addClickEventListener(function () {
            thiz.selectTab(thiz.tabSelectedIndex - 1, true);
        });

        rightBt.addClickEventListener(function () {
            thiz.selectTab(thiz.tabSelectedIndex + 1, true);
        });
    },

    isShow : function () {
        return this.jackpotLayer.visible;
    },

    show : function () {
        var jackpotLayer = this.jackpotLayer;

        jackpotLayer.stopAllActions();

        jackpotLayer.setPosition(0, 410);
        jackpotLayer.setVisible(true);
        jackpotLayer.runAction(cc.moveTo(0.2, 0, 0));
    },

    hide: function () {
        var jackpotLayer = this.jackpotLayer;
        jackpotLayer.stopAllActions();

        jackpotLayer.runAction(cc.sequence(cc.moveTo(0.2, 0, this.height), cc.callFunc(function () {
            jackpotLayer.setVisible(false);
        })));
    },

    selectTab: function (index, selectTab) {
        this.tabSelectedIndex = index;
        if(this.tabSelectedIndex < 0){
            this.tabSelectedIndex = home_jackpot_betting.length - 1;
        }
        else if(this.tabSelectedIndex >= home_jackpot_betting.length){
            this.tabSelectedIndex = 0;
        }

        if(selectTab){
            this.miniGameLayer.scrollToPage(this.tabSelectedIndex);
        }

        this.goldTitle.setString(cc.Global.NumberFormat1(home_jackpot_betting[this.tabSelectedIndex]));
    },

    onEnter: function () {
        this._super();
        this.selectTab(0, true);
        this.startAnimation();
        this._sortJackpot = true;
        this.scheduleUpdate();
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
    },

    startAnimation: function () {
        this.allMiniLayer[this.tabSelectedIndex].runMoveEffect(-2000, 0.1, 0.1);
    },

    addItem : function (m_list, gameId, betting) {
        var rankIdx = m_list.size() + 1;

        var newItem = new ccui.Widget();
        m_list.pushItem(newItem);

        var bg = new cc.Sprite("#home_jackpot_bg_2.png");
        bg.setPosition(0,0);
        bg.setAnchorPoint(cc.p(0,0));
        newItem.setContentSize(bg.getContentSize());
        newItem.addChild(bg);

        if(rankIdx < 4){
            var rankIcon = new cc.Sprite("#jackpot_rank_" + rankIdx + ".png");
        }
        else{
            var rankIcon = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, rankIdx.toString());
        }
        rankIcon.setPosition(30, newItem.height/2);
        newItem.addChild(rankIcon);

        var container = new ccui.Widget();
        container.setContentSize(newItem.getContentSize());
        container.setAnchorPoint(cc.p(0,0));
        newItem.addChild(container);
        newItem._container = container;

        var gameIcon = new cc.Sprite("#jackpot_icon_" + gameId.toString() + ".png");
        gameIcon.setPosition(89, container.height/2);
        container.addChild(gameIcon);

        var lb_tenhu = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, s_JackpotName[gameId]);
        lb_tenhu.setAnchorPoint(cc.p(0, 0.5));
        lb_tenhu.setPosition(cc.p(135, 56));
        container.addChild(lb_tenhu);

        var lb_moneyhu = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "0");
        lb_moneyhu.setColor(cc.color("#fff000"));
        lb_moneyhu.setAnchorPoint(cc.p(0, 0.5));
        lb_moneyhu.setPosition(cc.p(135, 28));
        container.addChild(lb_moneyhu);

        var thiz = this;
        container.value = 0;
        container.gameId = gameId;
        container.betting = betting;
        container._setJackpot = function (value) {
            lb_moneyhu.setString(cc.Global.NumberFormat1(value));
            container.value = value;
            thiz._sortJackpot = true;
        };
        JackpotEvent.addEventForTarget(container);

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            SceneNavigator.startGame(gameId);
        });
    },

    update: function (dt) {
        if(this._sortJackpot){
            for(var i=0;i<this.allMiniLayer.length;i++){
                this._sortJackpotList(this.allMiniLayer[i]);
            }
            this._sortJackpot = false;
        }
    },

    _sortJackpotList: function (mList) {
        for(var i=0;i<mList.size();i++){
            for(var j=i+1;j<mList.size();j++){
                var item1 = mList.getItem(i);
                var item2 = mList.getItem(j);
                var container1 = item1._container;
                var container2 = item2._container;
                if(container1.value < container2.value){
                    container1.retain();
                    container2.retain();
                    item1.removeChild(container1);
                    item2.removeChild(container2);
                    item1._container = container2;
                    item2._container = container1;
                    item1.addChild(container2);
                    item2.addChild(container1);
                }
            }
        }
    },
});