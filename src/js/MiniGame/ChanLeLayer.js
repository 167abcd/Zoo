/**
 * Created by ext on 12/20/2016.
 */
//var s_ChanLeLayer = null;
var s_miniGame_chip_position = s_miniGame_chip_position || [
        {x: 112, y: 365},
        {x: 91, y: 262},
        {x: 115, y: 154},
        {x: 192, y: 108},
        {x: 302, y:100}

    ];
var stext_obscene = "bon, bonclub, bon.club, bon club ,nova, no va, NOVA, NO VA, novaclub, n.o.v.a, nov@, n0va, n0v@,bot, boss, boot, 52vip, fang69, phang69, trumclub, trum.club, trum club, helyclub, hely.club, hely club,hely , duathu.net, duathu, dua thu, xengclub, xeng.club, xeng club, tuquy, tuquy.vip, tuquy vip, tuquyvip, tu quy, sanh rong, sanhrong, daiza.club, daiza club, dai za, daiza, cakiem.club, web ca kiem, web.cakiem.club, ca kiem, bancatien.com, ban ca, banca, go.win, go win, go, win, taixiu79";

// var s_mntx_result_position = s_mntx_result_position || [
//     {x: 134, y: 114},
//     {x: 184, y: 108},
//     {x: 224, y: 120},
//     {x: 191, y: 139},
//     {x: 152, y: 158},
//     {x: 255, y: 158},
//     {x: 198, y: 177},
//     {x: 243, y: 196},
//         {x: 191, y: 215},
//         {x: 217, y: 234},
//         {x: 127, y: 234},
//         {x: 172, y: 253}
// ];

var s_mntx_result_position = s_mntx_result_position || [
        {x: 193, y: 250},
        {x: 279, y: 250},
        {x: 241, y: 174}
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

var s_money_betEx = s_money_betEx || [1000, 10000, 100000, 1000000, 10000000];
var s_bet_tx = s_bet_tx || [
        1000,5000,50000,100000,500000,1000000,5000000,10000000
    ];

var s_bet_tx_number = s_bet_tx_number || [
        1,2,3,4,5,6,7,8,9,0
    ];

var betXiuSaveLast = "0";
var betTaiSaveLast = "0";

var ChanLeVirtualKeyboard = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this._value = 0;
        this._target = null;
        var thiz = this;

        var keyboardBg = new cc.Sprite("#tx_keyboad.png");
        this.setContentSize(keyboardBg.getContentSize());
        keyboardBg.setAnchorPoint(cc.p(0,0));
        this.addChild(keyboardBg);
        this.keyboardBg = keyboardBg;

        var touch = new ccui.Widget();
        touch.setContentSize(this.getContentSize());
        touch.setAnchorPoint(cc.p(0,0));
        touch.setPosition(cc.p(0,0));
        touch.setTouchEnabled(true);
        this.keyboardBg.addChild(touch,-1);

        var btnOk = new ccui.Button("tx_btn_ok.png","","",ccui.Widget.PLIST_TEXTURE);
        btnOk.setPosition(446, 34);
        btnOk.setZoomScale(0.01);
        btnOk.addClickEventListener(function () {
            thiz.okButtonHandler();
        });
        keyboardBg.addChild(btnOk);

        var btnCancel = new ccui.Button("tx_btn_huy.png","","",ccui.Widget.PLIST_TEXTURE);
        btnCancel.setPosition(272, 34);
        btnCancel.setZoomScale(0.01);
        btnCancel.addClickEventListener(function () {
            thiz.buttonCancelHandler();
        });
        keyboardBg.addChild(btnCancel);

        var btnXoa = new ccui.Button("tx_btn_xoa.png","","",ccui.Widget.PLIST_TEXTURE);
        btnXoa.setPosition(272, 34);
        btnXoa.setVisible(false);
        btnXoa.setZoomScale(0.01);
        btnXoa.addClickEventListener(function () {
            thiz.setValue(0);
            thiz.onChangeValue();
        });
        keyboardBg.addChild(btnXoa);

        this._initBettingNode();
        this._initNumberNode();

        //this.btnOk = btnOk;
        this.btnCancel = btnCancel;
        this.btnXoa = btnXoa;

        this.setVisible(false);
        this.hide();
    },



    _initBettingNode: function () {
        var thiz = this;

        var bettingNode = new cc.Node();
        this.bettingNode = bettingNode;
        this.keyboardBg.addChild(bettingNode);


        for(var i = 0; i < 8; i++){
            (function () {
                var idx = i;
                var bettingBt = new ccui.Button("tx_btn"+ (i+1).toString()+ ".png","","",ccui.Widget.PLIST_TEXTURE);
                bettingBt.setZoomScale(0.01);
                bettingBt.setPosition(81 + (i%4)*129, 150 -  Math.floor(i/4)*56);
                // if(i === 8){
                //     bettingBt.setPosition(153, 195 -  Math.floor(i/4)*54);
                // }else if(i === 9){
                //     bettingBt.setPosition(425, 195 -  Math.floor(i/4)*54);
                // }else if(i === 10){
                //     bettingBt.setPosition(654, 195 -  Math.floor(i/4)*54);
                // }

                bettingBt.addClickEventListener(function () {
                    // if(idx === 10){ //so khac
                    //     bettingNode.setVisible(false);
                    //     thiz.numberNode.setVisible(true);
                    //     thiz.setValue(0);
                    //     thiz.onChangeValue();
                    // }
                    // else if(idx === 3){ //datlai
                    //     thiz.datLaiButtonHandler();
                    // }
                    // else if(idx === 7){ //gapthep
                    //     var value = thiz.getCurrentValue() * 2;
                    //     thiz.setValue(value);
                    //     thiz.onChangeValue();
                    // }
                    // else{
                        var value = thiz.getCurrentValue() + s_bet_tx[idx];
                        thiz.setValue(value);
                        thiz.onChangeValue();
                    // }
                });
                bettingNode.addChild(bettingBt);
            })();
        }

        var btnSoKhac = new ccui.Button("tx_btnsokhac.png","","",ccui.Widget.PLIST_TEXTURE);
        btnSoKhac.setPosition(99, 34);
        btnSoKhac.setZoomScale(0.01);
        btnSoKhac.addClickEventListener(function () {
            bettingNode.setVisible(false);
                thiz.numberNode.setVisible(true);
                thiz.setValue(0);
                thiz.onChangeValue();
        });
        bettingNode.addChild(btnSoKhac);
    },

    _initNumberNode: function () {
        var thiz = this;

        var numberNode = new cc.Node();
        this.numberNode = numberNode;
        this.keyboardBg.addChild(numberNode);
        for(var i = 0; i < 12; i++){
            (function () {
                var idx = i;
                var numberBt = new ccui.Button("tx_num"+ (i+1).toString()+ ".png","","",ccui.Widget.PLIST_TEXTURE);
                numberBt.setZoomScale(0.01);
                numberBt.setPosition(64+ (i%6)*83, 152 -  Math.floor(i/6)*58);
                numberBt.addClickEventListener(function () {
                    if(idx === 11){ //xoa 1 char
                        var value = Math.floor(thiz.getCurrentValue() / 10);
                        thiz.setValue(value);
                        thiz.onChangeValue();
                    } else if(idx === 10){ // add 000
                        var value = thiz.getCurrentValue() * 1000;
                        thiz.setValue(value);
                        thiz.onChangeValue();
                    }else { // add number
                        var value = thiz.getCurrentValue() * 10 + s_bet_tx_number[idx];
                        thiz.setValue(value);
                        thiz.onChangeValue();
                    }
                });
                numberNode.addChild(numberBt);
            })();
        }
        numberNode.setVisible(false);
    },

    setValue: function (value) {
        this._value = value;
        if(value <= 0){
            this.btnCancel.setVisible(true);
            this.btnXoa.setVisible(false);
        }
        else{
            this.btnCancel.setVisible(false);
            this.btnXoa.setVisible(true);
        }
    },

    show: function (target) {
        this.onKeyboardShow(false);

        this.bettingNode.setVisible(true);
        this.numberNode.setVisible(false);

        this.setVisible(true);
        this._target = target;
        this.onKeyboardShow(true);

        this.stopAllActions();
        this.keyboardBg.runAction(new cc.MoveTo(0.25, cc.p(this.keyboardBg.x, 0)));
    },

    hide: function () {
        this.onKeyboardShow(false);
        this._target = null;

        this.stopAllActions();
        var thiz = this;
        this.keyboardBg.runAction(new cc.Sequence(new cc.MoveTo(0.25, cc.p(this.keyboardBg.x, this.height)),
            new cc.CallFunc(function () {
                thiz.setVisible(false);
            })));
    },

    buttonCancelHandler: function () {
        if(this.numberNode.isVisible()){
            this.numberNode.setVisible(false);
            this.bettingNode.setVisible(true);
        }
        else{
            cc.log("okButtonHandler");
            this.hide();
        }
    },

    getCurrentValue: function () {
        if(this._target && this._target.getCurrentValue){
            this._value = this._target.getCurrentValue();
        }
        return this._value;
    },

    onChangeValue: function () {
        if(this._target && this._target.onChangeValue){
            this._target.onChangeValue(this._value);
        }
    },

    okButtonHandler: function () {
        if(this._target && this._target.okButtonHandler){
            this._target.okButtonHandler();
        }
    },

    datLaiButtonHandler: function () {
        if(this._target && this._target.datLaiButtonHandler){
            this._target.datLaiButtonHandler();
        }
    },

    onKeyboardShow: function (isShow) {
        if(this._target && this._target.onKeyboardShow){
            this._target.onKeyboardShow(isShow);
        }
    }
});

