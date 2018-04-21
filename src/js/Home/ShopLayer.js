/**
 * Created by Balua on 7/18/17.
 */




var ShopLayer = Dialog.extend({
    ctor : function(){
        this._super();
        var thiz = this;

        this.initWithSize(cc.size(1095, 597));
        this.title.setString("CỬA HÀNG");
        this._paddingBottom = 30;

        var lb_titlesodu = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Số dư");

        var icon_coin_sodu = new cc.Sprite("#home_shop_item_coin.png");
        var lb_valueSodu = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, cc.Global.NumberFormat1(PlayerMe.gold));
        lb_valueSodu.setScale(28.0/30.0);
        lb_valueSodu.setColor(cc.color("#fffc00"));
        this.lb_valueSodu = lb_valueSodu;


        var widgetsodu = new ccui.Widget();
        widgetsodu.setAnchorPoint(cc.p(0.5, 0.5));
        widgetsodu.setContentSize(cc.size(lb_titlesodu.width + 10 + icon_coin_sodu.width + 10 + lb_valueSodu.width, icon_coin_sodu.height));

        lb_titlesodu.setAnchorPoint(cc.p(0.0, 0.5));
        lb_titlesodu.setPosition(cc.p(0, widgetsodu.height/2));
        widgetsodu.addChild(lb_titlesodu);

        icon_coin_sodu.setAnchorPoint(cc.p(0.0, 0.5));
        icon_coin_sodu.setPosition(cc.p(100, widgetsodu.height/2));
        widgetsodu.addChild(icon_coin_sodu);

        lb_valueSodu.setAnchorPoint(cc.p(0.0, 0.5));
        lb_valueSodu.setPosition(cc.p(153, widgetsodu.height/2));
        widgetsodu.addChild(lb_valueSodu);

        widgetsodu.setPosition(cc.p(this.width/2, 463));
        this.addChild(widgetsodu, 2);
        this.widgetsodu = widgetsodu;

        var bg_tab = new ccui.Scale9Sprite("home_shop_bg_tab.png", cc.rect(50, 0, 4, 72));
        bg_tab.setPreferredSize(cc.size(773, 72));
        bg_tab.setPosition(cc.p(this.width/2, this.height - 53));
        this.addChild(bg_tab);


        var mToggle = new ToggleNodeGroup();
        bg_tab.addChild(mToggle);
        this.mToggle = mToggle;

        this.allLayer = [new ChuyenKhoanLayer(this.getContentSize()), new DoiTheLayer(this.getContentSize()), new ShopDaiLyLayer(this.getContentSize()), new ShopNhanThuongLayer(this.getContentSize())];
        for(var i = 0; i < this.allLayer.length; i++)
        {
            this.addChild(this.allLayer[i],1);
        }

        var _tabNapVangName = ["CHUYỂN KHOẢN", "ĐỔI THẺ", "ĐẠI LÝ", "NHẬN THƯỞNG"];
        var _tabNapVangPos = [100, 310, 480, 672];


        var tab_select = new cc.Sprite("#home_shop_tab_select.png");
        bg_tab.addChild(tab_select);


        for(var i = 0; i < _tabNapVangName.length; i++)
        {
            (function () {

                var _btnTab = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, _tabNapVangName[i]);
                _btnTab.setPosition(cc.p(_tabNapVangPos[i], bg_tab.height/2));
                bg_tab.addChild(_btnTab);

                var mNode = thiz.allLayer[i];

                var toggleItem = new ToggleNodeItem(tab_select.getContentSize());
                toggleItem.setAnchorPoint(cc.p(0.5, 0.5));
                toggleItem.setPosition(_btnTab.getPosition());
                mToggle.addItem(toggleItem);

                var a = i;

                toggleItem.onSelect = function (force) {
                    thiz.setVisiblelblsodu(a);
                    tab_select.setPosition(_btnTab.getPosition());
                    _btnTab.setColor(cc.color("#5b391a"));
                    mNode.setVisible(true);
                };
                toggleItem.onUnSelect = function () {
                    thiz.setVisiblelblsodu(a);
                    _btnTab.setColor(cc.color("#a59f9a"));
                    mNode.setVisible(false);
                }
            })();

        }
    },

    setVisiblelblsodu : function (index) {
        if(index === 1 ||index === 2 || index === 3)
        {
            this.widgetsodu.setVisible(false);

        }
        else
        {
            this.widgetsodu.setVisible(true);
        }
    },

    onEnter : function()
    {
        this._super();
        this.mToggle.selectItem(0);
        this.setValueSoDu(PlayerMe.gold);
        SocketClient.getInstance().addListener("ua", this._onUpdateAsset, this);
        SocketClient.getInstance().addListener("refreshAsset", this._onUpdateAsset, this);
    },

    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    setValueSoDu : function (valueMoney) {
        this.lb_valueSodu.setString(cc.Global.NumberFormat1(valueMoney));
    },

    _onUpdateAsset : function (cmd, data) {
        this.setValueSoDu(PlayerMe.gold);
    }

});

