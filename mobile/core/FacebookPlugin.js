/**
 * Created by cocos2d on 6/30/2016.
 */

var FacebookPlugin = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {

            }
        },
        
        showLogin : function () {
            FacebookNativeBrigde.showLogin();
        },

        logout : function () {
            FacebookNativeBrigde.logout();
        },

        onLoginFinished : function (returnCode, userId, accessToken) {
            cc.log("onLoginFinished: " + returnCode + " " + userId + " "+ accessToken);
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

var FacebookNativeBrigde = FacebookNativeBrigde || {};
FacebookNativeBrigde.showLogin = function () {
    if(cc.sys.os === cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("NativeFacebookPlugin", "nativeShowLogin");
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID){
        jsb.reflection.callStaticMethod("ext/plugin/facebook/FacebookPlugin","jniLogin","()V");
    }
};

FacebookNativeBrigde.logout = function () {
    if(cc.sys.os === cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("NativeFacebookPlugin", "nativeShowLogout");
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID){
        jsb.reflection.callStaticMethod("ext/plugin/facebook/FacebookPlugin","jniLogout","()V");
    }
};

FacebookNativeBrigde.onLoginFinished = function (returnCode, userId, accessToken) {
    FacebookPlugin.getInstance().onLoginFinished(returnCode, userId, accessToken)
};

FacebookNativeBrigde.getFacebookAppId = function () {
    if(cc.sys.os === cc.sys.OS_IOS){
        return jsb.reflection.callStaticMethod("NativeFacebookPlugin", "nativeGetAppId");
    }
    else if(cc.sys.os === cc.sys.OS_ANDROID){
        return jsb.reflection.callStaticMethod("ext/plugin/facebook/FacebookPlugin","jniGetFacebookAppId","()Ljava/lang/String;");
    }
    else{
        return "";
    }
};