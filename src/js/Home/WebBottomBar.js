
var WebBottomBar = cc.Node.extend({
    ctor: function () {
        this._super();
        var bg = new cc.Sprite("#web_bottom_bar.png");
        bg.setPosition(1000, bg.height/2);
        this.addChild(bg);

        var btn_congnap = new ccui.Button("dialog_btn_congnap.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_congnap.setPosition(530, 59);
        btn_congnap.setVisible(false);
        this.addChild(btn_congnap);

        // var btn_direct = new ccui.Button("dialog_btn_taiAPK.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // btn_direct.setPosition(718, 62);
        // this.addChild(btn_direct);

        var btn_ios = new ccui.Button("dialog_btn_taiiOS.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_ios.setPosition(1074, 61);
        this.addChild(btn_ios);

        var btn_android = new ccui.Button("dialog_btn_taiAndroid.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_android.setPosition(926, 59);
        this.addChild(btn_android);

        var newBt = new ccui.Button("web_bottom_newsBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        newBt.setPosition(698, 60);
        this.addChild(newBt);

        // var agencyBt = new ccui.Button("web_bottom_agencyBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // agencyBt.setPosition(1282, 60);
        // agencyBt.setVisible(false);
        // this.addChild(agencyBt);

        var fanpageBt = new ccui.Button("web_bottom_fanpageBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        fanpageBt.setPosition(1302, 61);
        this.addChild(fanpageBt);

        var groupBt = new ccui.Button("web_bottom_groupBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        groupBt.setPosition(1472, 63);
        this.addChild(groupBt);

        newBt.addClickEventListener(function () {
            // MessageNode.getInstance().show("Chưa hỗ trợ trong thời gian Alpha Test");
            cc.Global.openURL(WebBottomBar.newsUrl);
        });

        // agencyBt.addClickEventListener(function () {
        //     var dialog = new HomeAgencyDialog();
        //     dialog.show();
        // });

        fanpageBt.addClickEventListener(function () {
            cc.Global.openURL(WebBottomBar.fanpageUrl);
        });

        groupBt.addClickEventListener(function () {
            cc.Global.openURL(WebBottomBar.groupUrl);
        });

        // btn_direct.addClickEventListener(function () {
        //     cc.Global.openURL(WebBottomBar.androidDirectUrl);
        // });

        btn_congnap.addClickEventListener(function () {
            // MessageNode.getInstance().show("Chưa hỗ trợ trong thời gian Alpha Test");
            cc.Global.openURL(WebBottomBar.congnap);
        });

        btn_android.addClickEventListener(function () {
            // MessageNode.getInstance().show("Phiên bản Android sắp ra mắt");
            cc.Global.openURL(WebBottomBar.androidStoreUrl);
        });

        btn_ios.addClickEventListener(function () {
            MessageNode.getInstance().show("Phiên bản IOS sắp ra mắt");
            // cc.Global.openURL(WebBottomBar.iosStoreUrl);
        });
    }
});

WebBottomBar.newsUrl = "";
WebBottomBar.fanpageUrl = "https://www.facebook.com/BinClub.Fanpage/";
WebBottomBar.groupUrl = "https://www.facebook.com/groups/BinClub.Group/";
WebBottomBar.androidStoreUrl = "https://play.google.com/store/apps/details?id=club.bin.nohu.slot";
WebBottomBar.androidDirectUrl = "";
WebBottomBar.iosStoreUrl = "";
WebBottomBar.congnap = "https://napbin.com";