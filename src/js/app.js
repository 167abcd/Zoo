


var HelloWorldLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var thiz = this;

        SystemPlugin.getInstance().onTakeImageData = function (imgObject) {
            cc.log("onTakeImageData");
            // cc.log("" + imgObject.retain());
            // cc.log("" + imgObject.release());
            cc.log("" + imgObject.getWidth());
            cc.log("" + imgObject.getHeight());
           //  cc.log("" + imgObject.saveToJPEG());
            // cc.log("" + imgObject.createTexture());
            // cc.log("" + imgObject.crop(cc.rect(0,0,20,20)));
            // cc.log("" + imgObject.resizeTo(20,20));
            // imgObject.retain();
            // imgObject.resizeTo(cc.size(imgObject.getWidth() / 2, imgObject.getHeight()/2), function (img) {
            //     cc.log("" + img.getWidth());
            //     cc.log("" + img.getHeight());
            //     cc.log("" + img.saveToJPEG());
            // });

            // var icon = new cc.Sprite(imgObject.createTexture());
            // icon.setPosition(thiz.width/2, thiz.height/2);
            // thiz.addChild(icon);
        };

        var button = new ccui.Text("Test Button", "arial", 40);
        button.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(button);
        button.setTouchEnabled(true);
        button.addClickEventListener(function () {
             cc.log("clicked");
            //SystemPlugin.getInstance().showImagePicker(100, 100);
            //cc.log(NativeSystemPluginBrigde.getPackageName());
            //cc.log(NativeSystemPluginBrigde.getVersionName());

            //cc.log(NativeSystemPluginBrigde.showCallPhone("123456789"));
            //cc.log(NativeSystemPluginBrigde.showSms("0123456789", "test sms"));
            //cc.log(NativeSystemPluginBrigde.iOSInitStore(["package1", "package2", "package3", "package4"]));
            //cc.log(NativeSystemPluginBrigde.buyIAPItem("package1"));

           // FacebookNativeBrigde.showLogin();

            //SystemPlugin.getInstance().showImagePicker(100, 100);

            cc.log(NativeSystemPluginBrigde.getAdvertisingId());
            cc.log(FacebookNativeBrigde.getFacebookAppId());

            cc.log(NativeSystemPluginBrigde.textToClipboard("deptrai123"));
        });

        return true;
    },
    
    onEvent : function (obj) {dasd
        // data = obj.getUserData().name;
        // cc.log("onevent" + data);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

window._cc_finished_Loading  = function () {
    cc.log("_cc_finished_Loading");
    cc.director.runScene(new HelloWorldScene());
};
