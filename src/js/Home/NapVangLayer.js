
/**
 * Created by Balua on 7/19/17.
 */



var NapVangLayer = Dialog.extend({
    ctor : function () {
        this._super();

        this.initWithSize(cc.size(1095, 584));

        var title = new cc.Sprite("#home_napvang_title.png");
        title.setAnchorPoint(cc.p(0.5, 0.0));
        title.setPosition(cc.p(this.width/2, this.height + 10));
        this.addChild(title, 2);

        this._paddingBottom = 30;

        var thiz = this;


        var mToggle = new ToggleNodeGroup();
        this.addChild(mToggle);
        this.mToggle = mToggle;

        this.allLayer = [new ShopNhanThuongLayer(this.getContentSize()), new NapDaiLyLayer(this.getContentSize())];
        for(var i = 0; i < this.allLayer.length; i++)
        {
            this.addChild(this.allLayer[i], 1);
        }


        var mToggle = new ToggleNodeGroup();
        this.addChild(mToggle);
        this.mToggle = mToggle;

        var _tabNapVangName = ["THẺ CÀO", "ĐẠI LÝ"];

        for(var i = 0; i < _tabNapVangName.length; i++)
        {
            (function () {

                var seltab = new cc.Sprite("#home_ttcn_seltab.png");
                seltab.setAnchorPoint(cc.p(0.0, 1.0));
                seltab.setPosition(cc.p(343 + (i * 205), thiz.height));
                thiz.addChild(seltab, 10);

                var unseltab = new cc.Sprite("#home_ttcn_unseltab.png");
                unseltab.setAnchorPoint(cc.p(0.0, 1.0));
                unseltab.setPosition(seltab.getPosition());
                thiz.addChild(unseltab, 10);

                var _tittab = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, _tabNapVangName[i]);
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


    onEnter : function()
    {
        this._super();
        this.mToggle.selectItem(0);
    }
});

var payment_card_code = payment_card_code || ["Mã thẻ Viettel", "Mã thẻ Mobi", "Mã thẻ Vina"];
var payment_card_serial = payment_card_serial || ["Serial thẻ Viettel", "Serial thẻ Mobi", "Serial thẻ Vina"];
var payment_card_type = payment_card_type || ["VTT", "VMS", "VNP"];

var NapTheLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();

        this.setContentSize(mSize);


        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg.setAnchorPoint(cc.p(0.5, 0));
        forebg.setPreferredSize(cc.size(1054, 482));
        forebg.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg, 1);
        this.forebg = forebg;


        var bg1 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        bg1.setPreferredSize(cc.size(407, 68));
        bg1.setAnchorPoint(cc.p(0.5, 0.0));
        bg1.setPosition(763, 227);
        this.forebg.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        bg2.setPreferredSize(cc.size(407, 68));
        bg2.setAnchorPoint(cc.p(0.5, 0.0));
        bg2.setPosition(bg1.x, 151);
        this.forebg.addChild(bg2);

        var maThe = new newui.EditBox(cc.size(bg1.getContentSize().width - 6, bg1.getContentSize().height - 2));
        maThe.setFont(cc.res.font.Roboto_CondensedBold, 20);
        maThe.setPlaceholderFont(cc.res.font.Roboto_CondensedBold, 20);
        maThe.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        maThe.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        maThe.setFontColor(cc.color("#525252"));
        maThe.setAnchorPoint(cc.p(0.5, 0.0));
        maThe.setPlaceholderFontColor(cc.color("#525252"));
        maThe.setPlaceHolder("Nhập số serial");
        maThe.setPosition(cc.p(bg1.x + 3, bg1.y + 1));
        this.forebg.addChild(maThe, 1);
        this.maThe = maThe;
        this.type = payment_card_type[0];

        var serialThe = new newui.EditBox(cc.size(bg2.getContentSize().width - 6, bg2.getContentSize().height - 2));
        serialThe.setFont(cc.res.font.Roboto_CondensedBold, 20);
        serialThe.setPlaceholderFont(cc.res.font.Roboto_CondensedBold, 20);
        serialThe.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        serialThe.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        serialThe.setPlaceHolder("Nhập mã thẻ");
        serialThe.setFontColor(cc.color("#525252"));
        serialThe.setPlaceholderFontColor(cc.color("#525252"));
        serialThe.setAnchorPoint(cc.p(0.5, 0.0));
        serialThe.setPosition(cc.p(bg2.x + 3, bg2.y + 1));
        this.forebg.addChild(serialThe, 1);
        this.serialThe = serialThe;
        var thiz = this;
        var okButton = new ccui.Button("home_napvang_btn_napthe.png", "", "", ccui.Widget.PLIST_TEXTURE);
        okButton.setAnchorPoint(cc.p(0.5, 0.0));
        okButton.setPosition(bg1.x, 37);
        okButton.addClickEventListener(function () {
            if(maThe.getString().length === 0)
            {
                MessageNode.getInstance().show("Bạn chưa nhập mã thẻ !");
            }
            else if(serialThe.getString().length === 0)
            {
                MessageNode.getInstance().show("Bạn chưa nhập serial thẻ !");
            }
            else
            {
                if(SocketClient.getInstance().isLoggin())
                {
                    var code = thiz.maThe.getString();
                    var serial = thiz.serialThe.getString();
                    var telco = thiz.type;
                    // var type = 1;//card
                    var msg = {
                        command: "charge_card",
                        code: code,
                        serial: serial,
                        telco: telco
                    };
                    // cc.log(msg);
                    SocketClient.getInstance().sendHttpGetRequest(msg);
                    LoadingDialog.getInstance().show();
                }
                else
                {
                    MessageNode.getInstance().show("Bạn phải đăng nhập để thực hiện chức năng này !");
                }


            }
        });
        this.forebg.addChild(okButton);


        this.initTiGia();
        this.initCardItem();

    },


    initCardItem : function () {
        this.cardSelected = 0;
        var thiz = this;
        for (var i = 0; i < 3; i++) {
            (function () {

                var container = new ccui.Widget();
                var bg_1 = new cc.Sprite("#home_napvang_nhamangun.png");
                container.setContentSize(bg_1.getContentSize());
                bg_1.setPosition(cc.p(container.width/2, container.height/2));
                container.addChild(bg_1);

                var bg_2 = new cc.Sprite("#home_napvang_nhamangsel.png");
                bg_2.setPosition(cc.p(container.width/2, container.height/2));
                bg_2.setVisible(false);
                container.addChild(bg_2);

                var lb_nhamang1 = new cc.Sprite("#home_napvang_the" + i + ".png");
                lb_nhamang1.setPosition(bg_1.width/2, bg_1.height/2);
                bg_1.addChild(lb_nhamang1);

                var lb_nhamang2 = new cc.Sprite("#home_napvang_the" + i + "1.png");
                lb_nhamang2.setPosition(bg_2.width/2, bg_2.height/2);
                bg_2.addChild(lb_nhamang2);

                container.setPosition(cc.p(300 + (i * 250), 390));
                thiz.forebg.addChild(container);

                container.maThe = payment_card_code[i];
                container.serialThe = payment_card_serial[i];
                container.type = payment_card_type[i];

                container.select = function () {
                    bg_1.setVisible(false);
                    bg_2.setVisible(true);
                };
                container.unselect = function () {
                    bg_1.setVisible(true);
                    bg_2.setVisible(false);
                };
                container.setTouchEnabled(true);
                container.addClickEventListener(function (item) {
                    thiz.selectCard(item);
                });

                container.unselect();
                if (i == 0) {
                    thiz.selectCard(container);
                }
            })();
        }
    },

    selectCard: function (card) {
        if (this.cardSelected) {
            this.cardSelected.setTouchEnabled(true);
            this.cardSelected.unselect();
        }
        this.cardSelected = card;
        this.cardSelected.setTouchEnabled(false);
        this.cardSelected.select();
        this.maThe.setPlaceHolder(this.cardSelected.maThe);
        this.serialThe.setPlaceHolder(this.cardSelected.serialThe);
        this.type = this.cardSelected.type;
    },


    initTiGia : function () {

        var bg_tygia = new ccui.Scale9Sprite("home_napvang_bg_tygia.png", cc.rect(20, 20, 4, 4));
        bg_tygia.setPreferredSize(cc.size(418, 287));
        bg_tygia.setAnchorPoint(cc.p(0.0, 0.0));
        bg_tygia.setPosition(cc.p(27, 27));
        this.forebg.addChild(bg_tygia);

        var listItem = new newui.TableView(cc.size(bg_tygia.getContentSize().width -1, bg_tygia.getContentSize().height - 10), 1);
        listItem.setScrollBarEnabled(false);
        // listItem.setAnchorPoint(cc.p(0.5, 0.5));
        listItem.setPosition(cc.p(0, 5));
        bg_tygia.addChild(listItem);
        this.listTiGia = listItem;

        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(bg_tygia.width/2, bg_tygia.height/2));
        bg_tygia.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;


    },
    addTiGia: function (money, gold, currency) {
        if(!currency){
            currency = "VND";
        }
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listTiGia.width, 41));
        this.listTiGia.pushItem(container);


        if(this.listTiGia.getChildrenCount() %2)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell1.png", cc.rect(5, 5, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }

        var moneyLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, money + " " + currency);
        moneyLabel.setAnchorPoint(cc.p(1.0, 0.5));
        moneyLabel.setPosition(166, container.getContentSize().height / 2);
        container.addChild(moneyLabel);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, gold);
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(255, container.getContentSize().height / 2);
        container.addChild(goldLabel);

        var equalLabel = new cc.Sprite("#home_napvang_iconxo.png");
        equalLabel.setAnchorPoint(cc.p(0.0, 0.5));
        equalLabel.setPosition(212, container.getContentSize().height / 2);
        container.addChild(equalLabel);
    },

    setVisible : function (isVisible) {
        this._super(isVisible);
        if(isVisible) {
            this.listTiGia.removeAllItems();
            var request = {
                command : "fetch_item_exchange"
            };
            this.loadingNode.setVisible(true);
            SocketClient.getInstance().sendHttpGetRequest(request);
        }
    },

    _chargingCard : function (cmd, data) {
        LoadingDialog.getInstance().hide();
        if(data["status"] === 0)
        {
            this.maThe.setString("");
            this.serialThe.setString("");
            var dialog = new MessageDialog();
            dialog.setMessage(data["data"]["message"]);
            dialog.showWithAnimationScale();
        }
    },

    onEnter: function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("fetch_item_exchange", this._getTyGia, this);
        SocketClient.getInstance().addHTTPListener("charge_card", this._chargingCard, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },
    _getTyGia : function (cmd, data) {
        var listtygia = data["data"];
        this.loadingNode.setVisible(false);
        if(listtygia)
        {
            for (var i = 0; i < listtygia.length; i++){
                var objdata = listtygia[i];
                var currency = objdata["currency"];
                this.addTiGia(objdata["price"].trim(), objdata["gold"].trim());
            }
        }

    }
});

var NapDaiLyLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        var thiz = this;
        this.setContentSize(mSize)


        var m_list_titlecolumn = ["MÃ ĐẠI LÝ", "TÊN ĐẠI LÝ", "KHU VỰC", "SỐ ĐIỆN THOẠI", "FACEBOOK"];
        var m_list_titlecolumnPos = [50, 239, 438, 654, 885];


        var forebg1 = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 400));
        forebg1.setPosition(cc.p(this.width/2, 96));
        this.addChild(forebg1, 1);

        for(var i = 0; i < m_list_titlecolumn.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, m_list_titlecolumn[i]);
            // m_lb.setColor(cc.color("#88725e"));
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(m_list_titlecolumnPos[i], forebg1.height - 40));
            forebg1.addChild(m_lb);
        }


        var _magin = 17;


        this.arrdaily = [];

        var mListDly = new newui.ListViewWithAdaptor(cc.size(forebg1.width - _magin, forebg1.height - 140));
        mListDly.setScrollBarEnabled(false);
        mListDly.setAnchorPoint(cc.p(0.0, 0.0));
        mListDly.setPosition(cc.p(_magin - 8, _magin + 60));
        forebg1.addChild(mListDly, 1);
        this.mListDly = mListDly;

        mListDly.setCreateItemCallback(function () {
            return thiz.addItemDaiLy("", "", "", "", "");
        });
        mListDly.setSizeCallback(function () {
            return thiz.arrdaily.length;
        });
        mListDly.setItemAdaptor(function (idx, view) {
            view.bg_cell.setVisible((idx % 2) === 0);
            thiz._setData(view, thiz.arrdaily[idx]);
        });



        var lb_hdan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Liên hệ với đại lý để mua vàng rẻ hơn nạp thẻ cào");
        // lb_hdan.setColor(cc.color("#fffaa7"));
        lb_hdan.setPosition(cc.p(forebg1.width/2, 40));
        forebg1.addChild(lb_hdan);



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
                btn_dly.setPosition(cc.p(thiz.width/2 + _tabSprPos[i], 50));
                thiz.addChild(btn_dly);

                var toggleItem = new ToggleNodeItem(btn_dly.getContentSize());
                toggleItem.setAnchorPoint(cc.p(0.5, 0.5));
                toggleItem.setPosition(btn_dly.getPosition());
                mToggleDly.addItem(toggleItem);

                var a = i+1;

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


        // for (var i = 0; i < 20; i++){
        //     this.addItemDaiLy("234832", "balua", "hanoi", "fb/sshshshsh", "9823483274234");
        // }

    },
    requestListDly : function (id) {
        this.arrdaily = [];
        this.mListDly.setVisible(false);
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

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("fetch_merchants", this._onGetListDly, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    setVisible : function (isVisible) {
      this._super(isVisible);
      if(isVisible)
      {
          this.mToggleDly.selectItem(0);
          // for(var i = 0; i < 20; i++)
          // {
          //     this.addItemDaiLy("balua11111111111", "Da Nang vang rong co roa", "Thanh hoa", "http://facebook.com/abcbsdsdsdsdsds", "0109191919191");
          // }
      }
    },

    addItemDaiLy : function (madaily, tendaily, khuvuc, fbname, sdt) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mListDly.width, 46));


        var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
        bg_cell.setPreferredSize(container.getContentSize());
        bg_cell.setPosition(cc.p(container.width/2, container.height/2));
        container.addChild(bg_cell);
        container.bg_cell = bg_cell;

        var lb_madaily = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, madaily);
        lb_madaily.setPosition(cc.p(85, container.height/2));
        container.addChild(lb_madaily);


        var lb_tendaily = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, tendaily);
        lb_tendaily.setColor(cc.color("#ffea00"));
        lb_tendaily.setPosition(cc.p(281, container.height/2));
        container.addChild(lb_tendaily);

        var lb_khuvuc = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, khuvuc, cc.TEXT_ALIGNMENT_CENTER, 170);
        lb_khuvuc.setPosition(cc.p(470, container.height/2));
        container.addChild(lb_khuvuc);


        var lb_sdt = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, sdt);
        // lb_sdt.setAnchorPoint(cc.p(0.0, 0.5));
        lb_sdt.setColor(cc.color("#ffea00"));
        lb_sdt.setPosition(cc.p(710, container.height/2));
        container.addChild(lb_sdt);

        var btn_fb = new ccui.Button("home_napvang_dailyfb.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_fb.setPosition(cc.p(920, container.height/2));
        container.addChild(btn_fb);
        btn_fb.setEnabled(fbname!=="");
        btn_fb.addClickEventListener(function () {
            var fb = container.facebookName;
            if(!fb.startsWith("http")){
                fb = "http://" + fb;
            }
            cc.Global.openURL(fb);
        });


        container.lb_madaily = lb_madaily;
        container.lb_tendaily = lb_tendaily;
        container.lb_khuvuc = lb_khuvuc;
        container.lb_sdt = lb_sdt;
        container.btn_fb = btn_fb;
        container.facebookName = "";

        return container;
    },

    _setData : function (view, data) {
        view.lb_madaily.setString(data["merchantNickname"]);
        view.lb_tendaily.setString(data["displayName"]);
        view.lb_khuvuc.setString(data["address"]);
        view.lb_sdt.setString(data["phone"]);
        view.madaily = data["merchantNickname"];
        view.facebookName = data["facebook"];
        view.btn_fb.setEnabled(data["facebook"]!=="");
    },

    _onGetListDly : function (cmd, data) {
        // cc.log(data);
        this.loadingNode.setVisible(false);
        var listDly = data["merchants"];
        if(listDly)
        {
            this.mListDly.setVisible(true);
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

                this.mListDly.refreshView();
            }
        }

    }
});

