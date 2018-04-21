/**
 * Created by Balua on 7/24/17.
 */


var ProfineLayer = Dialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        this.initWithSize(cc.size(1095, 584));

        var title = new cc.Sprite("#home_ttcn_tittle.png");
        title.setAnchorPoint(cc.p(0.5, 0.0));
        title.setPosition(cc.p(this.width/2, this.height + 10));
        this.addChild(title, 2);




        this.allLayer = [new ThongTinLayer(this.getContentSize()), new ThanhTichLayer(this.getContentSize()), new LichSuLayer(this.getContentSize()), new BaoMatLayer(this.getContentSize())];
        for(var i = 0; i < this.allLayer.length; i++)
        {
            this.addChild(this.allLayer[i],1);
        }


        var mToggle = new ToggleNodeGroup();
        this.addChild(mToggle);
        this.mToggle = mToggle;

        var _tabTTCNName = ["THÔNG TIN", "THÀNH TÍCH", "LỊCH SỬ", "BẢO MẬT"];



        for(var i = 0; i < _tabTTCNName.length; i++)
        {
            (function () {

                var seltab = new cc.Sprite("#home_ttcn_seltab.png");
                seltab.setAnchorPoint(cc.p(0.0, 1.0));
                seltab.setPosition(cc.p(213 + (i * 205), thiz.height));
                thiz.addChild(seltab, 10);

                var unseltab = new cc.Sprite("#home_ttcn_unseltab.png");
                unseltab.setAnchorPoint(cc.p(0.0, 1.0));
                unseltab.setPosition(seltab.getPosition());
                thiz.addChild(unseltab, 10);

                var _tittab = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, _tabTTCNName[i]);
                _tittab.setPosition(cc.p(seltab.x + seltab.width/2, seltab.y - seltab.height/2));
                thiz.addChild(_tittab, 10);

                var mNode = thiz.allLayer[i];

                var toggleItem = new ToggleNodeItem(seltab.getContentSize());
                toggleItem.setAnchorPoint(seltab.getAnchorPoint());
                toggleItem.setPosition(seltab.getPosition());
                mToggle.addItem(toggleItem);


                toggleItem.onSelect = function (force) {
                    seltab.setVisible(true);
                    unseltab.setVisible(false);
                    _tittab.setColor(cc.color("#000000"));
                    mNode.setVisible(true);
                };
                toggleItem.onUnSelect = function () {
                    seltab.setVisible(false);
                    unseltab.setVisible(true);
                    _tittab.setColor(cc.color("#3d1700"));
                    mNode.setVisible(false);
                }
            })();

        }


    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);
    },

    hide: function () {
        if(PlayerMe.phoneNumber){
            this._super();
        }
        else{
            MessageNode.getInstance().show("Bạn phải xác thực tài khoản!");
        }
    }
});


var ThongTinLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        var thiz = this;
        this.setContentSize(mSize);



        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(30, 30, 4, 4));
        forebg.setAnchorPoint(cc.p(0.5, 0));
        forebg.setPreferredSize(cc.size(1054, 486));
        forebg.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg, 1);
        this.forebg = forebg;

        var nodettcn = new cc.Node();
        nodettcn.setAnchorPoint(cc.p(0.5, 0.5));
        nodettcn.setContentSize(forebg.getContentSize());
        nodettcn.setPosition(cc.p(forebg.width/2, forebg.height/2));
        forebg.addChild(nodettcn);
        // nodettcn.setVisible(false);


        var avatarMe = UserAvatar.createMe();
        avatarMe.setScale(2.1);
        avatarMe.setPosition(cc.p(234, 343));
        nodettcn.addChild(avatarMe);



        var lb_username = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        lb_username.setColor(cc.color("#ffde00"));
        lb_username.setPosition(cc.p(avatarMe.x, 188));
        nodettcn.addChild(lb_username);
        this.lb_username = lb_username;

        var btn_changeAvatar = new ccui.Button("home_ttcn_btnthayavatar.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_changeAvatar.setPosition(cc.p(avatarMe.x, 118));
        nodettcn.addChild(btn_changeAvatar);
        btn_changeAvatar.addClickEventListener(function () {
            if(PlayerMe.loginType === "normal")
            {
                nodettcn.setVisible(false);
                thiz._viewchangeAvatar.setVisible(true);
            }
            else
            {
                MessageNode.getInstance().show("Chức năng này không hỗ trợ trên tài khoản Facebook");
            }

        });


        var bg_usermoney = new ccui.Scale9Sprite("home_ttcn_bg_slider.png", cc.rect(40, 0, 4, 67));
        bg_usermoney.setPreferredSize(cc.size(354, 67));
        bg_usermoney.setPosition(cc.p(718, 380));
        nodettcn.addChild(bg_usermoney);


        var iconxo = new cc.Sprite("#home_ttcn_icongold.png");
        iconxo.setPosition(cc.p(35, bg_usermoney.height/2));
        bg_usermoney.addChild(iconxo);



        var lb_usermoney = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "12.22222");
        lb_usermoney.setColor(cc.color("#ffea00"));
        lb_usermoney.setPosition(cc.p(198, bg_usermoney.height/2));
        bg_usermoney.addChild(lb_usermoney);
        this.lb_usermoney = lb_usermoney;


        var bg_userlevel = new ccui.Scale9Sprite("home_ttcn_bg_slider.png", cc.rect(40, 0, 4, 67));
        bg_userlevel.setPreferredSize(cc.size(354, 67));
        bg_userlevel.setPosition(cc.p(718, 307));
        nodettcn.addChild(bg_userlevel);

        var iconkinglevel = new cc.Sprite("#home_ttcn_iconlevel.png");
        iconkinglevel.setPosition(cc.p(45, bg_userlevel.height/2 - 3));
        bg_userlevel.addChild(iconkinglevel);

        var lb_userlevel = cc.Label.createWithBMFont("res/fonts/Font_CAP_VIP.fnt", "10");
        lb_userlevel.setColor(cc.color("#fffaa7"));
        lb_userlevel.setPosition(cc.p(45, bg_userlevel.height/2 + 20));
        bg_userlevel.addChild(lb_userlevel);
        this.lb_userlevel = lb_userlevel;

        var lb_userexp = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "12/7679");
        lb_userexp.setColor(cc.color("#ffacac"));
        lb_userexp.setPosition(cc.p(bg_userlevel.x, bg_userlevel.y));
        nodettcn.addChild(lb_userexp);
        this.lb_userexp = lb_userexp;



        var _viewDaXacThuc = new View_DaXacThuc(PlayerMe.phoneNumber);
        _viewDaXacThuc.setPosition(cc.p(718, 280));
        nodettcn.addChild(_viewDaXacThuc);
        this._viewDaXacThuc = _viewDaXacThuc;
        _viewDaXacThuc.btn_changephone.addClickEventListener(function () {
            thiz._viewChangeSdt.setVisible(true);
            nodettcn.setVisible(false);
        });



        var _viewChuaXacThuc = new View_ChuaXacThuc();
        _viewChuaXacThuc.setPosition(cc.p(718, 280));
        nodettcn.addChild(_viewChuaXacThuc);
        this._viewChuaXacThuc =_viewChuaXacThuc;


        var _viewChangeSdt = new ChangePhoneNumber(this.getContentSize());
        _viewChangeSdt.setPosition(cc.p(this.width/2, this.height/2));
        forebg.addChild(_viewChangeSdt);
        _viewChangeSdt.onBackButtonHandler = function () {
           _viewChangeSdt.setVisible(false);
           nodettcn.setVisible(true);
        };
        _viewChangeSdt.setVisible(false);
        this._viewChangeSdt = _viewChangeSdt;



        var _viewchangeAvatar = new ChangeAvatar(this.getContentSize());
        _viewchangeAvatar.setPosition(cc.p(this.width/2, this.height/2));
        _viewchangeAvatar.btn_back.addClickEventListener(function () {
            thiz._viewchangeAvatar.setVisible(false);
            nodettcn.setVisible(true);
        });
        forebg.addChild(_viewchangeAvatar);
        this._viewchangeAvatar = _viewchangeAvatar;
        _viewchangeAvatar.setVisible(false);

    },

    refreshProfileInfo : function(){

        if(PlayerMe.phoneNumber === "")
        {
            this._viewDaXacThuc.setVisible(false);
            this._viewChuaXacThuc.setVisible(true);
        }
        else
        {
            this._viewDaXacThuc.setVisible(true);
            this._viewChuaXacThuc.setVisible(false);
        }


        this.lb_username.setString(PlayerMe.displayName);
        this.lb_usermoney.setString(cc.Global.NumberFormat1(PlayerMe.gold));

        var level = cc.Global.GetVipMe();
        this.lb_userlevel.setString(level.level > 0?level.level:"0");
        if(level.startExp < level.targetExp){
            var current = (level.currentExp - level.startExp);
            var target = (level.targetExp - level.startExp);

            this.lb_userexp.setString(Math.floor(current / 40000) + "/" + Math.floor(target / 40000) );
        }
        else{
            this.lb_userexp.setString(Math.floor(level.currentExp / 40000));
        }

    },
    onEnter : function () {
        this._super();

        // SocketClient.getInstance().addHTTPListener("get_verify_sms", this.GetCodeVerifySms, this);
        SocketClient.getInstance().addListener("uInfo", this._onUserInfo, this);

        this.refreshProfileInfo();
    },

    setVisible : function (isVisible) {
        this._super(isVisible);
        if(isVisible)
        {
            this.refreshProfileInfo();
            // if(PlayerMe.phoneNumber === ""){
            //     var requets = {
            //         command : "get_verify_sms"
            //     };
            //     SocketClient.getInstance().sendHttpGetRequest(requets);
            // }
        }
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    // GetCodeVerifySms : function (cmd, data) {
    //     if(data["status"] == 0)
    //     {
    //         PlayerMe.xacthucContent = data["data"]["content"];
    //         this._viewChuaXacThuc.setLabelHuongDan(PlayerMe.xacthucContent);
    //
    //     }
    // },

    _onUserInfo : function (cmd, data) {
        this.refreshProfileInfo();
    }
});


