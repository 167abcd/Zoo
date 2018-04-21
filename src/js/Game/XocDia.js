/**
 * Created by ext on 7/25/2016.
 */

var s_xocdia_slot_id = s_xocdia_slot_id || [
    1, //le
    0, //chan
    4, // 4 trang
    2, // 4 den
    6, //2 trang
    5, //3 trang
    3]; //3 den
var s_xocdia_slot_position = s_xocdia_slot_position || [
        {x: 1158, y: 506}, //lẻ
        {x: 854, y: 506}, //chẵn
        {x: 548, y: 559}, //4 trắng
        {x: 548, y: 353}, //4 đen
        {x: 1007, y: 279}, //2 trắng
        {x: 1462, y: 559}, //3 trắng
        {x: 1462, y: 353}   //3 đen
    ];

var s_xocdia_result_position = s_xocdia_result_position ||
    [
        {x: 88, y: 103},
        {x: 86, y: 138},
        {x: 119, y: 77},
        {x: 117, y: 101},
        {x: 118, y: 143},
        {x: 103, y: 171},
        {x: 150, y: 82},
        {x: 178, y: 99},
        {x: 150, y: 116},
        {x: 149, y: 143},
        {x: 141, y: 176},
        {x: 187, y: 130},
        {x: 172, y: 160}
    ];

var _get_random_array = function (take, maxSize) {
    var arr = [];
    var min = 0;
    var max = maxSize - take;
    for (var i = 0; i < take; i++) {
        var number = min + Math.floor(Math.random() * (max - min));
        min = number + 1;
        max++;
        arr.push(number);
    }
    return arr;
};

var XocDiaBettingSlot = cc.Node.extend({
    ctor: function (idx, parentNode) {
        this._super();
        this._chips = [];
        this._chipNode = new cc.Node();
        this.addChild(this._chipNode);
        this._slotGold = 0;
        this._userGold = 0;

        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(s_xocdia_slot_position[idx]);

        var bg = new cc.Sprite("#xocdia_slot_" + (idx + 1) + ".png");
        this.bg = bg;
        this.setContentSize(bg.getContentSize());
        bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(bg);

        var bettingId = s_xocdia_slot_id[idx];
        if(bettingId < 2){
            var spineLabel = sp.SkeletonAnimation.createWithCache("xocdia_betting");
            spineLabel.setPosition(this.width/2, 250);
            spineLabel.setSkin((bettingId === 0) ? "chan" : "le");
            this.addChild(spineLabel);
            this.spineNode = spineLabel;
        }

        var slotGoldLabel = new cc.LabelBMFont("10.00.000", cc.res.font.Roboto_CondensedBold_20);
        slotGoldLabel.setPosition(this.x - this.getContentSize().width / 4, this.y - this.getContentSize().height / 2 + 25);
        parentNode.addChild(slotGoldLabel, 1);

        var userGoldLabel = new cc.LabelBMFont("1.00.000", cc.res.font.Roboto_CondensedBold_20);
        userGoldLabel.setPosition(this.x + this.getContentSize().width / 4, slotGoldLabel.y);
        userGoldLabel.setColor(cc.color("#fee52e"));
        parentNode.addChild(userGoldLabel, 1);
        this.slotGoldLabel = slotGoldLabel;
        this.userGoldLabel = userGoldLabel;

        //win
        var winEffect = new ccui.Scale9Sprite("xocdia_winSprite.png", cc.rect(50,50,4,4));
        winEffect.setPreferredSize(bg.getContentSize());
        winEffect.setPosition(bg.getPosition());
        this.addChild(winEffect);
        this.winEffect = winEffect;

        var particleNode = new cc.Node();
        this.addChild(particleNode, 10);
        this.particleNode = particleNode;

        this.reset();
        //
        //add Touch
        var rectTouch = cc.rect(0, 0, this.getContentSize().width, this.getContentSize().height);
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var p = thiz.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(rectTouch, p)) {
                    if (thiz.onTouchSlot) {
                        thiz.onTouchSlot();
                    }
                    return true;
                }
                return false;
            }
        }, this);
    },
    setOpacity: function (opacity) {
        this._super(opacity);
        this.bg.setOpacity(opacity);
        this.slotGoldLabel.setOpacity(opacity);
        this.userGoldLabel.setOpacity(opacity);
    },
    setWinEffect : function (win) {
     //   this.setOpacity(win ? 255 : 120);
        this.winEffect.setVisible(win);

        if(this.spineNode){
            if(win){
                this.spineNode.setAnimation(0,"run",true);
            }
            else{
                this.spineNode.clearTracks();
                this.spineNode.setToSetupPose();
            }
        }

        this.particleNode.stopAllActions();
        this.particleNode.removeAllChildren(true);
        if(win){
            var thiz = this;
            var createParticleFunc = function () {
                var x = 50 + Math.random() * (thiz.width - 100);
                var y = 50 + Math.random() * (thiz.height - 100);
                var scale = 0.7 + Math.random() * 0.3;

                var particle = new cc.ParticleSystem("res/Texture/XocDia/xocdia_win_effect.plist");
                particle.setScale(scale);
                particle.setSourcePosition(cc.p(x, y));
                return particle;
            };

            var createEffectFunc = function () {
                thiz.particleNode.addChild(createParticleFunc());
                thiz.particleNode.addChild(createParticleFunc());

                var time = 0.4 + Math.random() * 0.2;
                var action = new cc.Sequence(new cc.DelayTime(time), new cc.CallFunc(function () {
                    createEffectFunc();
                }));
                thiz.particleNode.runAction(action);
            };
            createEffectFunc();
        }
    },
    reset: function () {
        this._chipNode.removeAllChildren(true);
        this.removeChip();

        this.setSlotGold(0);
        this.setUserGold(0);

        this.setWinEffect(false);
        this.setOpacity(255);
    },
    setSlotGold: function (gold) {
        this._slotGold = gold;

        this.slotGoldLabel.stopAllActions();
        if (gold > 0) {
            this.slotGoldLabel.visible = true;
          //  this.slotGoldLabel.setOpacity(255);
            var action = new ext.ActionNumber(0.5, gold);
            this.slotGoldLabel.runAction(action);
        }
        else {

            this.slotGoldLabel.setString("0");
            this.slotGoldLabel.visible = false;
        }
    },
    setUserGold: function (gold) {
        this._userGold = gold;
        this.userGoldLabel.stopAllActions();
        if (gold > 0) {
            this.userGoldLabel.visible = true;
          //  this.userGoldLabel.setOpacity(255);
            var action = new ext.ActionNumber(0.5, gold);
            this.userGoldLabel.runAction(action);
        }
        else {
            this.userGoldLabel.setString("0");
            this.userGoldLabel.visible = false;
        }
    },
    getSlotPosition: function () {
        var paddingWidth = 60;
        var paddingHeight = 50;

        var w = Math.random() * (this.getContentSize().width - paddingWidth * 2) + paddingWidth;
        var h = Math.random() * (this.getContentSize().height - paddingHeight * 2) + paddingHeight;
        var x = this.x - this.getContentSize().width / 2 + w;
        var y = this.y - this.getContentSize().height / 2 + h;

        return cc.p(x, y);
    },
    addChip: function (chipSprite) {
        this._chips.push(chipSprite);
    },
    removeChip: function () {
        this._chips = [];
    }
});

