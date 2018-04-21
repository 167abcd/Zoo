/**
 * Created by ext on 7/27/2016.
 */
PL_POSITION_TOP = 0;
PL_POSITION_LEFT = 1;
PL_POSITION_BOTTOM = 2;
PL_POSITION_RIGHT = 3;

var GamePlayer = cc.Node.extend({
    ctor: function () {
        this._super();
        // this.setContentSize(cc.size(158, 120));
        // this.setAnchorPoint(cc.p(0.5, 0.5));
        this.isMe = false;
        this.username = "";
        this.gold = 0;

        this.infoLayer = new cc.Node();
        this.addChild(this.infoLayer,1);

        var avt = UserAvatar.createAvatar();
        avt.setPosition(0,0);
        this.infoLayer.addChild(avt);
        if(avt.width < 92){
            avt.setScale(92/avt.width);
        }

        var chatView = new PlayerMessageView();
        chatView.setPosition(avt.getPosition());
        this.infoLayer.addChild(chatView, 10);
        this.chatView = chatView;

        var isOwnerSprite = new cc.Sprite("#icon_owner.png");
        isOwnerSprite.setPosition(avt.x -54,avt.y - 24);
        this.infoLayer.addChild(isOwnerSprite);
        this.isOwnerSprite = isOwnerSprite;

        var timer = new cc.ProgressTimer(new cc.Sprite("#player-progress-1.png"));
        timer.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer.setPosition(avt.getPosition());
        timer.setPercentage(100.0);
        this.infoLayer.addChild(timer);
        this.timer = timer;

        var timerEffect = new cc.Sprite("#player-progress-2.png");
        this.infoLayer.addChild(timerEffect);
        this.timerEffect = timerEffect;

        var inviteBt = new ccui.Button("ingame_inviteBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        inviteBt.setPosition(avt.getPosition());
        this.addChild(inviteBt);
        inviteBt.setTouchEnabled(false);

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_23, "Player");
        userLabel.setColor(cc.color("#ffffff"));
        userLabel.setPosition(0, 67);
        this.infoLayer.addChild(userLabel, 1);

        var goldBg = new cc.Sprite("#ingame_gold_bg.png");
        goldBg.setPosition(cc.p(0, -75));
        this.infoLayer.addChild(goldBg);

        var goldIcon = new cc.Sprite("#ingame-goldIcon.png");
        goldIcon.setPosition(cc.p(20, goldBg.height/2));
        goldBg.addChild(goldIcon);
        this.goldIcon = goldIcon;

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "1.000");
        goldLabel.setColor(cc.color("#ffcb2c"));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(-41, goldBg.y);
        this.infoLayer.addChild(goldLabel, 1);

        this.userLabel = userLabel;
        this.goldLabel = goldLabel;
        this.inviteBt = inviteBt;
        this.avt = avt;
        this.goldBg = goldBg;
        this.goldIcon = goldIcon;

        var thiz = this;
        inviteBt.addClickEventListener(function () {
            thiz.onInviteBtClick();
        });
        var infoBt = new ccui.Widget();
        infoBt.setContentSize(avt.getContentSize());
        infoBt.setPosition(avt.getPosition());
        this.infoLayer.addChild(infoBt);
        infoBt.setTouchEnabled(true);
        infoBt.addClickEventListener(function () {
            thiz.showInfoDialog();
        });
        this.setEnable(true);
        this.setProgressPercentage(70);
    },
    setPositionInfo:function (postion) {
        // switch (postion){
        //     case PK_POSITION_LEFT:
        //     {
        //         this.bgInfor.setPosition(this.avt.getPositionX() -140,this.avt.getPositionY());
        //         this.userLabel.setAnchorPoint(1,0.5);
        //         this.goldLabel.setAnchorPoint(1,0.5);
        //         this.userLabel.setPosition(this.bgInfor.getPositionX()+80, this.bgInfor.getPositionY() + 10);
        //         this.goldLabel.setPosition(this.bgInfor.getPositionX()+80, this.bgInfor.getPositionY() - 10);
        //         break;
        //     }
        //     case PK_POSITION_RIGHT:
        //     {
        //         this.bgInfor.setPosition(this.avt.getPositionX() +140 ,this.avt.getPositionY());
        //         this.userLabel.setAnchorPoint(0,0.5);
        //         this.goldLabel.setAnchorPoint(0,0.5);
        //         this.userLabel.setPosition(this.bgInfor.getPositionX()-80, this.bgInfor.getPositionY() + 10);
        //         this.goldLabel.setPosition(this.bgInfor.getPositionX()-80, this.bgInfor.getPositionY() - 10);
        //         break;
        //     }
        //     case PK_POSITION_TOP:
        //     {
        //         this.bgInfor.setPosition(this.avt.getPositionX(),this.avt.getPositionY()+70);
        //         this.userLabel.setAnchorPoint(0.5,0.5);
        //         this.goldLabel.setAnchorPoint(0.5,0.5);
        //         this.userLabel.setPosition(this.bgInfor.getPositionX(), this.bgInfor.getPositionY() + 10);
        //         this.goldLabel.setPosition(this.bgInfor.getPositionX(), this.bgInfor.getPositionY() - 10);
        //         break;
        //     }
        //     case PK_POSITION_BOTTOM:
        //     {
        //         this.bgInfor.setPosition(this.avt.getPositionX() ,this.avt.getPositionY() - 65);
        //         this.userLabel.setAnchorPoint(0.5,0.5);
        //         this.goldLabel.setAnchorPoint(0.5,0.5);
        //         this.userLabel.setPosition(this.bgInfor.getPositionX(), this.bgInfor.getPositionY() + 10);
        //         this.goldLabel.setPosition(this.bgInfor.getPositionX(), this.bgInfor.getPositionY() - 10);
        //         break;
        //     }
        // };
    },
    onInviteBtClick: function () {
        this.showInviteDialog();
    },

    showChatMessage: function (message) {

    },
    setGold: function (gold) {
        this.goldLabel.setString(cc.Global.NumberFormat1(gold));
        this.gold = gold;
    },
    setUsername: function (name) {
        this.username = name;
        if (name.length > 15)
            name = name.substring(0, 15) ;
        this.userLabel.setString(name);
    },
    setEnable: function (enable) {
        this._isEnable = enable;
        if (enable) {
            this.infoLayer.visible = true;
            this.inviteBt.visible = false;
        }
        else {
            this.username = "";
            this.spectator = false;
            this.infoLayer.visible = false;
            this.inviteBt.visible = true;
           // this.isOwnerSprite.visible = false;
        }
    },
    setIsOwner : function(isOwner){
        this.isOwnerSprite.visible = isOwner;
    },
    showInviteDialog: function () {
        // cc.log("showInviteDialog");
        var dialog = new InviteDialog();
        dialog.show();
    },

    showInfoDialog: function () {
        // cc.log("showInfoDialog");
        // var dialog = new UserDialog();
        // dialog.setUsername(this.username);
        // dialog.setGold(this.gold);
        // if (this.avt) {
        //     dialog.setAvatar(this._avatarUrl);
        // }
        // dialog.showWithAnimationScale();
    },
    showChatEmotion : function (emotion) {
        var emotion = new cc.Sprite("#"+emotion);
        emotion.setScale(1.5);
        emotion.setPosition(this.avt.getPosition());
        this.addChild(emotion, 10);
        emotion.runAction(new cc.Sequence(
            new cc.DelayTime(3.0),
            new cc.CallFunc(function () {
                emotion.removeFromParent(true);
            })
        ));
    },
    setAvatar: function (avt) {
        this._avatarUrl = avt;
        if (this.avt) {
            this.avt.setAvatar(avt);
        }
    },
    runChangeGoldEffect: function (gold) {
        var goldNumber = gold;
        if (typeof gold === "string") {
            goldNumber = parseInt(gold);
        }
        var strGold = cc.Global.NumberFormat1(Math.abs(goldNumber));
        if (gold >= 0) {
            strGold = "+" + strGold;
        }
        else {
            strGold = "-" + strGold;
        }
        var labelEffect = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, strGold);
        if (gold >= 0) {
            labelEffect.setColor(cc.color("#ffde00"));
        }
        else {
            labelEffect.setColor(cc.color("#ff0000"));
        }
        labelEffect.setPosition(this.userLabel.getPosition());
        this.infoLayer.addChild(labelEffect, 10);

        var effectDuration = 2.0;
        var moveAction = new cc.MoveBy(effectDuration, cc.p(0.0, 100.0));
        var finishedAction = new cc.CallFunc(function () {
            labelEffect.removeFromParent(true);
        });
        labelEffect.runAction(new cc.Sequence(moveAction, finishedAction));
    },
    showTimeRemain: function (currentTime, maxTime) {
        var startValue = 100.0 * (currentTime / maxTime);
        // var deltaValue = 100.0 - startValue;
        this.setProgressPercentage(startValue);
        var thiz = this;
        var action = new ext.ActionTimer(currentTime, function (dt) {
            thiz.setProgressPercentage((1.0 - dt) * startValue);
        });
        if (this.timer) {
            this.timer.stopAllActions();
            this.timer.runAction(action);
        }
    },
    setProgressPercentage: function (percentage) {
        this.timer.setPercentage(percentage);
        this.timerEffect.visible = (percentage > 0);
        if(percentage > 0){
            this.timerEffect.setPosition(cc.pRotateByAngle(cc.p(0, 48), cc.p(0,0), cc.degreesToRadians(percentage / 100.0 * -360)));
        }
    },
    stopTimeRemain: function () {
        if (this.timer) {
            this.timer.stopAllActions();
            this.setProgressPercentage(0.0);
        }
    },

    setInfo : function (info) {

    },

    setFreeGameView: function () {
        this.goldIcon.setSpriteFrame("ingame-goldIcon-free.png");
        this.goldLabel.setColor(cc.color("#ffffff"));
    }
});