var ChuyenKhoanLayer = cc.Node.extend({
    ctor : function(mSize)
    {
        this._super();
        this.setContentSize(mSize);

        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg.setAnchorPoint(cc.p(0.5, 0));
        forebg.setPreferredSize(cc.size(1054, 482));
        forebg.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg, 1);
        this.forebg = forebg;


        var noidungCK = new NoiDungOTP(forebg.getContentSize());
        forebg.addChild(noidungCK);
        this.noidungCK = noidungCK;

        var xacNhanLayer = new XacNhanOTP(forebg.getContentSize());
        xacNhanLayer.setVisible(false);
        forebg.addChild(xacNhanLayer);
        this.xacNhanLayer = xacNhanLayer;



        var thiz = this;
        noidungCK.btn_tieptuc.addClickEventListener(function () {

            var tienck = cc.Global.NumberFromString(thiz.noidungCK.getMoneyCK());

            if(thiz.noidungCK.getUserNameCK().length === 0)
            {
                MessageNode.getInstance().show("Bạn chưa nhập tên nhân vật !");
                thiz.noidungCK.userck.showKeyboard();
                return;
            }

            if(thiz.noidungCK.getUserNameCK() != thiz.noidungCK.getReUserNameCK())
            {
                MessageNode.getInstance().show("Tên nhân vật không giống nhau !");
                thiz.noidungCK.reuserck.showKeyboard();
                return;
            }

            if (thiz.noidungCK.getMoneyCK().length === 0){
                MessageNode.getInstance().show("Bạn chưa nhập số tiền !");
                thiz.noidungCK.moneyck.showKeyboard();
                return;
            }

            if (tienck < 10000){
                MessageNode.getInstance().show("Số tiền ít nhất là 10.000!");
                thiz.noidungCK.moneyck.showKeyboard();
                return;
            }

            if(thiz.noidungCK.isMerchantOk)
            {
                if((tienck + 10000) > PlayerMe.gold){
                    MessageNode.getInstance().show("Số tiền không đủ để chuyển khoản !");
                    thiz.noidungCK.moneyck.showKeyboard();
                    return;
                }
            }
            else
            {
                if(((tienck * CHUYENKHOAN_FEE) + tienck + 10000) > PlayerMe.gold){
                    MessageNode.getInstance().show("Số Bin không đủ để chuyển khoản !");
                    thiz.noidungCK.moneyck.showKeyboard();
                    return;
                }
            }


            if(thiz.noidungCK.isAccOk)
            {
                thiz.noidungCK.setVisible(false);
                thiz.xacNhanLayer.setVisible(true);
                thiz.xacNhanLayer.setContentOTP(thiz.noidungCK.getUserNameCK(), thiz.noidungCK.getMoneyCK(), thiz.noidungCK.getReasonCk(), thiz.noidungCK.getIsDaily());
            }
            else
            {
                MessageNode.getInstance().show("Nhân vật nhận Bin không đúng, vui lòng kiểm tra lại!");
                thiz.noidungCK.userck.showKeyboard();
            }

        });
    },

    onEnter : function () {
      this._super();
      SocketClient.getInstance().addHTTPListener("gold_transfer", this.onCkThanhCong, this);

    },
    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    setVisible : function (isVisible) {
        this._super(isVisible);
        if(isVisible)
        {
            this.xacNhanLayer.setVisible(false);
            this.noidungCK.setVisible(true);
        }
    },
    onCkThanhCong : function (cmd, data) {
        this.xacNhanLayer.tf_otpcode.setText("");

        if(data["status"] === 0)
        {
            this.xacNhanLayer.setVisible(false);
            this.noidungCK.setVisible(true);
            this.noidungCK.resetTextFields();
            MessageNode.getInstance().show("Chuyển khoản thành công !");
        }

    }
});