var XocDiaScene = IGameScene.extend({
    ctor: function () {
        this._super("res/Texture/XocDia/xocdia_bg.jpg");
        this.bg.setAnchorPoint(cc.p(0.5, 1.0));
        this.bg.x = cc.winSize.width/2;

        this._historyData = [];
        this.chipTagMe = 100;
        this.chipTagOther = 200;
        this._shakeDisk = false;
        this.hostPosition = cc.p(this.sceneLayer.width/2, this.sceneLayer.height);

        this.initView();
        this.initBettingSlot();
        this.initChipButton();

        //history
        this.initHistory();
        this.initDisk();

        this.setUserCount(0);
    },
    onCanvasResize : function () {
        this._super();
        this.sceneLayer.y = 0;//cc.winSize.height - this.sceneLayer.height;

        this.menuTop.y = cc.winSize.height - 860;
        this.backBt.y = cc.winSize.height - 64;
        this.userBt.y = cc.winSize.height - 64;
    },

    showGameInfo : function (gameName,betAmount) {

    },

    update : function (dt) {
        if(this._shakeDisk){
            if(cc.Global.GetSetting("vibrator",true)){
                if(cc.sys.isNative){
                    cc.Device.vibrate(dt);
                }
                else{
                    cc.log("vibrator: " + dt);
                }
            }
        }
    },

    backButtonClickHandler : function (force) {
        // var uGold = 0;
        // for(var i = 0; i<this.bettingSlot.length;i++){
        //     uGold += this.bettingSlot[i]._userGold;
        // }
        // if(uGold > 0){
        //     var thiz = this;
        //     var dialog = new MessageConfirmDialog();
        //     dialog.setMessage("Bạn có muốn thoát game không ? \nNếu THOÁT bạn sẽ bị mất số vàng đã đặt cược");
        //     dialog.showWithAnimationScale();
        //     dialog.okButtonHandler = function () {
        //         if (thiz._controller) {
        //             thiz._controller.requestQuitRoom();
        //         }
        //     };
        // }
        // else{
        //     if (this._controller) {
        //         this._controller.requestQuitRoom();
        //     }
        // }
        // if(force){
        //     if (this._controller) {
        //         this._controller.requestQuitRoom();
        //     }
        // }
        // else{
        //     this.menuTop.showGameTopBar(true);
        // }

        if (this._controller) {
            this._controller.requestQuitRoom();
        }
    },
    initView: function () {
        var thiz = this;
        this.gameTopBar.visible = false;

        var backBt = new ccui.Button("xocdia_backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(85, 796);
        this.sceneLayer.addChild(backBt);
        this.backBt = backBt;

        var userBt = new ccui.Button("xocdia_userlistBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        userBt.setPosition(179, 796);
        this.sceneLayer.addChild(userBt);
        this.userBt = userBt;
        userBt.setTouchEnabled(false);

        var userLabel = new cc.LabelBMFont("30", cc.res.font.Roboto_Regular_20);
        userLabel.setScale(18/20);
        userLabel.setColor(cc.color("#ffdba3"));
        userLabel.setPosition(userBt.width / 2, 30);
        userBt.getRendererNormal().addChild(userLabel);

        backBt.addClickEventListener(function () {
            thiz.backButtonClickHandler();
        });
        userBt.addClickEventListener(function () {
            var dialog = new UserListDialog();
            dialog.show();
        });

        this.backBt = backBt;
        this.playerButton = userBt;
        this.userLabel = userLabel;

        var playerMe = new GamePlayerMe();
        playerMe.setPosition(104, 84);
        playerMe.setProgressPercentage(0);
        this.sceneLayer.addChild(playerMe, 1);
        this.playerMe = playerMe;

        var datLaiButton = new ccui.Button("xocdia_batlaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        datLaiButton.setPosition(1755, 68);
        this.sceneLayer.addChild(datLaiButton);
        this.datLaiButton = datLaiButton;

        var huyCuocButton = new ccui.Button("xocdia_huyCuocButton.png", "", "", ccui.Widget.PLIST_TEXTURE);
        huyCuocButton.setPosition(datLaiButton.getPosition());
        this.sceneLayer.addChild(huyCuocButton);
        this.huyCuocButton = huyCuocButton;

        var resultBg1 = new cc.Sprite("#xocdia_result_bg_0.png");
        resultBg1.setPosition(1517, 75);
        this.sceneLayer.addChild(resultBg1);

        var tongCuocLabal = new cc.LabelBMFont("Tổng: 1000", cc.res.font.Roboto_Regular_20);
        tongCuocLabal.setScale(0.9);
        tongCuocLabal.setColor(cc.color("#ffffff"));
        tongCuocLabal.setAnchorPoint(cc.p(0.0, 0.5));
        tongCuocLabal.setPosition(90, 44);
        resultBg1.addChild(tongCuocLabal, 1);
        this.tongCuocLabal = tongCuocLabal;

        var winLabel = new cc.LabelBMFont("Thắng: 1000", cc.res.font.Roboto_Regular_20);
        winLabel.setScale(0.9);
        winLabel.setColor(cc.color("#ffde00"));
        winLabel.setAnchorPoint(cc.p(0.0, 0.5));
        winLabel.setPosition(tongCuocLabal.x, 18);
        resultBg1.addChild(winLabel, 1);
        this.winLabel = winLabel;

        datLaiButton.addClickEventListener(function () {
            thiz._controller.requestDatlai();
        });

        huyCuocButton.addClickEventListener(function () {
            thiz._controller.requestHuyCuoc();
        });

        var menuTop = new TopBarTouchLayer(true);
        menuTop.showGameTopBar(false);
        this.sceneLayer.addChild(menuTop,10);
        this.menuTop = menuTop;
        menuTop.backButtonHandler = function () {
            thiz.backButtonClickHandler(true);
        };
    },
    initController: function () {
        this._controller = new XocDiaController(this);
    },
    playSoundDatCuoc: function (isReconnect) {
        if(isReconnect){
            // SoundPlayer.playSound("moidatcuoc");
        }
        else{
            // SoundPlayer.playSound(Date.now() % 2 ? "moidatcuoc" : "batdaudatcuoc");
        }
    },
    initBettingSlot: function () {
        this.bettingSlot = [];
        var sceneLayer = this.sceneLayer;

        var chipNode = new cc.Node();
        chipNode.setAnchorPoint(cc.p(0,0));
        chipNode.setPosition(cc.p(0, 0));
        sceneLayer.addChild(chipNode,1);
        this.chipNode = chipNode;

        for (var i = 0; i < 7; i++) {
            var slot = new XocDiaBettingSlot(i, sceneLayer);
            sceneLayer.addChild(slot);

            var thiz = this;
            (function () {
                var slotIndex = s_xocdia_slot_id[i];
                slot.onTouchSlot = function () {
                    thiz.onTouchSlot(slotIndex);
                };
                thiz.bettingSlot[slotIndex] = slot;
            })();
        }

        var timerNode = new cc.Node();
        timerNode.setPosition(1007, 503);
        sceneLayer.addChild(timerNode, 10);
        this.timerNode = timerNode;

        var timerBg = new cc.Sprite("#xocdia_timer_1.png");
        timerNode.addChild(timerBg);

        var timer = [];
        for(var i=0;i<3;i++){
            var timerBar = new cc.ProgressTimer(new cc.Sprite("#xocdia_timer_" + (i+2) + ".png"));
            timerBar.setType(cc.ProgressTimer.TYPE_RADIAL);
            timerBar.setReverseDirection(true);
            timerBar.setPercentage(30.0);
            timerNode.addChild(timerBar);
            timer.push(timerBar);
        }
        this.timer = timer;

        var timeLabel = cc.Label.createWithBMFont("res/Texture/XocDia/xocdia_timer_font.fnt", "00");
        timeLabel.setColor(cc.color("#ffffff"));
        timerNode.addChild(timeLabel);
        this.timeLabel = timeLabel;

        var playerMe = this.playerMe;
        var thiz = this;
        setTimeout(function () { //run when onEnter
            var p = playerMe.getParent().convertToWorldSpace(playerMe.getPosition());
            var p1 = chipNode.convertToNodeSpace(p);
            thiz._playerMePosition = p1;
        }, 0);
    },
    initChipButton: function () {
        var chipGroup = new ChipGroup();
        this.sceneLayer.addChild(chipGroup);
        this.chipGroup = chipGroup;

        var x = 703;
        for(var i=0;i<6;i++){
            (function () {
                var chip = new XocDiaChip(i+1);
                chip.setPosition(x, 71);
                chip.originPoint = chip.getPosition();
                chipGroup.addChip(chip);

                x += 124;
            })();
        }
    },

    initHistory: function () {
        var historyBt = new ccui.Button("xocdia_history_bt.png", "", "", ccui.Widget.PLIST_TEXTURE);

        var padding = 2.0;
        var itemSize = cc.size(46.0, 46.0);
        var row = 4;
        var col = 16;
        var left = historyBt.width;
        this.historyPaddingLeft = left;

        var historyBg = new ccui.Scale9Sprite("xocdia_history_bg1.png", cc.rect(4, 4, 4, 4));
        historyBg.setPreferredSize(cc.size((itemSize.width + padding) * col + left, itemSize.height * row + padding * (row + 1)));
        historyBg.setAnchorPoint(cc.p(0, 0));

        var historyBg2 = new ccui.Scale9Sprite("xocdia_history_bg2.png", cc.rect(4, 4, 4, 4));
        historyBg2.setPreferredSize(cc.size(left - padding * 2, historyBg.height - padding * 2));
        historyBg2.setAnchorPoint(cc.p(0, 0));
        historyBg2.setPosition(padding, padding);
        historyBg.addChild(historyBg2);

        var clippingNode = new ccui.Layout();
        clippingNode.setClippingEnabled(true);
        clippingNode.setAnchorPoint(cc.p(0.5, 1.0));
        clippingNode.setContentSize(historyBg.getContentSize());
        clippingNode.setPosition(1000, 860);
        this.sceneLayer.addChild(clippingNode, 3);
        clippingNode.addChild(historyBg);
        this.historyBg = historyBg;

        historyBt.setPosition(left / 2, historyBg.getContentSize().height / 2);
        historyBt.setZoomScale(0.0);
        historyBg.addChild(historyBt);
        var thiz = this;
        historyBt.addClickEventListener(function () {
            thiz.touchHistory(left);
        });

        var historyTouch = new ccui.Widget();
        historyTouch.setAnchorPoint(cc.p(0.0, 0.0));
        historyTouch.setContentSize(historyBg.getContentSize());
        historyTouch.setTouchEnabled(true);
        historyBg.addChild(historyTouch);
        historyTouch.addClickEventListener(function () {
            thiz.touchHistory();
        });
        this.historyTouch = historyTouch;

        for (var i = 0; i < col; i++) {
            for (var j = 0; j < row; j++) {
                var x = left + itemSize.width / 2 + (itemSize.width + padding) * i;
                var y = padding + itemSize.height / 2 + (itemSize.height + padding) * j;
                var bg = new ccui.Scale9Sprite("xocdia_history_bg2.png", cc.rect(4, 4, 4, 4));
                bg.setPreferredSize(itemSize);
                bg.setPosition(x, y);
                historyBg.addChild(bg);
            }
        }

        this.historyNode = new cc.Node();
        this.historyNode.setContentSize(historyBg.getContentSize());
        this.historyNode.setAnchorPoint(cc.p(0, 0));
        historyBg.addChild(this.historyNode);

        this._historyData = [];

        //test
        // for(var i=0;i<20;i++){
        //     this._addHistory(i%2 ? 1 : 2);
        // }
        // this._refreshHistory();
    },

    _refreshHistory: function () {
        var padding = 2.0;
        var itemSize = cc.size(46.0, 46.0);
        var row = 4;
        var left = this.historyPaddingLeft;

        this.historyNode.removeAllChildren(true);
        for (var i = 0; i < this._historyData.length; i++) {
            if (this._historyData[i] >= 0) {
                var label = new cc.LabelBMFont(this._historyData[i].toString(), cc.res.font.Roboto_Medium_20);

                var x = left + itemSize.width / 2 + (itemSize.width + padding) * Math.floor(i / row);
                var y = this.historyNode.getContentSize().height - padding - itemSize.height / 2 - (itemSize.height + padding) * (i % row);
                if (this._historyData[i] % 2) {
                    var historyIcon = new cc.Sprite("#xocdia_history_1.png");
                    label.setColor(cc.color("#ffffff"));
                }
                else {
                    var historyIcon = new cc.Sprite("#xocdia_history_2.png");
                    label.setColor(cc.color("#000000"));
                }
                historyIcon.setPosition(x, y);
                this.historyNode.addChild(historyIcon, 0);

                label.setPosition(x, y);
                this.historyNode.addChild(label, 1);
            }
        }
    },

    touchHistory: function () {
        if (this.historyBg.showed) {
            this.hideHistory();
        }
        else {
            this.showHistory();
        }
    },

    showHistory: function () {
        var thiz = this;
        var left = this.historyPaddingLeft;

        this.historyBg.showed = true;
        this.historyBg.stopAllActions();
        this.historyBg.runAction(new cc.Sequence(
            new cc.MoveTo(0.5, cc.p(0, 0)),
            new cc.CallFunc(function () {
                thiz.historyTouch.setTouchEnabled(true);
            })
        ));
    },

    hideHistory: function () {
        var thiz = this;
        var left = this.historyPaddingLeft;
        this.historyTouch.setTouchEnabled(false);

        this.historyBg.showed = false;
        this.historyBg.stopAllActions();
        this.historyBg.runAction(new cc.Sequence(
            new cc.MoveTo(0.5, cc.p(this.historyBg.getContentSize().width - left, 0)),
            new cc.CallFunc(function () {

            })
        ));
    },

    initDisk: function () {
        this.diskOriginPosition = cc.p(this.sceneLayer.width/2, this.sceneLayer.height + 100);
        this.diskShowPosition = cc.p(this.sceneLayer.width/2, this.sceneLayer.height/2);

        var diskSprite = new cc.Sprite("#xocdia_dia.png");
        diskSprite.setPosition(this.sceneLayer.width/2, this.sceneLayer.height + 100);
        this.sceneLayer.addChild(diskSprite,2);
        this.diskSprite = diskSprite;

        var diskNode = new cc.Node();
        diskSprite.addChild(diskNode);
        this.diskNode = diskNode;

        var batSprite = new cc.Sprite("#xocdia_bat.png");
        this.batSpritePosition = cc.p(diskSprite.getContentSize().width / 2, diskSprite.getContentSize().height / 2);
        batSprite.setPosition(this.batSpritePosition);
        diskSprite.addChild(batSprite);
        this.batSprite = batSprite;

        //test
        // this.openDisk({
        //     result : [1,2,3],
        //     winSlot : [1],
        //     loseSlot : [2]
        // });
    },

    _setFinishedSlot: function (slotId, win) {
        if (win) {
            this.bettingSlot[slotId].setWinEffect(true);
        }
        else {
            this.bettingSlot[slotId].setWinEffect(false);
        }
    },

    shakeDisk: function () {
        this.stopAllActions();
        this.diskNode.removeAllChildren(true);
        this.diskSprite.stopAllActions();
        this.batSprite.stopAllActions();

        this.hideHistory();

        this._shakeDisk = false;

        var thiz = this;
        this.batSprite.runAction(new cc.MoveTo(1.0, this.batSpritePosition));
        this.diskSprite.runAction(new cc.Sequence(
            new cc.EaseSineOut(new cc.MoveTo(1.0, this.diskShowPosition)),
            new cc.DelayTime(0.2),
            new cc.CallFunc(function () {
                thiz._shakeDisk = true;
            }),
            new ext.ActionShake2D(3.0, cc.p(10.0, 10.0)),
            new cc.CallFunc(function () {
                thiz._shakeDisk = false;
            })
        ));


    },

    hideDisk: function () {
        this._shakeDisk = false;
        //  this.stopAllActions();
        this.diskNode.removeAllChildren(true);
        this.diskSprite.stopAllActions();
        this.batSprite.stopAllActions();

        this.showHistory();

        this.diskSprite.runAction(new cc.MoveTo(1.0, this.diskOriginPosition));
        this.batSprite.runAction(new cc.MoveTo(1.0, this.batSpritePosition));
    },

    openDisk: function (data) {
        this._shakeDisk = false;
        var thiz = this;

        this.stopAllActions();
        // SoundPlayer.playSound(["bellopen", "mobat"]);
        this.diskNode.removeAllChildren(true);
        this.diskSprite.stopAllActions();
        this.batSprite.stopAllActions();

        this.hideHistory();

        var result = data.result;
        this._addHistory(result);
        this._addResultSprite(result);

        var sounds = this._getSoundOpenDisk(result);
        /* mở bát */
        this.diskSprite.runAction(new cc.EaseSineOut(new cc.MoveTo(1.0, this.diskShowPosition)));
        this.batSprite.runAction(new cc.Sequence(
            new cc.DelayTime(1.2),
            new cc.EaseSineIn(new cc.MoveBy(1.0, cc.p(0.0, 450.0))),
            new cc.CallFunc(function () {
                //SoundPlayer.playSound(sounds);
                thiz._refreshHistory();
            })
        ));

        /* thu tiền */
        var winSlot = data.winSlot;
        var loseSlot = data.loseSlot;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(6.0),
            new cc.CallFunc(function () {
                thiz.hideDisk();

                for (var i = 0; i < winSlot.length; i++) {
                    thiz._setFinishedSlot(winSlot[i], true);
                }
                for (var i = 0; i < loseSlot.length; i++) {
                    thiz._setFinishedSlot(loseSlot[i], false);
                }
            }),
            new cc.DelayTime(1.0),
            new cc.CallFunc(function () {
                for (var i = 0; i < loseSlot.length; i++) {
                    thiz.thuTienSlot(loseSlot[i]);
                }
            }),
            new cc.DelayTime(1.0),
            new cc.CallFunc(function () {
                for (var i = 0; i < winSlot.length; i++) {
                    thiz.traTienSlot(winSlot[i]);
                }
            }),
            new cc.DelayTime(1.0),
            new cc.CallFunc(function () {
                for (var i = 0; i < winSlot.length; i++) {
                    thiz.traTienUser(winSlot[i]);
                }
            })
        ));
    },

    _addResultSprite: function (result) {
        /* add result */
        var arr = _get_random_array(4, s_xocdia_result_position.length);
        for (var i = 0; i < arr.length; i++) {
            if (i < result) {
                var sprite = new cc.Sprite("#xocdia_hat_do.png");
            }
            else {
                var sprite = new cc.Sprite("#xocdia_hat_trang.png");
            }

            sprite.setPosition(s_xocdia_result_position[arr[i]]);
            this.diskNode.addChild(sprite);
        }
    },

    _getSoundOpenDisk: function (result) {
        var soundArray = [];
        if (result == 0) {
            soundArray.push("ngua4");
        } else if (result == 4) {
            soundArray.push("xap4");
        } else if (result == 2) {
            soundArray.push("xap2");
        } else if (result == 1) {
            soundArray.push("xap1");
        } else if (result == 3) {
            soundArray.push("xap3");
        }

        soundArray.push(result % 2 ? "le" : "chan");
        return soundArray;
    },

    // _openDisk : function () {
    //     var thiz = this;
    //
    // },

    onEnter: function () {
        this._super();
        this.chipGroup.selectChipAtIndex(0, true);
        this.scheduleUpdate();
    },

    onTouchSlot: function (slotId) {
        if(!SocketClient.getInstance().isLoggin()){
            this.menuTop.showGameTopBar(true);
            return;
        }

        if (this.chipGroup.chipSelected) {
            var chipId = this.chipGroup.chipSelected.chipIndex - 1;
            this._controller.requestDatCuoc(slotId, chipId);
        }
        else {
            this.showErrorMessage("Bạn phải chọn mức cược");
        }
    },

    addChipToSlot: function (slotIndex, chipIndex, from, tag, noAnimation) {
        //me = 1
        //other = 2
        //host = 3
        if (from == 1) { //me
            var chip = this.chipGroup.getChip(chipIndex);
            var p = chip.getParent().convertToWorldSpace(chip.getPosition());
            var chipPosition = this.chipNode.convertToNodeSpace(p);
        }
        else if (from == 2) { //other
            //from player button
            var p = this.playerButton.getWorldPosition();
            var chipPosition = this.chipNode.convertToNodeSpace(p);
        }
        else {  //host
            var chipPosition = cc.p(this.hostPosition);
        }

        if (!tag) {
            if (from == 1) { //me
                tag = this.chipTagMe;
            }
            else if (from == 2) { //other
                tag = this.chipTagOther;
            }
            else {
                tag = 0;
            }
        }

        var slot = this.bettingSlot[slotIndex];
        var thiz = this;

        var addChipHandler = function () {
            var chip = new cc.Sprite("#xocdia-chip-" + (chipIndex + 1) + ".png");
            chip.chipIndex = chipIndex;
            chip.chipTag = tag;
            chip.setPosition(chipPosition);
            thiz.chipNode.addChild(chip);
            slot.addChip(chip);

            //move
            if(noAnimation){
                var p = slot.getSlotPosition();
                chip.setPosition(p);
                chip.setScale(0.3);
            }
            else{
                var p = slot.getSlotPosition();
                var duration = cc.pLength(cc.pSub(chip.getPosition(), p)) / 1000.0;
                var moveAction = new cc.Spawn(
                    new cc.MoveTo(duration, p),
                    new cc.ScaleTo(duration, 0.3)
                );
                chip.runAction(new cc.EaseSineOut(moveAction));
            }


            // SoundPlayer.playSound("singlechip");
        };

        if (from == 1 || from == 3) { //me or host
            addChipHandler();
        }
        else {
            var delayTime = 0.5 + Math.random() * 1.5;
            this.runAction(new cc.Sequence(
                new cc.DelayTime(delayTime),
                new cc.CallFunc(addChipHandler)
            ));
        }
    },

    thuTienSlot: function (slotId) {
        var hostPosition = this.hostPosition;

        var chips = this.bettingSlot[slotId]._chips;
        for (var i = 0; i < chips.length; i++) {
            (function () {
                var chip = chips[i];
                chips[i].runAction(new cc.Sequence(
                    new cc.MoveTo(0.5, hostPosition),
                    new cc.CallFunc(function () {
                        chip.removeFromParent(true);
                    })
                ));
            })();
        }
        this.bettingSlot[slotId]._chips = [];
    },

    traTienSlot: function (slotId) {
        var chips = this.bettingSlot[slotId]._chips;
        var length = chips.length;
        for (var i = 0; i < length; i++) {
            this.addChipToSlot(slotId, chips[i].chipIndex, 3, chips[i].chipTag);
        }
    },

    traTienUser: function (slotId) {
        //cc.log("traTienUser: "+slotId);
        var chips = this.bettingSlot[slotId]._chips;
        var thiz = this;

        for (var i = 0; i < chips.length; i++) {
            (function () {
                var chip = chips[i];
                if (chip.chipTag == thiz.chipTagMe) {
                    //to me
                    chip.runAction(new cc.Sequence(
                        new cc.MoveTo(0.5, thiz._playerMePosition),
                        new cc.CallFunc(function () {
                            chip.removeFromParent(true);
                        }),
                        new cc.CallFunc(function () {
                            if (thiz.pendingGoldChange > 0) {
                                thiz.performChangeAsset(thiz.pendingGoldChange);
                                thiz.pendingGoldChange = null;
                            }
                        })
                    ));
                }
                else {
                    //to other
                    var p = thiz.playerButton.getWorldPosition();
                    chip.runAction(new cc.Sequence(
                        new cc.MoveTo(0.5, p),
                        new cc.CallFunc(function () {
                            chip.removeFromParent(true);
                        })
                    ));
                }
            })();
        }

        this.bettingSlot[slotId]._chips = [];
    },

    performChangeAsset: function (changeAmount) {
        var changeSprite = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        var changeText = (changeAmount >= 0 ? "+" : "") + changeAmount;
        changeSprite.setString(cc.Global.NumberFormat1(changeText));
        changeSprite.setColor(cc.color(changeAmount >= 0 ? "#ffde00" : "#ff0000"));
        changeSprite.setPosition(this.playerMe.getPosition());
        this.sceneLayer.addChild(changeSprite, 420);

        changeSprite.runAction(new cc.Sequence(new cc.MoveTo(1.0, changeSprite.x, changeSprite.y + 50), new cc.CallFunc(function () {
            changeSprite.removeFromParent(true);
        })));
    },

    resetGame: function () {
        for (var i = 0; i < this.bettingSlot.length; i++) {
            this.bettingSlot[i].reset();
        }

        this.chipNode.removeAllChildren(true);
        this.stopAllActions();

        this.setTongCuocLabel(-1);
        this.setWinLabel(-1);
        this._shakeDisk = false;

        this._refreshHistory();
    },

    datLaiThanhCong: function () {

    },

    huyCuocThanhCong: function () {
        var tagMe = this.chipTagMe;
        var pTarget = this.chipNode.convertToNodeSpace(cc.p(50,50));

        for (var i = 0; i < this.bettingSlot.length; i++) {
            var chips = this.bettingSlot[i]._chips;
            for (var j = 0; j < chips.length; j++) {
                (function () {
                    var chip = chips[j];
                    if (chip.chipTag == tagMe) {
                        //to me
                        chip.runAction(new cc.Sequence(
                            new cc.MoveTo(0.5, pTarget),
                            new cc.CallFunc(function () {
                                chip.removeFromParent(true);
                            })
                        ));
                    }
                })();
            }
            this.bettingSlot[i]._chips = [];
        }
    },

    updateSlotGold: function (slotId, gold) {
        var slot = this.bettingSlot[slotId];
        if (!slot) {
            cc.log("slot null");
        }
        slot.setSlotGold(gold);
    },

    updateUserGold: function (slotId, gold) {
        var slot = this.bettingSlot[slotId];
        slot.setUserGold(gold);
    },

    updateUserCount: function (userCount) {
        this.userLabel.setString(userCount);
    },

    setTimeRemaining: function (currentTime, maxTime) {
        this.timerNode.stopAllActions();
        if (maxTime <= 0.0) {
            this.timerNode.setVisible(false);
        }
        else{
            this.timerNode.setVisible(true);
            var thiz = this;

            var per = currentTime / maxTime;
            var cTime = Math.round(currentTime);
            this._setTimerProcess(per);
            this._setTimeLabel(cTime);

            var action = new ext.ActionTimer(currentTime, function (dt) {
                thiz._setTimerProcess(currentTime * (1.0 - dt) / maxTime, action);

                var t = Math.round((1.0 - dt) * currentTime);
                if(t !== cTime){
                    cTime = t;
                    thiz._setTimeLabel(cTime, action);
                }
            });
            this.timerNode.runAction(action);
        }
    },

    _setTimerProcess: function(percentage, action){
        var per = 100 * percentage;

        if(per >= 50){
            this.timer[0].setVisible(true);
            this.timer[1].setVisible(false);
            this.timer[2].setVisible(false);
            var timer = this.timer[0];
        }
        else if(per >= 20){
            this.timer[0].setVisible(false);
            this.timer[1].setVisible(true);
            this.timer[2].setVisible(false);
            var timer = this.timer[1];
        }
        else{
            this.timer[0].setVisible(false);
            this.timer[1].setVisible(false);
            this.timer[2].setVisible(true);
            var timer = this.timer[2];
        }
        timer.setPercentage(100 * percentage);
    },

    _setTimeLabel: function(currentTime, action){
        this.timeLabel.setString(Math.floor(currentTime));
    },

    setChipValue: function (chipId, gold) {
        this.chipGroup.getChip(chipId).setGold(gold);
    },

    setDatLaiButtonVisible: function (visible) {
        this.datLaiButton.setVisible(visible);
    },

    setHuyCuocButtonVisible: function (visible) {
        this.huyCuocButton.setVisible(visible);
    },

    _addHistory: function (history) {
        if (this._historyData.length == 0) {
            this._historyData.push(history);
            return;
        }

        var row = 4;
        var col = 16;
        var maxItem = row * col;

        var lastHistory = this._historyData[this._historyData.length - 1];
        if ((lastHistory % 2) != (history % 2)) {
            //fill empty
            var emptyCount = this._historyData.length % row;
            if (emptyCount > 0) {
                emptyCount = row - emptyCount;
                for (var i = 0; i < emptyCount; i++) {
                    this._historyData.push(-1);
                }
            }
        }
        this._historyData.push(history);

        if (this._historyData.length > maxItem) {
            this._historyData.splice(0, row);
        }
    },

    setHistory: function (history) {
        this._historyData = [];

        for (var i = 0; i < history.length; i++) {
            this._addHistory(history[i]);
        }
        //cc.log(this._historyData);
        this._refreshHistory();
    },

    setTongCuocLabel: function (gold) {
        if (gold < 0) {
            this.tongCuocLabal.setVisible(true);
            this.tongCuocLabal.setString("0");
        }
        else {
            this.tongCuocLabal.setVisible(true);
            this.tongCuocLabal.setString(cc.Global.NumberFormat1(gold));
        }
    },

    setWinLabel: function (gold) {
        if (gold < 0) {
            this.winLabel.setVisible(true);
            this.winLabel.setString("0");
        }
        else {
            this.winLabel.setVisible(true);
            this.winLabel.setString(cc.Global.NumberFormat1(gold));
            this.pendingGoldChange = gold;
        }
    },
    changeGoldEffect: function (username, deltaGold) {
        if(username === PlayerMe.username){
            this.playerMe.runChangeGoldEffect(deltaGold);
        }

    },
    updateGold: function (username, gold) {
        if(PlayerMe.username === username){
            this.playerMe.setGold(gold);
        }
    },
    setUsername: function (username) {
        this.playerMe.setUsername(username);
    },

    setUserCount: function (count) {
        this.userLabel.setString(count);
    },

    exitToLobby: function (message) {
        var homeScene = new HomeScene();
        homeScene.startGame();
        SceneNavigator.replaceScene(homeScene);
        if (message) {
            MessageNode.getInstance().show(message, null, homeScene);
        }
        return homeScene;
    },


    /*ignore*/
    processPlayerPosition: function () {

    },
    updateOwner: function () {

    }
});