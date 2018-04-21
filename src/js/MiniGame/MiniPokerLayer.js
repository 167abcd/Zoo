/**
 * Created by ext on 12/20/2016.
 */
//var s_MiniPokerLayer = null;

var ARR_BET_MONEY_POKER = ["100","1K","10K"];
var ARR_HUTHUONG_POKER_MONEY = [100,1000,10000];


var MiniPokerLayer = MiniGamePopup.extend({
    ctor: function () {
        this._super();
        this.isQuick = false;
        this.timeDelay =  1.5;
        this.cardSprites = [];
        this.autoRoll = false;
        this.rolling = false;
        this.baseCardHeight = 0;
        this.cardHeight = 0;
        this.rollHeight = 0;
        this.rewards = [];
        this.moneyJackpot = 0;
        this.rewardLayer = [];
        this.cardRollingSprites = [];
        this.gameType = GameType.MiniGame_Poker;

        this.initRewards();

        var bg = new cc.Sprite("#minipoker_bg.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);
        this.bg = bg;

        this._boudingRect = cc.rect(0, 0, this.width, this.height);


        var resultLabel = new cc.Sprite("#pk_reward_0.png");
        resultLabel.setVisible(false);
        resultLabel.setPosition(cc.p(this.width/2, 260));
        this.resultLabel = resultLabel;
        this.addChild(resultLabel, 1);

        var gameIdLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "", cc.TEXT_ALIGNMENT_LEFT);
        gameIdLabel.setScale(18/20);
        gameIdLabel.setAnchorPoint(0.0, 0.5);
        gameIdLabel.setPosition(130,85);
        this.addChild(gameIdLabel);
        this.gameIdLabel = gameIdLabel;



        var rollButton = new ccui.Widget();
        rollButton.setContentSize(cc.size(69,197));
        rollButton.setTouchEnabled(true);
        // rollButton.setScale9Enabled(true);
        rollButton.setPosition(632,194);
        this.addChild(rollButton);
        this.rollButton = rollButton;

        var autoRollButton = new ccui.Button("minipoker_quaytudong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        autoRollButton.setZoomScale(0.0);
        autoRollButton.setPosition(580, 72);
        this.autoRollButton = autoRollButton;
        this.addChild(autoRollButton);

        var quicklButton = new ccui.Button("poker_auto_dis.png", "", "", ccui.Widget.PLIST_TEXTURE);
        quicklButton.setZoomScale(0.0);
        quicklButton.setAnchorPoint(cc.p(0.0, 0.5));
        quicklButton.setPosition(320, 82);
        this.quicklButton = quicklButton;
        this.addChild(quicklButton);

        var clippingCardLayout = new ccui.Layout();
        clippingCardLayout.setContentSize(445, 120);
        clippingCardLayout.setClippingEnabled(true);
        clippingCardLayout.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingCardLayout.setPosition(138,118);
        this.addChild(clippingCardLayout);
        this.cardHeight = clippingCardLayout.height;
        this.baseCardHeight = clippingCardLayout.height / 2;

        for (var i = 0; i < 5; i++) {
            var sprite = new cc.Sprite("#pk_card.png");
            // sprite.setScale(1.4);
            sprite.setPosition(52 + 88 * i, clippingCardLayout.height / 2);
            sprite.setScale(0.80);
            clippingCardLayout.addChild(sprite);
            this.cardSprites.push(sprite);

            var rewardSprite = new cc.Sprite("#videopoker_rewardLayer.png");
            rewardSprite.setPosition(sprite.getPosition());
            // rewardSprite.setScale(1.4);
            rewardSprite.setVisible(false);
            clippingCardLayout.addChild(rewardSprite);
            this.rewardLayer.push(rewardSprite);
        }

        for (var i = 0; i < 15; i++) {
            var rollingSprite = new cc.Sprite("#card-motion" + (i % 3 + 1) + ".png");
            rollingSprite.setPosition(this.cardSprites[i % 5].x,
                clippingCardLayout.height / 2 + (i % 3 - 1) * clippingCardLayout.height);
            clippingCardLayout.addChild(rollingSprite, 4);
            rollingSprite.setOpacity(128);
            rollingSprite.setVisible(false);
            rollingSprite.setScale(0.85);
            this.cardRollingSprites.push(rollingSprite);
        }
        //    this.setScale(0.5);

        var thiz = this;
        autoRollButton.addClickEventListener(function () {
            thiz.onAutoRollClick();
        });
        quicklButton.addClickEventListener(function () {
            thiz.onquicklButtonClick();
        });
        rollButton.addClickEventListener(function () {
            thiz.onRollClick();
        });

        var bxhButton = new ccui.Button("pk_bxh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bxhButton.setPosition(92, 250);
        bxhButton.addClickEventListener(function () {
            var vinhdanhpop = new AllBangVinhDanhLayer(GameType.MiniGame_Poker);
            vinhdanhpop.show();
        });
        bg.addChild(bxhButton, 5);

        var tutorialButton = new ccui.Button("pk_tutorialBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialButton.addClickEventListener(function () {
            var tutorialDialog = TutorialDialog.getTutorial(GameType.MiniGame_Poker);
            tutorialDialog.show();
        });
        tutorialButton.setPosition(92, 103);
        bg.addChild(tutorialButton, 5);


        var historyButton = new ccui.Button("pk_historyBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        historyButton.setPosition(67, 175);
        historyButton.addClickEventListener(function () {
            var lichsupop = new AllLichSuLayer(GameType.MiniGame_Poker);
            lichsupop.show();
        });
        bg.addChild(historyButton, 5);

        var closeButton = new ccui.Button("poker_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(685, 335);
        bg.addChild(closeButton, 5);
        closeButton.addClickEventListener(function () {
            thiz.closeButtonHandler();
        });


        var bg_huthuong = new cc.Sprite("#minipoker_bg_huthuong.png");
        bg_huthuong.setAnchorPoint(cc.p(0.0, 0.5));
        bg_huthuong.setPosition(cc.p(260, 300));
        this.addChild(bg_huthuong);


        var particle = new cc.ParticleSystem("res/Texture/Animation/tophu.plist");
        particle.setPosition(cc.p(35, 60));
        bg_huthuong.addChild(particle);


        var huThuongLabel = new cc.LabelBMFont("10.000.000", "res/fonts/mnpk_fnt_tien1.fnt");
        huThuongLabel.setAnchorPoint(cc.p(1.0, 0.5))
        huThuongLabel.setColor(cc.color("#ffff00"));
        huThuongLabel.setPosition(bg_huthuong.width - 10, bg_huthuong.height/2);
        this.huThuongLabel = huThuongLabel;
        bg_huthuong.addChild(huThuongLabel, 1);
        huThuongLabel.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.MiniGame_Poker,1)));


        this.initBetting();

        var cangat = new cc.Sprite("#weitei_1.png");
        cangat.setPosition(rollButton.getPosition());
        var cangat_hd = new cc.Sprite("#minipoker_cangat.png");
        cangat_hd.setPosition(cangat.width/2,cangat.height/2+50);
        cangat_hd.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.Spawn(new cc.EaseSineIn(new cc.MoveBy(0.8,0,-100)),new cc.FadeOut(0.8)),
                new cc.MoveBy(0,0,100),new cc.FadeIn(0)
            )
        ));
        cangat.addChild(cangat_hd);
        // cc.log(cangat.getPosition());
        // cc.log(cangat_hd.getPosition());
        bg.addChild(cangat);
        this.cangat = cangat;
        this.cangat_hd = cangat_hd;


