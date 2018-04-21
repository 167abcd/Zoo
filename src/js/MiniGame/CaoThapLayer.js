/**
 * Created by ext on 12/20/2016.
 */

//var s_CaoThapLayer = null;
var ARR_BET_MONEY = ["1K","10K","50K","100K","500K"];

var POS_BETTING_CAOTHAP = [cc.p(157,174),cc.p(106,229),cc.p(91,299),cc.p(122,366),cc.p(183,409)]

var ARR_HUTHUONG_CAOTHAP_MONEY = [1000,10000,50000,100000,500000];


var CaoThapLayer = MiniGamePopup.extend({
    ctor: function () {
        this._super();
        this._boudingRect = cc.rect(20, 60, 800, 436);

        this.setScale(1);
        // this.timeRemainingInterval = null;
        // this.timeRemaining = 0;
        this.gameType = GameType.MiniGame_CaoThap;

        var bg = new cc.Sprite("#caothap_bg.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);
        this.bg = bg;

        var padY  = -20;

        var highButton = new ccui.Button("caothap_up.png", "", "", ccui.Widget.PLIST_TEXTURE);
        highButton.setPosition(419, 336+ padY);
        highButton.setScale9Enabled(true);
        this.addChild(highButton);
        this.highButton = highButton;

        var lowButton = new ccui.Button("caothap_down.png", "", "", ccui.Widget.PLIST_TEXTURE);
        lowButton.setPosition(419, 228+ padY);
        lowButton.setScale9Enabled(true);
        this.addChild(lowButton);
        this.lowButton = lowButton;

        var startButton = new ccui.Button("caothap_startButton.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startButton.setZoomScale(0.0);
        // startButton.setScale9Enabled(true);
        startButton.setPosition(264, 274+ padY);
        this.addChild(startButton,1);
        this.startButton = startButton;

        var nextButton = new ccui.Button("caothap_nextButton.png", "", "", ccui.Widget.PLIST_TEXTURE);
        nextButton.setZoomScale(0.0);
        nextButton.setScale9Enabled(true);
        nextButton.setPosition(631,208);
        nextButton.setVisible(true);
        this.addChild(nextButton);
        this.nextButton = nextButton;

        var coinIcon = new cc.Sprite("#caothap_coinIcon.png");
        coinIcon.setPosition(338, 422);
        this.addChild(coinIcon,1);

        var particle = new cc.ParticleSystem("res/Texture/Animation/tophu.plist");
        particle.setPosition(cc.p(338, 450));
        this.addChild(particle,1);

        var bg_hu_ct = new cc.Sprite("#bg_hu_ct.png");
        bg_hu_ct.setPosition(428, 422);
        this.addChild(bg_hu_ct);


        var huThuongLabel = new cc.LabelBMFont("10.000.000", "res/fonts/mnpk_fnt_tien1.fnt");
        huThuongLabel.setColor(cc.color("#ffff00"));
        // huThuongLabel.setAnchorPoint(cc.p(1.0, 0.5));
        huThuongLabel.setPosition(bg_hu_ct.width/2  + 22, bg_hu_ct.height/2);
        bg_hu_ct.addChild(huThuongLabel, 1);

        this.huThuongLabel = huThuongLabel;
        this.initBetting();



        var bankLabel = cc.Label.createWithBMFont("res/Texture/CapThap/caothap_tien2.fnt", "0", cc.TEXT_ALIGNMENT_CENTER);
        // bankLabel.setColor(cc.color("#ffea00"));
        // bankLabel.setAnchorPoint(cc.p(1.0, 0.5));
        bankLabel.setPosition(421, 281+ padY);
        this.bankLabel = bankLabel;
        this.addChild(bankLabel, 1);

        // var timeLabel = new cc.LabelBMFont("02:00", cc.res.font.Roboto_Medium_Bold_30);
        // timeLabel.setColor(cc.color(255,240,170,255));
        // timeLabel.setPosition(256, 197);
        // this.timeLabel = timeLabel;
        // this.addChild(timeLabel, 1);

        // var highLabel = new cc.LabelBMFont("CAO", cc.res.font.Roboto_CondensedBold_30);
        // highLabel.setColor(cc.color("#c9ceff"));
        // highLabel.setPosition(highButton.x, 192);
        // this.addChild(highLabel, 1);
        //
        // var lowLabel = new cc.LabelBMFont("THẤP", cc.res.font.Roboto_CondensedBold_30);
        // lowLabel.setColor(cc.color("#c9ceff"));
        // lowLabel.setPosition(lowButton.x, highLabel.y);
        // this.addChild(lowLabel, 1);

        var highValueLabel = cc.Label.createWithBMFont("res/Texture/CapThap/caothap_tien1.fnt", "0", cc.TEXT_ALIGNMENT_CENTER);
        // highValueLabel.setColor(cc.color("#ffea00"));
        highValueLabel.setPosition(421, 389+ padY);
        this.highValueLabel = highValueLabel;
        this.addChild(highValueLabel, 2);

        var lowValueLabel =  cc.Label.createWithBMFont("res/Texture/CapThap/caothap_tien1.fnt", "0", cc.TEXT_ALIGNMENT_CENTER);
        // lowValueLabel.setColor(cc.color("#ffea00"));
        lowValueLabel.setPosition(421, 174+ padY);
        this.lowValueLabel = lowValueLabel;
        this.addChild(lowValueLabel, 2);

        var card = new cc.Sprite("#caothap_bocBai.png");
        // card.setScale(2 * cc.winSize.screenScale);
        card.setPosition(264, 274+ padY);
        this.addChild(card);
        this.card = card;

        var gameIdLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "", cc.TEXT_ALIGNMENT_LEFT);
        // gameIdLabel.setColor(cc.color("#5366cb"));
        gameIdLabel.setAnchorPoint(0,0.5);
        gameIdLabel.setScale(0.8);
        gameIdLabel.setPosition(554, 433);
        this.addChild(gameIdLabel);
        this.gameIdLabel = gameIdLabel;

        this.initNoHu();
        this.initHistory();

        var thiz = this;
        lowButton.addClickEventListener(function () {
            thiz.onLowPredictClick();
        });

        highButton.addClickEventListener(function () {
            thiz.onHighPredictClick();
        });

        startButton.addClickEventListener(function () {
            thiz.onStartClick();
        });

        nextButton.addClickEventListener(function () {
            thiz.onLuotMoiBtClick();
        });

        this.setHighLowBtEnable(false);


        var bxhButton = new ccui.Button("caothap_bxh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bxhButton.setPosition(202, 489);
        bxhButton.addClickEventListener(function () {
            var vinhdanhpop = new AllBangVinhDanhLayer(GameType.MiniGame_CaoThap);
            vinhdanhpop.show();
        });
        bg.addChild(bxhButton, 5);

        var tutorialButton = new ccui.Button("caothap_tutorialBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialButton.setPosition(73, 438);
        tutorialButton.addClickEventListener(function () {
            var tutorialDialog = TutorialDialog.getTutorial(GameType.MiniGame_CaoThap);
            tutorialDialog.show();
        });
        bg.addChild(tutorialButton, 5);


        var historyButton = new ccui.Button("caothap_historyBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        historyButton.setPosition(133, 477);
        historyButton.addClickEventListener(function () {
            var lichsupop = new AllLichSuLayer(GameType.MiniGame_CaoThap);
            lichsupop.show();
        });
        bg.addChild(historyButton, 5);

        var closeButton = new ccui.Button("caothap_closeBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(744, 456);
        bg.addChild(closeButton, 5);
        closeButton.addClickEventListener(function () {
            thiz.closeButtonHandler();
        });
        thiz.setLuotMoiBtVisible(false);



    },

    updateInfor:function () {


    },
    initBetting:function () {
        var thiz = this;
        this.arrButtonBet = [];
        for(var i = 0; i < 5; i++){
            (function () {
                var inew = i;
                var btnBet = new ccui.Button("caothap_chip1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnBet.setPosition(POS_BETTING_CAOTHAP[i]);
                btnBet.setScale9Enabled(true);
                btnBet.addClickEventListener(function () {
                    thiz.onClickBetting(inew);
                });
                var label = new cc.LabelBMFont(ARR_BET_MONEY[inew], cc.res.font.Roboto_Medium_20);
                // label.setScale(0.8);
                label.setColor(cc.color(255,216,36,255));
                label.setPosition(35,35);
                btnBet.addChild(label);
                btnBet.lblM = label;
                thiz.bg.addChild(btnBet);
                thiz.arrButtonBet.push(btnBet);
            })();


        }
        this.isEnableBetting = true;
        this.onClickBetting(0);
    },
    onClickBetting:function (index) {
        if(!this.isEnableBetting){
            return;
        }
        this.indexBeting = index;
        this.huThuongLabel.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.MiniGame_CaoThap,ARR_HUTHUONG_CAOTHAP_MONEY[index])));
        for(var i = 0; i < this.arrButtonBet.length; i++){
            this.arrButtonBet[i].lblM.setColor(cc.color("ffffff"));
            this.arrButtonBet[i].loadTextureNormal("caothap_chip1.png",ccui.Widget.PLIST_TEXTURE);
        }
        this.arrButtonBet[index].lblM.setColor(cc.color("2d0303"));
        this.arrButtonBet[index].loadTextureNormal("caothap_chip2.png",ccui.Widget.PLIST_TEXTURE);
    },

    onLuotMoiBtClick : function () {
        this._controller.sendLuotMoiRequest();
        // SoundPlayer.playSound("mini_clickButton");
        this.setBettingSelectEnable(true);
        this.setReward(0,0);
    },
    setBettingSelectEnable:function (isEnable) {
        this.isEnableBetting = isEnable;
        // for(var i = 0; i < this.arrButtonBet.length; i++){
        //     // setEN    this.arrButtonBet
        //     this.setActiveBt(this.arrButtonBet[i],isEnable);
        // }
    },
    onLowPredictClick: function () {

        this.setRolling(true);
        this._controller.sendLowPredict();
        // SoundPlayer.playSound("mini_clickButton");
    },

    onHighPredictClick: function () {

        this.setRolling(true);
        this._controller.sendHighPredict();
        // SoundPlayer.playSound("mini_clickButton");
    },

    onStartClick: function () {

        if(SocketClient.getInstance().isLoggin()){
            this.setBocBtEnable(false);
            this.setRolling(true);
            this._controller.sendInitGame(this.indexBeting + 1);
            // SoundPlayer.playSound("mini_clickButton");
            this.setBettingSelectEnable(false);
        }else {
             MessageNode.getInstance().show("Bạn cần đăng nhập để sử dụng chức năng này!");
        }


    },

    initNoHu: function () {
        this._kingCards = [];
        for (var i = 0; i < 3; i++) {
            var kingCard = new cc.Sprite("#caothap_kingCard_1.png");
            kingCard.setPosition(548 + i * 77, 309);
            this.addChild(kingCard, 1);
            this._kingCards.push(kingCard);
            kingCard.activated = false;
        }
    },

    setBankValue: function (value) {
        this.bankLabel.setString(cc.Global.NumberFormat1(value));
    },

    showResultCard: function (cardId) {
        this.setRolling(false);
        if(cardId < 0){
            this.card.setSpriteFrame("caothap_bocBai.png");
            this.card.setScale(1);
        }
        else{
            var card = CardList.prototype.getCardWithId(cardId);
            this.card.setSpriteFrame(card.rank + s_card_suit[card.suit] + ".png");
            this.card.setScale(1.4);
        }
    },

    playSoundLost : function () {
        // SoundPlayer.playSound("thuaroi");
    },

    initHistory: function () {
        var historyList = new newui.TableView(cc.size(541, 66), 1);
        historyList.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        historyList.setReverse(false);
        historyList.setPosition(153, 50);
        // historyList.setMargin(margin, margin, 0, 0);
        // historyList.setPadding(padding);
        historyList.setScrollBarEnabled(false);
        this.bg.addChild(historyList, 3);
        this.historyList = historyList;

        // for(var i=0;i<4;i++){
        //     this.addHistory(0);
        //     //this.addHistory( Math.floor((Math.random() * 13)));
        // }
    },

    initController: function () {
        this._controller = new CaoThapController(this);
    },

    pushKing: function (isK) {
            if(isK){
                for (var i = 0; i < 3; i++) {
                    if(!this._kingCards[i].activated){
                        this._kingCards[i].setSpriteFrame("caothap_kingCard_2.png");
                        this._kingCards[i].activated = true;
                        break;
                    }

                }
            }

    },

    pushClearKing: function () {

        for (var i = 0; i < 3; i++) {

                this._kingCards[i].setSpriteFrame("caothap_kingCard_1.png");
                this._kingCards[i].activated = false;


        }
    },

    setRolling: function (isRolling) {
        this.rolling = isRolling;
        if (isRolling) {
            // this._rollingSound = SoundPlayer.playSoundLoop("lucky_wheel");
        }
        else {
            // SoundPlayer.stopSoundLoop(this._rollingSound);
            this._rollingSound = null;
        }
    },

    update: function (dt) {
        if (this.rolling) {
            // dang quay
            this.delta += dt;
            // if (this.delta < 0.1)
            //     return;
            var randNum = Math.floor(Math.random() * 51 + 4);
            var thiz = this;
            var texture = "" + Math.floor(randNum / 4) +
                s_card_suit[randNum % 4] + ".png";
            this.card.setSpriteFrame(texture);
            this.card.setScale(1.4);
            this.delta = 0;
        }
    },
    showJackpot: function () {
        // var layer = new JackpotLayer();
        // layer.show();
        // return;
        var nodeJackpot = new cc.Node();
        nodeJackpot.setTag(7777);
        nodeJackpot.isCanRemove = false;
        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
        toucWidget.setAnchorPoint(cc.p(0.0, 0.0));
        toucWidget.setTouchEnabled(true);
        toucWidget.addClickEventListener(function () {
            if(nodeJackpot.isCanRemove)
                nodeJackpot.removeFromParent();
        });
        toucWidget.runAction(new cc.Sequence( new cc.DelayTime(2), new cc.CallFunc(function () {
            nodeJackpot.isCanRemove = true;
        })));
        nodeJackpot.addChild(toucWidget);

        var jackpotSprite = new cc.Sprite("#caothap_nohu_.png");
        jackpotSprite.setPosition(this.width/2, this.height/2);
        jackpotSprite.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1)
            )
        ));
        nodeJackpot.addChild(jackpotSprite,1);
        var xubay = new cc.ParticleSystem("res/Texture/hu_xubay.plist");
        xubay.setPosition(this.width/2, this.height/2);
        xubay.setScale(1.5);
        nodeJackpot.addChild(xubay, 0);
        this.addChild(nodeJackpot, 1000);
        var lblHuno = cc.Label.createWithBMFont("res/fonts/fnt_nohu.fnt", cc.Global.NumberFormat1(parseInt(this.moneyJackpot)));
        // lblHuno.setScale(1.5);
        lblHuno.setPosition(jackpotSprite.width/2,10);
        // lblHuno.setColor(cc.color(255,222,0,255));
        jackpotSprite.addChild(lblHuno);
    },

    saveDataJackpot:function (money) {
        this.moneyJackpot =   money;
    },
    updateHuThuong:function () {
        this.huThuongLabel.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.MiniGame_CaoThap,ARR_HUTHUONG_CAOTHAP_MONEY[this.indexBeting])));
    },

    addHistory: function (cardValue) {
        var card = CardList.prototype.getCardWithId(cardValue);
        var cardIndex = card.rank;
        var cardSiut = card.suit;


        var cardImg = new cc.Sprite("#" + card.rank + s_card_suit[card.suit] + ".png");
        cardImg.setScale(0.5);
        // if (this.historyList.size() > 0) {
        //     var item = this.historyList.getItem(this.historyList.size()-1);
        //     // item.label.setColor(cc.color("#8d9de6"));
        //
        //     item.lastCardSprite.setVisible(false);
        // }
        //
        //
        // var container = new ccui.Widget();
        // container.setContentSize(39, 48);
        //
        // var cardString = "";
        // if (cardIndex == 1)
        //     cardString = "A";
        // else if (cardIndex == 11)
        //     cardString = "J";
        // else if (cardIndex == 12)
        //     cardString = "Q";
        // else if (cardIndex == 13)
        //     cardString = "K";
        // else
        //     cardString = cardIndex.toString();
        //
        // var label = new cc.LabelBMFont(cardString, cc.res.font.Roboto_Medium_20);
        // label.setColor(cc.color("#fff0aa"));
        // label.setPosition(container.getContentSize().width / 2-8, container.getContentSize().height / 2);
        // container.addChild(label);
        // container.label = label;
        // var namecCard = "#caothap_bich.png";
        // if(cardSiut == 1){
        //     namecCard = "#caothap_tep.png";
        // }else  if(cardSiut == 2){
        //     namecCard = "#caothao_ro.png";
        // }else  if(cardSiut == 3){
        //     namecCard = "#caothao_co.png";
        // }
        // var suitCardSprite = new cc.Sprite(namecCard);
        // suitCardSprite.setPosition(container.getContentSize().width / 2+8, container.getContentSize().height / 2-2);
        // container.addChild(suitCardSprite);
        //
        //
        // var lastCardSprite = new cc.Sprite("#caothap_history_lastCard.png");
        // // lastCardSprite.setScaleX(1.2);
        // lastCardSprite.setPosition(container.getContentSize().width / 2, container.getContentSize().height / 2);
        // container.addChild(lastCardSprite);
        // container.lastCardSprite = lastCardSprite;

        this.historyList.insertItem(cardImg, this.historyList.size());
        this.historyList.forceRefreshView();
        this.historyList.jumpToRight();
    },

    setReward: function (lowReward, highReward) {
        this.lowValueLabel.setString(cc.Global.NumberFormat1(lowReward));
        this.highValueLabel.setString(cc.Global.NumberFormat1(highReward));

        // this.highButton.enabled = highReward != 0;
        // this.highButton.setBright(highReward != 0);
        //
        // this.lowButton.enabled = lowReward != 0;
        // this.lowButton.setBright(lowReward != 0);
    },

    setGameId: function (gameId) {
        this.gameIdLabel.setString("(" + gameId+")");
    },

    setTimeRemaining: function (timeRemaining) {
        // var thiz = this;
        // this.timeRemaining = timeRemaining;
        // if (this.timeRemainingInterval) {
        //     clearInterval(this.timeRemainingInterval);
        // }
        // this.timeRemainingInterval = setInterval(function () {
        //     if (thiz.timeRemaining <= 0) {
        //         thiz.timeLabel.setString("");
        //         clearInterval(thiz.timeRemainingInterval);
        //         thiz.timeRemainingInterval = null;
        //     } else {
        //         thiz.timeLabel.setString(thiz.formatTime(thiz.timeRemaining));
        //         thiz.timeRemaining--;
        //     }
        // }, 1000);
    },

    formatTime: function (timeRemaining) {
        var minute = Math.floor(timeRemaining / 60);
        if (minute < 10) minute = "0" + minute;
        var second = timeRemaining % 60;
        if (second < 10) second = "0" + second;
        return minute + " : " + second;
    },

    setTipString: function (str) {

    },

    setLuotMoiBtVisible: function (visible) {
        this.startButton.visible = !visible;
        this.nextButton.visible = visible;
    },

    setLuotMoiBtEnable: function (enabled) {
        this.nextButton.enabled = enabled;
        this.nextButton.setBright(enabled);
        this.nextButton.visible = enabled;
    },

    setBocBtEnable:function (enabled) {
        this.startButton.visible = enabled;
        this.startButton.enabled = enabled;
        this.startButton.setBright(enabled);
    },

    setHighLowBtEnable: function (enabled) {
        this.setHighBtEnable(enabled);
        this.setLowBtEnable(enabled);
    },

    setHighBtEnable : function (enabled) {

        this.highButton.enabled = enabled;
        this.highButton.setBright(enabled);
    },

    setLowBtEnable : function (enabled) {
        this.lowButton.enabled = enabled;
        this.lowButton.setBright(enabled);
    },





    clearTurn: function () {
        this.bankLabel.setString("0");
        this.gameIdLabel.setString("");
        this.setLuotMoiBtEnable(false);
        this.setBocBtEnable(true);
        this.historyList.removeAllItems();
        this.card.setSpriteFrame("caothap_bocBai.png");
        this.card.setScale(1);
        this.setHighLowBtEnable(false);
        this.setReward(0,0);
        this.setBettingSelectEnable(true);
        // if (this.timeRemainingInterval)
        //     clearInterval(this.timeRemainingInterval);
        //this.timeLabel.setString("");
    },

    onEnter: function () {
        this._super();
        this.scheduleUpdate();
        //s_CaoThapLayer = this;
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        //s_CaoThapLayer = null;
    },

    // onError: function (param) {
    //     this._super(param);
    //
    //     //het tien
    //     this.setRolling(false);
    //     this.clearTurn();
    // }
});

// CaoThapLayer.showPopup = function () {
//     if (s_CaoThapLayer) {
//         return null;
//     }
//     var popup = new CaoThapLayer();
//     popup.show();
//     return popup;
// };