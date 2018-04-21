var HomeAgencyDialog = Dialog.extend({
    ctor: function () {
        this._super();
        this.initWithSize(cc.size(1081, 597));

        var title = new cc.Sprite("#web_bottom_agency_title.png");
        title.setAnchorPoint(cc.p(0.5, 0.0));
        title.setPosition(this.width/2, this.height + 10);
        this.addChild(title,1);

        var mNode = new cc.Node();
        this.addChild(mNode, 1);

        var titleBg = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        titleBg.setPreferredSize(cc.size(1044, 82));
        titleBg.setPosition(541, 532);
        mNode.addChild(titleBg);

        var bg = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        bg.setPreferredSize(cc.size(1044, 460));
        bg.setPosition(541, 267);
        mNode.addChild(bg);

        var title1 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "TÊN ĐẠI LÝ");
        title1.setAnchorPoint(cc.p(0, 0.5));
        title1.setPosition(79, 532);
        mNode.addChild(title1);

        var title2 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "SỐ ĐIỆN THOẠI");
        title2.setAnchorPoint(cc.p(0, 0.5));
        title2.setPosition(360, 532);
        mNode.addChild(title2);

        var title3 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "ĐỊA CHỈ");
        title3.setAnchorPoint(cc.p(0, 0.5));
        title3.setPosition(670, 532);
        mNode.addChild(title3);

        var top = 470;
        var bottom = 60;
        var left = 0;
        var right = 1081;

        var listItem = new newui.TableView(cc.size(right - left, top - bottom), 1);
        listItem.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listItem.setScrollBarEnabled(false);
       // listItem.setPadding(50);
        listItem.setAnchorPoint(cc.p(0, 0));
        listItem.setPosition(cc.p(left, bottom));
        mNode.addChild(listItem);
        this.listItem = listItem;
    },

    onEnter: function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("fetch_merchants", this._onGetListDly, this);
        this.listItem.removeAllItems();

        var request = {
            command: "fetch_merchants",
            action : "FetchMerchantsByLevelRequest",
            level: 1,
            bundle: SystemPlugin.getInstance().getPackageName(),
            limit:1000000
        };
        SocketClient.getInstance().sendHttpGetRequest(request);
    },

    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    _onGetListDly : function (cmd, data) {
        var arr = data["merchants"];
        if(arr) {
            this.listItem.removeAllItems();
            for(var i = 0; i < arr.length; i++) {
                var obj = arr[i];
                this.addItem(obj["displayName"], obj["phone"], obj["address"], obj["facebook"]);
            }
        }
    },

    addItem: function(name, phone, address, facebook){
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.width, 47));
        this.listItem.pushItem(container);

        if(this.listItem.size() % 2){
            var bg = new ccui.Scale9Sprite("web_bottom_bg_2.png", cc.rect(14,14,4,4));
            bg.setPreferredSize(cc.size(1010, container.height));
            bg.setPosition(container.width/2, container.height/2);
            container.addChild(bg);
        }

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, name);
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(79, container.height/2);
        container.addChild(nameLabel);

        var phoneLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, phone);
        phoneLabel.setAnchorPoint(cc.p(0, 0.5));
        phoneLabel.setPosition(360, nameLabel.y);
        container.addChild(phoneLabel);

        var addressLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, address);
        addressLabel.setAnchorPoint(cc.p(0, 0.5));
        addressLabel.setPosition(670,  nameLabel.y);
        container.addChild(addressLabel);

        var fbBt = new ccui.Button("web_bottom_fbBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        fbBt.setPosition(978,  nameLabel.y);
        container.addChild(fbBt);
        fbBt.addClickEventListener(function () {
            if(!facebook.startsWith("http")){
                facebook = "http://" + facebook;
            }
            cc.Global.openURL(facebook);
        });
        fbBt.setEnabled(facebook !== "");
    }
});