// this.moneyJackpot = 100;
//         this.showJackpot();

    },
    initBetting:function () {
        var thiz = this;
        this.arrButtonBet = [];
        for(var i = 0; i < 3; i++){
            (function () {
                var inew = i;
                var btnBet = new ccui.Button("poker_xeng1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnBet.setPosition(256 + inew*114, 12);
                btnBet.setScale9Enabled(true);
                btnBet.addClickEventListener(function () {
                    thiz.onClickBetting(inew);
                });
             //   var cangat = new cc.Sprite("#weitei_1.png");

                var label = new cc.LabelBMFont(ARR_BET_MONEY_POKER[inew], cc.res.font.Roboto_UTMAvoBold_16);
                label.setScale(1.1);
                // label.setColor(cc.color(255,216,36,255));
                label.setPosition(btnBet.width/2,btnBet.height/2);
                btnBet.addChild(label);
                btnBet.lblM = label;
                thiz.bg.addChild(btnBet);
                thiz.arrButtonBet.push(btnBet);
            })();


        }
        this.isEnableBetting = true;
        this.onClickBetting(0);
    },

    setKetQuaVanChoi : function (kequa) {
        if(kequa === "")
        {
            this.resultLabel.setVisible(true);
            this.resultLabel.setSpriteFrame("pk_reward_9.png");
        }
        else {
            this.resultLabel.setVisible(true);
            this.resultLabel.setSpriteFrame(kequa);
       }
    },

    onClickBetting:function (index) {
        if(!this.isEnableBetting){
            return;
        }
        this.huThuongLabel.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.MiniGame_Poker,ARR_HUTHUONG_POKER_MONEY[index])));

        this.indexBeting = index+1;
        for(var i = 0; i < this.arrButtonBet.length; i++){
            this.arrButtonBet[i].lblM.setColor(cc.color("#ffffff"));
            this.arrButtonBet[i].loadTextureNormal("poker_xeng1.png",ccui.Widget.PLIST_TEXTURE);
        }
        this.arrButtonBet[index].lblM.setColor(cc.color("#ffd824"));
        this.arrButtonBet[index].loadTextureNormal("poker_xeng2.png",ccui.Widget.PLIST_TEXTURE);
    },
    initRewards: function () {
        this.rewards.push("pk_reward_0.png");
        this.rewards.push("pk_reward_1.png");
        this.rewards.push("pk_reward_2.png");
        this.rewards.push("pk_reward_3.png");
        this.rewards.push("pk_reward_4.png");
        this.rewards.push("pk_reward_5.png");
        this.rewards.push("pk_reward_6.png");
        this.rewards.push("pk_reward_7.png");
        this.rewards.push("pk_reward_8.png");
    },

    updateHuThuong:function () {
        this.huThuongLabel.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.MiniGame_Poker,ARR_HUTHUONG_POKER_MONEY[this.indexBeting-1])));
    },

    update: function (dt) {
        if (!this.baseCardHeight || !this.cardHeight || !this.rolling)
            return;
        this.rollHeight -= 40;

        this.rollHeight = this.rollHeight > 0 ? this.rollHeight : this.rollHeight + this.cardHeight * 3;
        for (var i = 0; i < 15; i++) {
            this.cardRollingSprites[i].visible = true;
            var newY = this.baseCardHeight + (i % 3 - 1) * this.cardHeight + this.rollHeight;
            newY = newY > this.baseCardHeight + this.cardHeight ? newY - 2 * this.cardHeight
                : newY;
            this.cardRollingSprites[i].setPositionY(newY);
        }
    },

    onEnter: function () {
        this._super();
        this.scheduleUpdate();
        //s_MiniPokerLayer = this;
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        //s_MiniPokerLayer = null;
    },

    onAutoRollClick: function () {
        if(!SocketClient.getInstance().isLoggin() ){
            MessageNode.getInstance().show("Bạn cần đăng nhập để sử dụng chức năng này!");
            return;
        }


        this.autoRoll = !this.autoRoll;
        this.autoRollButton.loadTextureNormal(this.autoRoll ? "minipoker_quaytudong_active.png"
            : "minipoker_quaytudong.png", ccui.Widget.PLIST_TEXTURE);
        var thiz = this;
        if (!this.rolling && this.autoRoll)
            thiz.onRollClick();

        // SoundPlayer.playSound("mini_clickButton");

        if(this.autoRoll){

        }
        else{

        }
    },
    onquicklButtonClick: function () {
        var thiz = this;
        this.isQuick = !this.isQuick;
        this.timeDelay =  this.isQuick ? 0.5:1.5;
            this.quicklButton.loadTextureNormal(this.isQuick ? "poker_auto_enable.png"
            : "poker_auto_dis.png", ccui.Widget.PLIST_TEXTURE);



    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    },
    activateReward: function (id, rank) {
        if(id == 9999){
            id = 0;
        }
        var str = "";
        str = this.rewards[id] ? this.rewards[id] : "";


        this.setKetQuaVanChoi(str);
        if(this.rolling){
            // SoundPlayer.playSound(this.rewards[id] ? "NormalWin" : "mini_slotLost");
        }

    },

    setRewardCards: function (rewardArrayIndex) {
        for (var i = 0; i < rewardArrayIndex.length; i++) {
            this.rewardLayer[i].setVisible(false);
            this.cardSprites[i].setScale(0.80);
            this.cardSprites[i].setOpacity(rewardArrayIndex[i]?255:120);
        }
    },

    onRollClick: function () {
        if(SocketClient.getInstance().isLoggin()){
            if(this.rolling){
                return;
            }
            var frames = [];
            for(var i =0; i < 7; i++){
                frames.push(cc.spriteFrameCache.getSpriteFrame("weitei_"+ (i+1).toString() +".png"));
            }

            var animation = new cc.Animation(frames, 0.1, 1);
            var animateAction = new cc.Animate(animation);

            var thiz = this;
            thiz.cangat_hd.setVisible(false);

            this.cangat.stopAllActions();
            this.cangat.runAction(animateAction);
            this.cangat.runAction(new cc.Sequence(new cc.DelayTime(0.35), new cc.CallFunc(function () {
                thiz.rollCard();
                thiz._controller.sendRollRequest(thiz.indexBeting);
                // SoundPlayer.playSound("mini_clickButton");
            }) ) );
        }else {
            MessageNode.getInstance().show("Bạn cần đăng nhập để sử dụng chức năng này!");
        }





    },

    rollCard : function () {
        this.setRolling(true);
        this.setBettingSelectEnable(false);
        // this.resultLabel.setString("");
        this.resultLabel.setVisible(false);
    },

    initController: function () {
        this._controller = new MiniPokerController(this);
    },

    setCardArray: function (cardArray) {
        for (var i = 0; i < cardArray.length; i++) {
            var card = CardList.prototype.getCardWithId(cardArray[i]);
            this.cardSprites[i].setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
            this.cardSprites[i].setScale(0.80   );
        }
        this.setRolling(false);

        var thiz = this;
        if (this.autoRoll) {
            setTimeout(function () {
                thiz.onRollClick();
            }, 500);
        }
        else{
            this.setQuayBtEnable(true);
            this.setBettingSelectEnable(true);
        }
    },
    setBettingSelectEnable:function (isEnable) {
        this.isEnableBetting = isEnable;
        // for(var i = 0; i < this.arrButtonBet.length; i++){
        //     // setEN    this.arrButtonBet
        //     this.setActiveBt(this.arrButtonBet[i],isEnable);
        // }
    },
    setRolling: function (isRolling) {
        this.rolling = isRolling;
        if (isRolling)
            for (var i = 0; i < 5; i++)
                this.rewardLayer[i].visible = false;
        for (var i = 0; i < 15; i++) {
            this.cardSprites[i % 5].visible = !isRolling;
            this.cardRollingSprites[i].visible = isRolling;
        }
        if (isRolling) {
            // this._rollingSound = SoundPlayer.playSoundLoop("mini_flyCard");
        }
        else {
            SoundPlayer.stopSoundLoop(this._rollingSound);
            this._rollingSound = null;
        }
    },
    onUpdateJackPotManual:function () {

    },
    onError: function (param) {


        //het tien
        this.isEnableBetting = true;
        this.setRolling(false);
        this.setQuayBtEnable(true);
        this.autoRoll = false;
        this.autoRollButton.loadTextureNormal(this.autoRoll ? "minipoker_quaytudong_active.png"
            : "minipoker_quaytudong.png", ccui.Widget.PLIST_TEXTURE);
    },

    setQuayBtEnable: function (enabled) {
        this.rollButton.enabled = enabled;
        this.rollButton.setBright(enabled);
    },
    saveDataJackpot:function (money) {
        this.moneyJackpot =   money;
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

        var jackpotSprite = new cc.Sprite("#minipoker_nohu.png");
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
});

// MiniPokerLayer.showPopup = function () {
//     if (s_MiniPokerLayer) {
//         return null;
//     }
//     var popup = new MiniPokerLayer();
//     popup.show();
//     return popup;
// };