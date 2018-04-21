/**
 * Created by Balua on 7/19/17.
 */

var GIFTCODE_FEE = 0.0;


var _thuhang = ["1", "2->3", "4->10", "11->20", "21->50", "51->100"];
var _phanthuong = ["20,000", "10,000", "5,000", "2,000", "1,000", "500"];

var GiftCodeTimerLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        this._isUpdateTimeGiftCode = false;
        this.setVisible(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        var bg_countdownGiftcode = new cc.Sprite("#home_giftcode_bgcount.png");
        this.setContentSize(bg_countdownGiftcode.getContentSize());
        bg_countdownGiftcode.setPosition(this.width/2, this.height/2);
        this.addChild(bg_countdownGiftcode);
        this.bg_countdownGiftcode = bg_countdownGiftcode;

        var lb_countdownGiftcode = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, "");
        lb_countdownGiftcode.setPosition(this.width/2, this.height/2);
        this.addChild(lb_countdownGiftcode);
        this.lb_countdownGiftcode = lb_countdownGiftcode;
    },

    _sendRequestGetGiftcodeTimer : function () {
        var request = {
            a : 1607,
            c : "game",
            g : "gift_hunting"
        };
        SocketClient.getInstance().send(request);
    },

    _onSocketStatus: function (cmd, data) {
        if (data === "Connected") {
            this._sendRequestGetGiftcodeTimer();
        }
    },

    _onTimeGiftCode : function (cmd, data) {
        var time = data["data"]["1"];
        this.setVisible(false);
        if(time && time > 0) {
            this.setVisible(true);
            this.timerGiftcode = time;
            this._isUpdateTimeGiftCode = true;
        }
    },

    stopTime:function () {
        this._isUpdateTimeGiftCode = false;
        this.timerGiftcode = 0;
        this.lb_countdownGiftcode.setString("");
        this.setVisible(false);
    },

    setTimeFomat:function () {
        var number = Math.floor(this.timerGiftcode);
        var hour = Math.round(number/(60*60));


        var stringHour = (hour > 9)?hour:"0"+hour;

        var minute = Math.floor((number/60) % 60);
        var stringMinus = (minute > 9)?minute:"0"+minute;

        var second = number%60;

        var stringSecon = (second > 9)?second:"0"+second;
        var stringTime = stringHour + ":" + stringMinus + ":" + stringSecon;
        this.lb_countdownGiftcode.setString(stringTime);
    },

    update: function (dt) {
        if(this._isUpdateTimeGiftCode){
            this.timerGiftcode -= dt;
            if(this.timerGiftcode > 0){
                this.setTimeFomat();
            }
            else {
                this.stopTime();
            }
        }
    },

    onEnter: function () {
        this._super();
        this.timerGiftcode = 0;
        this.scheduleUpdate();
        SocketClient.getInstance().addListener("1607", this._onTimeGiftCode, this);

        if(SocketClient.getInstance().isConnected()){
            this._sendRequestGetGiftcodeTimer();
        }
        else{
            SocketClient.getInstance().addListener("LobbyStatus", this._onSocketStatus, this);
        }
    },
    
    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
        this.unscheduleUpdate();
    }
});

var GiftCodeLayer = Dialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        this.initWithSize(cc.size(1095, 584));
        this.title.setString("GIFTCODE");
        this._paddingBottom = 30;


        var bg_tab = new ccui.Scale9Sprite("home_shop_bg_tab.png", cc.rect(50, 0, 4, 72));
        bg_tab.setPreferredSize(cc.size(773, 72));
        bg_tab.setPosition(cc.p(this.width/2, this.height - 53));
        this.addChild(bg_tab);

        var giftcodeTimer = new GiftCodeTimerLayer();
        giftcodeTimer.setPosition(cc.p(95, bg_tab.height + 12));
        bg_tab.addChild(giftcodeTimer, 30);

        var _tabGiftCodeName = ["Săn\ngiftcode", "Nạp\ngiftcode", "Tạo\ngiftcode", "Quản lý\ngiftcode"];
        var _tabGiftCodePos = [100, 293, 485, 672];


        var mToggle = new ToggleNodeGroup();
        bg_tab.addChild(mToggle);
        this.mToggle = mToggle;

        this.allLayer = [new SanGiftCodeLayer(this.getContentSize()), new NapGiftCodeLayer(this.getContentSize()), new TaoGiftCodeLayer(this.getContentSize()), new QuanLyGiftCodeLayer(this.getContentSize())];
        for(var i = 0; i < this.allLayer.length; i++)
        {
            this.addChild(this.allLayer[i], 1);
        }


        var tab_select = new cc.Sprite("#home_shop_tab_select.png");
        bg_tab.addChild(tab_select);


        for(var i = 0; i < _tabGiftCodeName.length; i++)
        {
            (function () {

                var _btnTab = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, _tabGiftCodeName[i].toUpperCase(), cc.TEXT_ALIGNMENT_CENTER);
                _btnTab.setPosition(cc.p(_tabGiftCodePos[i], bg_tab.height/2));
                bg_tab.addChild(_btnTab);


                var mNode = thiz.allLayer[i];

                var toggleItem = new ToggleNodeItem(tab_select.getContentSize());
                toggleItem.setAnchorPoint(cc.p(0.5, 0.5));
                toggleItem.setPosition(_btnTab.getPosition());
                mToggle.addItem(toggleItem);

                toggleItem.onSelect = function (force) {
                    tab_select.setPosition(_btnTab.getPosition());
                    // _btnTab.setScale(1.05);
                    _btnTab.setColor(cc.color("#5b391a"));
                    mNode.setVisible(true);
                };
                toggleItem.onUnSelect = function () {
                    _btnTab.setColor(cc.color("#a59f9a"));
                    // _btnTab.setScale(1.0);
                    mNode.setVisible(false);
                }
            })();

        }


    },

    // onClickBack : function () {
    //     var qlygifcodelayer = this.allLayer[3];
    //     if(qlygifcodelayer.isVisible())
    //     {
    //         if(qlygifcodelayer.mainNode.isVisible())
    //         {
    //             return false;
    //         }
    //         else
    //         {
    //             qlygifcodelayer.setHiddenDetail(false);
    //             return true;
    //         }
    //     }
    //     return false;
    // },
    //
    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);

        //get get_giftcode_fee
        SocketClient.getInstance().addHTTPListener("get_giftcode_fee", this.onGetGiftCodeFee, this);
        this.sendRequestGetGiftcodeFee();
    },

    sendRequestGetGiftcodeFee : function () {
        var request = {
            command : "get_giftcode_fee"
        };
        SocketClient.getInstance().sendHttpGetRequest(request);
    },

    onGetGiftCodeFee : function (cmd, data) {
        cc.log("giftcode + " + data);
        if(data && data["status"] === 0){
            GIFTCODE_FEE = data["data"];
        }
    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    seltecTab : function (tabindex) {
        this.mToggle.selectItem(tabindex);
    },

    setTextFieldGiftcode : function (magiftcode) {

        if(this.allLayer[1]._maGiftCode)
        {
            this.allLayer[1]._maGiftCode.setString(magiftcode);
        }

    }
});

var SanGiftCodeLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);

        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg.setAnchorPoint(cc.p(0.5, 0));
        forebg.setPreferredSize(cc.size(1054, 482));
        forebg.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg, 1);
        this.forebg = forebg;



        var bg_mota = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        bg_mota.setPreferredSize(cc.size(486, 344));
        bg_mota.setAnchorPoint(cc.p(0.0, 0.0));
        bg_mota.setPosition(cc.p(513, 107));
        this.forebg.addChild(bg_mota);



        // var lb_note = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Thể lệ");
        // lb_note.setPosition(cc.p(forebg.width, 560));
        // forebg.addChild(lb_note);
        //
        var lb_mota = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Thời gian diễn ra: 12h và 20h các ngày Thứ 3, 5, 7, CN.\n" +
        "Thời gian mỗi phiên chơi: 5 phút\n" +
        "Nội dung:" +
            "Trong thời gian diễn ra phiên chơi săn GiftCode người chơi được " +
        "tặng 20 lượt quay, quay mỗi lượt được một số lượng\n" +
        "(đồng tiền nhưng chỉ có giá trị trong phiên chơi), " +
        "kết thúc thời gian phiên chơi TOP 100 người chơi có điểm " +
        "cao nhất sẽ nhận được GiftCode quà tặng từ NPH như sau", cc.TEXT_ALIGNMENT_LEFT, 460);
        lb_mota.setPosition(cc.p(bg_mota.width/2, bg_mota.height/2));
        bg_mota.addChild(lb_mota);


        var btn_sanngay = new ccui.Button("home_giftcode_btnsanngay.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_sanngay.setPosition(cc.p(778, 58));
        forebg.addChild(btn_sanngay);
        btn_sanngay.addClickEventListener(function () {
            SceneNavigator.replaceScene(new AoeGiftCode(1,false));
        });



        var bg_tit = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        bg_tit.setPreferredSize(cc.size(419, 57));
        bg_tit.setPosition(cc.p(56, 414));
        bg_tit.setAnchorPoint(cc.p(0.0, 0.0));
        forebg.addChild(bg_tit);


        var m_tile_sangiftcode = ["Thứ hạng", "Giải thưởng"];
        var m_pos_sangiftcode = [39, 245];

        for(var i = 0; i < m_tile_sangiftcode.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, m_tile_sangiftcode[i].toUpperCase());
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(m_pos_sangiftcode[i], bg_tit.height/2));
            bg_tit.addChild(m_lb);
        }


        var mList = new newui.TableView(cc.size(419, 387), 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setPadding(10);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(56, 10));
        forebg.addChild(mList);
        this.mList = mList;


        for(var i = 0; i < _thuhang.length; i++){
            this.addItemList(_thuhang[i], _phanthuong[i]);
        }

    },

    addItemList : function (thuhang, giaithuong) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(419, 57));

        var bg_tit = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        bg_tit.setPreferredSize(container.getContentSize());
        bg_tit.setPosition(cc.p(container.width/2, container.height/2));
        container.addChild(bg_tit);

        var lb_thuhang = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, thuhang);
        lb_thuhang.setPosition(cc.p(91, bg_tit.height/2));
        bg_tit.addChild(lb_thuhang);


        var lb_giaithuong = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, giaithuong);
        lb_giaithuong.setColor(cc.color("#ffd201"));
        lb_giaithuong.setPosition(cc.p(309, bg_tit.height/2));
        bg_tit.addChild(lb_giaithuong);

        this.mList.pushItem(container);
    }
});

var NapGiftCodeLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);

        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg.setAnchorPoint(cc.p(0.5, 0));
        forebg.setPreferredSize(cc.size(1054, 482));
        forebg.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg, 1);
        this.forebg = forebg;

        var lb_hdan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Like và theo dõi Fanpage để nhận được nhiều code có giá trị!");
        lb_hdan.setPosition(cc.p(forebg.width/2, 397));
        forebg.addChild(lb_hdan);


        var tf_maGiftCode = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_maGiftCode.setPreferredSize(cc.size(407, 68));
        tf_maGiftCode.setPosition(forebg.width/2, 333);
        forebg.addChild(tf_maGiftCode);


        var tf_giftCodeCapcha = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_giftCodeCapcha.setPreferredSize(cc.size(165, 68));
        tf_giftCodeCapcha.setPosition(405, 249);
        forebg.addChild(tf_giftCodeCapcha);


        var bg_capcahview = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        bg_capcahview.setPreferredSize(cc.size(165, 68));
        bg_capcahview.setPosition(584, tf_giftCodeCapcha.y);
        forebg.addChild(bg_capcahview);




        var _maGiftCode = new newui.EditBox(cc.size(tf_maGiftCode.getContentSize().width - 6, tf_maGiftCode.getContentSize().height - 2));
        _maGiftCode.setFont(cc.res.font.Roboto_CondensedBold, 20);
        _maGiftCode.setPlaceholderFont(cc.res.font.Roboto_CondensedBold, 20);
        _maGiftCode.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        _maGiftCode.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        _maGiftCode.setFontColor(cc.color("#525252"))
        _maGiftCode.setPlaceholderFontColor(cc.color("#525252"));
        _maGiftCode.setPlaceHolder("Nạp Giftcode");
        _maGiftCode.setPosition(cc.p(tf_maGiftCode.x + 3, tf_maGiftCode.y + 1));
        forebg.addChild(_maGiftCode, 1);
        this._maGiftCode = _maGiftCode;


        var _giftCodeCapcha = new newui.TextField(cc.size(tf_giftCodeCapcha.getContentSize().width - 6, tf_giftCodeCapcha.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_16);
        _giftCodeCapcha.setAlignment(0);
        _giftCodeCapcha.setPlaceHolder("Nhập mã");
        _giftCodeCapcha.setTextColor(cc.color("#525252"));
        _giftCodeCapcha.setPlaceHolderColor(cc.color("#525252"));
        _giftCodeCapcha.setMaxLength(5);
        _giftCodeCapcha.setPosition(cc.p(tf_giftCodeCapcha.x + 3, tf_giftCodeCapcha.y + 1));
        forebg.addChild(_giftCodeCapcha,1);
        this._giftCodeCapcha = _giftCodeCapcha;


        var captchaView = new ImageCaptcha();
        captchaView.setScale(1.2);
        captchaView.setPosition(cc.p(bg_capcahview.width/2, bg_capcahview.height/2));
        bg_capcahview.addChild(captchaView);
        this.captchaView = captchaView;


        var btn_gicoderefresh = new ccui.Button("home_signup_refresh.png","","", ccui.Widget.PLIST_TEXTURE);
        btn_gicoderefresh.setPosition(cc.p(706, tf_giftCodeCapcha.y));
        btn_gicoderefresh.addClickEventListener(function () {
           captchaView.sendGetCapcha();
        });
        forebg.addChild(btn_gicoderefresh);


        var btn_giftcodexn = new ccui.Button("home_giftcode_btnnap.png","","", ccui.Widget.PLIST_TEXTURE);
        btn_giftcodexn.setPosition(cc.p(forebg.width/2, 135));
        btn_giftcodexn.addClickEventListener(function () {
            var macode = _maGiftCode.getString();
            var macapchar = _giftCodeCapcha.getText();
            if(macode.length === 0)
            {
                MessageNode.getInstance().show("Bạn chưa nhập mã giftcode !");
                return;
            }
            if(macapchar.length === 0)
            {
                MessageNode.getInstance().show("Bạn chưa nhập mã xác nhận !");
                return;
            }

            var request = {
                command : "use_giftcode",
                code : macode,
                captchaAnswer : macapchar,
                captchaKey : captchaView.captchaKey

            };

            SocketClient.getInstance().sendHttpGetRequest(request);
        });
        forebg.addChild(btn_giftcodexn);

    },
    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("use_giftcode", this.receiveData, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);

    },
    receiveData : function (cmd, data) {

        this._giftCodeCapcha.setText("");
        this.captchaView.sendGetCapcha();
        if(data["status"] === 0)
        {
            this._maGiftCode.setString("");
            MessageNode.getInstance().show("Chúc mừng bạn đã nạp giftcode thành công !");
        }
    }


});

var TaoGiftCodeLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);


        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg.setAnchorPoint(cc.p(0.5, 0));
        forebg.setPreferredSize(cc.size(1054, 482));
        forebg.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg, 1);
        this.forebg = forebg;



        this.contentopt = "";

        var tfbg_tensukien = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tfbg_tensukien.setPreferredSize(cc.size(407, 68));
        tfbg_tensukien.setAnchorPoint(cc.p(0.0, 0.5));
        tfbg_tensukien.setPosition(74, 372);
        forebg.addChild(tfbg_tensukien);


        var tfbg_gtriGiftCode = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tfbg_gtriGiftCode.setPreferredSize(cc.size(407, 68));
        tfbg_gtriGiftCode.setAnchorPoint(cc.p(0.0, 0.5));
        tfbg_gtriGiftCode.setPosition(74, 298);
        forebg.addChild(tfbg_gtriGiftCode);


        var tfbg_soluong = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tfbg_soluong.setPreferredSize(cc.size(407, 68));
        tfbg_soluong.setAnchorPoint(cc.p(0.0, 0.5));
        tfbg_soluong.setPosition(74, 225);
        forebg.addChild(tfbg_soluong);


        var tfbg_ngayhethan = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tfbg_ngayhethan.setPreferredSize(cc.size(407, 68));
        tfbg_ngayhethan.setAnchorPoint(cc.p(0.0, 0.5));
        tfbg_ngayhethan.setPosition(74, 151);
        forebg.addChild(tfbg_ngayhethan);


        var tf_tensukien = new newui.TextField(cc.size(tfbg_tensukien.getContentSize().width - 6, tfbg_tensukien.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        tf_tensukien.setAlignment(0);
        tf_tensukien.setPlaceHolder("Tên sự kiện");
        tf_tensukien.setTextColor(cc.color("#525252"));
        tf_tensukien.setPlaceHolderColor(cc.color("#525252"));
        tf_tensukien.setMaxLength(32);
        tf_tensukien.setAnchorPoint(cc.p(0.0, 0.5));
        tf_tensukien.setPosition(cc.p(tfbg_tensukien.x + 3, tfbg_tensukien.y + 1));
        forebg.addChild(tf_tensukien,1);
        this.tf_tensukien = tf_tensukien;


        var tf_gtriGiftCode = new newui.TextField(cc.size(tfbg_gtriGiftCode.getContentSize().width - 6, tfbg_gtriGiftCode.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        tf_gtriGiftCode.setAlignment(0);
        tf_gtriGiftCode.setPlaceHolder("Giá trị giftcode");
        tf_gtriGiftCode.setTextColor(cc.color("#525252"));
        tf_gtriGiftCode.setPlaceHolderColor(cc.color("#525252"));
        tf_gtriGiftCode.setMaxLength(32);
        tf_gtriGiftCode.setAnchorPoint(cc.p(0.0, 0.5));
        tf_gtriGiftCode.setPosition(cc.p(tfbg_gtriGiftCode.x + 3, tfbg_gtriGiftCode.y + 1));
        forebg.addChild(tf_gtriGiftCode,1);
        this.tf_gtriGiftCode = tf_gtriGiftCode;



        var tf_soluong = new newui.TextField(cc.size(tfbg_soluong.getContentSize().width - 6, tfbg_soluong.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        tf_soluong.setAlignment(0);
        tf_soluong.setPlaceHolder("Số lượng");
        tf_soluong.setTextColor(cc.color("#525252"));
        tf_soluong.setPlaceHolderColor(cc.color("#525252"));
        tf_soluong.setMaxLength(3);
        tf_soluong.setAnchorPoint(cc.p(0.0, 0.5));
        tf_soluong.setPosition(cc.p(tfbg_soluong.x + 3, tfbg_soluong.y + 1));
        forebg.addChild(tf_soluong,1);
        this.tf_soluong = tf_soluong;




        var tf_mngayhethan = new newui.TextField(cc.size(tfbg_ngayhethan.getContentSize().width - 6, tfbg_ngayhethan.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        tf_mngayhethan.setAlignment(0);
        tf_mngayhethan.setPlaceHolder("Số ngày hết hạn");
        tf_mngayhethan.setTextColor(cc.color("#525252"));
        tf_mngayhethan.setPlaceHolderColor(cc.color("#525252"));
        tf_mngayhethan.setMaxLength(2);
        tf_mngayhethan.setAnchorPoint(cc.p(0.0, 0.5));
        tf_mngayhethan.setPosition(cc.p(tfbg_ngayhethan.x + 3, tfbg_ngayhethan.y + 1));
        forebg.addChild(tf_mngayhethan,1);
        this.tf_mngayhethan = tf_mngayhethan;



        var _lbtit1 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Giá trị Giftcode: ", cc.TEXT_ALIGNMENT_LEFT);
        _lbtit1.setAnchorPoint(cc.p(0.0, 0.5));
        _lbtit1.setPosition(cc.p(629, 395));
        forebg.addChild(_lbtit1);


        var _lb_gtriGiftCode = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "", cc.TEXT_ALIGNMENT_LEFT);
        _lb_gtriGiftCode.setColor(cc.color("#ffde00"));
        _lb_gtriGiftCode.setAnchorPoint(cc.p(0.0, 0.5));
        _lb_gtriGiftCode.setPosition(cc.p(837, _lbtit1.y));
        forebg.addChild(_lb_gtriGiftCode);
        this._lb_gtriGiftCode = _lb_gtriGiftCode;



        var _lbtit2 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Phí phát hành: ", cc.TEXT_ALIGNMENT_LEFT);
        _lbtit2.setAnchorPoint(cc.p(0.0, 0.5));
        _lbtit2.setPosition(cc.p(_lbtit1.x, 354));
        forebg.addChild(_lbtit2);

        var _lb_phiphathanh = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "", cc.TEXT_ALIGNMENT_LEFT);
        _lb_phiphathanh.setColor(cc.color("#ffde00"));
        _lb_phiphathanh.setAnchorPoint(cc.p(0.0, 0.5));
        _lb_phiphathanh.setPosition(cc.p(_lb_gtriGiftCode.x, _lbtit2.y));
        forebg.addChild(_lb_phiphathanh);
        this._lb_phiphathanh = _lb_phiphathanh;


        var _lbtit3 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Tổng số Bin bị trừ: ", cc.TEXT_ALIGNMENT_LEFT);
        _lbtit3.setAnchorPoint(cc.p(0.0, 0.5));
        _lbtit3.setPosition(cc.p(_lbtit1.x, 315));
        forebg.addChild(_lbtit3);

        var _lb_tongsoXObitru = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "", cc.TEXT_ALIGNMENT_LEFT);
        _lb_tongsoXObitru.setColor(cc.color("#ffde00"));
        _lb_tongsoXObitru.setAnchorPoint(cc.p(0.0, 0.5));
        _lb_tongsoXObitru.setPosition(cc.p(_lb_gtriGiftCode.x, _lbtit3.y));
        forebg.addChild(_lb_tongsoXObitru);
        this._lb_tongsoXObitru = _lb_tongsoXObitru;



        var tf_inputOTP = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_inputOTP.setPreferredSize(cc.size(407, 68));
        tf_inputOTP.setAnchorPoint(cc.p(0.0, 0.5));
        tf_inputOTP.setPosition(567, 251);
        forebg.addChild(tf_inputOTP);



        var _input_otp = new newui.TextField(cc.size(tf_inputOTP.getContentSize().width - 6, tf_inputOTP.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        _input_otp.setAlignment(0);
        _input_otp.setPlaceHolder("Nhập mã OTP");
        _input_otp.setTextColor(cc.color("#525252"));
        _input_otp.setPlaceHolderColor(cc.color("#525252"));
        _input_otp.setMaxLength(6);
        _input_otp.setAnchorPoint(cc.p(0.0, 0.5));
        _input_otp.setPosition(cc.p(tf_inputOTP.x + 3, tf_inputOTP.y + 1));
        forebg.addChild(_input_otp,1);
        this._input_otp = _input_otp;

        var thiz = this;


        var requestfunc = function(){
            var tensukien = tf_tensukien.getText();
            var gtriGiftcode = tf_gtriGiftCode.getText();
            var sluong = tf_soluong.getText();
            var expriedday = tf_mngayhethan.getText();
            var otptext = _input_otp.getText();
            if(tensukien.length === 0)
            {
                MessageNode.getInstance().show("Tên sự kiện không được để trống!");
                return;
            }

            if(gtriGiftcode.length === 0)
            {
                MessageNode.getInstance().show("Bạn chưa nhập giá trị giftcode!");
                return;
            }
            if(sluong.length === 0)
            {
                MessageNode.getInstance().show("Bạn chưa nhập số lượng giftcode!");
                return;
            }
            if(expriedday.length === 0)
            {
                MessageNode.getInstance().show("Bạn chưa nhập số ngày hết hạn!");
                return;
            }

            if(otptext.length === 0)
            {
                MessageNode.getInstance().show("Bạn chưa nhập mã OTP!");
                return;
            }


            var request = {
                command : "create_giftcode",
                event : tensukien,
                value : cc.Global.NumberFromString(gtriGiftcode),
                quantity : cc.Global.NumberFromString(sluong),
                remainDays : expriedday,
                otp : otptext
            };

            SocketClient.getInstance().sendHttpGetRequest(request);
        };


        var btn_giftcodexn = new ccui.Button("home_shop_ck_xacnhan.png","","", ccui.Widget.PLIST_TEXTURE);
        btn_giftcodexn.setPosition(cc.p(660, 140));
        forebg.addChild(btn_giftcodexn);
        btn_giftcodexn.addClickEventListener(function () {
            requestfunc();
        });


        var btn_layotp = new ccui.Button("home_shop_btnlayopt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_layotp.setPosition(cc.p(876, 140));
        forebg.addChild(btn_layotp);
        btn_layotp.addClickEventListener(function () {
            GetOTPDialog.showGetOTPDialog();

        });

        this.tf_gtriGiftCode = tf_gtriGiftCode;
        this.tf_soluong = tf_soluong;
        tf_gtriGiftCode.setFocusListener(function (focus) {
            if(focus){
                // goldCorrectIcon.visible = false;
            }
            else{
                thiz._updateGiftCodeFee();
            }
        });

        tf_gtriGiftCode.setTextChangeListener(function (type, newString) {
            if(newString === ""){
                tf_gtriGiftCode.setText(newString);
            }
            else{
                // /[a-zA-Z]/
                var str = newString.replace(/[.,]/g,'');
                if(cc.Global.IsNumber(str)){
                    var goldInput = parseInt(str);
                    if(goldInput > PlayerMe.gold) {
                        goldInput = PlayerMe.gold;
                    }

                    if(goldInput > 100000)
                    {
                        goldInput = 100000;
                    }
                    tf_gtriGiftCode.setText(cc.Global.NumberFormat1(goldInput));
                }
            }
            thiz._updateGiftCodeFee();
            return true;
        });

        tf_soluong.setFocusListener(function (focus) {
            if(focus){
                // goldCorrectIcon.visible = false;
                var goldInput = cc.Global.NumberFromString(thiz.tf_gtriGiftCode.getText());
                if(goldInput < 5000)
                {
                    goldInput =  5000;
                    tf_gtriGiftCode.setText(cc.Global.NumberFormat1(goldInput));
                    thiz._updateGiftCodeFee();
                }
            }
            else{
                thiz._updateGiftCodeFee();
            }
        });

        tf_soluong.setTextChangeListener(function (type, newString) {
            if(newString === ""){
                tf_soluong.setText(newString);
            }
            else{
                var str = newString.replace(/[.,]/g,'');
                if(cc.Global.IsNumber(str)){
                    var numberInput = parseInt(str);
                    tf_soluong.setText(cc.Global.NumberFormat1(numberInput));
                }
            }
            thiz._updateGiftCodeFee();
            return true;
        });


        tf_mngayhethan.setTextChangeListener(function (type, newString) {
            if(newString === ""){
                tf_mngayhethan.setText(newString);
            }
            else{
                var str = newString.replace(/[.,]/g,'');
                if(cc.Global.IsNumber(str)){
                    tf_mngayhethan.setText(str);
                }
            }
            return true;
        });


        tf_mngayhethan.setFocusListener(function (focus) {
            if(focus){
                var soluongNum = cc.Global.NumberFromString(tf_soluong.getText());
                if(soluongNum > 100)
                {
                    soluongNum =  100;

                }
                if(soluongNum <= 0)
                {
                    soluongNum = 1;
                }
                tf_soluong.setText(cc.Global.NumberFormat1(soluongNum));
                thiz._updateGiftCodeFee();
            }
            else{
                thiz._updateGiftCodeFee();
            }
        });

        _input_otp.setFocusListener(function (focus) {
            if(focus){
                var validDate = cc.Global.NumberFromString(tf_mngayhethan.getText());
                if(validDate > 60 || validDate <= 0)
                {
                    validDate =  60;

                }

                tf_mngayhethan.setText(cc.Global.NumberFormat1(validDate));
                thiz._updateGiftCodeFee();
            }
            else{
                thiz._updateGiftCodeFee();
            }
        });


        this.tf_tensukien.nextTextField = this.tf_gtriGiftCode;
        this.tf_gtriGiftCode.nextTextField = this.tf_soluong;
        this.tf_soluong.nextTextField = this.tf_mngayhethan;
        this.tf_mngayhethan.nextTextField = this._input_otp;
        this._input_otp.setReturnCallback(function () {
            requestfunc();
        });

    },

    _updateGiftCodeFee : function () {
        var goldInput = cc.Global.NumberFromString(this.tf_gtriGiftCode.getText());
        var goldFee = Math.round(goldInput * GIFTCODE_FEE);

        // goldInput = goldInput - goldFee;

        var numberInput = 0;
        if(this.tf_soluong.getText() === "")
        {
            numberInput = 1;
        }
        else
        {
            numberInput = cc.Global.NumberFromString(this.tf_soluong.getText());
        }

        this._lb_gtriGiftCode.setString(cc.Global.NumberFormat1(goldInput * numberInput) + " N");

        this._lb_phiphathanh.setString(cc.Global.NumberFormat1(goldFee * numberInput) + " N");

        var tongXO = (goldFee + goldInput) * numberInput;

        this._lb_tongsoXObitru.setString(cc.Global.NumberFormat1(tongXO) + " N");

        // this._lb_gtriGiftCode.setPositionX(this.tf_inputOTP.x);
        // this._lb_phiphathanh.setPositionX(this.tf_inputOTP.x);
        // this._lb_tongsoXObitru.setPositionX(this.tf_inputOTP.x);


    },
    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("create_giftcode", this.receiveData, this);
        // SocketClient.getInstance().addHTTPListener("get_otp_sms", this.getOTPCK, this);

        this.getXacThucTK();

    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },


    getXacThucTK : function () {
        if(PlayerMe.phoneNumber === ""){
            if(PlayerMe.xacthucContent === "")
            {
                var requets = {
                    command : "get_verify_sms"
                };
                SocketClient.getInstance().sendHttpGetRequest(requets);
            }
        }
        else
        {
            var request = {
                command : "get_otp_sms"
            };
            SocketClient.getInstance().sendHttpGetRequest(request);
        }
    },


    receiveData : function (cmd, data) {
        if(data["status"] === 0)
        {
            this.tf_gtriGiftCode.setText("");
            this.tf_mngayhethan.setText("");
            this.tf_soluong.setText("");
            this.tf_tensukien.setText("");
            this._input_otp.setText("");
            MessageNode.getInstance().show("Bạn đã tạo giftcode thành công !");
        }
    },

    // getOTPCK : function (cmd, data) {
    //
    //     cc.log(data);
    //     if (data["status"] === 0) {
    //         if (this.getChildByTag(10)) {
    //             this.removeChildByTag(10);
    //         }
    //
    //         this.contentopt = data["data"]["content"];
    //
    //         if (cc.sys.isNative) {
    //             var hdanstr = "<font color='#ffde00'>" + " " + this.contentopt + " " + "</font>";
    //             var dausoStr = "<font color='#00fe6c'>" + " " + GameConfig.smsDauSo + "</font>";
    //
    //             var textStr1 = "<font face='" + cc.res.font.Roboto_Condensed + "' size='24'>" + "Soạn" + hdanstr + " gửi " + dausoStr + " để nhận mã OTP" + "</font>";
    //
    //             var msgLabel = new ccui.RichText();
    //             msgLabel.initWithXML(textStr1, {});
    //             msgLabel.setPosition(768, 200);
    //             msgLabel.setTag(10);
    //             this.forebg.addChild(msgLabel);
    //         }
    //         else {
    //             var msgLabel = new ccui.RichText();
    //             msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, "Soạn ", cc.res.font.Roboto_Condensed, 23));
    //             msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffde00"), 255, this.contentopt, cc.res.font.Roboto_CondensedBold, 23));
    //             msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, " gửi ", cc.res.font.Roboto_Condensed, 23));
    //             msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#00fe6c"), 255, " " + GameConfig.smsDauSo + " ", cc.res.font.Roboto_CondensedBold, 23));
    //             msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, " để nhận mã OTP", cc.res.font.Roboto_Condensed, 23));
    //             msgLabel.setTag(10);
    //             msgLabel.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    //             msgLabel.setPosition(768, 195);
    //             this.forebg.addChild(msgLabel);
    //         }
    //
    //     }
    // }
});


var DEFAULT_ROW_ON_PAGE = 6;
var QuanLyGiftCodeLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();

        this.setContentSize(mSize);

        var mainNode = new cc.Node();
        mainNode.setContentSize(this.getContentSize());
        this.addChild(mainNode, 1);
        this.mainNode = mainNode;


        var _list_label_qlygiftcode = ["Tên chiến tích", "Thời gian", "Số lượng", "Tổng giá trị", "Chi tiết"];
        var _list_pos_qlygiftcode = [109, 326, 524, 745, 966];


        var forebg1 = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 482));
        forebg1.setPosition(cc.p(this.width/2, 16));
        this.mainNode.addChild(forebg1, 1);

        for(var i = 0; i < _list_label_qlygiftcode.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, _list_label_qlygiftcode[i].toUpperCase());
            m_lb.setPosition(cc.p(_list_pos_qlygiftcode[i], forebg1.height - 30));
            forebg1.addChild(m_lb);
        }


        var _magin = 17;


        var mList = new newui.TableView(cc.size(forebg1.width - _magin, 323) , 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(_magin - 8, 97));
        forebg1.addChild(mList, 1);
        this.mList = mList;


        var thiz = this;

        this.currentPage = 0;
        this.totalPage = 0;

        var btn_pre = new ccui.Button("home_giftcode_btnnext.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_pre.setPosition(cc.p(forebg1.width/2 - 70, 48));
        btn_pre.addClickEventListener(function () {

            if(thiz.currentPage > 0 && thiz.currentPage <= (thiz.totalPage - 1))
            {
                thiz.currentPage--;
                thiz.getDatePage(thiz.currentPage * DEFAULT_ROW_ON_PAGE, DEFAULT_ROW_ON_PAGE);
                thiz.btn_pre.setEnabled(true);
                thiz.btn_next.setEnabled(true);
                if(thiz.currentPage === 0)
                {
                    btn_pre.setEnabled(false);
                }

            }
        });
        forebg1.addChild(btn_pre);
        this.btn_pre = btn_pre;

        var btn_next = new ccui.Button("home_giftcode_btnnext.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_next.setRotation(180);
        btn_next.setPosition(cc.p(forebg1.width/2 + 70, btn_pre.y));
        btn_next.addClickEventListener(function () {
            btn_next.setEnabled(true);
            if(thiz.currentPage >= 0 && thiz.currentPage < (thiz.totalPage - 1))
            {
                thiz.currentPage++;
                thiz.getDatePage(thiz.currentPage * DEFAULT_ROW_ON_PAGE, DEFAULT_ROW_ON_PAGE);
                thiz.btn_pre.setEnabled(true);
                thiz.btn_next.setEnabled(true);
                if(thiz.currentPage === (thiz.totalPage - 1))
                {
                    btn_next.setEnabled(false);
                }
            }
        });
        forebg1.addChild(btn_next);
        this.btn_next = btn_next;

        var curpagebg = new cc.Sprite("#home_giftcode_curpagebg.png");
        curpagebg.setPosition(cc.p(forebg1.width/2, btn_pre.y));
        forebg1.addChild(curpagebg);


        var lb_infopage = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, this.currentPage + "/" + this.totalPage);
        lb_infopage.setPosition(cc.p(curpagebg.width/2, curpagebg.height/2));
        curpagebg.addChild(lb_infopage);
        this.lb_infopage = lb_infopage;



        var detailGifcode = new DetailGiftCode(this.getContentSize());
        this.addChild(detailGifcode, 1);
        detailGifcode.setVisible(false);
        this.detailGifcode = detailGifcode;

        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;
    },

    setLabelInfoPage : function (curPage, totPage) {
        this.lb_infopage.setString((totPage === 0?curPage:(curPage + 1)) + "/" + totPage);
    },

    setHiddenDetail : function (ishidden) {
        this.detailGifcode.setVisible(ishidden);
        this.mainNode.setVisible(!ishidden);
    },

    addListGiftCode : function (tenchiendich, thoigian, soluong, tonggiatri, id) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mList.width, 46));

        if(this.mList.getChildrenCount() %2)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }


        var thiz = this;

        var lb_tenchiendich = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, tenchiendich, cc.TEXT_ALIGNMENT_CENTER, 200);
        lb_tenchiendich.setPosition(cc.p(99, container.height/2));
        container.addChild(lb_tenchiendich);


        var lb_thoigian= cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thoigian);
        lb_thoigian.setPosition(cc.p(316, container.height/2));
        container.addChild(lb_thoigian);

        var lb_soluong = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, soluong);
        lb_soluong.setPosition(cc.p(514, container.height/2));
        container.addChild(lb_soluong);

        var lb_tonggiatri = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cc.Global.NumberFormat1(tonggiatri));
        lb_tonggiatri.setColor(cc.color("#ffea00"));
        lb_tonggiatri.setPosition(cc.p(735, container.height/2));
        container.addChild(lb_tonggiatri);


        var btn_chitiet = new ccui.Button("home_giftcode_btnchitiet.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_chitiet.setPosition(cc.p(956, container.height/2));
        btn_chitiet.addClickEventListener(function () {
            thiz.mainNode.setVisible(false);
            thiz.detailGifcode.sendIDgetDetail(id, tenchiendich);
            thiz.detailGifcode.setVisible(true);
        });
        container.addChild(btn_chitiet);

        this.mList.pushItem(container);
    },
    onEnter : function () {
        this._super();

    },
    setVisible : function (isVisible) {
        this._super(isVisible);
        if(isVisible)
        {
            this.getDatePage(this.currentPage * DEFAULT_ROW_ON_PAGE, DEFAULT_ROW_ON_PAGE);
        }
    },

    getDatePage : function (m_from, m_size) {
        this.mList.removeAllItems();
        SocketClient.getInstance().addHTTPListener("search_giftcode", this.getLichSuGiftCode, this);
        var request = {
            command : "search_giftcode",
            from : m_from,
            size : m_size
        };
        SocketClient.getInstance().sendHttpGetRequest(request);
        this.loadingNode.setVisible(true);
        // for(var i = 0; i < 10; i++)
        // {
        //     this.addListGiftCode("abaccdsdsdsdsdasdsdsdssdsdsdsc", "12/23/23/ 12:12:12", "10", 100000, "123131312");
        // }
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);

    },
    getLichSuGiftCode : function (cmd, data) {
        cc.log(data);
        this.loadingNode.setVisible(false);
        if(data["status"] === 0)
        {
            var childdata = data["data"];
            this.totalPage = Math.ceil(childdata["total"]/DEFAULT_ROW_ON_PAGE);
            this.setLabelInfoPage(this.currentPage, this.totalPage);
            var list = childdata["data"];
            for (var i = 0; i < list.length; i++)
            {
                var obj = list[i];
                this.addListGiftCode(obj["event"], obj["createdTime"], obj["quantity"], obj["sumValue"], obj["id"]);
            }
        }
    }

});