var s_currency_icon = s_currency_icon || {};
s_currency_icon["USD"] = "$";

var NapSMSLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);

        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg.setAnchorPoint(cc.p(0.5, 0));
        forebg.setPreferredSize(cc.size(1054, 482));
        forebg.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg, 1);
        this.forebg = forebg;


        var lb_hdan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Chọn gói bạn muốn nạp");
        // lb_hdan.setColor(cc.color("#fffaa7"));
        lb_hdan.setPosition(cc.p(forebg.width/2, 440));
        forebg.addChild(lb_hdan);

        var mList = new newui.TableView(cc.size(forebg.width - 40, 370), 1);
        mList.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        mList.setScrollBarEnabled(false);
        mList.setPadding(50);
        mList.setAnchorPoint(cc.p(0.5, 0.5));
        mList.setPosition(cc.p(forebg.width/2, forebg.height/2 + 20));
        forebg.addChild(mList);
        this.mList = mList;



        this.lb_hdan1 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, "Hoặc nhắn tin theo cú pháp");
        this.lb_hdan1.setPosition(cc.p(forebg.width/2, 90));
        this.lb_hdan1.setVisible(false);
        forebg.addChild(this.lb_hdan1);

        this.lb_hdan2 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "");
        this.lb_hdan2.setColor(cc.color("#fff000"));
        this.lb_hdan2.setPosition(cc.p(this.lb_hdan1.x, 60));
        forebg.addChild(this.lb_hdan2);

        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;
    },

    addItemSMS : function (valuevang, valuemoney) {
        var container = new ccui.Widget();

        var bg_item = new cc.Sprite("#home_napvang_bg_iteminapp.png");
        container.setContentSize(bg_item.getContentSize());
        bg_item.setPosition(cc.p(container.width/2, container.height/2));
        container.addChild(bg_item);


        if(this.mList.getChildrenCount() >= 4)
        {
            var xooo = new cc.Sprite("#home_napvang_xo4.png");
            xooo.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(xooo);
        }
        else
        {
            var xooo = new cc.Sprite("#home_napvang_xo" + (this.mList.getChildrenCount() + 1) + ".png");
            xooo.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(xooo);
        }


        var lb_money = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, valuevang);
        lb_money.setColor(cc.color("#fff000"));
        lb_money.setAnchorPoint(cc.p(0.0, 0.5));
        lb_money.setPosition(cc.p(67, 86));
        container.addChild(lb_money);


        var lb_vang = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, valuemoney);
        lb_vang.setAnchorPoint(cc.p(0.5, 0.5));
        lb_vang.setPosition(cc.p(container.width/2, 288));
        container.addChild(lb_vang);

        container.setTouchEnabled(true);

        this.mList.pushItem(container);
        return container;
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("fetch_cash_in_item", this._getSMSItem, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    setVisible : function (isVisible) {
        this._super(isVisible);
        if(isVisible) {
            this.lb_hdan1.setVisible(false);
            this.mList.removeAllItems();

            var request = {
                command : "fetch_cash_in_item",
                cashInType : 2,
                bundleName : SystemPlugin.getInstance().getPackageName(),
                osId : ApplicationConfig.PLATFORM
            };

            this.loadingNode.setVisible(true);
            SocketClient.getInstance().sendHttpGetRequest(request);
        }
    },

    _getSMSItem : function (cmd, data) {
        var thiz = this;
        this.loadingNode.setVisible(false);
        var datalist = data["data"];
        if (datalist) {
            for (var i = 0; i < datalist.length; i++) {
                (function () {
                    var objdata = datalist[i];
                    var price = cc.Global.NumberFormat1(objdata["price"]);
                    var currency = s_currency_icon[objdata["currency"]];
                    if(!currency){
                        currency = objdata["currency"];
                    }
                    if(!currency){
                        currency = "VNĐ";
                    }

                    var container = thiz.addItemSMS(objdata["gold"] + " BON", price + " " + currency);
                    var smsIndex = i;
                    container.addClickEventListener(function () {
                        var objdetail = objdata["detail"];
                        var cuphap1 = objdetail["content"];
                        var dauso = objdetail["smsGateway"];

                        if(!SocketClient.getInstance().isLoggin())
                        {

                            if(cc.sys.isNative){
                                MessageNode.getInstance().show("Bạn cần đăng nhập để thực hiện chức năng này !");
                            }
                            else
                            {
                                thiz.lb_hdan1.setVisible(true);
                                thiz.lb_hdan2.setString(cuphap1 + " gửi " + dauso);
                            }
                        }
                        else
                        {
                            thiz.lb_hdan1.setVisible(true);
                            var recupha = cuphap1.replace("nickname", PlayerMe.displayName);
                            thiz.lb_hdan2.setString(recupha + " gửi " + dauso);
                            if(cc.sys.isNative){
                                thiz.selectSMSPayment(recupha, dauso);
                            }
                            else
                            {
                                MessageNode.getInstance().show("Bạn vui lòng nhắn tin theo cú pháp bên dưới !");
                            }
                        }

                    });
                })();
            }
        }
    },

    selectSMSPayment: function (cuphap, dauso) {
        SystemPlugin.getInstance().showSMS(dauso, cuphap);
    }
});


