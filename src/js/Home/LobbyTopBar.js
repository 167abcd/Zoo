/**
 * Created by ext on 7/15/2017.
 */

var HomeMessageCountLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        var notif = new cc.Sprite("#home_notif_bg.png");
        notif.setPosition(notif.width/2, notif.height/2);
        this.addChild(notif);
        this.setContentSize(notif.getContentSize());
        this.notif = notif;

        var label = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, "");
        label.setPosition(notif.width/2, notif.height/2);
        notif.addChild(label,1);
        this.label = label;
    },

    _refreshView : function () {
        this.notif.visible = (PlayerMe.messageCount > 0);
        this.label.setString(PlayerMe.messageCount > 9 ? "9+" : PlayerMe.messageCount.toString());
    },

    onEnter : function () {
        this._super();
        this._refreshView();
        SocketClient.getInstance().addListener("inboxUnReadCount", this._refreshView, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    }
});

var LobbyTopBar = cc.Node.extend({
    ctor: function () {
        this._super();
        var thiz = this;

        var bg = new cc.Sprite("#home_bar_4.png");
        bg.setAnchorPoint(cc.p(0.5, 1.0));
        bg.setPosition(cc.p(1000, 860));
        this.addChild(bg);

        var logo = new cc.Sprite("#lobby_top_bar_logo.png");
        logo.setPosition(1000, 860 - logo.height/2);
        this.addChild(logo);

        var backBt = new ccui.Button("home_buttonBack.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(357, 824);
        this.btn_back = backBt;
        this.addChild(backBt);

        var avatar = UserAvatar.createMe();
        avatar.setPosition(440, 824);
        avatar.setScale(0.78);
        this.addChild(avatar,1);

        var userinfoBt = new ccui.Widget();
        userinfoBt.setContentSize(cc.size(85, 85));
        userinfoBt.setPosition(avatar.getPosition());
        this.addChild(userinfoBt);
        userinfoBt.setTouchEnabled(true);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Bold_20, "username");
        nameLabel.setScale(18/20);
        nameLabel.setColor(cc.color("#ffffff"));
        nameLabel.setPosition(542, 839);
        this.addChild(nameLabel,2);

        var vipPointBg = new cc.Sprite("#lobby_top_bar_vip_bg.png");
        vipPointBg.setPosition(542, 812);
        this.addChild(vipPointBg);

        var vipPointLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "VP: 100/100");
        vipPointLabel.setPosition(vipPointBg.x, vipPointBg.y);
        vipPointLabel.setColor(cc.color("#ffffff"));
        this.addChild(vipPointLabel,2);
        this.vipPointLabel = vipPointLabel;

        var goldBg = new cc.Sprite("#lobby_top_bar_gold_bg.png");
        goldBg.setPosition(734, 828);
        this.addChild(goldBg);

        var goldLabel1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_25, "0");
        goldLabel1.setPosition(cc.p(733, 827));
        goldLabel1.setColor(cc.color("#ffcb2c"));
        this.addChild(goldLabel1, 2);

        var paymentBt = new ccui.Button("home_paymentBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        paymentBt.setPosition(820, 828);
        this.addChild(paymentBt);

        var vongquayBt = new ccui.Button("lobby_top_bar_vongquay_bt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        vongquayBt.setPosition(1361, 824);
        this.addChild(vongquayBt);
        this.vongquayBt = vongquayBt;

        var inboxBt = new ccui.Button("home_buttonInbox.png", "", "", ccui.Widget.PLIST_TEXTURE);
        inboxBt.setPosition(1466, 824);
        this.addChild(inboxBt);
        this.inboxBt = inboxBt;

        var msgNotif = new HomeMessageCountLayer();
        msgNotif.setPosition(64,46);
        inboxBt.getRendererNormal().addChild(msgNotif);

        var settingBt = new ccui.Button("home_buttonMenu.png", "", "", ccui.Widget.PLIST_TEXTURE);
        settingBt.setPosition(1565, 825);
        this.addChild(settingBt);

        this.goldLabel1 = goldLabel1;
        this.nameLabel = nameLabel;

        userinfoBt.addClickEventListener(function () {
            var dialog = new ProfineLayer();
            dialog.show();
        });

        settingBt.addClickEventListener(function () {
            var dialog = new SettingDialog();
            dialog.show();
        });

        inboxBt.addClickEventListener(function () {
            var inboxpop = new InboxLayer();
            inboxpop.show();
        });

        paymentBt.addClickEventListener(function () {
            SceneNavigator.showPaymentDialog();
        });

        vongquayBt.addClickEventListener(function () {
            SceneNavigator.startGame(GameType.MiniGame_Vong_Quay_May_Man);
        });

    },

    setHidden: function (isHidden) {
        if(isHidden !== this.isVisible()){
            return;
        }

        this.stopAllActions();
        var thiz = this;
        if(isHidden){
            this.runAction(cc.sequence(cc.moveTo(0.2, 0, 100), cc.callFunc(function () {
                thiz.setVisible(false);
            })));
        }
        else{
            thiz.setPosition(0, 100);
            thiz.setVisible(true);
            thiz.runAction(new cc.EaseCircleActionOut(cc.moveTo(0.2, 0, 0)));
        }
    },

    onEnter: function () {
        this._super();
        this.refreshView();
        this.setVisible(false);

        SocketClient.getInstance().addListener("login", this._onLogin, this);
        SocketClient.getInstance().addListener("ua", this._onUpdateAsset, this);
        SocketClient.getInstance().addListener("refreshAsset", this.refreshView, this);
        SocketClient.getInstance().addHTTPListener("update_nickname", this._onUpdateDisplayName, this);
        SocketClient.getInstance().addListener("inboxUnReadCount", this._refreshMess, this);
        this._refreshMess();
      //  SocketClient.getInstance().addListener("inboxUnReadCount", this._onUpdateCountInbox, this);
       // SocketClient.getInstance().addListener("connected", this._onTimeGiftCode, this);
      //  SocketClient.getInstance().addListener("1607", this._onTimeGiftCode, this);
    },

    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },


    // sendRequestGetGiftcodeTimer : function () {
    //     var request = {
    //         a : 1607,
    //         c : "game",
    //         g : "gift_hunting"
    //     };
    //     SocketClient.getInstance().send(request);
    // },

    _refreshMess: function (cmd, data) {

        this.inboxBt.stopAllActions();
        this.inboxBt.setRotation(0);
        if(PlayerMe.messageCount > 0){

            this.inboxBt.runAction(new cc.RepeatForever(new cc.Sequence(

                new cc.RotateTo(0.5,20),
                new cc.RotateTo(0.5,-20)
            ))) ;
        }

    },
    _onLogin: function (cmd, data) {
        var status = data["stt"];
        if (status === 0) {
            this.goldLabel1.setString("0");
            this.refreshView();
        }
    },

    _onUpdateAsset: function (cmd, data) {
        if (data["r"] >= 0) {
            this.refreshView();
        }
    },

    _onUpdateDisplayName: function (cmd, data) {
        if (data && data["status"] === 0) {
            this.refreshView();
        }
    },

    refreshView : function () {
        this.goldLabel1.stopAllActions();

        var action = new ext.ActionNumber(0.5,parseInt(PlayerMe.gold));
        this.goldLabel1.runAction(action);
        this.nameLabel.setString(PlayerMe.username);

        var level = cc.Global.GetVipMe();
        if(level.startExp < level.targetExp){
            var current = (level.currentExp - level.startExp);
            var target = (level.targetExp - level.startExp);

            this.vipPointLabel.setString(Math.floor(current / 40000) + "/" + Math.floor(target / 40000) );
        }
        else{
            this.vipPointLabel.setString(Math.floor(level.currentExp / 40000));
        }

    }
});

var SubTopBar = cc.Node.extend({
    ctor : function(){
        this._super();


        var bg_subtop = new cc.Sprite("#home_bar_5.png");
        this.setContentSize(bg_subtop.getContentSize());
        bg_subtop.setPosition(cc.p(this.width/2,bg_subtop.height/2));
        this.addChild(bg_subtop);

        this.bg_subtop = bg_subtop;

        var title = new cc.Sprite("#home_shop_title.png");
        title.setPosition(bg_subtop.width/2, bg_subtop.height/2);
        this.addChild(title);
        this.title = title;

        var btn_back  = new ccui.Button("home_signup_back.png","","", ccui.Widget.PLIST_TEXTURE);
        btn_back.setPosition(cc.p(47, 82));
        this.addChild(btn_back);
        this.btn_back = btn_back;

        this.ispop = true;

    },
    setTitle : function (frameName) {
        this.title.setSpriteFrame(frameName);
    }

});