var CHUYENKHOAN_FEE = 0.0;
var NoiDungOTP = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        var thiz = this;
        this.setContentSize(mSize);
        this.isAccOk = false;
        this.isMerchantOk = false;


        var bg_username = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        bg_username.setPreferredSize(cc.size(407, 68));
        bg_username.setAnchorPoint(cc.p(0.5, 0.0));
        bg_username.setPosition(276, 355);
        this.addChild(bg_username);

        var bg_reusername = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        bg_reusername.setPreferredSize(cc.size(407, 68));
        bg_reusername.setAnchorPoint(cc.p(0.5, 0.0));
        bg_reusername.setPosition(276, 275);
        this.addChild(bg_reusername);

        var bg_money = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        bg_money.setPreferredSize(cc.size(407, 68));
        bg_money.setAnchorPoint(cc.p(0.5, 0.0));
        bg_money.setPosition(276, 196);
        this.addChild(bg_money);

        var bg_reason = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        bg_reason.setPreferredSize(cc.size(407, 68));
        bg_reason.setAnchorPoint(cc.p(0.5, 0.0));
        bg_reason.setPosition(276, 117);
        this.addChild(bg_reason);


        var lb_moneynhan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Nhận được: ");
        lb_moneynhan.setAnchorPoint(cc.p(0.0, 0.5));
        lb_moneynhan.setPosition(cc.p(69, 80));
        this.addChild(lb_moneynhan);

        var icon_coin = new cc.Sprite("#home_shop_item_coin.png");
        icon_coin.setPosition(cc.p(lb_moneynhan.x + lb_moneynhan.width + 20, lb_moneynhan.y));
        this.addChild(icon_coin);

        var lb_valuemoney = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "");
        lb_valuemoney.setColor(cc.color("#fffc00"));
        lb_valuemoney.setAnchorPoint(cc.p(0.0, 0.5));
        lb_valuemoney.setPosition(cc.p(icon_coin.x + 20, icon_coin.y));
        this.addChild(lb_valuemoney);
        this.lb_valuemoney  = lb_valuemoney;

        var lb_phick = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Phí chuyển khoản: ");
        lb_phick.setAnchorPoint(cc.p(0.0, 0.5));
        lb_phick.setPosition(cc.p(lb_moneynhan.x, 35));
        this.addChild(lb_phick);
        this.lb_phick = lb_phick;



        var lb_valuePhi = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "");
        lb_valuePhi.setColor(cc.color("#fffc00"));
        lb_valuePhi.setAnchorPoint(cc.p(0.0, 0.5));
        lb_valuePhi.setPosition(cc.p(lb_phick.x + lb_phick.width + 10, lb_phick.y));
        this.addChild(lb_valuePhi);
        this.lb_valuePhi = lb_valuePhi;


        var userck = new newui.TextField(cc.size(bg_username.getContentSize().width - 6, bg_username.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        userck.setAlignment(0);
        userck.setPlaceHolder("Tên nhân vật nhận");
        userck.setTextColor(cc.color("#525252"));
        userck.setPlaceHolderColor(cc.color("#525252"));
        userck.setMaxLength(32);
        userck.setAnchorPoint(cc.p(0.5, 0.0));
        userck.setPosition(cc.p(bg_username.x + 3, bg_username.y + 1));
        this.addChild(userck,1);
        this.userck = userck;


        var reuserck = new newui.TextField(cc.size(bg_username.getContentSize().width - 6, bg_username.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        reuserck.setAlignment(0);
        reuserck.setPlaceHolder("Nhập lại tên nhân vật");
        reuserck.setTextColor(cc.color("#525252"));
        reuserck.setPlaceHolderColor(cc.color("#525252"));
        reuserck.setMaxLength(32);
        reuserck.setAnchorPoint(cc.p(0.5, 0.0));
        reuserck.setPosition(cc.p(bg_reusername.x + 3, bg_reusername.y +  1));
        this.addChild(reuserck,1);
        this.reuserck = reuserck;


        var moneyck = new newui.TextField(cc.size(bg_username.getContentSize().width - 6, bg_username.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        moneyck.setAlignment(0);
        moneyck.setPlaceHolder("Số Bin cần chuyển");
        moneyck.setTextColor(cc.color("#525252"));
        moneyck.setPlaceHolderColor(cc.color("#525252"));
        moneyck.setMaxLength(15);
        moneyck.setAnchorPoint(cc.p(0.5, 0.0));
        moneyck.setPosition(cc.p(bg_money.x + 3, bg_money.y +  1));
        this.addChild(moneyck,1);
        this.moneyck = moneyck;


        var reasonck = new newui.TextField(cc.size(bg_username.getContentSize().width - 6, bg_username.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        reasonck.setAlignment(0);
        reasonck.setPlaceHolder("Lý do chuyển khoản");
        reasonck.setTextColor(cc.color("#525252"));
        reasonck.setPlaceHolderColor(cc.color("#525252"));
        reasonck.setMaxLength(128);
        reasonck.setAnchorPoint(cc.p(0.5, 0.0));
        reasonck.setPosition(cc.p(bg_reason.x  + 3, bg_reason.y +  1));
        this.addChild(reasonck,1);
        this.reasonck = reasonck;

        userck.nextTextField = reuserck;
        reuserck.nextTextField = moneyck;
        moneyck.nextTextField = reasonck;



        var lb_quydinh = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Quy định chuyển khoản :\n\n" +
            "- Giá trị giao dịch tối thiểu 10.000\n" +
            "- Chỉ hỗ trợ các nhân vật đã xác thực SĐT.\n" +
            "- Các giao dịch chuyển nhầm tên nhân vật được\n tính là giao dịch hợp lệ và không được hoàn trả.\n" +
            "- Sau khi chuyển cần còn lại tối thiểu 10.000\n" +
            "- Không giới hạn số tiền chuyển tối đa trong ngày\n" +
            "- Người chơi chuyển khoản cho đại lý, đại lý sẽ chịu toàn bộ phí chuyển khoản.", cc.TEXT_ALIGNMENT_LEFT, 520);

        lb_quydinh.setAnchorPoint(cc.p(0.0, 0.0));
        lb_quydinh.setPosition(cc.p(525, 123));
        this.addChild(lb_quydinh);



        var isdaily  = new cc.Sprite("#home_shop_btn_daily.png");
        isdaily.setAnchorPoint(cc.p(1.0, 0.5));
        isdaily.setVisible(false);
        isdaily.setPosition(cc.p(bg_reusername.x + bg_reusername.width/2 - 10, bg_reusername.y + 30));
        this.addChild(isdaily);
        this.isdaily = isdaily;

        var isuserok  = new cc.Sprite("#home_vip_checkok.png");
        isuserok.setAnchorPoint(cc.p(1.0, 0.5));
        isuserok.setVisible(false);
        isuserok.setPosition(cc.p(isdaily.x - 10, bg_reusername.y + 30));
        this.addChild(isuserok);
        this.isuserok = isuserok;


        var btn_tieptuc = new ccui.Button("home_shop_ck_tieptuc.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_tieptuc.setPosition(cc.p(767, 59));
        this.addChild(btn_tieptuc);
        this.btn_tieptuc  = btn_tieptuc;


        reuserck.setFocusListener(function (focus) {
            if(focus){

            }
            else{
                SocketClient.getInstance().addHTTPListener("check_merchant", thiz._checkMerchant, thiz);

                if(thiz.getUserNameCK().length === 0)
                {
                    MessageNode.getInstance().show("Bạn chưa nhập tên nhân vật !");
                }
                else if(thiz.getUserNameCK() != thiz.getReUserNameCK())
                {
                    MessageNode.getInstance().show("Nhân vật không giống nhau !");
                }
                else
                {
                    thiz.sendCheckIsMerchant();
                }

            }
        });


        //

        moneyck.setFocusListener(function (focus) {
            if(focus){
                // goldCorrectIcon.visible = false;
            }
            else{
                thiz._updateCkFeeLabel();
            }
        });

        moneyck.setTextChangeListener(function (type, newString) {
            if(newString === ""){
                moneyck.setText(newString);
            }
            else{
                var str = newString.replace(/[.,]/g,'');
                if(cc.Global.IsNumber(str)){
                    var numberInput = parseInt(str);
                    moneyck.setText(cc.Global.NumberFormat1(numberInput));
                }
            }
            thiz._updateCkFeeLabel();
            return true;
        });


        this.getFeeCk();
    },

    sendCheckIsMerchant : function () {
        this.isdaily.setVisible(false);
        this.isuserok.setVisible(false);
        var request = {
            command: "check_merchant",
            action: "CheckMerchantRequest",
            nickName: this.reuserck.getText()
        };
        SocketClient.getInstance().sendHttpGetRequest(request);
    },

    _updateCkFeeLabel : function () {
        var goldInput = cc.Global.NumberFromString(this.moneyck.getText());
        var goldFee = Math.round(goldInput * CHUYENKHOAN_FEE);

        this.lb_valuemoney.setString(cc.Global.NumberFormat1(goldInput));
        this.lb_valuePhi.setString(cc.Global.NumberFormat1(goldFee))

    },

    getUserNameCK : function () {
        return this.userck.getText();
    },

    getReUserNameCK : function () {
        return this.reuserck.getText();
    },

    getMoneyCK : function () {
        return this.moneyck.getText();
    },

    getReasonCk : function () {
        return this.reasonck.getText();
    },

    getIsDaily : function () {
      return this.lb_phick.visible;
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("check_merchant", this._checkMerchant, this);
        SocketClient.getInstance().addHTTPListener("gold_transfer_fee", this._onGetFeeCkFromServer, this);
    },

    setVisible : function (isVisible) {
        this._super(isVisible);
    },
    _checkMerchant : function (cmd, data) {
        cc.log(data);
        var isdly = data["isMerchant"];
        this.isdaily.setVisible(isdly);
        this.isAccOk = data["isValid"];
        if(!isdly)
        {
            this.isuserok.setVisible(true);
            if(this.isAccOk)
            {
                this.isuserok.setSpriteFrame("home_vip_checkok.png");
            }
            else
            {
                this.isuserok.setSpriteFrame("home_vip_checknotok.png");
            }
        }

        this.lb_phick.setVisible(!isdly);
        this.lb_valuePhi.setVisible(!isdly);
        this.isMerchantOk = isdly;
    },

    _onGetFeeCkFromServer : function (cmd, data) {
        CHUYENKHOAN_FEE = data["fee"];
    },

    getFeeCk : function () {
        var request = {
            command: "gold_transfer_fee",
            action: "FetchUserFeeRequest"
        };
        SocketClient.getInstance().sendHttpGetRequest(request);
    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },
    setNameDaiLy : function (namedaily) {
        this.userck.setText(namedaily);
        this.reuserck.setText(namedaily);
        this.sendCheckIsMerchant();
    },

    resetTextFields : function () {
        this.userck.setText("");
        this.reuserck.setText("");
        this.moneyck.setText("");
        this.reasonck.setText("");
        this.lb_valuemoney.setString("");
        this.lb_valuePhi.setString("");
    }


});

var XacNhanOTP = cc.Node.extend({
    ctor : function(mSize){
        this._super();

        this.setContentSize(mSize);

        var lb_tknxnguoinhan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Người nhận là: ");
        lb_tknxnguoinhan.setAnchorPoint(cc.p(0.0, 0.5));
        lb_tknxnguoinhan.setPosition(cc.p(387, 398));
        this.addChild(lb_tknxnguoinhan);

        var lb_tknguoinhan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "");
        lb_tknguoinhan.setAnchorPoint(cc.p(0.0, 0.5));
        lb_tknguoinhan.setPosition(cc.p(lb_tknxnguoinhan.x + lb_tknxnguoinhan.width + 30, 398));
        lb_tknguoinhan.setColor(cc.color("#fffc00"));
        this.addChild(lb_tknguoinhan);
        this.lb_tknguoinhan = lb_tknguoinhan;

        var lb_daily = new cc.Sprite("#home_shop_btn_daily.png");
        lb_daily.setPosition(cc.p(lb_tknguoinhan.x + lb_tknguoinhan.width + 80, lb_tknguoinhan.y));
        lb_daily.setVisible(false);
        lb_daily.setScale(0.8);
        this.addChild(lb_daily);
        this.lb_daily = lb_daily;


        var lb_tkhxacnhan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Tên nhân vật: ");
        lb_tkhxacnhan.setAnchorPoint(cc.p(0.0, 0.5));
        lb_tkhxacnhan.setPosition(cc.p(387, 361));
        this.addChild(lb_tkhxacnhan);

        var lb_usernamexacnhan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "");
        lb_usernamexacnhan.setAnchorPoint(cc.p(0.0, 0.5));
        lb_usernamexacnhan.setPosition(cc.p(lb_tkhxacnhan.x + lb_tkhxacnhan.width + 30, 361));
        lb_usernamexacnhan.setColor(cc.color("#fffc00"));
        this.addChild(lb_usernamexacnhan);
        this.lb_usernamexacnhan = lb_usernamexacnhan;

        var lb_xnmoney = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Số tiền nhận được: ");
        lb_xnmoney.setAnchorPoint(cc.p(0.0, 0.5));
        lb_xnmoney.setPosition(cc.p(355, 324));
        this.addChild(lb_xnmoney);

        var icon_coin_nx = new cc.Sprite("#home_shop_item_coin.png");
        icon_coin_nx.setPosition(cc.p(lb_xnmoney.x + lb_xnmoney.width + 20, lb_xnmoney.y));
        this.addChild(icon_coin_nx);

        var lb_valuemoney_xn = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "");
        lb_valuemoney_xn.setColor(cc.color("#fffc00"));
        lb_valuemoney_xn.setAnchorPoint(cc.p(0.0, 0.5));
        lb_valuemoney_xn.setPosition(cc.p(icon_coin_nx.x + 20, icon_coin_nx.y));
        this.addChild(lb_valuemoney_xn);
        this.lb_valuemoney_xn = lb_valuemoney_xn;


        var bg_otpcode = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        bg_otpcode.setPreferredSize(cc.size(407, 68));
        bg_otpcode.setAnchorPoint(cc.p(0.5, 0.0));
        bg_otpcode.setPosition(this.width/2, 222);
        this.addChild(bg_otpcode);


        var tf_otpcode = new newui.TextField(cc.size(bg_otpcode.getContentSize().width - 6, bg_otpcode.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        tf_otpcode.setAlignment(0);
        tf_otpcode.setAlignment(cc.TEXT_ALIGNMENT_LEFT);
        tf_otpcode.setPlaceHolder("Nhập mã OTP");
        tf_otpcode.setTextColor(cc.color("#525252"));
        tf_otpcode.setPlaceHolderColor(cc.color("#525252"));
        tf_otpcode.setMaxLength(6);
        tf_otpcode.setAnchorPoint(cc.p(0.5, 0.0));
        tf_otpcode.setPosition(cc.p(bg_otpcode.x + 3, bg_otpcode.y + 1));
        this.addChild(tf_otpcode,1);
        this.tf_otpcode = tf_otpcode;
        var thiz = this;



        var btn_xacnhan = new ccui.Button("home_shop_ck_xacnhan.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // btn_xacnhan.setScale(cc.winSize.screenScale);
        btn_xacnhan.setPosition(cc.p(this.width/2 - 103, 100));
        this.addChild(btn_xacnhan);
        btn_xacnhan.addClickEventListener(function () {
           if(tf_otpcode.getText().length === 0)
           {
               MessageNode.getInstance().show("Bạn chưa nhập mã OTP !");
           }
           else
           {
               var request = {
                   command:"gold_transfer",
                   action:"TransferUserToMerchantRequest",
                   receiverNickname: thiz.lb_usernamexacnhan.getString(),
                   gold: cc.Global.NumberFromString(thiz.lb_valuemoney_xn.getString()),
                   content: thiz.contentCk,
                   otp: tf_otpcode.getText()

               };
               SocketClient.getInstance().sendHttpGetRequest(request);
           }
        });

        var btn_layotp = new ccui.Button("home_shop_btnlayopt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // btn_layotp.setScale(cc.winSize.screenScale);
        btn_layotp.setPosition(cc.p(this.width/2 + 103, 100));
        this.addChild(btn_layotp);
        btn_layotp.addClickEventListener(function () {
            GetOTPDialog.showGetOTPDialog();
        });


    },

    setContentOTP : function(username, money, reasonCK, isdaily){
        this.lb_usernamexacnhan.setString(username);
        this.lb_valuemoney_xn.setString(money);
        this.contentCk = reasonCK;
        this.lb_tknguoinhan.setString(isdaily?"Người chơi":"Đại lý");
        this.lb_tknguoinhan.setColor(cc.color(isdaily?"#fffc00":"#00ffff"));
        this.lb_daily.setVisible(isdaily?false:true);
    },

    setVisible : function (isVisible) {
        this._super(isVisible);
        if(isVisible)
        {
            var request = {
                command : "get_otp_sms"
            };
            SocketClient.getInstance().sendHttpGetRequest(request);
        }

    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("get_verify_sms", this.GetCodeVerifySms, this);
        this.getXacThucTK();
    },

    onExit : function () {
        this._super();
        this.contentopt = "";
        SocketClient.getInstance().removeListener(this);
    },


    GetCodeVerifySms : function (cmd, data) {
        if(data["status"] == 0)
        {
            PlayerMe.xacthucContent = data["data"]["content"];
        }
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

    }

});

var DoiTheLayer = cc.Node.extend({
    ctor : function(mSize){
        this._super();

        this.setContentSize(mSize);

        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg.setAnchorPoint(cc.p(0.5, 0));
        forebg.setPreferredSize(cc.size(1054, 482));
        forebg.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg, 1);
        this.forebg = forebg;


        var mList = new newui.TableView(cc.size(forebg.width - 40,forebg.height - 40), 4);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 1.0));
        mList.setPosition(cc.p(20, forebg.height - 20));
        forebg.addChild(mList);
        mList.setPadding(20);
        this.mList = mList;


        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;
    },


    addItemThe : function (nhamang, valuemoney, valuevang, iditem) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(236, 169));

        var bg_item = new cc.Sprite("#home_shop_bg_item_the.png");
        bg_item.setPosition(cc.p(container.width/2, container.height/2));
        container.addChild(bg_item);

        container.nameThe = "thẻ Viettel ";
        var typeThe = new cc.Sprite("#home_shop_viettel.png");
        // typeThe.setAnchorPoint(cc.p(0.0, 0.0));
        typeThe.setPosition(cc.p(bg_item.x, bg_item.y));
        container.addChild(typeThe);

        if(nhamang === "VMS")
        {
            typeThe.setSpriteFrame("home_shop_mobi.png");
            container.nameThe = "thẻ Mobifone ";
        }
        else if(nhamang === "VNP")
        {
            typeThe.setSpriteFrame("home_shop_vina.png");
            container.nameThe = "thẻ Vinaphone ";
        }


        var lb_money = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, cc.Global.NumberFormat1(valuemoney) + " VND");
        lb_money.setPosition(cc.p(container.width/2, 146));
        container.addChild(lb_money);


        var lb_vang = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, cc.Global.NumberFormat1(valuevang));
        lb_vang.setAnchorPoint(cc.p(0.0, 0.5));


        var itemcoin = new cc.Sprite("#home_shop_item_coin.png");
        itemcoin.setAnchorPoint(cc.p(0.0, 0.5));
        itemcoin.setScale(0.8);


        var chilcon = new ccui.Widget();
        chilcon.setContentSize(cc.size(itemcoin.width +  lb_vang.width, itemcoin.height));

        itemcoin.setPosition(cc.p(0, chilcon.height/2));
        lb_vang.setPosition(cc.p(itemcoin.width, chilcon.height/2));

        chilcon.addChild(lb_vang);
        chilcon.addChild(itemcoin);

        chilcon.setAnchorPoint(cc.p(0.5, 0.5));
        chilcon.setPosition(cc.p(bg_item.width/2, 64));
        bg_item.addChild(chilcon, 2);



        this.mList.pushItem(container);

        var thiz = this;

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {

            var dialog = new XacNhanDoiThuongDialog();
            dialog.setItemInfo(container.nameThe + cc.Global.NumberFormat1(valuemoney), valuevang);
            dialog.show();
            dialog.btn_ok.addClickEventListener(function () {
                if(thiz.requestReward(iditem)){
                    dialog.hide();
                }
            });

        });

    },

    requestReward : function (productId) {
        var request = {
            command:"cashout",
            productId:productId
        };
        SocketClient.getInstance().sendHttpGetRequest(request);
        LoadingDialog.getInstance().show();

        return true;
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("fetch_product", this._onGetListThe, this);
        SocketClient.getInstance().addHTTPListener("cashout", this._onCashout, this);
    },

    setVisible : function (isVisible) {
        this._super(isVisible);
        if (isVisible) {
            this.mList.removeAllItems();
            var request = {
                command: "fetch_product",
                productType : 1
            };

            SocketClient.getInstance().sendHttpGetRequest(request);
            // LoadingDialog.getInstance().show();
            this.loadingNode.setVisible(true);

            // for(var i = 0; i < 10; i++)
            // {
            //     this.addItemThe("", 50000, 50000, "1");
            // }
        }
    },

    _onGetListThe : function (cmd, data) {
        this.loadingNode.setVisible(false);
        if(data["data"] && data["data"]["1"])
        {
            var listthe = data["data"]["1"];
            if(listthe && listthe.length > 0)
            {
                for(var i = 0; i < listthe.length; i++)
                {
                    var obj = listthe[i];
                    this.addItemThe(obj["providerCode"], obj["netValue"], obj["gold"], obj["id"]);
                }
            }
        }


    },

    _onCashout : function (cmd, data) {
        LoadingDialog.getInstance().hide();
        if(data["status"] === 0)
        {
            MessageNode.getInstance().show(data["message"]);
        }
    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    }

});


var ShopDaiLyLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        var thiz = this;
        this.setContentSize(mSize);


        var m_list_titlecolumn = ["MÃ ĐẠI LÝ", "TÊN ĐẠI LÝ", "KHU VỰC", "SỐ ĐIỆN THOẠI"];
        var m_list_titlecolumnPos = [104 , 321, 517, 737];


        var forebg1 = new ccui.Scale9Sprite("dialog_fore1.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(mSize.width, 431));
        forebg1.setPosition(cc.p(this.width/2, 65));
        this.addChild(forebg1, 1);

        for(var i = 0; i < m_list_titlecolumn.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, m_list_titlecolumn[i]);
            // m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(m_list_titlecolumnPos[i], forebg1.height - 40));
            forebg1.addChild(m_lb);
        }


        var _magin = 17;

        this.arrdaily = [];

        var mListDaiLy = new newui.ListViewWithAdaptor(cc.size(forebg1.width - _magin, forebg1.height - 80));
        mListDaiLy.setScrollBarEnabled(false);
        mListDaiLy.setAnchorPoint(cc.p(0.0, 0.0));
        mListDaiLy.setPosition(cc.p(_magin - 8, _magin));
        forebg1.addChild(mListDaiLy, 1);
        this.mListDaiLy = mListDaiLy;

        mListDaiLy.setCreateItemCallback(function () {
            return thiz.addItemDiaLy("", "", "", "", "");
        });
        mListDaiLy.setSizeCallback(function () {
            return thiz.arrdaily.length;
        });
        mListDaiLy.setItemAdaptor(function (idx, view) {
            view.bg_cell.setVisible((idx % 2) === 0);
            thiz._setData(view, thiz.arrdaily[idx]);
        });


        var thiz = this;

        var mToggleDly = new ToggleNodeGroup();
        this.addChild(mToggleDly);
        this.mToggleDly = mToggleDly;


        var _tabSprName = ["#home_shop_btndailycap1.png", "#home_shop_btndailycap2.png"];
        var _tabSprPos = [-120, 120];


        for(var i = 0; i < _tabSprName.length; i++)
        {
            (function () {

                var btn_dly = new cc.Sprite(_tabSprName[i]);
                btn_dly.setPosition(cc.p(thiz.width/2 + _tabSprPos[i], 34));
                thiz.addChild(btn_dly);

                var toggleItem = new ToggleNodeItem(btn_dly.getContentSize());
                toggleItem.setAnchorPoint(cc.p(0.5, 0.5));
                toggleItem.setPosition(btn_dly.getPosition());
                mToggleDly.addItem(toggleItem);

                var a = i + 1;

                toggleItem.onSelect = function (force) {
                    btn_dly.setOpacity(255);
                    thiz.requestListDly(a);
                };
                toggleItem.onUnSelect = function () {
                    btn_dly.setOpacity(100);
                }
            })();

        }


        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;

    },

    requestListDly : function (id) {
        this.arrdaily = [];
        this.mListDaiLy.setVisible(false);
        if(id !== 1) return;

        var request = {
            command: "fetch_merchants",
            action : "FetchMerchantsByLevelRequest",
            level: id,
            bundle: SystemPlugin.getInstance().getPackageName(),
            limit : 1000000
        };

        SocketClient.getInstance().sendHttpGetRequest(request);
       this.loadingNode.setVisible(true);

    },

    addItemDiaLy : function (madaily, tendaily, diachi, facebookname, sodienthoai) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(1073, 46));


        var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell1.png", cc.rect(5, 5, 4, 4));
        bg_cell.setPreferredSize(container.getContentSize());
        bg_cell.setPosition(cc.p(container.width/2, container.height/2));
        container.addChild(bg_cell);
        container.bg_cell = bg_cell;


        var lb_madaily = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, madaily);
        // lb_madaily.setAnchorPoint(cc.p(0.0, 0.5));
        lb_madaily.setPosition(cc.p(95, container.height/2));
        container.addChild(lb_madaily);

        var lb_tendaily = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, tendaily, cc.TEXT_ALIGNMENT_CENTER, 200);
        // lb_tendaily.setAnchorPoint(cc.p(0.0, 0.5));
        lb_tendaily.setColor(cc.color("#ffea00"));
        lb_tendaily.setPosition(cc.p(314, container.height/2));
        container.addChild(lb_tendaily);

        var lb_diachi = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, diachi, cc.TEXT_ALIGNMENT_CENTER, 170);
        // lb_diachi.setAnchorPoint(cc.p(0.0, 0.5));
        lb_diachi.setPosition(cc.p(511, container.height/2));
        container.addChild(lb_diachi);

        var lb_sodienthoai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, sodienthoai, cc.TEXT_ALIGNMENT_CENTER, 0);
        // lb_sodienthoai.setAnchorPoint(cc.p(0.0, 0.5));
        lb_sodienthoai.setColor(cc.color("#ffea00"));
        lb_sodienthoai.setPosition(cc.p(732, container.height/2));
        container.addChild(lb_sodienthoai);


        var thiz = this;

        var btn_fb = new ccui.Button("home_napvang_dailyfb.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_fb.setPosition(cc.p(880, container.height/2));
        container.addChild(btn_fb);
        btn_fb.addClickEventListener(function () {
            var fb = container.facebookName;
            if(!fb.startsWith("http")){
                fb = "http://" + fb;
            }
            cc.Global.openURL(fb);
        });



        var btn_chvag = new ccui.Button("home_shop_item_btnchvang.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_chvag.setPosition(cc.p(990, container.height/2));
        container.addChild(btn_chvag);
        btn_chvag.addClickEventListener(function () {
           var parent = thiz.getParent();
           parent.mToggle.selectItem(0);
           parent.allLayer[0].noidungCK.setNameDaiLy(container.madaily);
        });

        container.lb_madaily = lb_madaily;
        container.lb_tendaily = lb_tendaily;
        container.lb_diachi = lb_diachi;
        container.lb_sodienthoai = lb_sodienthoai;
        container.btn_fb = btn_fb;
        container.facebookName = "";
        container.madaily = "";

        return container;
        // this.mListDaiLy.pushItem(container);
    },

    _setData : function (view, data) {
        view.lb_madaily.setString(data["merchantNickname"]);
        view.lb_tendaily.setString(data["displayName"]);
        view.lb_diachi.setString(data["address"]);
        view.lb_sodienthoai.setString(data["phone"]);
        view.madaily = data["merchantNickname"];
        view.facebookName = data["facebook"];
        view.btn_fb.setEnabled(data["facebook"]!=="");
    },


    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("fetch_merchants", this._onGetListDly, this);

    },

    setVisible : function (isvi) {
      this._super(isvi);
      if(isvi)
      {
          this.mToggleDly.selectItem(0);
          // for(var i = 0; i < 20; i++)
          // {
          //     this.addItemDiaLy("balua11111111111", "Da Nang vang rong co roa", "Thanh hoa", "http://facebook.com/abcbsdsdsdsdsds", "0109191919191");
          // }
      }
    },

    _onGetListDly : function (cmd, data) {
        this.loadingNode.setVisible(false);
        cc.log(data);

        var listDly = data["merchants"];
        if(listDly)
        {
            this.mListDaiLy.setVisible(true);
            for(var i = 0; i < listDly.length; i++)
            {

                var listdatadd = listDly[i];
                var obj = {
                    merchantNickname : listdatadd["merchantNickname"],
                    displayName : listdatadd["displayName"],
                    address : listdatadd["address"],
                    facebook : listdatadd["facebook"],
                    phone : listdatadd["phone"]
                };

                this.arrdaily.push(obj);

                this.mListDaiLy.refreshView();
            }
        }

    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    }
});


var ShopNhanThuongLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);


        var arr_tit = ["Thời gian", "Hình thức", "Thông tin", "Trạng thái"];
        var arr_tit_pos = [53, 294, 530, 873];


        var forebg1 = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 482));
        forebg1.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg1, 1);

        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, arr_tit[i].toUpperCase());
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(arr_tit_pos[i], 452));
            forebg1.addChild(m_lb);
        }


        var _magin = 17;


        var mListNhanThuong = new newui.TableView(cc.size(forebg1.width - _magin, forebg1.height - 80) , 1);
        mListNhanThuong.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mListNhanThuong.setScrollBarEnabled(false);
        mListNhanThuong.setAnchorPoint(cc.p(0.0, 0.0));
        mListNhanThuong.setPosition(cc.p(_magin - 8, _magin));
        forebg1.addChild(mListNhanThuong, 1);
        this.mListNhanThuong = mListNhanThuong;


        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;


    },

    addItemNhanThuong : function (thoigian, loai, thongtin, trangthai, index, nhamang, mathe, maserial) {
        var thiz = this;
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mListNhanThuong.width, 46));

        if(this.mListNhanThuong.getChildrenCount() %2)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }



        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thoigian, cc.TEXT_ALIGNMENT_LEFT, 150);
        lb_thoigian.setAnchorPoint(cc.p(0.0, 0.5));
        lb_thoigian.setPosition(cc.p(43, container.height/2));
        container.addChild(lb_thoigian);

        var lb_loai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, loai);
        lb_loai.setAnchorPoint(cc.p(0.0, 0.5));
        lb_loai.setPosition(cc.p(285, container.height/2));
        container.addChild(lb_loai);

        var lb_thongtin = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thongtin);
        lb_thongtin.setAnchorPoint(cc.p(0.0, 0.5));
        lb_thongtin.setPosition(cc.p(520, container.height/2));
        container.addChild(lb_thongtin);

        var m_trangthai = "Thành công";
        var m_color = cc.color("#b1c21e");
        if(trangthai === 1)
        {
            m_trangthai = "Đang xử lý";
            m_color = cc.color("#88725e");
        }
        else if(trangthai === 2)
        {
            m_trangthai = "Từ chối";
            m_color = cc.color("#b86464");
        }


        var lb_trangthai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, m_trangthai);
        lb_trangthai.setColor(m_color);
        lb_trangthai.setAnchorPoint(cc.p(0.0, 0.5));
        lb_trangthai.setPosition(cc.p(863, container.height/2));
        container.addChild(lb_trangthai);


        var icon_option = new ccui.Button("home_shop_iconoption.png", "", "", ccui.Widget.PLIST_TEXTURE);
        icon_option.setPosition(cc.p(1020, container.height/2));
        icon_option.addClickEventListener(function () {
            var indexlast = thiz.mListNhanThuong.getChildrenCount() - 7;

            if(indexlast > 0 && index >= indexlast){
                thiz.optionpop.setPosition(cc.p(thiz.optionpop.x, thiz.mListNhanThuong.getItem(indexlast).y));
            }
            else
            {
                thiz.optionpop.setPosition(cc.p(thiz.optionpop.x, thiz.mListNhanThuong.getItem(index).y));
            }

            thiz.optionpop.setVisible(true);
            thiz.touchLayerOption.setVisible(true);
            thiz.optionpop.btn_copyThe.addClickEventListener(function () {

                SystemPlugin.getInstance().copyTextClipboard(mathe);

                thiz.optionpop.setVisible(false);
                thiz.touchLayerOption.setVisible(false);
            });
            thiz.optionpop.btn_copySerial.addClickEventListener(function () {

                SystemPlugin.getInstance().copyTextClipboard(maserial);

                thiz.optionpop.setVisible(false);
                thiz.touchLayerOption.setVisible(false);
            });
            thiz.optionpop.btn_naplaigame.addClickEventListener(function () {
                var msg = {
                    command: "charge_card",
                    code: mathe,
                    serial: maserial,
                    telco: nhamang
                };
                SocketClient.getInstance().sendHttpGetRequest(msg);
                thiz.optionpop.setVisible(false);
                thiz.touchLayerOption.setVisible(false);
                LoadingDialog.getInstance().show();
            });
        });
        container.addChild(icon_option);

        this.mListNhanThuong.pushItem(container);
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("fetch_order", this._lichsuCashout, this);
        SocketClient.getInstance().addHTTPListener("charge_card", this._chargingCardNhanThuong, this);
    },

    setVisible : function (isvisible) {
        this._super(isvisible);
        if(isvisible) {
            this.mListNhanThuong.removeAllItems();
            var request = {
                command: "fetch_order"
            };

            SocketClient.getInstance().sendHttpGetRequest(request);
            this.loadingNode.setVisible(true);
            // for(var i = 0; i < 10; i++)
            // {
            //     this.addItemNhanThuong("12/12/12332", "viette 50k","ashdjashdsadhjhsjd" ,0, i, "sds", "sdsds", "dsdsdd");
            // }
            // this.addOptionLayout();
        }

    },

    _chargingCardNhanThuong : function (cmd, data) {
        LoadingDialog.getInstance().hide();
        if(data["status"] === 0)
        {
            var dialog = new MessageDialog();
            dialog.setMessage(data["data"]["message"]);
            dialog.showWithAnimationScale();
        }
    },

    _lichsuCashout : function (cmd, data) {
        this.loadingNode.setVisible(false);
        if(data["status"] === 0)
        {
            var list = data["data"]["items"];
            if(list && list.length > 0)
            {
                for(var i = 0; i < list.length; i++){
                    var obj = list[i];
                    this.addItemNhanThuong(obj["createdTime"], obj["productName"], obj["resultContent"], obj["status"], i, obj["telco"], obj["code"], obj["serial"]);
                }
                this.addOptionLayout();
            }

        }
    },

    addOptionLayout : function () {
        var thiz = this;
        var touchLayerOption = new ccui.Widget();
        touchLayerOption.setTouchEnabled(true);
        touchLayerOption.setContentSize(cc.size(this.mListNhanThuong.width/2, 80 * this.mListNhanThuong.getChildrenCount()));
        touchLayerOption.setVisible(false);
        touchLayerOption.addClickEventListener(function () {
            thiz.optionpop.setVisible(false);
            touchLayerOption.setVisible(false);
        });
        // touchLayerOption.setAnchorPoint(cc.p(.5, 1.0));
        touchLayerOption.setPosition(cc.p(this.mListNhanThuong.getInnerContainerSize().width/2, (80 * this.mListNhanThuong.getChildrenCount())/2));
        this.touchLayerOption = touchLayerOption;
        this.mListNhanThuong.addChild(touchLayerOption, 1);

        var optionpop = new NapOptionLayer();
        optionpop.setAnchorPoint(cc.p(0.5, 1.0));
        optionpop.setPosition(cc.p(this.mListNhanThuong.width - 130, this.mListNhanThuong.height/2));
        this.mListNhanThuong.addChild(optionpop, 2);
        optionpop.setVisible(false);
        this.optionpop = optionpop;
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    }
});

var NapOptionLayer = ccui.Widget.extend({
    ctor : function () {
        this._super();
        this.setTouchEnabled(true);
        this.addClickEventListener(function () {});


        var bg = new cc.Sprite("#home_shop_bg_option.png");
        this.setContentSize(bg.getContentSize());
        bg.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(bg);

        var btn_copySerial = new ccui.Button("home_shop_btn_copyserial.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_copySerial.setPosition(cc.p(this.width/2, 171));
        this.addChild(btn_copySerial);
        this.btn_copySerial = btn_copySerial;

        var btn_copyThe = new ccui.Button("home_shop_btn_copymathe.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_copyThe.setPosition(cc.p(this.width/2, 109));
        this.addChild(btn_copyThe);
        this.btn_copyThe = btn_copyThe;

        var btn_naplaigame = new ccui.Button("home_shop_btn_naplaigame.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_naplaigame.setPosition(cc.p(this.width/2, 47));
        this.addChild(btn_naplaigame);
        this.btn_naplaigame = btn_naplaigame;


    }
});

