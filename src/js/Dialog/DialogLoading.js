/**
 * Created by gjfgj on 7/4/2018.
 */




var DialogLoading = (function() {
    var instance = null;
    var DialogLoadingClass = IDialog.extend({
        ctor : function () {
            this._super();

            var loadingSpin = new cc.Sprite("res/Texture/Home/loading_spin.png");
            this.addChild(loadingSpin);
            this.loadingSpin = loadingSpin;

            /*var loadingLogo = new cc.Sprite("#dialog-loading-logo.png");
             this.addChild(loadingLogo);*/

            var loadingMessage = cc.Label.createWithBMFont(cc.res.font.Tahoma_Regular_24, "Loading");
            loadingMessage.setPosition(0, -100);
            this.addChild(loadingMessage);
            this.loadingMessage = loadingMessage;
        },

        setMessage : function (message) {
            this.loadingMessage.setString(message);
        },

        update : function (dt) {
            if(this.timeOut < 0){
                this.hide();
                SceneNavigator.toHome("Hết thời gian kết nối máy chủ");
            }
            else{
                this.timeOut -= dt;
            }
        },

        onEnter : function () {
            this._super();
            this.loadingSpin.runAction(new cc.RepeatForever(new cc.RotateBy(1.0, 360.0)));
            this.timeOut = 30.0;
            this.scheduleUpdate();
        },

        onExit : function () {
            this._super();
            this.loadingSpin.stopAllActions();
            this.unscheduleUpdate();
        },

        show : function (message) {
            var mScene = cc.director.getRunningScene();
            if(mScene.topScene){
                mScene = mScene.topScene;
            }
            this._super(mScene);

            if(message){
                this.setMessage(message);
            }
            else{
                this.setMessage("");
            }
        },

        onTouchBegan : function () {
            return true;
        },
        onTouchMoved : function (){},
        onTouchEnded : function (){}
    });

    DialogLoadingClass.getInstance = function() {
        if (!instance) {
            instance = new DialogLoadingClass();
            instance.retain();
        }
        return instance;
    };

    return DialogLoadingClass;
})();