cc.defineGetterSetter(_p, "pixelsWidth", _p.getPixelsWide);
var ChanLeLayer = MiniGamePopup.extend({
    ctor: function () {

        this._super();
        this.setScale(0.9);
        this.arrHisSoiCau = [];
        // this._customAction = new cc.ActionManager();
        this._isUpdateTime = false;
        this.isChatEnable = true;
        this.timeDelayChat = 0;
        this.isEnableBetting = true;
        //this.jackpotLabel.setVisible(false);
        this.baseCardHeight = 0;

        this.gameType = GameType.MiniGame_TaiXiu;

        var thiz = this;
        this.moneyBet = 0;



        var bg = new cc.Sprite("#tx_bg.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(cc.winSize.width/2, cc.winSize.height - 600);
        this.addChild(bg);
        this.bg = bg;


        var virtualKeyboard = new ChanLeVirtualKeyboard();
        virtualKeyboard.setPosition(bg.width/2, -virtualKeyboard.height/2 + 70);
        bg.addChild(virtualKeyboard,-1);
        this.virtualKeyboard = virtualKeyboard;

        var bxhButton = new ccui.Button("tx_bxh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bxhButton.setPosition(639, 324);
        bxhButton.addClickEventListener(function () {
            var bxhtaixiupop = new BXHMiniTaixiuLayer();
            bxhtaixiupop.show();
        });
        bg.addChild(bxhButton, 3);

        var tutorialButton = new ccui.Button("tx_tutorialBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialButton.addClickEventListener(function () {
            var tutorialDialog = TutorialDialog.getTutorial(GameType.MiniGame_TaiXiu);
            tutorialDialog.show();
        });
        tutorialButton.setPosition(582, 343);
        bg.addChild(tutorialButton, 3);


        var historyButton = new ccui.Button("tx_historyBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        historyButton.setPosition(683, 284);
        historyButton.addClickEventListener(function () {
            var lichsupop = new LichSuTaiXiuLayer(GameType.MiniGame_TaiXiu);
            lichsupop.show();
        });
        bg.addChild(historyButton, 3);

        var closeButton = new ccui.Button("tx_closeBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(735, 253);
        bg.addChild(closeButton, 3);
        closeButton.addClickEventListener(function () {
            thiz.closeButtonHandler();
            // thiz.runEffectKetQua(true, false);
        });



        // var btnRank = new ccui.Button("mntx_btn_bxh.png","","",ccui.Widget.PLIST_TEXTURE);
        //
        // btnRank.setPosition(cc.p(909, 309));
        // btnRank.addClickEventListener(function () {
        //
        //     var rank = new ThongKeChanLe();
        //     rank.showWithAnimationScale();
        //
        // });
        // bg.addChild(btnRank);

        var gameIdLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "(123213)");
        gameIdLabel.setPosition(349, 310);
        bg.addChild(gameIdLabel);
        this.gameIdLabel = gameIdLabel;

        // var coinIcon = new cc.Sprite("#caothap_coinIcon.png");
        // coinIcon.setPosition(549, 90);
        // this.addChild(coinIcon);

        this._boudingRect = cc.rect(0, 0, 757, 477);


        this.gameState = -2;

        // var icon_onli1 = new cc.Sprite("#mntx_icon_numonline.png");
        // icon_onli1.setPosition(cc.p(95, 221));
        // bg.addChild(icon_onli1);


        var lblNumTai = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, "(0)", cc.TEXT_ALIGNMENT_RIGHT);
        lblNumTai.setAnchorPoint(1.0, 0.5);
        lblNumTai.setPosition(208, 215);
        bg.addChild(lblNumTai);

        // var icon_onli1 = new cc.Sprite("#mntx_icon_numonline.png");
        // icon_onli1.setPosition(cc.p(605, 221));
        // bg.addChild(icon_onli1);


        var lblNumXiu = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, "(0)", cc.TEXT_ALIGNMENT_RIGHT);
        lblNumXiu.setAnchorPoint(1.0, 0.5);
        lblNumXiu.setPosition(620, 215);
        bg.addChild(lblNumXiu);
        this.lblNumXiu = lblNumXiu;
        this.lblNumTai = lblNumTai;


        var lblTotalTai = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0", cc.TEXT_ALIGNMENT_RIGHT);
        lblTotalTai.setColor(cc.color("#edc319"));
        // lblTotalTai.setAnchorPoint(cc.p(1.0, 0.5));
        lblTotalTai.setPosition(108, 215);
        bg.addChild(lblTotalTai);
        this.lblTotalTai = lblTotalTai;

        var lblTotalXiu = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0", cc.TEXT_ALIGNMENT_RIGHT);
        lblTotalXiu.setColor(cc.color("#edc319"));
        // lblTotalXiu.setAnchorPoint(cc.p(1.0, 0.5));
        lblTotalXiu.setPosition(521, 215);
        bg.addChild(lblTotalXiu);
        this.lblTotalXiu = lblTotalXiu;


        var lblTai = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "0", cc.TEXT_ALIGNMENT_CENTER);
        lblTai.setColor(cc.color("#ffef81"));
        lblTai.setPosition(149, 120);
        lblTai.setScale(0.8);
        bg.addChild(lblTai);
        this.lblTai = lblTai;


        var lblXiu =  cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "0", cc.TEXT_ALIGNMENT_CENTER);
        lblXiu.setColor(cc.color("#ffef81"));
        lblXiu.setPosition(551, 120);
        bg.addChild(lblXiu);
        lblXiu.setScale(0.8);
        this.lblXiu = lblXiu;



        var wgResuft = new ccui.Widget();
        // wgResuft.setScale(0.9);
        this.wgResuft = wgResuft;

        wgResuft.setPosition(bg.width/2 - 10, 60);
        wgResuft.setAnchorPoint(0.5,0.5);


        var bghis = new ccui.Scale9Sprite("tx_bg_his.png", cc.rect(25, 0, 4, 36));
        bghis.setPreferredSize(cc.size(464, 36));
        bghis.setAnchorPoint(cc.p(0.5, 0.0));
        wgResuft.setContentSize(bghis.getContentSize());
        bghis.setPosition(cc.p(bg.width/2,20));
        bghis.setVisible(false);
        bg.addChild(bghis);

        bg.addChild(wgResuft);

        this.createAnimationNumber();

        this.initDisk();
        // var classicLabel =

        var lblTime = new cc.LabelTTF("",cc.res.font.Roboto_CondensedBold, 55);// cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
        lblTime.setPosition(this.diskSprite.getPosition());
        // lblTime.enableShadow(cc.color(0,0,0,100), cc.size(7, -7), 0.5);
        // lblTime.setColor(cc.color("#df9e33"));
        this.bg.addChild(lblTime,12);
        this.lblTime = lblTime;

        // var tx_bg_time = cc.Sprite.create("#tx_bg_time.png");
        // tx_bg_time.setPosition(this.diskSprite.getPosition());
        // bg.addChild(tx_bg_time,11);
        // tx_bg_time.setVisible(false);
        // this.tx_bg_time = tx_bg_time;

        var bg_timer = new cc.Sprite("#tx_bgcounttimer.png");
        bg_timer.setPosition(cc.p(this.diskSprite.getPositionX(), 100));
        this.bg.addChild(bg_timer, 12);
        this.bg_timer = bg_timer;

        var lblTimeUnder = cc.Label.createWithBMFont(cc.res.font.Roboto_Black_25, "");// cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
        lblTimeUnder.setPosition(cc.p(bg_timer.width/2, bg_timer.height/2));
        bg_timer.addChild(lblTimeUnder);
        this.lblTimeUnder = lblTimeUnder;



        var bg_chat = cc.Sprite.create("#tx_bg_chat.png");
        bg_chat.setPosition(-120,200);
        bg.addChild(bg_chat);
        bg_chat.setVisible(true);

        var dontTouchChat = new ccui.Widget();
        dontTouchChat.setPosition(bg_chat.width/2,bg_chat.height/2);
        dontTouchChat.setTouchEnabled(true);
        dontTouchChat.setContentSize(bg_chat.getContentSize());
        bg_chat.addChild(dontTouchChat);
        dontTouchChat.addClickEventListener(function () {
            cc.log("eo lam gi");
        });

        var closeChat = new ccui.Button("tx_closeBt2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeChat.setPosition(cc.p(235+43, 344));
        closeChat.addClickEventListener(function () {
            bg_chat.setVisible(false);
        });
        bg_chat.addChild(closeChat, 5);

        var chatText = new newui.TextField(cc.size(180+43, 55), cc.res.font.Roboto_Condensed, 15);
        chatText.setAlignment(newui.TextField.ALIGNMENT_LEFT);
        chatText.setPlaceHolder("Nhập nội dung");
        chatText.setPlaceHolderColor(cc.color("#000000"));
        chatText.setTextColor(cc.color("#000000"));
        chatText.setAnchorPoint(cc.p(0.0, 0.5));
        chatText.setPosition(24, 34);
        //chatText.setScale(cc.winSize.screenScale);
        bg_chat.addChild(chatText, 1);
        chatText.setMaxLength(60);
        // chatText.setTextChangeListener(function () {
        //     if(chatText.getText().length > 20){
        //
        //     }
        // });
        chatText.setReturnCallback(function () {
            var message = thiz.chatText.getText();
            if (message && message.length != 0) {
                thiz.sendChatHandler();
                return true;
            }
            return false;
        });
        this.chatText = chatText;

        var chatList = new newui.TableView(cc.size(234+63, 252), 1);
        // var chatList = new ccui.ListView();
        // chatList.setContentSize(cc.size(405, 270));
        // var chatList = new ccui.ListView();
        // chatList.setContentSize(cc.size(300, 355));
        // var chatList = new newui.TableView(cc.size(405, 270), 1);
        chatList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        chatList.setScrollBarEnabled(false);
        chatList.setTouchEnabled(true);
        chatList.setBounceEnabled(true);
        chatList.setPadding(10);
        chatList.setMargin(0, 10, 0,0);
        // chatList.setAnchorPoint(cc.p(1.0, 0));
        chatList.setPosition(cc.p(11, 62));
        bg_chat.addChild(chatList, 1);
        this.chatList = chatList;
        var btnSend = new ccui.Button("tx_send_chat.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnSend.setPosition(220+43, 34);
        bg_chat.addChild(btnSend, 5);
        btnSend.addClickEventListener(function () {
            thiz.sendChatHandler();
        });

        var chatButton = new ccui.Button("tx_btn_chat.png", "", "", ccui.Widget.PLIST_TEXTURE);
        chatButton.setZoomScale(0.01);
        chatButton.setPosition(97, 65);
        bg.addChild(chatButton, 5);
        chatButton.addClickEventListener(function () {
            bg_chat.setVisible(!bg_chat.isVisible());
            // thiz._boudingRect = cc.rect(0, 0, (!bg_chat.isVisible()?760:1106),thiz._boudingRect.height);
        });


        // var stopButton = new ccui.Button("tx_btn_stop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // stopButton.setZoomScale(0.01);
        // stopButton.setPosition(744, 123);
        // bg.addChild(stopButton, 5);
        // stopButton.addClickEventListener(function () {
        //
        // });


        var cauButton = new ccui.Button("tx_btn_cau.png", "", "", ccui.Widget.PLIST_TEXTURE);
        cauButton.setZoomScale(0.01);
        cauButton.setPosition(660, 78);
        bg.addChild(cauButton, 5);
        cauButton.addClickEventListener(function () {

            thiz.bg_sc.setVisible(!thiz.bg_sc.isVisible());
        });

        var virtualKeyboardFocusTai = function () {
            if(thiz.getPosition().y<(450*thiz.getScale()))
            {
                thiz.setPosition(thiz.getPosition().x,(450*thiz.getScale()));
            }
            virtualKeyboard.show(thiz.txtTai);
            var str = thiz.txtTai.getText();
            if(str === ""){
                virtualKeyboard.setValue(0);
            }
            else{
                virtualKeyboard.setValue(parseInt(str.replace(new RegExp(",", 'g'), "")));
            }
        };

        var virtualKeyboardFocusXiu = function () {
            if(thiz.getPosition().y<(450*thiz.getScale()))
            {
                thiz.setPosition(thiz.getPosition().x,(450*thiz.getScale()));
            }
            virtualKeyboard.show(thiz.txtXiu);
            var str = thiz.txtXiu.getText();
            if(str === ""){
                virtualKeyboard.setValue(0);
            }
            else{
                virtualKeyboard.setValue(parseInt(str.replace(new RegExp(",", 'g'), "")));
            }
        };

        var btnTai = new ccui.Button("tx_bg_text.png","","",ccui.Widget.PLIST_TEXTURE);
        btnTai.setPosition(cc.p(149, 163));
        btnTai.setZoomScale(0);
        btnTai.addClickEventListener(function () {
            if(!SocketClient.getInstance().isLoggin()){
                MessageNode.getInstance().show("Bạn cần đăng nhập để thực hiện chức năng này");
                return;
            }
            virtualKeyboardFocusTai();
        });
        bg.addChild(btnTai,1);
        btnTai.setTouchEnabled(true);

        var btnXiu = new ccui.Button("tx_bg_text.png","","",ccui.Widget.PLIST_TEXTURE);
        // btnXiu.setRotation(180);
        // btnXiu.setFlippedY(true);
        btnXiu.setPosition(cc.p(551, 163));
        btnXiu.setZoomScale(0);
        btnXiu.addClickEventListener(function () {
            if(!SocketClient.getInstance().isLoggin()){
                MessageNode.getInstance().show("Bạn cần đăng nhập để thực hiện chức năng này");
                return;
            }
            virtualKeyboardFocusXiu();
        });
        bg.addChild(btnXiu,1);
        btnXiu.setTouchEnabled(true);

        this.btnTai = btnTai;
        this.btnXiu = btnXiu;

        var txtTai = new newui.TextField(cc.size(140,45), cc.res.font.Roboto_Condensed, 18);
        this.txtTai = txtTai;
        this.txtTai.setPlaceHolder("ĐẶT");
        this.txtTai.setEnable(false);
        // this.txtTai.setTextColor(cc.color("#c4e1ff"));
        // this.txtTai.setPlaceHolderColor(cc.color("#909090"));
        this.txtTai.setPosition(btnTai.getPosition());
        this.txtTai.setReturnCallback(function () {
            return false;
        });
        bg.addChild(this.txtTai,1);
        this.txtTai.setFocusListener(function (focus) {
            if(focus){
                virtualKeyboardFocusTai();
            }
        });
        this.txtTai.setTextChangeListener(function (type, newText) {
            if(newText) {
                if (cc.Global.IsNumber(newText)) {
                    var money = parseInt(newText.replace(new RegExp(",", 'g'), ""));
                    txtTai.onChangeValue(money);
                }
                return true;
            }
            return false;
        });

        var txtXiu = new newui.TextField(cc.size(140,45), cc.res.font.Roboto_Condensed, 18);
        this.txtXiu = txtXiu;
        this.txtXiu.setPlaceHolder("ĐẶT");
        this.txtXiu.setEnable(false);
        // this.txtTai.setTextColor(cc.color("#c4e1ff"));
        // this.txtXiu.setPlaceHolderColor(cc.color("#909090"));
        this.txtXiu.setPosition(btnXiu.getPosition());
        this.txtXiu.setReturnCallback(function () {
            return false;
        });
        this.txtXiu.setFocusListener(function (focus) {
            if(focus){
                virtualKeyboardFocusXiu();
            }
        });
        this.txtXiu.setTextChangeListener(function (type, newText) {
            if(newText) {
                if (cc.Global.IsNumber(newText)) {
                    var money = parseInt(newText.replace(new RegExp(",", 'g'), ""));
                    txtXiu.onChangeValue(money);
                }
                return true;
            }
            return false;
        });
        bg.addChild(this.txtXiu,1);

        //
        // this.txtTai.setTextChangeListener(function (type, newString) {
        //
        // });
        this.txtTai.getCurrentValue = function () {
            var money = thiz.txtTai.getText();
            if(money === ""){
                return 0;
            }else {
                return parseInt(money.replace(new RegExp(",", 'g'), ""));
            }
        };
        this.txtTai.onChangeValue = function (value) {
            if(!SocketClient.getInstance().isLoggin()) {
                MessageNode.getInstance().show("Bạn phải đăng nhập để thực hiện chức năng này!");
                return;
            }

            if(value >= PlayerMe.gold && PlayerMe.gold > 0){
                value = PlayerMe.gold;
                MessageNode.getInstance().show("Đã đạt số tiền tối đa");
            }
            if(value <= 0){
                thiz.txtTai.setText("");
            }else{
                thiz.txtTai.setText(cc.Global.NumberFormat1(value));
            }
        };

        this.txtTai.okButtonHandler = function () {
            if(!SocketClient.getInstance().isLoggin()) {
                MessageNode.getInstance().show("Bạn phải đăng nhập để thực hiện chức năng này!");
                return;
            }

            var money = thiz.txtTai.getText();
            if(money === ""){
                MessageNode.getInstance().show("Nhập tiền cược");
            }else {
                if(thiz.isEnableBetting) {
                    var res = parseInt(money.replace(new RegExp(",", 'g'), ""));
                    thiz._controller.sendBetTaiXiu(TX_CUA_TAI, res);
                }
                thiz.isEnableBetting = false;
            }

            thiz.virtualKeyboard.setValue(0);
        };

        this.txtTai.onKeyboardShow = function (isShow) {
            if(isShow){
                btnTai.loadTextureNormal("tx_bg_text2.png",ccui.Widget.PLIST_TEXTURE);
                thiz.txtXiu.setText("");
            }
            else{
                btnTai.loadTextureNormal("tx_bg_text.png",ccui.Widget.PLIST_TEXTURE);
            }
        };

        this.txtTai.datLaiButtonHandler = function () {
            cc.log("txtTai" + betTaiSaveLast);
            if(betTaiSaveLast !== "0"){
                var strBet = cc.Global.NumberFormat1(parseInt(betTaiSaveLast));
                thiz.txtTai.setText(strBet);
            }
            else{
                MessageNode.getInstance().show("Ván trước bạn không đặt");
            }
        };

        //
        this.txtXiu.getCurrentValue = function () {
            var money = thiz.txtXiu.getText();
            if(money === ""){
                return 0;
            }else {
                return parseInt(money.replace(new RegExp(",", 'g'), ""));
            }
        };

        this.txtXiu.onChangeValue = function (value) {
            if(!SocketClient.getInstance().isLoggin()) {
                MessageNode.getInstance().show("Bạn phải đăng nhập để thực hiện chức năng này!");
                return;
            }

            if(value >= PlayerMe.gold && PlayerMe.gold > 0){
                MessageNode.getInstance().show("Đã đạt số tiền tối đa");
                value = PlayerMe.gold;
            }
            if(value <= 0){
                thiz.txtXiu.setText("");
            }else{
                thiz.txtXiu.setText(cc.Global.NumberFormat1(value));
            }
            return value;
        };

        this.txtXiu.okButtonHandler = function () {
            if(!SocketClient.getInstance().isLoggin()) {
                MessageNode.getInstance().show("Bạn phải đăng nhập để thực hiện chức năng này!");
                return;
            }

            var money = thiz.txtXiu.getText();
            if(money === ""){
                MessageNode.getInstance().show("Nhập tiền cược");
            }else {
                if(thiz.isEnableBetting) {
                    var res = parseInt(money.replace(new RegExp(",", 'g'), ""));
                    thiz._controller.sendBetTaiXiu(TX_CUA_XIU, res);
                }
                thiz.isEnableBetting = false;
            }

            thiz.virtualKeyboard.setValue(0);
        };

        this.txtXiu.onKeyboardShow = function (isShow) {
            if(isShow){
                btnXiu.loadTextureNormal("tx_bg_text2.png",ccui.Widget.PLIST_TEXTURE);
                thiz.txtTai.setText("");
            }
            else{
                btnXiu.loadTextureNormal("tx_bg_text.png",ccui.Widget.PLIST_TEXTURE);
            }
        };

        this.txtXiu.datLaiButtonHandler = function () {
            cc.log("txtXiu" + betXiuSaveLast);
            if(betXiuSaveLast !== "0"){
                var strBet = cc.Global.NumberFormat1(parseInt(betXiuSaveLast));
                thiz.txtXiu.setText(strBet);
            }
            else{
                MessageNode.getInstance().show("Ván trước bạn không đặt");
            }
        };

        var bg_tai = new cc.Sprite.create("#tx_bg_tai.png");
        bg_tai.setPosition(286,244);
        thiz.bg.addChild(bg_tai,11);
        bg_tai.setVisible(false);
        this.bgtaiLbl = bg_tai;

        var bg_xiu = new cc.Sprite.create("#tx_bg_xiu.png");
        bg_xiu.setPosition(410,244);
        thiz.bg.addChild(bg_xiu,11);
        bg_xiu.setVisible(false);
        this.bgxiuLbl = bg_xiu;

        var taiLbl = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "", cc.TEXT_ALIGNMENT_LEFT);
        taiLbl.setPosition(bg_tai.width/2, bg_tai.height/2);
        bg_tai.addChild(taiLbl);
        this.taiLbl = taiLbl;


        var xiuLbl = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "", cc.TEXT_ALIGNMENT_LEFT);
        xiuLbl.setPosition(bg_xiu.width/2, bg_xiu.height/2);
        xiuLbl.setColor(cc.color("#000000"));
        bg_xiu.addChild(xiuLbl);
        this.xiuLbl = xiuLbl;
        this.isNan = false;
        var btnNan = new ccui.Button("tx_btnNan2.png","","",ccui.Widget.PLIST_TEXTURE);
        btnNan.addClickEventListener(function () {
            thiz.isNan  = !thiz.isNan;
            cc.log("state=== nan " + thiz.isNan);
            btnNan.loadTextureNormal(thiz.isNan?"tx_btnNan.png":"tx_btnNan2.png", ccui.Widget.PLIST_TEXTURE);
        });
        btnNan.setPosition(690, 150);
        // btnNan.setPosition(thiz.diskSprite.width/2, 110);
        thiz.bg.addChild(btnNan,4);
        btnNan.setVisible(true);
        thiz.btnNan = btnNan;

        var lblCanCua = new cc.LabelTTF("Cân Cửa",cc.res.font.Roboto_CondensedBold, 30);// cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
        lblCanCua.setPosition(lblTime.getPosition());
        // lblCanCua.setColor(cc.color("#da8120"));
        this.bg.addChild(lblCanCua,12);
        lblCanCua.setVisible(false);
        this.lblCanCua = lblCanCua;

        this.betXiuSave = "0";
        this.betTaiSave = "0";

        var bg_win_tai = new cc.Sprite.create("#tx_ketqua_effect.png");
        bg_win_tai.setPosition(bg.width/2 - 210,275);
        thiz.bg.addChild(bg_win_tai,4);
        bg_win_tai.setVisible(false);
        this.bg_win_tai = bg_win_tai;

        var bg_win_xiu = new cc.Sprite.create("#tx_ketqua_effect.png");
        bg_win_xiu.setPosition(bg.width/2 + 190,275);
        thiz.bg.addChild(bg_win_xiu,4);
        bg_win_xiu.setVisible(false);
        this.bg_win_xiu = bg_win_xiu;

        this.bg_win_tai.runAction(new cc.RepeatForever(new cc.RotateBy(2.0, 360)));
        this.bg_win_xiu.runAction(new cc.RepeatForever(new cc.RotateBy(2.0, 360)));

        var sprTai = new cc.Sprite("#tx_txt_tai.png");
        sprTai.setAnchorPoint(cc.p(0.0, 0.0));
        sprTai.setPosition(cc.p(90, 247));
        bg.addChild(sprTai,5);
        this.sprTai = sprTai;

        var sprXiu = new cc.Sprite("#tx_txt_xiu.png");
        sprXiu.setAnchorPoint(cc.p(0.0, 0.0));
        sprXiu.setPosition(cc.p(496, 247));
        bg.addChild(sprXiu,5);
        this.sprXiu = sprXiu;


        // this.openDisk();
        //
        // this.runAction(new cc.Sequence(
        //     new cc.DelayTime(4),
        //
        //     new cc.CallFunc(function () {
        //
        //         thiz.closeDisk();
        //     })
        // ));
        // var test = [1,2,5];
        // this._addResultSprite(test);

        this.createLayerSoiCau();
        // this.bg_sc.setVisible(false);
        this.bg_sc.setScale(1.25);
        this.initDuDay();


    },
    onError:function(params){
        this.isEnableBetting = true;

    },
    initDuDay:function () {
        var bg_duDay = cc.Sprite.create("#tx_bg_txt_day.png");
        bg_duDay.setPosition(this.bg.width/2, 15);
        this.bg.addChild(bg_duDay,-1);
        bg_duDay.setVisible(false);
        this.bg_duDay = bg_duDay;

        var lblDayThang = new cc.LabelTTF("" ,cc.res.font.Roboto_CondensedBold, 18);
        lblDayThang.setPosition(144, 31);
        lblDayThang.setAnchorPoint(0.5, 0.5);
        lblDayThang.setColor(cc.color("#fce522"));
        bg_duDay.addChild(lblDayThang,12);


        var lblDayThua = new cc.LabelTTF("" ,cc.res.font.Roboto_CondensedBold, 18);
        lblDayThua.setPosition(385, 31);
        lblDayThua.setAnchorPoint(0.5, 0.5);
        lblDayThua.setColor(cc.color("#fce522"));
        bg_duDay.addChild(lblDayThua,12);


        var bg_title = new ccui.Button("tx_title_tx.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bg_title.setAnchorPoint(cc.p(0.5, 0.5));
        bg_title.setPosition(this.bg.width/2, this.bg.height + 30);

        this.bg.addChild(bg_title);
        this.bg_title = bg_title;
        this.lblDayThang = lblDayThang;
        this.lblDayThua = lblDayThua;

    },

    onHanldeDuDay:function (isDuday,thang,thua) {
        this.bg_duDay.setVisible(isDuday);

        if(isDuday){
            // this.bg_title.setPosition(388,360);
            this.bg_title.loadTextureNormal("tx_title_duday.png", ccui.Widget.PLIST_TEXTURE);
            this.bg_title.addClickEventListener(function () {
                //show du day
                var pop = new SuKienDuDayDialog();
                pop.show();
            });
            this.lblDayThang.setString(thang.toString());
            this.lblDayThua.setString(thua.toString());
        }
    },
    onUpdateDuDay:function (thang, thua) {
        this.lblDayThang.setString(thang.toString());
        this.lblDayThua.setString(thua.toString());
    },
    createXucXac:function (result) {
        var thiz = this;
        var zzz = new cc.Sprite("#tx_xx_1.png");
        zzz.setPosition(this.diskSprite.width/2, this.diskSprite.height/2+10);
        zzz.setScale(1.5);
        this.arrXX = [];
        if(!this.isNan){
            var frames = [];
            for(var k = 1; k < 40; k ++){
                frames.push(cc.spriteFrameCache.getSpriteFrame("tx_xx_"+k.toString() +".png"));
            }

            var animation = new cc.Animation(frames, 0.025, 1);
            var animateAction = new cc.Animate(animation);
            var onfinish = new cc.CallFunc(function () {
                cc.log("finish ");
                for (var i = 0; i < thiz.arrXX.length; i++) {
                    thiz.arrXX[i].setVisible(true);
                }
            });
            zzz.runAction( new cc.Sequence(  animateAction ,onfinish) );

        }

        for (var i = 0; i < 3; i++) {

            var temp = new cc.Sprite("#tx" + (i+1).toString() + "_" + result[i] + ".png");
            // temp.setScale(0.8);
            temp.setPosition(zzz.width/2,zzz.height/2);
            temp.setVisible(this.isNan);
            zzz.addChild(temp);
            this.arrXX.push(temp);

        }


        return zzz;

    },

    handleCanCuaMe:function (idCua, money) {

    },

    handelCanCuaTotal:function (idCua, money,moneyTru) {

    },

    setMoneyBetMe:function (idCua, money) {
        if (idCua == TX_CUA_TAI) {
            var action = new ext.ActionNumber(0.5,parseInt(money));
            this.lblTai.runAction(action);
        } else {
            var action = new ext.ActionNumber(0.5,parseInt(money));
            this.lblXiu.runAction(action);
        }
    },
    setMonetBetTotal:function (idCua, money) {
        if (idCua === TX_CUA_TAI) {
            var mlabel  = this.lblTotalTai;
        } else {
            var mlabel  = this.lblTotalXiu;
        }

        // var action = new ext.ActionNumber(0.5,parseInt(money));
        // mlabel.runAction(action);

        mlabel.setString(cc.Global.NumberFormat1(parseInt(money)));
        mlabel.stopAllActions();
        mlabel.setScale(1.0);
        var action = new cc.Sequence(new cc.EaseSineOut(new cc.ScaleTo(0.1, 1.5)), new cc.EaseSineOut(new cc.ScaleTo(0.1, 1.0)));
        mlabel.runAction(action);
    },

    createMoneyCanCuaFly:function (idCua, moneyTru) {

        if(moneyTru == 0){
            return;
        }
        var lblFly = new cc.LabelTTF("-" + cc.Global.NumberFormat1(moneyTru) ,cc.res.font.Roboto_CondensedBold, 40);
        if(idCua == TX_CUA_TAI){

            lblFly.setPosition( this.lblTotalTai.getPosition() );
        }else {
            lblFly.setPosition(this.lblTotalXiu.getPosition() );

        }


        lblFly.setColor(cc.color("#ff0000"));
        this.bg.addChild(lblFly,12);
        // lblFly.runAction(new cc.MoveTo(1.5, cc.p(lblFly.x, lblFly.y  + 200)));
        var moveAndFade = new cc.CallFunc(function () {
            lblFly.runAction(new cc.MoveTo(1.5, cc.p(lblFly.x, lblFly .y  + 200)));
            // lblFly.runAction(new cc.FadeTo(1.5,0));
        });
        this.bg.runAction(new cc.Sequence(moveAndFade, new cc.DelayTime(1.5), new cc.CallFunc(function () {
            lblFly.removeFromParent();
        })));
    },



    setNumerPersonBet:function (idCua, userCount) {
        if (idCua == TX_CUA_TAI) {

            this.lblNumTai.setString(("(" + userCount.toString() + ")") );
        } else {
            this.lblNumXiu.setString(("(" + userCount.toString() + ")") );
        }
    },

    onBetSucess: function (cua) {
        this.txtTai.setText("");
        this.txtXiu.setText("");
        this.isEnableBetting = true;
        if(cua ==1)
        {
            this.txtXiu.setEnable(false);
            this.btnXiu.setTouchEnabled(false);
            this.txtXiu.setPlaceHolder("Không được đặt");
        }
        else{
            this.txtTai.setEnable(false);
            this.btnTai.setTouchEnabled(false);
            this.txtTai.setPlaceHolder("Không được đặt");
        }
    },

    resetMobie:function () {
        this.bgxiuLbl.setVisible(false);
        this.bgtaiLbl.setVisible(false);
        this.bg_win_tai.setVisible(false);
        this.bg_win_xiu.setVisible(false);
    },

    runEffectKetQua : function (isrun, isTai,delay) {
        var thiz = this;
        this.stopAllActions();
        this.sprTai.stopAllActions();
        this.sprXiu.stopAllActions();
        this.sprTai.setVisible(true);
        this.sprXiu.setVisible(true);
        thiz.bgxiuLbl.setVisible(false);
        thiz.bgtaiLbl.setVisible(false);
        this.bg_win_tai.setVisible(false);
        this.bg_win_xiu.setVisible(false);
        if(isrun)
        {
            this.runAction(new cc.Sequence(new cc.DelayTime(delay+0.3),
            new cc.CallFunc(function () {
                if(isTai)
                {
                    thiz.sprTai.runAction(new cc.RepeatForever(
                        new cc.Sequence(
                            new cc.Blink(0.3,true),
                            new cc.Blink(0.1,false)
                        )
                    ));
                    thiz.bg_win_tai.setVisible(true);
                    thiz.bgtaiLbl.setVisible(true);
                    // this.bg_win_tai.runAction(new cc.RepeatForever(new cc.RotateBy(2.0, 360)));
                }
                else
                {
                    thiz.sprXiu.runAction(new cc.RepeatForever(
                        new cc.Sequence(
                            new cc.Blink(0.3,true),
                            new cc.Blink(0.1,false)
                        )
                    ));
                    thiz.bg_win_xiu.setVisible(true);
                    thiz.bgxiuLbl.setVisible(true);
                    // this.bg_win_xiu.runAction(new cc.RepeatForever(new cc.RotateBy(2.0, 360)));
                }
            })
            ));
        }

    },


    sendChatHandler: function () {
        var message = this.chatText.getText();
        if (message && message.length != 0) {
            // if(PlayerMe.vipExp < 40000){
            //     MessageNode.getInstance().show("Bạn phải có 1 VP trở lên mới được chat!");
            //     return;
            // }

            if(!this.isChatEnable ){
                MessageNode.getInstance().show("Thời gian mỗi lần chat là 5s!");
                return;
            }
            this.timeDelayChat = 5;
            this.chatText.setText("");

            this._controller.sendMessageChat(GameType.MiniGame_TaiXiu, message);
            // this.addChatMessage("Me", message);
        }
    },

    addChatMessage: function (username, message) {
        //  cc.log(username + ": "+message);
        var textMesasge = new ccui.RichText();
        textMesasge.ignoreContentAdaptWithSize(false);
        if(cc.sys.isNative){
            //textMesasge.setWrapMode(0);
        }
        else{
            textMesasge.setLineBreakOnSpace(true);
        }

        textMesasge.setContentSize(cc.size(this.chatList.getContentSize().width - 5, 0));
        var arrText = stext_obscene.split(",");
        for(var i = 0; i < arrText.length ; i++){
            message = message.replace( arrText[i].trim(), "***");
        }
        //textMesasge.width = this.chatList.getContentSize().width-10;
        var usercolor = cc.color(255, 98, 43);
        var textcolor = cc.color(255, 255, 255);
        if(username.indexOf("@") != -1)
        {
            usercolor = cc.color(255, 239, 43);
            textcolor = cc.color(255, 255, 255);
        }

        var userText = new ccui.RichElementText(0, usercolor, 255, username.replace("@", "") + ": ", cc.res.font.Roboto_Regular, 15);
        var messageText = new ccui.RichElementText(1, textcolor, 255, message, cc.res.font.Roboto_Regular, 15);

        textMesasge.pushBackElement(userText);
        textMesasge.pushBackElement(messageText);
        textMesasge.formatText();

        this._pushChat(textMesasge);
        cc.log(textMesasge.height);
    },

    _pushChat: function (mNode) {

        this.chatList.pushItem(mNode);
        this.chatList.stopAutoScroll();
        this.chatList.forceRefreshView();
        this.chatList.scrollToBottom(0.5, true);

        if(this.chatList.size() > 200){
            var thiz = this;
            this.chatList.runAction(new cc.Sequence(new cc.DelayTime(0.6), new cc.CallFunc(function () {
                thiz.chatList.removeItem(0);
                thiz.chatList.forceRefreshView();
            })));
        }
    },

    addChatMessageInfo: function (type, message, cua) {
        //type: 1 cuoc, 2 hoan, 3 nhan
        var textMesasge = new ccui.RichText();
        textMesasge.ignoreContentAdaptWithSize(false);
        if(cc.sys.isNative){
            //textMesasge.setWrapMode(0);
        }
        else{
            textMesasge.setLineBreakOnSpace(true);
        }

        textMesasge.setContentSize(cc.size(this.chatList.getContentSize().width - 5, 0));
        //textMesasge.width = this.chatList.getContentSize().width-10;
        var usercolor = cc.color(255, 255, 255);
        var textcolor = cc.color(255, 222, 76);
        var userText = new ccui.RichElementText(0, usercolor, 255, this.gameIdLabel.getString() +": ", cc.res.font.Roboto_Regular, 16);
        switch (type){
            case 1:
                var textcua= (cua==1)?("cửa TRÊN "+ cc.Global.NumberFormat1(message- parseInt(this.betTaiSave))):("cửa DƯỚI "+ cc.Global.NumberFormat1(message- parseInt(this.betXiuSave)));
                var messageText = new ccui.RichElementText(1, textcolor, 255, "Bạn đã đặt " + textcua , cc.res.font.Roboto_Regular, 16);
                break;
            case 2:
                var messageText = new ccui.RichElementText(1, textcolor, 255, "Bạn đã được Hoàn " + cc.Global.NumberFormat1(message), cc.res.font.Roboto_Regular, 16);
                break;
            case 3:
                var messageText = new ccui.RichElementText(1, textcolor, 255, "Bạn đã nhận được " + cc.Global.NumberFormat1(message), cc.res.font.Roboto_Regular, 16);
                break;
        }
        textMesasge.pushBackElement(userText);
        textMesasge.pushBackElement(messageText);
        textMesasge.formatText();
        this._pushChat(textMesasge);
    },
    showBetAvaible:function (isShow) {
        for(var i = 0; i < this.arrKeyBet.length; i++){
            this.arrKeyBet[i].setVisible(isShow);
        }
        for(var i = 0; i < this.arrKeyNumber.length; i++){
            this.arrKeyNumber[i].setVisible(!isShow);
        }
    },

    // showKeyboard:function (isShow) {
    //     this.bg_keyboad.stopAllActions();
    //     if(isShow){
    //         this.bg_keyboad.setVisible(true);
    //         this.bg_keyboad.runAction(cc.MoveTo.create(0.25,cc.p(this.bg_keyboad.getContentSize().width/2,-this.bg_keyboad.getContentSize().height/2 + 22)));
    //     }else {
    //         var thiz = this;
    //         this.bg_keyboad.runAction(new cc.Sequence(cc.MoveTo.create(0.25,cc.p(this.bg_keyboad.getContentSize().width/2,this.bg_keyboad.getContentSize().height/2+ 20)), new cc.CallFunc(function () {
    //             thiz.bg_keyboad.setVisible(false);
    //         })));
    //     }
    // },


    drawSoiCauUnder:function (arrTest,objTong, objPerCent) {
        var soluongTai = 0;
        var soluongXiu = 0;
        this.nodeHatUndr.removeAllChildren(true);



        for(var i = 0; i < arrTest.length; i++){


            var tongHat = arrTest[i][0] + arrTest[i][1] + arrTest[i][2];
            var taizz = 1;
            if(tongHat <= 10){
                taizz = 2;
            }
            soluongXiu++;
            var nameHat = "#tx_sc_hat1";

            if(taizz==2){
                nameHat = "#tx_sc_hat2";
                soluongTai++;
                soluongXiu--;
            }

            var temp2 = new cc.Sprite(nameHat+".png");
            temp2.setPosition(90 + Math.floor(i/6)*30.2,208 - (i%6)*30);
            this.nodeHatUndr.addChild(temp2);



        }
        // max = 34

        if(arrTest.length > 108) {
            //remove phantu thua

            arrTest.splice(0, arrTest.length - 108);
            // draw again
            this.drawSoiCauUnder(arrTest, objTong, objPerCent,false);
        }
        this.numberTaiDown.setString(soluongTai.toString());
        this.numberXiuDown.setString(soluongXiu.toString());
    },
    drawSoiCauBaccaratOld:function (arrTest,objTong, objPerCent) {
        var soluongTai = 0;
        var soluongXiu = 0;
        this.nodeHat.removeAllChildren(true);


        var indexThua = 0;
        var indexX = 0;
        var indexY = 0;
        var distance = 0;

        var indexMax = 5;
        var indexXEnd = 0;

        var arrThua = [];
        var indexEndMax = 0;

        for(var i = 0; i < arrTest.length; i++){
            var tongHat = arrTest[i][0] + arrTest[i][1] + arrTest[i][2];
            var taizz = 1;
            if(tongHat <= 10){
                taizz = 2;
            }
            var nameHat = "#bg_hat_xiu";
            soluongXiu++;
            if(taizz ==2){
                nameHat = "#bg_hat_tai";
                soluongXiu--;
                soluongTai++;
            }
            var temp = new cc.Sprite(nameHat+".png");
            if(i > 0 ){
                var tongHat2 = arrTest[i-1][0] + arrTest[i-1][1] + arrTest[i-1][2];
                var taizz2 = 1;
                if(tongHat2 <= 10){
                    taizz2 = 2;
                }
                if(taizz != taizz2  ){


                    indexX++;

                    if(distance>0){
                        indexMax --;
                        indexXEnd = indexX;
                    }
                    indexX = indexX - distance;
                    distance = 0;
                    arrThua.push(indexY+1);
                    indexY = 0;



                }
                else if(taizz == taizz2 ){

                    if(indexX >= indexXEnd ){
                        indexMax = 5;
                        indexXEnd = 0;
                    }
                    indexY++;
                    if(indexY>indexMax){
                        indexY = indexMax;
                        indexX++;
                        distance++;
                        if(distance > indexThua ){
                            indexEndMax = indexX;
                            indexThua = distance;
                        }
                    }else {

                    }



                }
            }



            temp.setPosition(91 + indexX*30.2,467 - indexY*29.3);
            this.nodeHat.addChild(temp);
            var lblNum = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, tongHat.toString());
            lblNum.setScale(12.0/20.0);
            lblNum.setColor(cc.color(taizz===2?"#ffffff":"#02f6ff"));
            lblNum.setPosition(14, 14);
            temp.addChild(lblNum);



        }
        // cc.log("indexThua:" + indexThua.toString()  + " indexEndMax:" + indexEndMax.toString());
        // max = 34
        this.numberTaiUp.setString(soluongTai.toString());
        this.numberXiuUp.setString(soluongXiu.toString());
        cc.log("indexX" + indexX);
        if(indexX > 18) {
            //remove phantu thua
            var numberThua = 0;
            for (var i = 0; i < indexX - 18; i++) {
                numberThua += arrThua[i];
            }
            arrTest.splice(0, numberThua);
            // draw again
            this.drawSoiCauBaccarat(arrTest, objTong, objPerCent,false);
        }

    },
    createDataSoiCauBaccarat:function (arrTest) {

        var arrColumn = [];
        var arrRow = [];
        for(var i = 0; i < arrTest.length; i++){
            var tongHat = arrTest[i][0] + arrTest[i][1] + arrTest[i][2];
            var taizz = 1;
            if(tongHat <= 10){
                taizz = 2;
            }


            if(i > 0 ){
                var tongHat2 = arrTest[i-1][0] + arrTest[i-1][1] + arrTest[i-1][2];
                var taizz2 = 1;
                if(tongHat2 <= 10){
                    taizz2 = 2;
                }
                if(i !=  arrTest.length-1){
                    if(taizz != taizz2  ){

                        var arrTemp = arrRow;
                        arrColumn.push(arrTemp);
                        arrRow = [];
                    }
                }else { // con cuoi
                    if(taizz != taizz2){
                        var arrTemp = arrRow;
                        arrColumn.push(arrTemp);
                        arrRow = [];
                        arrColumn.push(arrRow);
                    }else {
                        arrRow.push( tongHat);
                        var arrTemp = arrRow;
                        arrColumn.push(arrTemp);
                        arrRow = [];
                    }


                }


            }

            arrRow.push( tongHat);
        }

        if(arrColumn.length>19){
            arrColumn.splice(0,arrColumn.length-19);
        }



        //fill ao
        var arrCell = [];
        for(var i = 0; i < arrColumn.length+20; i++){
            var temp = [false,false,false,false,false,false];
            arrCell.push(temp);

        }
        var  indexMax = 0;
        var indexYMax = 5;
        for(var i = 0; i < arrColumn.length; i++){
            indexYMax = this.giamRawDan(arrCell,i);
            for(var j = 0; j< arrColumn[i].length; j++){

                var indexX = i+ ((j>indexYMax)?(j-indexYMax):0);

                var indexY = ((j>indexYMax)?indexYMax:j);

                // if(arrCell[indexX][indexY]){
                //     indexYMax -- ;
                //     indexX = i+ ((j>indexYMax)?(j-indexYMax):0);
                //     indexY = ((j>indexYMax)?indexYMax:j);
                // }


                if(indexMax< indexX){
                    indexMax = indexX;
                }
                arrCell[indexX][indexY] = true;
            }


        }

        if(indexMax >18){
            arrColumn.splice(0,indexMax-18);
        }

        return arrColumn;
    },
    drawSoiCauBaccarat:function (arrNew,objTong, objPerCent) {
        var arrTest = this.createDataSoiCauBaccarat(arrNew);
        var soluongTai = 0;
        var soluongXiu = 0;
        this.nodeHat.removeAllChildren(true);
        var indexYMax = 5;


        var arrCell = [];
        for(var i = 0; i < arrTest.length+20; i++){
            var temp = [false,false,false,false,false,false];
            arrCell.push(temp);

        }
        for(var i = 0; i < arrTest.length; i++){

            indexYMax = this.giamRawDan(arrCell,i);
            for(var j = 0; j< arrTest[i].length; j++){
                var nameHat = "#bg_hat_xiu";
                soluongXiu++;
                if(arrTest[i][j] <=10){
                    nameHat = "#bg_hat_tai";
                    soluongXiu--;
                    soluongTai++;
                }


                var temp = new cc.Sprite(nameHat+".png");

                var indexX = i+ ((j>indexYMax)?(j-indexYMax):0);

                var indexY = ((j>indexYMax)?indexYMax:j);

                temp.setPosition(91 + indexX*30.2,467 - indexY*29.3);

                arrCell[indexX][indexY] = true;

                this.nodeHat.addChild(temp);
                var lblNum = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, arrTest[i][j].toString());
                lblNum.setScale(14.0/20.0);
                lblNum.setColor(cc.color(arrTest[i][j] <=10?"#ffffff":"#02f6ff"));
                lblNum.setPosition(14, 14);
                temp.addChild(lblNum);

            }


        }
        // max = 34
        this.numberTaiUp.setString(soluongTai.toString());
        this.numberXiuUp.setString(soluongXiu.toString());
    },

    giamRawDan:function (arrCell,i) {
        var indexYMax = 5;
        for(var k = 0; k < 5; ){

            k++;
            var indexY = ((k>indexYMax)?indexYMax:k);
            if(arrCell[i][k]){
                cc.log("giam ram dna" + (k -1).toString() + "cua" + i);
                indexYMax =  k -1;
                break;

            }

        }
        return indexYMax ;
    },
    createLayerSoiCau:function () {
        var bg_sc = new cc.Sprite("#tx_bg_sc.png");
        this.bg.addChild(bg_sc,15);
        this.bg_sc = bg_sc;
        bg_sc.setVisible(false);
        var thiz = this;
        bg_sc.setAnchorPoint(1,0);
        bg_sc.setPosition(800, -200);

        var nodemain = new cc.Node();
        nodemain.setContentSize(bg_sc.getContentSize());
        nodemain.setAnchorPoint(cc.p(0.5, 0.5));
        nodemain.setPosition(cc.p(bg_sc.width/2, bg_sc.height/2));
        bg_sc.addChild(nodemain);


        var bg_temp1 = new cc.Sprite("#tx_bg_sc1.png");
        nodemain.addChild(bg_temp1);
        bg_temp1.setPosition(bg_sc.width/2,bg_temp1.height/2 + 50);
        bg_temp1.setVisible(false);
        var bg_temp2 = new cc.Sprite("#tx_bg_sc2.png");

        var numberTaiUp = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0");
        numberTaiUp.setPosition(354, 515);
        numberTaiUp.setColor(cc.color("#02f6ff"));

        var numberXiuUp = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0");
        numberXiuUp.setPosition(479, 515);
        numberXiuUp.setColor(cc.color("#000000"));

        var numberTaiDown = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0");
        numberTaiDown.setPosition(354, 258);
        numberTaiDown.setColor(cc.color("#02f6ff"));

        var numberXiuDown = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0");
        numberXiuDown.setPosition(479 ,258);
        numberXiuDown.setColor(cc.color("#000000"));



        bg_temp2.addChild(numberTaiUp);
        bg_temp2.addChild(numberXiuUp);
        bg_temp2.addChild(numberTaiDown);
        bg_temp2.addChild(numberXiuDown);
        this.numberTaiUp = numberTaiUp;
        this.numberXiuUp = numberXiuUp;
        this.numberTaiDown = numberTaiDown;
        this.numberXiuDown = numberXiuDown;


        nodemain.addChild(bg_temp2);
        bg_temp2.setPosition(bg_sc.width/2,bg_temp2.height/2);
        bg_temp2.setVisible(true);


        var nodeHat = new cc.Node();
        nodeHat.setPosition(cc.p(0, 0));
        bg_temp2.addChild(nodeHat,1);
        this.nodeHat =  nodeHat;

        var nodeHatUndr = new cc.Node();
        nodeHatUndr.setPosition(cc.p(0, 0));
        bg_temp2.addChild(nodeHatUndr,1);
        this.nodeHatUndr =  nodeHatUndr;


        var nextButton = new ccui.Button("tx_nexttrai.png", "", "", ccui.Widget.PLIST_TEXTURE);
        nextButton.setPosition(bg_sc.width/2 + 337, 265);
        nextButton.addClickEventListener(function () {
            // bg_temp1.stopAllActions();
            // bg_temp2.stopAllActions();
            // bg_temp1.runAction(new cc.FadeTo(0.5,1));
            // bg_temp2.runAction(new cc.FadeTo(0.5,0));
            bg_temp1.setVisible(true);
            bg_temp2.setVisible(false);
            thiz.nextButton.setVisible(false);
            thiz.previosButton.setVisible(true);
        });
        nodemain.addChild(nextButton, 5);


        var previosButton = new ccui.Button("tx_nextphai.png", "", "", ccui.Widget.PLIST_TEXTURE);
        previosButton.setPosition(bg_sc.width/2 - 337, 265);
        previosButton.setVisible(false);
        previosButton.addClickEventListener(function () {

            // bg_temp1.stopAllActions();
            // bg_temp2.stopAllActions();
            // bg_temp2.runAction(new cc.FadeTo(0.5,1));
            // bg_temp1.runAction(new cc.FadeTo(0.5,0));
            bg_temp1.setVisible(false);
            bg_temp2.setVisible(true);
            thiz.nextButton.setVisible(true);
            thiz.previosButton.setVisible(false);
        });
        nodemain.addChild(previosButton, 5);
        this.nextButton = nextButton;
        this.previosButton = previosButton;

        // var arrTest = [[1,1,3],[1,1,3],[1,1,3],[1,1,3],[1,1,3],[1,1,3],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6],[1,1,1],[3,2,6]];
        // arrTest.reverse();
        //
        // this.drawSoiCauUnder(arrTest,null,null);
        // this.drawSoiCauBaccarat(arrTest,null,null);

        this.preTouchPointBg = null;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if(thiz.preTouchPointBg != null){
                    return false;
                }
                if(bg_sc.isVisible()){
                    var p = bg_sc.convertToNodeSpace(touch.getLocation());
                    // var p2 = thiz.convertToNodeSpace(bg_sc.getPosition());
                    // var rect = this.getBoundingBox();
                    if (cc.rectContainsPoint( cc.rect(0, 0, bg_sc.getContentSize().width, bg_sc.getContentSize().height), p)) {
                        thiz.preTouchPointBg = touch.getLocation();
                        return true;
                    }
                    return false;
                }
                else{
                    return false;
                }

            },
            onTouchEnded: function (touch, event) {
                thiz.preTouchPointBg = null;
            },
            onTouchMoved: function (touch, event) {
                var p = touch.getLocation();


                bg_sc.x += (p.x - thiz.preTouchPointBg.x)/bg_sc.getParent().getScale();
                bg_sc.y += (p.y - thiz.preTouchPointBg.y)/bg_sc.getParent().getScale();
                thiz.preTouchPointBg = p;

                var distance = cc.pDistance(thiz.preTouchPointBg,bg_sc.getPosition());
                // cc.log("aaa"+distance);


            }
        }, bg_sc);

        var closeChat = new ccui.Button("tx_closeBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeChat.setPosition(bg_sc.width -10, bg_sc.height -10);
        closeChat.addClickEventListener(function () {
            bg_sc.setVisible(false);
        });
        bg_sc.addChild(closeChat, 5);

        var lbl_Phien = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, "Phiên gần đây nhất (#1234000005)");
        lbl_Phien.setAnchorPoint(0,0.5);
        lbl_Phien.setPosition(132, 478);
        bg_temp1.addChild(lbl_Phien);
        thiz.lbl_Phien = lbl_Phien;

        var lbl_last = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, " 12(4-2-6)");
        lbl_last.setAnchorPoint(0,0.5);
        lbl_last.setPosition(407+130, 478);
        lbl_last.setColor(cc.color("#fcff00"));
        bg_temp1.addChild(lbl_last);
        this.lbl_last = lbl_last;


        var btnTong = new ccui.Button("tx_sc_tongb.png","","",ccui.Widget.PLIST_TEXTURE);
        btnTong.isClick = true;
        btnTong.addClickEventListener(function () {
            btnTong.isClick = !btnTong.isClick;
            thiz.drawnodeTongHat.setVisible(btnTong.isClick);
            btnTong.loadTextureNormal(btnTong.isClick?"tx_sc_tongb.png":"tx_sc_tonga.png",ccui.Widget.PLIST_TEXTURE);
        });
        bg_temp1.addChild(btnTong);
        btnTong.setAnchorPoint(cc.p(0.0, 0.5));
        btnTong.setPosition(113,437);


        var btnHat1 = new ccui.Button("tx_sc_hat1b.png","","",ccui.Widget.PLIST_TEXTURE);
        btnHat1.isClick = true;
        btnHat1.addClickEventListener(function () {
            btnHat1.isClick = !btnHat1.isClick;
            thiz.drawNodeHat1.setVisible(btnHat1.isClick);
            btnHat1.loadTextureNormal(btnHat1.isClick?"tx_sc_hat1b.png":"tx_sc_hat1a.png",ccui.Widget.PLIST_TEXTURE);
        });
        bg_temp1.addChild(btnHat1);
        btnHat1.setAnchorPoint(cc.p(0.0, 0.5));
        btnHat1.setPosition(207,437);


        var btnHat2 = new ccui.Button("tx_sc_hat2b.png","","",ccui.Widget.PLIST_TEXTURE);
        btnHat2.isClick = true;
        btnHat2.addClickEventListener(function () {
            btnHat2.isClick = !btnHat2.isClick;
            thiz.drawNodeHat2.setVisible(btnHat2.isClick);
            btnHat2.loadTextureNormal(btnHat2.isClick?"tx_sc_hat2b.png":"tx_sc_hat2a.png",ccui.Widget.PLIST_TEXTURE);
        });
        bg_temp1.addChild(btnHat2);
        btnHat2.setAnchorPoint(cc.p(0.0, 0.5));
        btnHat2.setPosition(348,437);


        var btnHat3 = new ccui.Button("tx_sc_hat3b.png","","",ccui.Widget.PLIST_TEXTURE);
        btnHat3.isClick = true;
        btnHat3.addClickEventListener(function () {
            btnHat3.isClick = !btnHat3.isClick;
            thiz.drawNodeHat3.setVisible(btnHat3.isClick);
            btnHat3.loadTextureNormal(btnHat3.isClick?"tx_sc_hat3b.png":"tx_sc_hat3a.png",ccui.Widget.PLIST_TEXTURE);
        });
        bg_temp1.addChild(btnHat3);
        btnHat3.setAnchorPoint(cc.p(0.0, 0.5));
        btnHat3.setPosition(484,437);


        this.drawNodeHat1 = cc.DrawNode.create();
        this.drawNodeHat2 = cc.DrawNode.create();
        this.drawNodeHat3 = cc.DrawNode.create();
        this.drawnodeTongHat = cc.DrawNode.create();

        // var arrNum = [1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1];
        // var arrNum2 = [3,3,3,3,3,2,3,3,3,3,3,3,3,2,3,3,3,3,3];
        // var arrNum3 = [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6];

        // this.drawNodeHat1.drawSegment(cc.p(80,51),cc.p(106,103), 2,cc.color(255,255,255,128));
        // this.drawNode.drawRect(cc.p(100,100), cc.p(300,300), cc.color(255,255,255,128), 1 , cc.color(255,255,255,128) );
        bg_temp1.addChild(this.drawNodeHat1);
        bg_temp1.addChild(this.drawNodeHat2);
        bg_temp1.addChild(this.drawNodeHat3);
        bg_temp1.addChild(this.drawnodeTongHat);

        thiz._controller.requestSoiCau();
    },
    onResuftSoiCau:function (itemXuc,idVan) {
        this.onResuftSoiCauBar(itemXuc);
        this.arrHisSoiCau.splice(0,0,itemXuc);
        if(this.arrHisSoiCau.length > 19){
            this.arrHisSoiCau.splice(19,1);
        }
        this.drawHat(this.arrHisSoiCau);
        this.lbl_Phien.setString("Phiên gần đây nhất (#" + idVan + ")");
        this.lbl_last.setString( " " + (itemXuc[0]+ itemXuc[1] + itemXuc[2]).toString() + "(" + itemXuc[0].toString()+"-" + itemXuc[1].toString()+"-"+itemXuc[2].toString()+")" );
        this.lbl_last.setPosition(170+this.lbl_Phien.getContentSize().width, 478);
    },
    onSoiCau:function(arr,idvan){

        this.arrHisSoiCau = [];
        if(arr.length<0){
            return;
        }
        var lengtHis = arr.length > 19 ? 19 : arr.length;
        for(var i =  0; i <  lengtHis ; i++){
            this.arrHisSoiCau.push(arr[i]);
        }
        this.drawHat(this.arrHisSoiCau);
        this.lbl_Phien.setString("Phiên gần đây nhất (#" + idvan + ")");
        this.lbl_last.setString( " " + (arr[0][0]+ arr[0][1] + arr[0][2]).toString() + "(" + arr[0][0].toString() +"-"+ arr[0][1].toString()+"-"+arr[0][2].toString()+")" );
        this.lbl_last.setPosition(170+this.lbl_Phien.getContentSize().width, 478);
        this.onSoiCauBac(arr);

    },
    onSoiCauBac:function (arr) {
        this.arrHisSoiCauBacc = arr;

        //  var arrTest = [1,1,1,1,1,1,2,1,1,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,1,1,12,1,1,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,1,1,12,1,1,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,1,1,12,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,1,1,12,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,1,1,12,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,1,1,12,1,1,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,1];
        this.arrHisSoiCauBacc.reverse();
        this.drawSoiCauUnder(this.arrHisSoiCauBacc,null,null);
        this.drawSoiCauBaccarat(this.arrHisSoiCauBacc,null,null);
    },
    onResuftSoiCauBar:function (itemXuc) {
        if(this.arrHisSoiCauBacc.length < 0){
            return;
        }
        this.arrHisSoiCauBacc.splice(this.arrHisSoiCauBacc.length,0,itemXuc);

        this.drawSoiCauUnder(this.arrHisSoiCauBacc,null,null);
        this.drawSoiCauBaccarat(this.arrHisSoiCauBacc,null,null);
    },

    drawHat:function (arrNum) {
        this.drawNodeHat1.clear();
        this.drawNodeHat2.clear();
        this.drawNodeHat3.clear();
        arrNum.reverse();

        if(arrNum.length<0){
            return;
        }
        this.drawnodeTongHat.clear();
        this.drawnodeTongHat.removeAllChildren();





        for(var i = 0; i < arrNum.length-1; i++){
            // var yNew = arrNum[i] - 3 ;

        }



        for(var i = 0; i < arrNum.length-1; i++){

            var tong1 = arrNum[i][0] +  arrNum[i][1]+ arrNum[i][2];
            var tong2 = arrNum[i+1][0] +  arrNum[i+1][1]+ arrNum[i+1][2];

            this.drawNodeHat1.drawSegment(cc.p(142+i*23 ,48 + (arrNum[i][0]-1)*23),cc.p(142+(i+1)*23 ,48 + (arrNum[i+1][0]-1)*23), 2,cc.color("#54e813"));

            this.drawNodeHat2.drawSegment(cc.p(142+i*23 ,48 + (arrNum[i][1]-1)*23),cc.p(142+(i+1)*23 ,48 + (arrNum[i+1][1]-1)*23), 2,cc.color("#ff8a00"));

            this.drawNodeHat3.drawSegment(cc.p(142+i*23 ,48 + (arrNum[i][2]-1)*23),cc.p(142+(i+1)*23 ,48 + (arrNum[i+1][2]-1)*23), 2,cc.color("#f92a73"));

            this.drawnodeTongHat.drawSegment(cc.p(142+i*23 ,246 + (tong1-3)*7),cc.p(142+(i+1)*23 ,246 + (tong2-3)*7), 2,cc.color("#df4400"));
            var nameDot = "#tx_sc_hat2.png";
            if(tong1>10){
                nameDot = "#tx_sc_hat1.png";
            }
            var spriteDot = new cc.Sprite(nameDot);
            spriteDot.setScale(0.6);
            spriteDot.setPosition(cc.p(142+i*23 ,246 + (tong1-3)*7));
            this.drawnodeTongHat.addChild(spriteDot);


            // this.drawnodeTongHat.drawSegment(cc.p(80+i*27 ,278 + (arrNum[i]-1)*27),cc.p(80+(i+1)*27 ,278 + (arrNum[i+1]-1)*27), 2,cc.color(255,153,0,255));


        }
        var nameDotLast = "#tx_sc_hat2.png";
        var tongLast = arrNum[arrNum.length-1][0] +arrNum[arrNum.length-1][1]+arrNum[arrNum.length-1][2];

        if(tongLast>10){
            nameDotLast = "#tx_sc_hat1.png";
        }
        var spriteDotLast = new cc.Sprite(nameDotLast);
        spriteDotLast.setScale(0.6);
        spriteDotLast.setPosition(cc.p(142+(arrNum.length-1)*23  ,246 + (tongLast-3)*7));
        this.drawnodeTongHat.addChild(spriteDotLast,1);
        var  ictx_last  = new cc.Sprite("#ictx_last.png");
        ictx_last.runAction(new cc.RepeatForever(new cc.Sequence(new cc.ScaleTo(0.8,0.5), new cc.ScaleTo(0.8,1.1))));
        ictx_last.setPosition(spriteDotLast.getPosition());
        this.drawnodeTongHat.addChild(ictx_last);

        arrNum.reverse();

    },

    drawHatReconnect:function (result) {
        this.batSprite.setVisible(false);
        this.diskNode.removeAllChildren();
        var nodeXucXac = this.createXucXac(result);
        this.diskNode.addChild(nodeXucXac);
    },
    _addResultSprite: function (result,typeCua, isForce) {
        /* add result */
        this.batSprite.setVisible(this.isNan);
        var totalDiem = 0;
        for (var i = 0; i < 3; i++) {
            totalDiem += result[i];

        }
        if(isForce){
            this.batSprite.setVisible(false);
        }else {

            var nodeXucXac = this.createXucXac(result);
            this.diskNode.addChild(nodeXucXac);
        }
        var isEff = !this.isNan;
        if(isForce){
            isEff = true;
        }
        this.xiuLbl.setString("");
        this.taiLbl.setString("");
        if(typeCua == TX_CUA_TAI){
            this.taiLbl.setString(totalDiem.toString());
            // this.bgtaiLbl.setVisible(true);

            this.runEffectKetQua(isEff, true,1);

            if(this.isNan && !isForce){
                this.bgtaiLbl.setVisible(false);
                this.bg_win_tai.setVisible(false);
            }


        }else{
            this.xiuLbl.setString(totalDiem.toString());
            // this.bgxiuLbl.setVisible(true);

            this.runEffectKetQua(isEff, false,1);
            if(this.isNan  && !isForce){
                this.bgxiuLbl.setVisible(false);
                this.bg_win_xiu.setVisible(false);
            }

        }

    },
    setTextTaiXiu:function (name) {
        var sprite = new cc.Sprite(name);
        sprite.setPosition(this.bg.getContentSize().width/2,this.bg.getContentSize().height/2);
        this.bg.addChild(sprite);
        sprite.runAction(new cc.Sequence(
            new cc.DelayTime(2),
            new cc.CallFunc(function () {
                sprite.removeFromParent(true);
            })
        ));
    },
    setMoneyBet:function (money) {
        this.moneyBet = money;
        this.moneyTF.setText(cc.Global.NumberFormat1(this.moneyBet));
    },

    initDisk: function () {
        var thiz = this;
        var diskSprite = new cc.Sprite("#mntx_dia.png");
        diskSprite.setPosition(this.bg.width/2 - 20 , 175);
        // diskSprite.setScale(0.7);
        this.bg.addChild(diskSprite,10);
        this.diskSprite = diskSprite;
        var diskNode = new cc.Node();
        diskSprite.addChild(diskNode);
        this.diskNode = diskNode;

        var batSprite = new cc.Sprite("#mntx_bat.png");
        this.batSpritePosition = cc.p(diskSprite.getContentSize().width / 2, diskSprite.getContentSize().height / 2);
        batSprite.setPosition(this.batSpritePosition);
        this.preTouchPoint = cc.p(0,0);
        this.batSprite = batSprite;
        this.batSprite.setVisible(false);
        diskSprite.addChild(batSprite);

        this.canTouchBat = false;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if (thiz.canTouchBat ) {
                    var p = batSprite.convertToNodeSpace(touch.getLocation());
                    // var rect = this.getBoundingBox();
                    if (cc.rectContainsPoint( cc.rect(0, 0, batSprite.getContentSize().width, batSprite.getContentSize().height), p)) {
                        this.isTouched = true;
                        this.isMoved = false;
                        thiz.preTouchPoint = touch.getLocation();
                        return true;
                    }
                }
                return false;
            },
            onTouchEnded: function (touch, event) {

            },
            onTouchMoved: function (touch, event) {
                var p = touch.getLocation();


                batSprite.x += (p.x - thiz.preTouchPoint.x)/batSprite.getParent().getScale();
                batSprite.y += (p.y - thiz.preTouchPoint.y)/batSprite.getParent().getScale();
                thiz.preTouchPoint = p;

                var distance = cc.pDistance(thiz.batSpritePosition,batSprite.getPosition());
                // cc.log("aaa"+distance);
                if(distance>300){
                    thiz.batSprite.setVisible(false);
                    if(thiz.taiLbl.getString() == ""){
                        thiz.bgxiuLbl.setVisible(true);
                        thiz.bg_win_xiu.setVisible(true);
                    }else {
                        thiz.bgtaiLbl.setVisible(true);
                        thiz.bg_win_tai.setVisible(true);
                    }

                }

            }
        }, batSprite);


    },

    shakeDisk: function () {
        this.diskNode.removeAllChildren(true);
        this.diskSprite.stopAllActions();
        this.batSprite.stopAllActions();

        // this.hideHistory();

        var thiz = this;
        // this.batSprite.runAction(new cc.MoveTo(1.0, this.batSpritePosition));
        // this.diskSprite.runAction(new cc.Sequence(
        //     // new cc.EaseSineOut(new cc.MoveTo(1.0, cc.p(cc.winSize.width / 2, cc.winSize.height / 2))),
        //     new cc.DelayTime(0.2),
        //     new ext.ActionShake2D(3.0, cc.p(10.0, 10.0))
        // ));
    },

    openDisk: function (isEffect) {
        var thiz = this;


        this.canTouchBat = this.isNan;

        return;

        if(isEffect)
        {
            //SoundPlayer.playSound(["bellopen", "mobat"]);
            //this.diskNode.removeAllChildren(true);
            this.diskSprite.stopAllActions();
            this.batSprite.stopAllActions();
            /* mở bát */
            // this.batSpritePosition = this.batSprite.getPosition();
            if(!thiz.isNan){
                this.batSprite.runAction(new cc.Sequence(
                    new cc.EaseSineIn(new cc.MoveBy(1.0, cc.p(0.0, 200.0))),
                    new cc.DelayTime(2.5),
                    new cc.CallFunc(function () {
                        thiz.closeDisk(true);
                    })
                ));
            }else {
                this.batSprite.runAction(new cc.Sequence(
                    new cc.DelayTime(4),
                    new cc.EaseSineIn(new cc.MoveTo(1.0, cc.p(thiz.batSpritePosition.x, 340.0))),
                    // new cc.DelayTime(2.5),
                    new cc.CallFunc(function () {
                        if(thiz.taiLbl.getString() == ""){
                            thiz.bgxiuLbl.setVisible(true);
                            // thiz.bg_win_xiu.setVisible(true);
                            thiz.runEffectKetQua(true, true,0);
                        }else {
                            thiz.bgtaiLbl.setVisible(true);
                            // thiz.bg_win_tai.setVisible(true);
                            thiz.runEffectKetQua(true, false,0);
                        }
                    })
                ));
            }

        }
        else{
            this.diskSprite.stopAllActions();
            this.batSprite.stopAllActions();
            this.batSprite.setPosition(cc.p(0.0, 340.0));
        }

    },

    closeDisk:function (isEffect) {
        var thiz = this;


        this.batSprite.setVisible(false);
        thiz.bgtaiLbl.setVisible(false);
        thiz.bgxiuLbl.setVisible(false);


        this.diskSprite.stopAllActions();
        this.batSprite.stopAllActions();
        this.batSprite.setPosition(thiz.batSpritePosition);
        return;
        if(isEffect){
            this.batSprite.runAction(new cc.EaseSineOut(new cc.MoveTo(1, thiz.batSpritePosition)));
            this.diskSprite.runAction(new cc.Sequence(
                new cc.DelayTime(1),
                new cc.CallFunc(function () {
                    thiz.bgtaiLbl.setVisible(false);
                    thiz.bgxiuLbl.setVisible(false);
                    // thiz.diskSprite.runAction(new cc.EaseSineOut(new cc.ScaleTo(0.7, 1.0)));

                })

                //  new cc.EaseSineOut(new cc.ScaleTo(1, 0.34,0.34))

            ));
        }
        else{
            thiz.diskSprite.setScale(1.0);
            this.batSprite.setPosition(thiz.batSpritePosition);
        }

    },

    resetGame:function () {
        this.btnTai.setTouchEnabled(true);
        this.btnXiu.setTouchEnabled(true);
        this.isEnableBetting = true;

        this.txtXiu.setPlaceHolder("ĐẶT");
        this.txtTai.setPlaceHolder("ĐẶT");
        // this.txtXiu.setText("");
        // this.txtTai.setText("");
        this.betXiuSave = "0";
        this.betTaiSave = "0";
        this.lblTai.setString("0");
        this.lblXiu.setString("0");
        this.lblTotalTai.setString("0");
        this.lblTotalXiu.setString("0");

        // this.spriteAni.setVisible(false);
        this.stopTime();
        this.bgtaiLbl.setVisible(false);
        this.bgxiuLbl.setVisible(false);
        this.lblCanCua.setVisible(false);
        // this.bg_win_tai.setVisible(false);
        // this.bg_win_xiu.setVisible(false);
        this.runEffectKetQua(false, true,0);
        this.canTouchBat = false;
        this.lblNumTai.setString("(0)");
        this.lblNumXiu.setString("(0)");
        this.batSprite.setPosition(cc.p(this.diskSprite.getContentSize().width / 2, this.diskSprite.getContentSize().height / 2));
    },

    showEffectNumber:function () {
        // this.spriteAni.setVisible(true);
        // cc.log("==================" + this.wgResuft.getChildrenCount());
        // this.spriteAni.setPosition(this.wgResuft.getPositionX()/2 + 20 + (this.wgResuft.getChildrenCount()-1)*50 , this.wgResuft.getPositionY() );

    },
    hiddenEffectNumber:function () {
        // this.spriteAni.setVisible(false);
    },
    createAnimationNumber:function () {
        return;
        var spriteAni = new cc.Sprite("#mntx_bg_itemselect.png");
        spriteAni.setPosition(this.wgResuft.getPositionX()/2 + (this.wgResuft.getChildrenCount()-1)*50 , this.wgResuft.getPositionY() );
        this.bg.addChild(spriteAni);
        spriteAni.setVisible(false);
        this.spriteAni = spriteAni;
        var lbl = new cc.LabelTTF("10",cc.res.font.Roboto_CondensedBold,20);
        lbl.setPosition(spriteAni.getContentSize().width/2, spriteAni.getContentSize().height/2);
        lbl.runAction(new cc.RepeatForever( new cc.Sequence(
            new cc.DelayTime(0.2),
            new cc.CallFunc(function () {
                var number = Math.floor(3 + Math.random()*18);
                if(number>10){
                    lbl.setColor(cc.color(0,204,255,255));

                }
                else{
                    lbl.setColor(cc.color(255,222,0,255));
                }
                lbl.setString(number);
            })
            )
        ));
        spriteAni.addChild(lbl);
    },
    drawResuft:function (arrNumer) {
        var thiz = this;
    },
    pushItemHistory:function (index,data,isLast,isEffect) {
        var thiz = this;
        // var lbl = new cc.LabelTTF (data.number, cc.res.font.Roboto_CondensedBold, 20);
        // var bgText = new cc.Sprite("#mntx_bg_hisItem.png");

        var nameTai = "tx_ls1.png";
        if(data.type == TX_CUA_XIU){

            nameTai  = "tx_ls2.png";
        }
        var bgText = new ccui.Button(nameTai,"","",ccui.Widget.PLIST_TEXTURE);
        bgText.addClickEventListener(function () {
            thiz.handleHistoryPhien(data);
        });
       
        if(isEffect && !isLast){
            bgText.setPosition(cc.p(40+(index+1)*50, this.wgResuft.getContentSize().height/2));
            bgText.runAction(new cc.EaseSineInOut(new cc.MoveTo(0.25,cc.p(40+index*30, this.wgResuft.getContentSize().height/2))));

        }else {
            bgText.setPosition(cc.p(40+index*30, this.wgResuft.getContentSize().height/2));
        }

        if(isLast){
            if(isEffect){
                bgText.setVisible(false);
                bgText.runAction(new cc.Sequence(new cc.DelayTime(0.3), new cc.CallFunc(function () {
                    bgText.setVisible(true);
                })));
            }
            bgText.runAction(new cc.RepeatForever(new cc.Sequence(new cc.EaseSineInOut(new cc.MoveTo(0.4,cc.p(bgText.x,45))), new cc.EaseSineInOut(new cc.MoveTo(0.4,cc.p(bgText.x,18))) )));
        }


        this.wgResuft.addChild(bgText);
    },
    handleHistoryPhien:function (data) {
        var id = data["idVan"];
        var chitietphoenpop = new ChiTietPhienLayer(id);
        chitietphoenpop.show();
        // cc.log(id);
        // var aa = new HistoryPhien(data);
        //   aa.showWithAnimationScale();
    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    },
    initChip: function (centerPosition) {

        var thiz = this;

        for(var i = 1; i < 6;i++)
        {
            (function () {
                var iNew = i;
                var chip1 = new ccui.Button("mm_btn"+iNew+"_2.png","mm_btn"+iNew+"_1.png","",ccui.Widget.PLIST_TEXTURE);
                chip1.setTitleText("+"+  cc.Global.NumberFormat2(s_money_betEx[iNew-1]));
                chip1.setTitleFontName(cc.res.font.Roboto_CondensedBold);
                chip1.setTitleFontSize(30);
                chip1.setPosition(s_miniGame_chip_position[iNew-1]);
                chip1.addClickEventListener(function () {
                    thiz.handleChip(iNew-1);
                });
                thiz.addChild(chip1,1);

            })();
        }


    },

    handleChip:function (index) {
        cc.log(index);
        this.moneyBet += s_money_betEx[index];
        if(this.moneyBet > PlayerMe.gold)
        {
            this.moneyBet = PlayerMe.gold;
        }
        this.setMoneyBet(this.moneyBet);
    },
    update: function (dt) {
        if(this._isUpdateTime){
            this.timer -= dt;
            if(this.timer>0){
                this.setTimeFomat();
            }
            else {
                this.stopTime();
            }
        }
        if(this.timeDelayChat > 0){
            this.isChatEnable = false;
            this.timeDelayChat -= dt;
        }else {
            this.isChatEnable = true;
        }
        // this.diskSprite.setPosition(this.bg.getContentSize().width / 2+4 , this.bg.getContentSize().height/2+2 );

    },
    startTime:function (time) {
        this.lblTime.setColor(cc.color("#ffffff"));
        this.lblTime.setOpacity(255);
        this._isUpdateTime = true;
        this.timer = time;
        this.bg_timer.setVisible(false);
        this.lblTime.setVisible(true);
        // this.tx_bg_time.setVisible(true);
    },

    startTimeUnder:function (time) {
        // this.lblTime.setColor(cc.color("#927c56"));
        // this.lblTime.setOpacity(255);
        cc.log("time ======== " + time);
        this._isUpdateTime = true;
        this.timer = time;
        this.bg_timer.setVisible(true);
        this.lblTime.setVisible(false);
        // this.tx_bg_time.setVisible(false);
    },

    stopTime:function () {
        // this.lblTime.setColor(cc.color("#da8120"));
        this._isUpdateTime = false;
        this.timer = 0;
        this.lblTime.stopAllActions();
        this.lblTime.setString("");
        this.isCountDownSound = false;
    },
    setTimeFomat:function () {
        this.lblTime.setPosition(this.diskSprite.getPosition());
        var number = Math.floor(this.timer);
        var minute = Math.floor(number/60);
        var second = number - minute*60;
        var stringSecon = (second > 9)?second:"0"+second;
        var stringTime = "0" + minute + ":" + stringSecon;
        this.lblTime.setString(stringTime);
        this.lblTimeUnder.setString(stringTime);
        if(this.isCountDownSound && number <= 5)
        {
            this.lblTime.setColor(cc.color("#ff0000"));
            this.lblTime.runAction(new cc.RepeatForever(
                new cc.Sequence(
                    new cc.FadeTo(0.2,50),
                    new cc.FadeTo(0.2,255)
                )
            ));
            this.isCountDownSound = false;
            this.playSoundBip();
        }
    },
    playSoundBip:function () {
        this.lblTime.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.CallFunc(function () {
                    //  SoundPlayer.playSound("countDownS");
                }),
                new cc.DelayTime(1)
            )
        ));
    },
    onEnter: function () {
        this._super();
        this.scheduleUpdate();
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
    },

    initController: function () {
        this._controller = new ChanLeController(this);
    }
});


