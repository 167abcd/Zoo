/**
 * Created by cocos2d on 11/9/2016.
 */
var FacebookPlugin = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        plugin: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.fbAppId = "1296504797116621";
                this.lazyInit();
            }
        },
        lazyInit: function (cb) {
            cc.log("fb lazy init");
            var fbAppId = this.fbAppId;
            window.fbAsyncInit = function() {
                FB.init({
                    appId: fbAppId,
                    cookie: true,
                    autoLogAppEvents : false,
                    xfbml: false,
                    version: 'v2.11'
                });
                if(cb){
                    cb();
                }
            };
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        },
        showLogin : function () {
            var thiz = this;
            if(window.FB){
                this._showLoginDialog();
            }
            else{
                thiz.lazyInit(function () {
                    thiz.showLogin();
                });
            }
        },

        _showLoginDialog: function () {
            var thiz = this;
            FB.login(function(response){
                cc.log(response);
                if(response && response["status"] && response["status"] === "connected"){
                    thiz.onLoginFinished(0, response["authResponse"]["userID"], response["authResponse"]["accessToken"]);
                }
                else{
                    thiz.onLoginFinished(1, "", "");
                }
            });
        },

        onLoginFinished : function (returnCode, userId, accessToken) {
            //cc.log(returnCode + " " + userId + " "+ accessToken);
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
(function () {
    FacebookPlugin.getInstance();
})();