var GamePlayerMe = GamePlayer.extend({
    ctor: function () {
        cc.Node.prototype.ctor.call(this);

        this.isMe = true;
        this.infoLayer = new cc.Node();
        this.addChild(this.infoLayer);

        // this.setContentSize(cc.size(300, 100));
        // this.setAnchorPoint(cc.p(0.5, 0.5));

        var avt = UserAvatar.createMe();
        avt.setPosition(0, 0);
        this.infoLayer.addChild(avt);
        if(avt.width < 92){
            avt.setScale(92/avt.width);
        }

        var isOwnerSprite = new cc.Sprite("#icon_owner.png");
        isOwnerSprite.setVisible(false);
        isOwnerSprite.setPosition(avt.x -54,avt.y - 24);
        this.infoLayer.addChild(isOwnerSprite);
        this.isOwnerSprite = isOwnerSprite;

        var chatView = new PlayerMessageView();
        chatView.setPosition(avt.getPosition());
        chatView.setAnchorPoint(cc.p(0.0, 0.0));
        this.infoLayer.addChild(chatView, 10);
        this.chatView = chatView;

        var timer = new cc.ProgressTimer(new cc.Sprite("#player-progress-1.png"));
        timer.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer.setPosition(avt.getPosition());
        timer.setPercentage(75.0);
        this.infoLayer.addChild(timer);
        this.timer = timer;

        var timerEffect = new cc.Sprite("#player-progress-2.png");
        this.infoLayer.addChild(timerEffect);
        this.timerEffect = timerEffect;

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_23, PlayerMe.username);
        userLabel.setColor(cc.color("#ffffff"));
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setPosition(67, 21);
        this.infoLayer.addChild(userLabel);

        var goldBg = new cc.Sprite("#ingame_gold_bg.png");
        goldBg.setPosition(cc.p(141, -17));
        this.infoLayer.addChild(goldBg);

        var goldIcon = new cc.Sprite("#ingame-goldIcon.png");
        goldIcon.setPosition(cc.p(20, goldBg.height/2));
        goldBg.addChild(goldIcon);
        this.goldIcon = goldIcon;

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "99.999.999V");
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setColor(cc.color("#ffcb2c"));
        goldLabel.setPosition(104, goldBg.y);
        this.infoLayer.addChild(goldLabel);

        this.userLabel = userLabel;
        this.goldLabel = goldLabel;
        this.avt = avt;

        this.setProgressPercentage(70);

        this.setGold(PlayerMe.gold);
    },
    onEnter: function () {
        this._super();
    },
    setEnable: function (enable) {

    },
    setFreeGameView: function () {
        this._super();
        this.setGold(PlayerMe.goldFree);
    }
});

var PlayerMessageView = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));

        var bg = new ccui.Scale9Sprite("ingame-chat-bg.png", cc.rect(20, 20, 4, 4));
        bg.setPreferredSize(cc.size(100, 100));
        this.setContentSize(bg.getContentSize());
        this.addChild(bg);
        bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.bg = bg;

        var label = new cc.LabelBMFont("Message", cc.res.font.Roboto_UTMAvoBold_24, 300, cc.TEXT_ALIGNMENT_CENTER);
        label.setPosition(bg.getPosition());
        this.addChild(label);
        this.label = label;

        this.setVisible(false);
    },

    show: function (message) {
        this.setVisible(true);
        this.stopAllActions();

        var thiz = this;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(5.0),
            new cc.CallFunc(function () {
                thiz.setVisible(false);
            })
        ));

        this.label.setString(message);
        this.bg.setPreferredSize(cc.size(this.label.getContentSize().width + 40, this.label.getContentSize().height + 20));
        this.setContentSize(this.bg.getContentSize());
        this.bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.label.setPosition(this.bg.getPosition());
    }
});