var View_DaXacThuc = ccui.Widget.extend({
    ctor : function (sdt) {
        this._super();
        this.setContentSize(cc.size(600, 270));
        this.setAnchorPoint(cc.p(0.5, 1.0));

        var bg_usermoney = new ccui.Scale9Sprite("home_ttcn_bg_slider.png", cc.rect(40, 0, 4, 67));
        bg_usermoney.setPreferredSize(cc.size(354, 67));
        bg_usermoney.setPosition(cc.p(this.width/2, 220));
        this.addChild(bg_usermoney);



        var iconxacthuc = new cc.Sprite("#home_ttcn_iconphone.png");
        iconxacthuc.setPosition(cc.p(30, bg_usermoney.height/2));
        bg_usermoney.addChild(iconxacthuc);


        var _lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Sđt :");
        _lb.setAnchorPoint(cc.p(0.0, 0.5));
        _lb.setPosition(cc.p(100, bg_usermoney.height/2));
        bg_usermoney.addChild(_lb);


        var lb_sdt = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, sdt);
        lb_sdt.setAnchorPoint(cc.p(0.0, 0.5));
        lb_sdt.setColor(cc.color("#fffc0e"));
        bg_usermoney.addChild(lb_sdt);
        lb_sdt.setPosition(cc.p(160, bg_usermoney.height/2));
        this.lb_sdt = lb_sdt;



        var lb_xacthuc = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Đã xác thực");
        lb_xacthuc.setPosition(cc.p(this.width/2, 160));
        this.addChild(lb_xacthuc);



        var btn_changephone = new ccui.Button("home_ttcn_btnchangephone.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_changephone.setPosition(cc.p(this.width/2, 90));
        this.addChild(btn_changephone);
        this.btn_changephone = btn_changephone;

    },

    setVisible : function (isvisiable) {
        this._super(isvisiable);
        if(isvisiable)
        {
            this.lb_sdt.setString(PlayerMe.phoneNumber);
        }
    }
});