var DetailGiftCode = cc.Node.extend({
    ctor : function (mSize) {
        this._super();

        this.setContentSize(mSize);


        var forebg1 = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 482));
        forebg1.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg1, 1);


        var ttitle = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "");
        ttitle.setColor(cc.color("#ffde00"));
        forebg1.addChild(ttitle);
        ttitle.setPosition(cc.p(forebg1.width/2, 456));
        this.ttitle = ttitle;


        var _list_label_detailgiftcode = ["Mã code", "Thời gian hết hạn", "Giá trị", "Trạng thái", "Copy"];
        var _list_pos_detailgiftcode = [98, 361, 593, 791, 970];


        var bg_tit = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
        bg_tit.setPreferredSize(cc.size(forebg1.width - 17, 46));
        bg_tit.setPosition(cc.p(forebg1.width/2, 399));
        forebg1.addChild(bg_tit);

        for(var i = 0; i < _list_label_detailgiftcode.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, _list_label_detailgiftcode[i].toUpperCase());
            m_lb.setPosition(cc.p(_list_pos_detailgiftcode[i], bg_tit.height/2));
            bg_tit.addChild(m_lb);
        }

        var _magin = 17;

        var mList = new newui.TableView(cc.size(forebg1.width - _magin, 367) , 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(_magin - 8, 6));
        forebg1.addChild(mList, 1);
        this.mList = mList;


    },

    sendIDgetDetail : function (createID, tenchiendich) {

        this.ttitle.setString(tenchiendich.toUpperCase());
        this.mList.removeAllItems();
        var request = {
            command : "detail_create_giftcode",
            createId : createID
        };

        SocketClient.getInstance().sendHttpGetRequest(request);

        // for(var i = 0; i < 20; i++)
        // {
        //     this.addDetailListGifcode("3243242324", "12", 100000, "okbaby");
        // }


    },

    addDetailListGifcode : function (macode, thoigianhethan, gtri, trangthai) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mList.width, 46));

        if(this.mList.getChildrenCount() %2)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }

        var lb_macode = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, macode);
        lb_macode.setPosition(cc.p(98, container.height/2));
        container.addChild(lb_macode);


        var lb_thoigianhethan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thoigianhethan);

        lb_thoigianhethan.setPosition(cc.p(361, container.height/2));
        container.addChild(lb_thoigianhethan);

        var lb_gtri = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cc.Global.NumberFormat1(gtri));

        lb_gtri.setColor(cc.color("#fff996"));
        lb_gtri.setPosition(cc.p(593, container.height/2));
        container.addChild(lb_gtri);

        var lb_trangthai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, trangthai);

        lb_trangthai.setPosition(cc.p(791, container.height/2));
        container.addChild(lb_trangthai);


        var btncopy = new ccui.Button("home_giftcode_btncopy.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btncopy.setPosition(cc.p(970, container.height/2));
        container.addChild(btncopy);
        btncopy.addClickEventListener(function () {
            SystemPlugin.getInstance().copyTextClipboard(macode);

        });

        this.mList.pushItem(container);
    },
    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("detail_create_giftcode", this.getListGiftCode, this);

    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    getListGiftCode : function (cmd, data) {
        cc.log(data);
        if(data["status"] === 0)
        {
            var childdata = data["data"];
            var list = childdata["data"];
            for (var i = 0; i < list.length; i++)
            {
                var obj = list[i];
                this.addDetailListGifcode(obj["code"], obj["expiredTime"], obj["value"], obj["used"]);
            }
        }
    }
});