var s_currency_icon = s_currency_icon || {};
s_currency_icon["USD"] = "$";

var NapInAppLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);


        var lb_hdan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Chọn gói bạn muốn nạp");
        // lb_hdan.setColor(cc.color("#fffaa7"));
        lb_hdan.setPosition(cc.p(this.width/2, 500));
        this.addChild(lb_hdan);

        var mList = new newui.TableView(cc.size(this.width - 40, 370), 1);
        mList.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        mList.setScrollBarEnabled(false);
        mList.setPadding(50);
        mList.setAnchorPoint(cc.p(0.5, 0.5));
        mList.setPosition(cc.p(this.width/2, this.height/2 + 20));
        this.addChild(mList);
        this.mList = mList;


        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;

        this._initItems();
    },


    _initItems : function () {
        var listdata = cc.Global.inAppBillingData;
        if(listdata)
        {
            var thiz = this;
            for (var i = 0; i < listdata.length; i++) {
                (function () {
                    var gold = listdata[i]["gold"];
                    var price = listdata[i]["price"];

                    var currency = s_currency_icon[listdata[i]["currency"]];
                    if(!currency){
                        currency = listdata[i]["currency"];
                    }
                    if(!currency){
                        currency = "VNĐ";
                    }

                    var inappId = listdata[i]["id"];

                    var container = thiz.addItemInApp("1000", "10000" + " " + currency);
                    container.addClickEventListener(function (item) {
                        if(!SocketClient.getInstance().isLoggin())
                        {
                            MessageNode.getInstance().show("Bạn cần đăng nhập để thực hiện chức năng này !");
                        }
                        else
                        {

                            if(cc.sys.isNative)
                            {
                                thiz._selectInappItem(inappId);
                            }
                            else
                            {
                                MessageNode.getInstance().show("Chức năng này không được hỗ trợ trên nền Web !");
                            }


                        }

                    });
                })();


            }
        }
    },

    addItemInApp : function (valuevang, valuemoney) {
        var container = new ccui.Widget();

        var bg_item = new cc.Sprite("#home_napvang_bg_iteminapp.png");
        container.setContentSize(bg_item.getContentSize());
        bg_item.setPosition(cc.p(container.width/2, container.height/2));
        container.addChild(bg_item);


        if(this.mList.getChildrenCount() >= 4)
        {
            var xooo = new cc.Sprite("#home_napvang_xo4.png");
            xooo.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(xooo);
        }
        else
        {
            var xooo = new cc.Sprite("#home_napvang_xo" + (this.mList.getChildrenCount() + 1) + ".png");
            xooo.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(xooo);
        }


        var lb_money = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, valuevang);
        lb_money.setColor(cc.color("#fff000"));
        lb_money.setAnchorPoint(cc.p(0.0, 0.5));
        lb_money.setPosition(cc.p(67, 86));
        container.addChild(lb_money);


        var lb_vang = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, valuemoney);
        lb_vang.setAnchorPoint(cc.p(0.5, 0.5));
        lb_vang.setPosition(cc.p(container.width/2, 288));
        container.addChild(lb_vang);

        this.mList.pushItem(container);
        container.setTouchEnabled(true);
        return container;
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("in_app_verify", this._inappData, this);
    },

    _inappData : function (cmd, data) {
        this.loadingNode.setVisible(false);
        if(data["status"] === 0)
        {
            var dialog = new MessageDialog();
            dialog.setMessage(data["data"]["message"]);
            dialog.closeButton.visible = true;
            dialog.show();
        }
    },

    setVisible : function (isVisible) {
        this._super(isVisible);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    _selectInappItem : function (inappId) {
        this.loadingNode.setVisible(true);
        SystemPlugin.getInstance().buyIAPItem(inappId);
    }

});