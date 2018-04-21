
var ImageCaptcha = ImageBase64.extend({
    ctor : function () {
        this._super();
        this.captchaKey = null;
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("get_captcha", this.onRecvData, this);
        this.sendGetCapcha();
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    sendGetCapcha : function () {
        var request = {
            command : "get_captcha"
        };
        SocketClient.getInstance().sendHttpGetRequestUrl(s_lobby_captcha, request, this.__instanceId);
    },
    
    onRecvData : function (cmd, data) {
        if(data && data["status"] === 0){
            var tag = data["requestTag"];
            if(tag !== this.__instanceId){
                return;
            }

            var imgBase64 = data["data"]["image"];
            var timeout = data["data"]["timeout"];
            this.captchaKey = data["data"]["key"];
            this.setImageData(imgBase64);

            var thiz = this;

            this.stopActionByTag(100);
            var action = new cc.Sequence(new cc.DelayTime(timeout / 1000), new cc.CallFunc(function () {
                thiz.sendGetCapcha();
            }));
            action.setTag(100);
            this.runAction(action);
        }
    }
});