var View_ChuaXacThuc = ccui.Widget.extend({
    ctor : function () {
        this._super();
        this.setContentSize(cc.size(600, 270));
        this.setAnchorPoint(cc.p(0.5, 1.0));

        this.initCapcharLayer();
        this.initOTPLayer();
    },


    initCapcharLayer : function () {
        var capcharLayer  = new ccui.Widget();
        capcharLayer.setAnchorPoint(cc.p(0.5, 0.5));
        capcharLayer.setContentSize(this.getContentSize());
        capcharLayer.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(capcharLayer);
        this.capcharLayer = capcharLayer;

        var lb_chuaxacthuc = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Chưa xác thực tài khoản");
        lb_chuaxacthuc.setPosition(cc.p(this.width/2, capcharLayer.height - 30));
        capcharLayer.addChild(lb_chuaxacthuc);

        var bg_tf1 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        bg_tf1.setPreferredSize(cc.size(400, 68));
        bg_tf1.setAnchorPoint(cc.p(0.0, 0.0));
        bg_tf1.setPosition(cc.p(90, 150));
        capcharLayer.addChild(bg_tf1);

        var nhapsdt = new newui.TextField(cc.size(bg_tf1.getContentSize().width - 6, bg_tf1.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_20  );
        nhapsdt.setAlignment(0);
        nhapsdt.setPlaceHolder("Nhập SĐT");
        nhapsdt.setTextColor(cc.color("#525252"));
        nhapsdt.setPlaceHolderColor(cc.color("#525252"));
        nhapsdt.setMaxLength(11);
        nhapsdt.setAnchorPoint(cc.p(0.0, 0.0));
        nhapsdt.setPosition(cc.p(bg_tf1.x, bg_tf1.y));
        capcharLayer.addChild(nhapsdt,1);
        this.nhapsdt = nhapsdt;

        nhapsdt.setTextChangeListener(function (type, newString) {
            if(newString === ""){
                nhapsdt.setText(newString);
            }
            else{
                if(cc.Global.IsNumber(newString)){
                    nhapsdt.setText(newString);
                }
            }
            return true;
        });

        var bg_tf2 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        bg_tf2.setPreferredSize(cc.size(150, 68));
        bg_tf2.setAnchorPoint(cc.p(0.0, 0.0));
        bg_tf2.setPosition(cc.p(90, 70));
        capcharLayer.addChild(bg_tf2);

        var nhapcapchar = new newui.TextField(cc.size(bg_tf2.getContentSize().width - 6, bg_tf2.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_20);
        nhapcapchar.setAlignment(0);
        nhapcapchar.setPlaceHolder("Captcha");
        nhapcapchar.setTextColor(cc.color("#525252"));
        nhapcapchar.setPlaceHolderColor(cc.color("#525252"));
        nhapcapchar.setMaxLength(5);
        nhapcapchar.setAnchorPoint(cc.p(0.0, 0.0));
        nhapcapchar.setPosition(cc.p(bg_tf2.x, bg_tf2.y));
        capcharLayer.addChild(nhapcapchar,1);
        this.nhapcapchar = nhapcapchar;

        var captchaView = new ImageCaptcha();
        captchaView.setScale(2.0);
        captchaView.setAnchorPoint(cc.p(0.0, 0.0));
        captchaView.setPosition(cc.p(250, 77));
        capcharLayer.addChild(captchaView);
        this.captchaView = captchaView;


        var btn_refreshCapcha = new ccui.Button("home_signup_refresh.png","","", ccui.Widget.PLIST_TEXTURE);
        btn_refreshCapcha.setAnchorPoint(cc.p(0.0, 0.0));
        btn_refreshCapcha.setPosition(cc.p(420, 70));
        btn_refreshCapcha.addClickEventListener(function () {
            captchaView.sendGetCapcha();
            nhapcapchar.setText("");
        });
        capcharLayer.addChild(btn_refreshCapcha);

        var btn_xacthucnow = new ccui.Button("home_ttcn_btnxacthucngay1.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_xacthucnow.setAnchorPoint(cc.p(0.5, 0.0));
        btn_xacthucnow.setPosition(cc.p(300, 5));
        capcharLayer.addChild(btn_xacthucnow);
        btn_xacthucnow.addClickEventListener(function () {
            var phone = nhapsdt.getText();
            var captchaAnswer = nhapcapchar.getText();
            var captchaKey = captchaView.captchaKey;

            if(phone.length < 10){
                MessageNode.getInstance().show("Số điện thoại phải từ 10 - 11 ký tự!");
                return;
            }

            if(captchaAnswer.length === 0){
                MessageNode.getInstance().show("Bạn chưa nhập mã xác nhận!");
                return;
            }
            // MessageNode.getInstance().show("Tính năng chưa mở trong giai đoạn Alpha Test!");
            var request = {
                command: "send_verify_code",
                phone: phone,
                captchaAnswer: captchaAnswer,
                captchaKey: captchaKey
            };
            SocketClient.getInstance().sendHttpGetRequest(request);
        });

        var _setVisible = capcharLayer.setVisible;
        capcharLayer.setVisible = function (visible) {
            _setVisible.apply(capcharLayer, arguments);
        };
    },

    initOTPLayer : function () {
        var optLayer = new ccui.Widget();
        optLayer.setAnchorPoint(cc.p(0.5, 0.5));
        optLayer.setContentSize(this.getContentSize());
        optLayer.setPosition(cc.p(this.width / 2, this.height / 2));
        optLayer.setVisible(false);
        this.addChild(optLayer);
        this.optLayer = optLayer;


        var lb_chuaxacthuc = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, "Mã xác thực đã được gửi về SĐT ***. Vui lòng nhập mã để xác thực hoặc liên hệ CSKH", cc.TEXT_ALIGNMENT_CENTER, 500);
        lb_chuaxacthuc.setPosition(cc.p(this.width / 2, optLayer.height - 50));
        optLayer.addChild(lb_chuaxacthuc);

        var bg_tf1 = new ccui.Scale9Sprite("home_napvang_tf.png", cc.rect(20, 20, 4, 4));
        bg_tf1.setPreferredSize(cc.size(400, 68));
        bg_tf1.setAnchorPoint(cc.p(0.0, 0.0));
        bg_tf1.setPosition(cc.p(90, 110));
        optLayer.addChild(bg_tf1);

        var nhapsdt = new newui.TextField(cc.size(bg_tf1.getContentSize().width - 6, bg_tf1.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_20);
        nhapsdt.setAlignment(0);
        nhapsdt.setPlaceHolder("Nhập mã xác thực");
        nhapsdt.setTextColor(cc.color("#525252"));
        nhapsdt.setPlaceHolderColor(cc.color("#525252"));
        nhapsdt.setMaxLength(32);
        nhapsdt.setAnchorPoint(cc.p(0.0, 0.0));
        nhapsdt.setPosition(cc.p(bg_tf1.x, bg_tf1.y));
        optLayer.addChild(nhapsdt, 1);

        var btn_xacthucnow = new ccui.Button("home_ttcn_btnxacthucngay.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_xacthucnow.setAnchorPoint(cc.p(0.5, 0));
        btn_xacthucnow.setPosition(cc.p(optLayer.width / 2, 20));
        optLayer.addChild(btn_xacthucnow);
        btn_xacthucnow.addClickEventListener(function () {
            var verifyCode = nhapsdt.getText();

            var request = {
                command: "verify",
                verifyCode: verifyCode
            };
            SocketClient.getInstance().sendHttpGetRequest(request);
        });

        var thiz = this;
        var _setVisible = optLayer.setVisible;
        optLayer.setVisible = function (visible) {
            _setVisible.apply(optLayer, arguments);
            if(visible){
                var str = "Mã xác thực đã được gửi về SĐT " + thiz.nhapsdt.getText() + ". Vui lòng nhập mã để xác thực hoặc liên hệ CSKH";
                lb_chuaxacthuc.setString(str);
            }
        };
    },

    onEnter: function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("check_verify_code_sent", this.onCheckVerifyCodeSent, this);
        SocketClient.getInstance().addHTTPListener("send_verify_code", this.onSendVerifyCode, this);
    },

    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    setVisible: function (visible) {
        this._super(visible);
        if(visible){
            this.capcharLayer.setVisible(false);
            this.optLayer.setVisible(false);
            var request = {
                command: "check_verify_code_sent"
            };
            SocketClient.getInstance().sendHttpGetRequest(request);
        }
    },

    onCheckVerifyCodeSent: function (cmd, data) {
        if(data && data["status"] === 0){
            var sent = data["data"]["sent"];
            if(sent){
                var phoneNumber = data["data"]["phone"];
                this.nhapsdt.setText(phoneNumber);
                this.capcharLayer.setVisible(false);
                this.optLayer.setVisible(true);
            }
            else{
                this.capcharLayer.setVisible(true);
                this.optLayer.setVisible(false);
            }
        }
    },

    onSendVerifyCode: function (cmd, data) {
        this.nhapcapchar.setText("");
        this.captchaView.sendGetCapcha();
        if(data && data["status"] === 0){
            this.capcharLayer.setVisible(false);
            this.optLayer.setVisible(true);
        }
    }

    // setLabelHuongDan : function (hdan) {
    //     this.contenthdan = hdan;
        // if(this.getChildByTag(10))
        // {
        //     this.getChildByTag(10).removeFromParent();
        // }
        //
        // if(cc.sys.isNative)
        // {
        //     var hdanstr = "<font color='#fff000'>" + " " + hdan + " " + "</font>";
        //     var dausoStr = "<font color='#00ccff'>" + " " + GameConfig.smsDauSo + "</font>";
        //
        //     var textStr1 = "<font face='"+cc.res.font.Roboto_Condensed+"' size='20'>" + "Soạn" + hdanstr + " gửi " + dausoStr + "</font>";
        //
        //     var lb_huongdan = new ccui.RichText();
        //     lb_huongdan.initWithXML(textStr1, {});
        //     lb_huongdan.setAnchorPoint(cc.p(0.5, 0.5));
        //     lb_huongdan.setPosition(cc.p(this.width/2, 118));
        //     lb_huongdan.setTag(10);
        //     this.addChild(lb_huongdan);
        // }
        //
        // else
        // {
        //     var lb_huongdan = new ccui.RichText();
        //     lb_huongdan.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, "Soạn ", cc.res.font.Roboto_Condensed, 24));
        //     lb_huongdan.pushBackElement(new ccui.RichElementText(0, cc.color("#fff000"), 255, hdan, cc.res.font.Roboto_CondensedBold, 24));
        //     lb_huongdan.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, " gửi ", cc.res.font.Roboto_Condensed, 24));
        //     lb_huongdan.pushBackElement(new ccui.RichElementText(0, cc.color("#00ccff"), 255, " " + GameConfig.smsDauSo + " ", cc.res.font.Roboto_CondensedBold, 24));
        //     lb_huongdan.setTag(10);
        //     lb_huongdan.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        //     lb_huongdan.setAnchorPoint(cc.p(0.5, 0.5));
        //     lb_huongdan.setPosition(cc.p(this.width/2, 118));
        //     this.addChild(lb_huongdan);
        // }
    //
    // }
});

var ChangePhoneNumber = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        var thiz = this;


        var title = new cc.Sprite("#home_ttcn_titlephone.png");
        this.addChild(title);
        title.setPosition(cc.p(this.width/2, 445));


        var btn_back = new ccui.Button("home_ttcn_btn_back.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_back.setPosition(cc.p(48, 445));
        this.addChild(btn_back);
        this.btn_back = btn_back;
        btn_back.addClickEventListener(function () {
            thiz.onBackButtonHandler();
        });

        var tf_bg1 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_bg1.setPreferredSize(cc.size(407, 68));
        tf_bg1.setAnchorPoint(cc.p(0.5, 0.0));
        tf_bg1.setPosition(this.width/2, 346);
        this.addChild(tf_bg1);


        var tf_bg2 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_bg2.setPreferredSize(cc.size(407, 68));
        tf_bg2.setAnchorPoint(cc.p(0.5, 0.0));
        tf_bg2.setPosition(this.width/2, 259);
        this.addChild(tf_bg2);

        var tf_bg3 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_bg3.setPreferredSize(cc.size(407, 68));
        tf_bg3.setAnchorPoint(cc.p(0.5, 0.0));
        tf_bg3.setPosition(this.width/2, 172);
        this.addChild(tf_bg3);


        var tf_mk = new newui.TextField(cc.size(tf_bg1.getContentSize().width - 6, tf_bg1.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        tf_mk.setAlignment(0);
        tf_mk.setPlaceHolder("Nhập mật khẩu");
        tf_mk.setTextColor(cc.color("#525252"));
        tf_mk.setPlaceHolderColor(cc.color("#525252"));
        tf_mk.setMaxLength(32);
        tf_mk.setPasswordEnable(true);
        tf_mk.setAnchorPoint(cc.p(0.5, 0.0));
        tf_mk.setPosition(cc.p(tf_bg1.x + 3, tf_bg1.y + 1));
        this.addChild(tf_mk,1);
        this.tf_mk = tf_mk;

        var tf_phonenum = new newui.TextField(cc.size(tf_bg2.getContentSize().width - 6, tf_bg2.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        tf_phonenum.setAlignment(0);
        tf_phonenum.setPlaceHolder("Nhập SĐT mới");
        tf_phonenum.setTextColor(cc.color("#525252"));
        tf_phonenum.setPlaceHolderColor(cc.color("#525252"));
        tf_phonenum.setMaxLength(11);
        tf_phonenum.setAnchorPoint(cc.p(0.5, 0.0));
        tf_phonenum.setPosition(cc.p(tf_bg2.x + 3, tf_bg2.y + 1));
        this.addChild(tf_phonenum,1);
        this.tf_phonenum  = tf_phonenum;

        tf_phonenum.setTextChangeListener(function (type, newString) {
            if(newString === ""){
                tf_phonenum.setText(newString);
            }
            else{
                if(cc.Global.IsNumber(newString)){
                    tf_phonenum.setText(newString);
                }
            }
        });


        // var tf_optcode = new newui.TextField(cc.size(tf_bg3.getContentSize().width - 6, tf_bg3.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        // tf_optcode.setAlignment(0);
        // tf_optcode.setPlaceHolder("Nhập mã đổi SĐT");
        // tf_optcode.setTextColor(cc.color("#525252"));
        // tf_optcode.setPlaceHolderColor(cc.color("#525252"));
        // tf_optcode.setMaxLength(10);
        // tf_optcode.setAnchorPoint(cc.p(0.5, 0.0));
        // tf_optcode.setPosition(cc.p(tf_bg3.x + 3, tf_bg3.y + 1));


        var tf_optcode = new newui.EditBox(cc.size(tf_bg3.getContentSize().width - 36, tf_bg3.getContentSize().height - 2));
        tf_optcode.setFont(cc.res.font.Roboto_CondensedBold, 24);
        tf_optcode.setPlaceholderFont(cc.res.font.Roboto_CondensedBold, 24);
        tf_optcode.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        tf_optcode.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        tf_optcode.setFontColor(cc.color("#525252"));
        tf_optcode.setAnchorPoint(cc.p(0.5, 0.0));
        tf_optcode.setPlaceholderFontColor(cc.color("#525252"));
        tf_optcode.setPlaceHolder("Nhập mã OTP");
        tf_optcode.setPosition(cc.p(tf_bg3.x + 3, tf_bg3.y + 1));
        this.addChild(tf_optcode,1);
        this.tf_optcode = tf_optcode;


        var btn_doisdt = new ccui.Button("home_ttcn_btndoisdt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_doisdt.setPosition(cc.p(this.width/2- 110, 95));
        btn_doisdt.addClickEventListener(function () {
            var mk = tf_mk.getText();
            if(!mk){
                MessageNode.getInstance().show("Bạn phải nhập mật khẩu");
                tf_mk.showKeyboard();
                return;
            }

            var phonenum = tf_phonenum.getText();
            if(!phonenum || phonenum.length < 10){
                MessageNode.getInstance().show("Số điện thoại phải từ 10 - 11 ký tự!");
                return;
            }

            var optcode = tf_optcode.getString();
            if(!optcode){
                MessageNode.getInstance().show("Bạn phải nhập mã đổi SĐT");
                // tf_optcode.showKeyboard();
                return;
            }

            var pop = new MessageConfirmDialog();
            pop.title.setString("XÁC NHẬN");
            var feestr = "<font color='#ffec16'>" + " " + "500 Bin" + " " + "</font>";
            var textStr1 = "<font face='"+cc.res.font.Roboto_CondensedBold+"' size='24'>" + "Phí lấy mã đổi SĐT là" + feestr + "bạn có muốn lấy không ?" + "</font>";
            var msgLabel = new ccui.RichText();
            msgLabel.initWithXML(textStr1, {});
            msgLabel.setPosition(cc.p(pop.forebg.width/2, 210));
            pop.forebg.addChild(msgLabel);

            pop.btn_ok.addClickEventListener(function () {
                var request = {
                    "command": "request_change_verfied_phone",
                    "password": mk,
                    "newVerifyPhone": phonenum,
                    "otp": optcode
                };
                SocketClient.getInstance().sendHttpGetRequest(request);
                pop.hide();
            });
            pop.show();

        });
        this.addChild(btn_doisdt);


        var btn_latopt = new ccui.Button("home_ttcn_btnlaymadoisdt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_latopt.setPosition(cc.p(this.width/2 + 110, 95));
        btn_latopt.addClickEventListener(function () {
            GetOTPDialog.showGetMaDoiSDTDialog();
        });
        this.addChild(btn_latopt);
    },
    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("request_change_verfied_phone", this.onChangePhoneNumberFinished, this);
        SocketClient.getInstance().addListener("uInfo", this.onUpdateUserInfo, this);

    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    onChangePhoneNumberFinished: function (cmd, data) {
        this.tf_mk.setText("");
        this.tf_phonenum.setText("");
        this.tf_optcode.setString("");

        if(data && data["status"] === 0){
            var dialog = new DoiSDTDialog();
            dialog.show();
        }
    },

    onBackButtonHandler: function () {

    },

    onUpdateUserInfo: function () {
        this.onBackButtonHandler();
    }
});

var ChangeAvatar = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);
        this.setAnchorPoint(cc.p(0.5, 0.5));


        var btn_back = new ccui.Button("home_ttcn_btn_back.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_back.setPosition(cc.p(48, 445));
        this.addChild(btn_back);
        this.btn_back = btn_back;

        var lb_note = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Chọn Avatar mới , một số Avatar cần cấp VIP để sử dụng . VIP 4 trở lên được upload Avatar", cc.TEXT_ALIGNMENT_CENTER, 500);
        lb_note.setPosition(cc.p(400, 425));
        this.addChild(lb_note);


        var level = cc.Global.GetVipMe();
        var btn_uploadavatar = new ccui.Button("dialog_btn_uploadavatar.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_uploadavatar.setAnchorPoint(cc.p(0.0, 1.0));
        btn_uploadavatar.setPosition(cc.p(730, 460));
        this.addChild(btn_uploadavatar);
        btn_uploadavatar.addClickEventListener(function () {
            if(level.level >= 4)
            {
                SystemPlugin.getInstance().showImagePicker(230, 230);
            }
            else
            {
                MessageNode.getInstance().show("Cần VIP 4 trở lên để sử dụng chức năng này !");
            }
        });

        for(var i = 0; i < 3; i++)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_bg_tygia.png", cc.rect(20, 20, 4, 4));
            bg_cell.setPreferredSize(cc.size(957, 104));
            bg_cell.setAnchorPoint(cc.p(0.0, 0.0));
            bg_cell.setPosition(cc.p(51, 267 - (113 * i)));
            this.addChild(bg_cell);

            var lbvip = new cc.Sprite("#home_vip_" + (i+1)+ ".png");
            lbvip.setPosition(cc.p(30, bg_cell.height/2));
            lbvip.setAnchorPoint(cc.p(0.0,0.5));
            bg_cell.addChild(lbvip);
        }

        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;

    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("fetch_active_avatar", this._getAvatarList, this);
        SocketClient.getInstance().addHTTPListener("choose_avatar", this._choseAvatarReponse, this);
        SocketClient.getInstance().addHTTPListener("update_avatar", this._choseAvatarReponse, this);
        var reuqest = {
            command : "fetch_active_avatar"
        };
        SocketClient.getInstance().sendHttpGetRequest(reuqest);
        this.loadingNode.setVisible(true);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    _getAvatarList : function (cmd, data) {
        cc.log(data);
        this.loadingNode.setVisible(false);
        this.drawListAvatar(data["data"]);
    },

    drawListAvatar : function (list) {
        var thiz = this;
        for(var i = 0; i < list.length; i++)
        {
            (function () {
                var obj = list[i];
                var container = new ccui.Widget();
                container.setContentSize(cc.size(86, 86));
                container.setTouchEnabled(true);


                var itemAvatar = new WebSprite(cc.size(86, 86));
                itemAvatar.loadDefault("#dialog_avatardefaultmale.png");
                itemAvatar.reloadFromURL(obj["url"]);
                // itemAvatar.setScale(0.9);
                itemAvatar.setPosition(container.width/2, container.height/2);
                container.addChild(itemAvatar);


                var mask_avatar = new cc.Sprite("#avatarDefault_bg_1.png");
                mask_avatar.setScale(container.width/mask_avatar.width, container.height/mask_avatar.height);
                mask_avatar.setPosition(itemAvatar.getPosition());
                container.addChild(mask_avatar);

                thiz.addChild(container);

                container.setPosition(cc.p(240 + (140 * (i % 6)), 320 - Math.floor(i /6) * 115));

                var isopen = PlayerMe.vipExp >= obj["vip"]?true:false;

                if(!isopen)
                {
                    var iconlock = new cc.Sprite("#dialog_iconlock.png");
                    iconlock.setAnchorPoint(cc.p(1.0, 1.0));
                    iconlock.setPosition(cc.p(container.width, container.height));
                    container.addChild(iconlock);
                }


                container.addClickEventListener(function () {
                    var request = {
                        command: "choose_avatar",
                        avatarId: obj["id"]
                    };

                    SocketClient.getInstance().sendHttpGetRequest(request);
                });



            })();
        }
    },

    _choseAvatarReponse : function (cmd, data) {
        if(data["status"] === 0)
        {
            MessageNode.getInstance().show("Bạn đã đổi avatar thành công !");
        }

    }
});

var ThanhTichLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);


        var m_list_titlecolumn = ["PHIÊN", "THỜI GIAN", "GAME", "BIN", "SỐ DƯ", "MÔ TẢ"];
        var m_list_titlecolumnPos = [67, 220, 433, 610, 773, 934];


        var forebg = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg.setPreferredSize(cc.size(1054, 59));
        forebg.setPosition(cc.p(this.width/2, 470));
        this.addChild(forebg, 1);


        var forebg1 = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 433));
        forebg1.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg1, 1);

        for(var i = 0; i < m_list_titlecolumn.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, m_list_titlecolumn[i]);
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(m_list_titlecolumnPos[i], forebg.height/2));
            forebg.addChild(m_lb);
        }



        var _magin = 17;


        var mList = new newui.TableView(cc.size(forebg1.width - _magin, forebg1.height - _magin - 17) , 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(_magin - 8, _magin));
        forebg1.addChild(mList, 1);
        this.mList = mList;

        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;
    },


    addThanhTichXlot : function (idphien, thoigian, game, xlot, sodu, mota) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mList.width, 46));

        if(this.mList.getChildrenCount() %2 === 0)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }

        var lb_idphien = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, idphien);
        lb_idphien.setPosition(cc.p(93, container.height/2));
        container.addChild(lb_idphien);


        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thoigian);
        lb_thoigian.setPosition(cc.p(262, container.height/2));
        container.addChild(lb_thoigian);

        var lb_game = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, game);
        lb_game.setColor(cc.color("#ffe400"));
        lb_game.setPosition(cc.p(446, container.height/2));
        container.addChild(lb_game);

        var lb_xlot = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cc.Global.NumberFormat1(xlot));
        lb_xlot.setColor(cc.color("#ffe400"));
        lb_xlot.setPosition(cc.p(610, container.height/2));
        container.addChild(lb_xlot);

        var lb_sodu = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cc.Global.NumberFormat1(sodu));
        lb_sodu.setColor(cc.color("#ffe400"));
        lb_sodu.setPosition(cc.p(790, container.height/2));
        container.addChild(lb_sodu);

        var lb_mota = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, mota);
        lb_mota.setPosition(cc.p(950, container.height/2));
        container.addChild(lb_mota);


        this.mList.pushItem(container);
    },
    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("get_achievement", this.getAchievement,this);

    },

    setVisible : function (isVisible) {
        this._super(isVisible);
        if (isVisible) {
            this.mList.removeAllItems();
            var request = {
                command : "get_achievement"
            };

            SocketClient.getInstance().sendHttpGetRequest(request);
            this.loadingNode.setVisible(true);

            // for(var i = 0; i < 10; i++)
            // {
            //     this.addThanhTichXlot("241434", "12/12/1234", "xlot", "122313123", "123123213", "good");
            // }
        }
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },
    getAchievement : function (cmd, data) {
        this.loadingNode.setVisible(false);
        if(data["status"] === 0)
        {
            var mlist = data["data"];
            for(var i = 0; i < mlist.length; i++)
            {
                var mdata = mlist[i];
                this.addThanhTichXlot(mdata["gameId"], mdata["date"], mdata["game"], mdata["winMoney"], mdata["money"], mdata["desc"]);
            }
        }
    }

});

var LichSuLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();

        this.setContentSize(mSize);

        var thiz = this;

        var bg_tab = new ccui.Scale9Sprite("home_ttcn_lsu_bg_tab.png", cc.rect(40, 0, 4, 66));
        bg_tab.setPreferredSize(cc.size(482, 66));
        bg_tab.setPosition(cc.p(this.width/2, 472));
        this.addChild(bg_tab, 1);

        var mToggle = new ToggleNodeGroup();
        bg_tab.addChild(mToggle);
        this.mToggle = mToggle;
        var _tab_title = ["CHƠI BIN", "NẠP BIN", "TIÊU BIN"];

        this.allLayer = [new LichSuChoiXlotLayer(this.getContentSize()), new LichSuNapXlotLayer(this.getContentSize()), new LichSuTieuXlotLayer(this.getContentSize())];

        for(var i = 0; i < this.allLayer.length; i++)
        {
            this.addChild(this.allLayer[i]);
        }


        var tabselect = new cc.Sprite("#home_ttcn_lsu_tabselect.png");
        bg_tab.addChild(tabselect);
        var tabpos = [90, bg_tab.width/2, 392];


        for(var i = 0; i < this.allLayer.length; i++)
        {
            (function () {

                var lb_tit = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, _tab_title[i]);
                lb_tit.setColor(cc.color("#e86b64"));
                lb_tit.setPosition(cc.p(tabpos[i], bg_tab.height/2));
                bg_tab.addChild(lb_tit);

                var mNode = thiz.allLayer[i];

                var toggleItem = new ToggleNodeItem(tabselect.getContentSize());
                toggleItem.setAnchorPoint(cc.p(0.5, 0.5));
                toggleItem.setPosition(lb_tit.getPosition());
                mToggle.addItem(toggleItem);

                toggleItem.onSelect = function (force) {
                    tabselect.setPosition(lb_tit.getPosition());
                    mNode.setVisible(true);
                    lb_tit.setColor(cc.color("#ffffff"));
                };
                toggleItem.onUnSelect = function () {
                    mNode.setVisible(false);

                    lb_tit.setColor(cc.color("#e86b64"));
                }
            })();

        }
    },

    onEnter : function () {
        this._super();
    },

    setVisible : function (isVisible) {
        this._super(isVisible);
        if(isVisible)
        {
            this.mToggle.selectItem(0);
        }
    }
    
});



var LichSuChoiXlotLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();


        this.setContentSize(mSize);

        var m_list_titlecolumn = ["PHIÊN", "THỜI GIAN", "GAME", "TIỀN", "SỐ DƯ", "MÔ TẢ"];
        var m_list_titlecolumnPos = [67, 220, 433, 610, 773, 934];


        var forebg = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg.setPreferredSize(cc.size(1054, 59));
        forebg.setPosition(cc.p(this.width/2, 407));
        this.addChild(forebg, 1);


        var forebg1 = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 362));
        forebg1.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg1, 1);

        for(var i = 0; i < m_list_titlecolumn.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, m_list_titlecolumn[i]);
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(m_list_titlecolumnPos[i], forebg.height/2));
            forebg.addChild(m_lb);
        }


        var _magin = 17;

        var mList = new newui.TableView(cc.size(forebg1.width - _magin, forebg1.height - _magin - 17) , 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(_magin - 8, _magin - 2));
        forebg1.addChild(mList, 1);
        this.mList = mList;

        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;

    },


    addLsuChoiXlot : function (idphien, thoigian, game, tien, sodu, mota) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mList.width, 46));

        if(this.mList.getChildrenCount() %2===0)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }

        var lb_idphien = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, idphien);
        lb_idphien.setPosition(cc.p(86, container.height/2));
        container.addChild(lb_idphien);


        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thoigian);
        lb_thoigian.setPosition(cc.p(262, container.height/2));
        container.addChild(lb_thoigian);

        var lb_game = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, game);
        lb_game.setColor(cc.color("#ffe400"));
        lb_game.setPosition(cc.p(456, container.height/2));
        container.addChild(lb_game);

        var lb_xlot = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cc.Global.NumberFormat1(tien));
        lb_xlot.setColor(cc.color("#ffe400"));
        lb_xlot.setPosition(cc.p(620, container.height/2));
        container.addChild(lb_xlot);

        var lb_sodu = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cc.Global.NumberFormat1(sodu));
        lb_sodu.setColor(cc.color("#ffe400"));
        lb_sodu.setPosition(cc.p(790, container.height/2));
        container.addChild(lb_sodu);

        var lb_mota = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, mota);
        lb_mota.setPosition(cc.p(950, container.height/2));
        container.addChild(lb_mota);


        this.mList.pushItem(container);
    },
    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("get_history_for_user", this.getHisChoiXlot,this);

    },

    setVisible : function (isVisible) {
        this._super(isVisible);
        if (isVisible) {
            this.mList.removeAllItems();
            var request = {
                command : "get_history_for_user",
                game: ""
            };
            SocketClient.getInstance().sendHttpGetRequest(request);
            this.loadingNode.setVisible(true);


            // for (var i = 0; i < 20; i++)
            // {
            //     this.addLsuChoiXlot("3213213", "21/12/1222", "tai xiu", 10000, 1000000, "thang thua");
            // }
        }
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },
    getHisChoiXlot : function (cmd, data) {
        cc.log(data);
        this.loadingNode.setVisible(false);
        if(data["status"] === 0)
        {
            var mlist = data["data"];
            for(var i = 0; i < mlist.length; i++)
            {
                var mdata = mlist[i];
                this.addLsuChoiXlot(mdata["gameId"], mdata["date"], mdata["game"], mdata["winMoney"], mdata["money"], mdata["desc"]);
            }
        }
    }
});

var LichSuNapXlotLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();


        this.setContentSize(mSize);

        var m_list_titlecolumn = ["THỜI GIAN", "LOẠI", "MỆNH GIÁ", "BIN NHẬN", "TRẠNG THÁI"];
        var m_list_titlecolumnPos = [96, 311, 453, 681, 895];


        var forebg = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg.setPreferredSize(cc.size(1054, 59));
        forebg.setPosition(cc.p(this.width/2, 407));
        this.addChild(forebg, 1);


        var forebg1 = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 362));
        forebg1.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg1, 1);

        for(var i = 0; i < m_list_titlecolumn.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, m_list_titlecolumn[i]);
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(m_list_titlecolumnPos[i], forebg.height/2));
            forebg.addChild(m_lb);
        }


        var _magin = 17;

        var mListNapXlot = new newui.TableView(cc.size(forebg1.width - _magin, forebg1.height - _magin - 10) , 1);
        mListNapXlot.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mListNapXlot.setScrollBarEnabled(false);
        mListNapXlot.setAnchorPoint(cc.p(0.0, 0.0));
        mListNapXlot.setPosition(cc.p(_magin - 8, _magin - 2));
        forebg1.addChild(mListNapXlot, 1);
        this.mListNapXlot = mListNapXlot;


        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;
    },


    addLsuNapXlot : function (thoigian, loai, menhgia, xlotnhan, trangthai) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mListNapXlot.width, 46));

        if(this.mListNapXlot.getChildrenCount() %2===0)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }


        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thoigian);
        lb_thoigian.setPosition(cc.p(128, container.height/2));
        container.addChild(lb_thoigian);

        var lb_loai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, loai);
        lb_loai.setColor(cc.color("#ffe400"));
        lb_loai.setPosition(cc.p(320, container.height/2));
        container.addChild(lb_loai);

        var lb_menhgia = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, menhgia);
        lb_menhgia.setColor(cc.color("#ffe400"));
        lb_menhgia.setPosition(cc.p(483, container.height/2));
        container.addChild(lb_menhgia);

        var lb_xlotnhan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, xlotnhan);
        lb_xlotnhan.setColor(cc.color("#ffe400"));
        lb_xlotnhan.setPosition(cc.p(710, container.height/2));
        container.addChild(lb_xlotnhan);

        var lb_trangthai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, trangthai);
        lb_trangthai.setColor(trangthai === "Thành công"?cc.color("#9ab228"):cc.color("#b86464"));
        lb_trangthai.setColor(cc.color("#ffe400"));
        lb_trangthai.setPosition(cc.p(935, container.height/2));
        container.addChild(lb_trangthai);


        this.mListNapXlot.pushItem(container);
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("cash_in_history", this._onCashinHis, this);
    },
    setVisible : function (isVisible) {
        this._super(isVisible);
        if (isVisible) {
            this.mListNapXlot.removeAllItems();
            var request = {
                command: "cash_in_history"
            };
            SocketClient.getInstance().sendHttpGetRequest(request);

            this.loadingNode.setVisible(true);


            // for (var i = 0; i < 20; i++)
            // {
            //     this.addLsuNapXlot("25:14:14  28/11/2017", "VIETTEL", 100.000, 100000000, "Thành công");
            // }
        }
    },

    _onCashinHis : function (cmd, data) {
        cc.log(data);
        this.loadingNode.setVisible(false);
        var mlist = data["data"];
        if(mlist)
        {
            for(var i = 0; i < mlist.length; i++){
                var obj = mlist[i];
                this.addLsuNapXlot(obj["timestamp"], obj["type"], obj["price"], obj["gold"], obj["status"]);
            }
        }

    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    }
});

var LichSuTieuXlotLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);

        var m_list_titlecolumn = ["THỜI GIAN", "LOẠI", "BIN TIÊU", "SỐ DƯ", "TRẠNG THÁI"];
        var m_list_titlecolumnPos = [96, 311, 453, 681, 895];


        var forebg = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg.setPreferredSize(cc.size(1054, 59));
        forebg.setPosition(cc.p(this.width/2, 407));
        this.addChild(forebg, 1);


        var forebg1 = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 362));
        forebg1.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg1, 1);

        for(var i = 0; i < m_list_titlecolumn.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, m_list_titlecolumn[i]);
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(m_list_titlecolumnPos[i], forebg.height/2));
            forebg.addChild(m_lb);
        }


        var _magin = 17;

        var mListTieuxLot = new newui.TableView(cc.size(forebg1.width - _magin, forebg1.height - _magin - 10) , 1);
        mListTieuxLot.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mListTieuxLot.setScrollBarEnabled(false);
        mListTieuxLot.setAnchorPoint(cc.p(0.0, 0.0));
        mListTieuxLot.setPosition(cc.p(_magin - 8, _magin - 2));
        forebg1.addChild(mListTieuxLot, 1);
        this.mListTieuxLot = mListTieuxLot



        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;

    },


    addLsuTieuXlot : function (thoigian, loai, menhgia, xlotnhan, trangthai) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mListTieuxLot.width, 46));

        if(this.mListTieuxLot.getChildrenCount() %2===0)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }


        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thoigian);
        lb_thoigian.setPosition(cc.p(128, container.height/2));
        container.addChild(lb_thoigian);

        var lb_loai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, loai);
        lb_loai.setColor(cc.color("#ffe400"));
        lb_loai.setPosition(cc.p(320, container.height/2));
        container.addChild(lb_loai);

        var lb_menhgia = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, menhgia);
        lb_menhgia.setColor(cc.color("#ffe400"));
        lb_menhgia.setPosition(cc.p(473, container.height/2));
        container.addChild(lb_menhgia);

        var lb_xlotnhan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, xlotnhan);
        lb_xlotnhan.setColor(cc.color("#ffe400"));
        lb_xlotnhan.setPosition(cc.p(700, container.height/2));
        container.addChild(lb_xlotnhan);

        var lb_trangthai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, trangthai);
        lb_trangthai.setColor(trangthai === "Thành công"?cc.color("#ffe400"):cc.color("#b86464"));
        lb_trangthai.setPosition(cc.p(935, container.height/2));
        container.addChild(lb_trangthai);


        this.mListTieuxLot.pushItem(container);
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("fetch_cashout_log", this._onCashoutHis, this);
    },

    setVisible : function (isVisible) {
        this._super(isVisible);
        if (isVisible) {
            this.mListTieuxLot.removeAllItems();
            var request = {
                command: "fetch_cashout_log",
                skip:0,
                limit: 50

            };
            SocketClient.getInstance().sendHttpGetRequest(request);

            this.loadingNode.setVisible(true);

            // for (var i = 0; i < 20; i++)
            // {
            //     this.addLsuTieuXlot("25:14:14  28/11/2017", "VIETTEL", 100.000, 100000000, "Thành công");
            // }
        }
    },

    _onCashoutHis : function (cmd, data) {
        cc.log(data);
        this.loadingNode.setVisible(false);
        if(data && data["data"] && data["data"]["items"])
        {
            var mlist = data["data"]["items"];
            if(mlist && mlist.length)
            {
                for(var i = 0; i < mlist.length; i++){
                    var obj = mlist[i];
                    this.addLsuTieuXlot(obj["createdTime"], obj["productName"], obj["gold"], obj["goldAfter"], obj["status"]);
                }
            }
        }
    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    }
});



var BaoMatLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);

        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg.setAnchorPoint(cc.p(0.5, 0));
        forebg.setPreferredSize(cc.size(1054, 468));
        forebg.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg, 1);
        this.forebg = forebg;

        var icon_ket = new cc.Sprite("#home_ttcn_bmat_iconket.png");
        icon_ket.setPosition(cc.p(297, 292));
        forebg.addChild(icon_ket);


        var lb_usermoney = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, cc.Global.NumberFormat1(PlayerMe.goldBank));
        lb_usermoney.setScale(28.0/30.0);
        lb_usermoney.setColor(cc.color("#fffc00"));
        lb_usermoney.setPosition(cc.p(icon_ket.width/2, 22));
        icon_ket.addChild(lb_usermoney);
        this.lb_usermoney = lb_usermoney;
// //
        var btn_rutra = new ccui.Button("home_ttcn_bmat_btnrut.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_rutra.setPosition(cc.p(icon_ket.x - 95, 80));
        btn_rutra.addClickEventListener(function () {
            var rutPop = new CatRutXlotDialog(false);
            rutPop.showWithAnimationMove();
        });
        forebg.addChild(btn_rutra);

        var btn_catvao = new ccui.Button("home_ttcn_bmat_btncat.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_catvao.setPosition(cc.p(icon_ket.x + 95, 80));
        btn_catvao.addClickEventListener(function () {
            var rutPop = new CatRutXlotDialog(true);
            rutPop.showWithAnimationMove();
        });
        forebg.addChild(btn_catvao);


        var btn_doimk = new ccui.Button("home_ttcn_bmat_btndoimk.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_doimk.setAnchorPoint(cc.p(0.0, 0.5));
        btn_doimk.setPosition(cc.p(600, 410));
        forebg.addChild(btn_doimk);


        var btn_khoagame = new ccui.Button("home_ttcn_btn_khoagame.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_khoagame.setAnchorPoint(cc.p(0.0, 0.5));
        btn_khoagame.setPosition(cc.p(600, btn_doimk.y - 85));
        forebg.addChild(btn_khoagame);


        var btn_khoatinhnang = new ccui.Button("home_ttcn_btn_khoatinhnang.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_khoatinhnang.setAnchorPoint(cc.p(0.0, 0.5));
        btn_khoatinhnang.setPosition(cc.p(600, btn_khoagame.y - 85));
        forebg.addChild(btn_khoatinhnang);


        var btn_lsudangnhap = new ccui.Button("home_ttcn_btn_lsudangnhap.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_lsudangnhap.setAnchorPoint(cc.p(0.0, 0.5));
        btn_lsudangnhap.setPosition(cc.p(600, btn_khoatinhnang.y - 85));
        forebg.addChild(btn_lsudangnhap);

        var btn_dangnhap2buoc = new ccui.Button("home_ttcn_bmat_dangnhap2buoc.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_dangnhap2buoc.setAnchorPoint(cc.p(0.0, 0.5));
        btn_dangnhap2buoc.setPosition(cc.p(600, btn_lsudangnhap.y - 85));
        forebg.addChild(btn_dangnhap2buoc);

        var thiz = this;


        btn_doimk.addClickEventListener(function () {

            if(PlayerMe.phoneNumber === "")
            {
                var popThongbao = new MessageConfirmDialog();
                popThongbao.setMessage("Bạn chưa xác thực tài khoản! \nBạn có muốn xác thực ngay không? ");
                popThongbao.show();

                popThongbao.btn_ok.addClickEventListener(function () {
                    thiz.getParent().mToggle.selectItem(0);
                    thiz.refreshGoldBank();
                    popThongbao.closeButtonHandler();
                });
            }
            else
            {
                BaoMatPopsDialog.showDoiMatKhauDialog();
            }

        });

        btn_khoagame.addClickEventListener(function () {
           BaoMatPopsDialog.showKhoaGameDialog();
        });

        btn_khoatinhnang.addClickEventListener(function () {
           BaoMatPopsDialog.showKhoaTinhNangDialog();
        });

        btn_lsudangnhap.addClickEventListener(function () {
            BaoMatPopsDialog.showLichSuLogin();
        });
        btn_dangnhap2buoc.addClickEventListener(function () {
            // MessageNode.getInstance().show("Tính năng chưa mở trong thời gian Alpha Test")
            BaoMatPopsDialog.showDangNhapHaiBuoc();
        });
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("ua", this._onUpdateAsset, this);
    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },
    _onUpdateAsset : function (cmd, data) {
        cc.log(data);
        if(data["r"] >= 0){
            this.refreshGoldBank();
        }
    },

    refreshGoldBank : function () {
        this.lb_usermoney.setString(cc.Global.NumberFormat1(PlayerMe.goldBank));
    }
});