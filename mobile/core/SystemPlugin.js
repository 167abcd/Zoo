/**
 * Created by cocos2d on 6/24/2016.
 */

var SystemPlugin = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        plugin: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.plugin = new ext.SystemPlugin();
            }
        },

        textureFromBase64 : function (base64) {
            return this.plugin.textureFromBase64(base64);
        },

        showImagePicker : function () {
            return this.plugin.showImagePicker.apply(this.plugin, arguments);
        },

        getDeviceUUID : function () {
            return this.plugin.getDeviceUUID();
        },

        getDeviceUUIDWithKey : function (key) {
            return this.plugin.getDeviceUUIDWithKey(key);
        },

        startLaucher : function () {
            this.plugin.startLaucher();
        },

        exitApp : function () {
            this.plugin.exitApp();
        },
        enableMipmapTexture : function (texture) {
            this.plugin.enableMipmapTexture(texture);
        },

        //event
        onBuyItemFinishAndroid : function (returnCode, signature, json) {
            cc.log(returnCode + " - " + signature + " - " + json);
        },

        onBuyItemFinishIOS : function (returnCode, signature) {
            cc.log(returnCode + " - " + signature);
        },

        getPackageName :function () {
            return NativeSystemPluginBrigde.getPackageName();
        },

        getVersionName : function () {
            return NativeSystemPluginBrigde.getVersionName();
        },

        getPushNotificationToken : function () {
            return NativeSystemPluginBrigde.getPushNotificationToken();
        },

        buyIAPItem : function (itemBundle) {
            NativeSystemPluginBrigde.buyIAPItem(itemBundle);
        },

        iOSInitStore : function (itemList) {
            NativeSystemPluginBrigde.iOSInitStore(itemList);
        },

        onTakeImageData : function (base64Data) {
            cc.log("onTakeImageData: "+base64Data);
        },

        showCallPhone : function (phoneNumber) {
            NativeSystemPluginBrigde.showCallPhone(phoneNumber);
        },

        showSMS : function (smsNumber, smsContent) {
            return NativeSystemPluginBrigde.showSms(smsNumber, smsContent);
        },

        getAdsId : function(){
            return NativeSystemPluginBrigde.getAdvertisingId();
        },

        getFacebookId : function () {
            return FacebookNativeBrigde.getFacebookAppId();
        },

        copyTextClipboard : function (text) {
            return NativeSystemPluginBrigde.textToClipboard(text);
        }
    });

    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };
    return Clazz;
})();

var NativeSystemPluginBrigde = NativeSystemPluginBrigde || {};

NativeSystemPluginBrigde.getPackageName = function () {
    if(cc.sys.os === cc.sys.OS_IOS){
        return jsb.reflection.callStaticMethod("NativeSystemPlugin", "getPackageName");
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID){
        return jsb.reflection.callStaticMethod("ext/plugin/system/SystemPlugin", "jniGetAndroidPackage", "()Ljava/lang/String;");
    }
    else{
        return "com.puppet.game";
    }
};

NativeSystemPluginBrigde.getVersionName = function () {
    if(cc.sys.os === cc.sys.OS_IOS){
        return jsb.reflection.callStaticMethod("NativeSystemPlugin", "getVersionName");
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID){
        return jsb.reflection.callStaticMethod("ext/plugin/system/SystemPlugin", "jniGetVersionName", "()Ljava/lang/String;");
    }
    else{
        return "1.0.0";
    }
};

NativeSystemPluginBrigde.showCallPhone = function (phoneNumber) {
    if(cc.sys.os === cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("NativeSystemPlugin", "showCallPhone:", phoneNumber);
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID){
        jsb.reflection.callStaticMethod("ext/plugin/system/SystemPlugin","jniPhoneSupport","(Ljava/lang/String;)V", phoneNumber);
    }
};

NativeSystemPluginBrigde.showSms = function (smsNumber, smsContent) {
    if(cc.sys.os === cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("SMSPlugin", "nativeShowSMS:withMessage:", smsNumber, smsContent);
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID){
        return jsb.reflection.callStaticMethod("ext/plugin/system/SystemPlugin","jniShowSMS","(Ljava/lang/String;Ljava/lang/String;)Z", smsNumber, smsContent);
    }
    return false;
};

NativeSystemPluginBrigde.iOSInitStore = function (itemList) {
    if(cc.sys.os === cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("IAPPlugin", "nativeInitStore:", JSON.stringify(itemList));
    }
};

NativeSystemPluginBrigde.buyIAPItem = function (itemBundle) {
    if(cc.sys.os === cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("IAPPlugin", "nativeBuyItem:", itemBundle);
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID){
        jsb.reflection.callStaticMethod("ext/plugin/system/AndroidBilling","jniBuyItem","(Ljava/lang/String;Z)V", itemBundle, true);
    }
};

NativeSystemPluginBrigde.onRegisterNotificationSuccess = function (token, uniqueIdentifier) {
    //save
    cc.sys.localStorage.setItem("notificationToken", token);
};

NativeSystemPluginBrigde.getPushNotificationToken = function () {
    if(cc.sys.os === cc.sys.OS_IOS){
        var value = cc.sys.localStorage.getItem("notificationToken");
        return value;
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID){
        return jsb.reflection.callStaticMethod("ext/plugin/fcm/FirebaseMessagingService","jniGetFCMToken","()Ljava/lang/String;");
    }
    return "";
};

NativeSystemPluginBrigde.onBuyIAPFinished = function (returnCode, signature, json) {
    if(cc.sys.os === cc.sys.OS_IOS){
        SystemPlugin.getInstance().onBuyItemFinishIOS(returnCode, signature);
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID){
        SystemPlugin.getInstance().onBuyItemFinishAndroid(returnCode, signature, json);
    }
};

NativeSystemPluginBrigde.onTakeImageData = function (base64) {
    cc.log("NativeSystemPluginBrigde.onTakeImageData");
    SystemPlugin.getInstance().onTakeImageData(base64);
};

NativeSystemPluginBrigde.getAdvertisingId = function(){
    if(cc.sys.os === cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("NativeSystemPlugin", "identifierForAdvertising");
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod("ext/plugin/system/SystemPlugin", "jniGetAdvertisingIdClient", "()Ljava/lang/String;");
    }
};

NativeSystemPluginBrigde.textToClipboard = function (text) {
    if(cc.sys.os === cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("NativeSystemPlugin", "textToClipboard:", text);
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod("ext/plugin/system/SystemPlugin", "jniTextToClipboard", "(Ljava/lang/String;)Z", text);
    }
};


