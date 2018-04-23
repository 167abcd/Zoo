/**
 * Created by ext on 7/11/2016.
 */

var ToastMessage = (function() {
    var instance = null;
    var MessageNodeClass = IDialog.extend({
        ctor : function () {
            this._super();
            this._bgColor = cc.color(0,0,0,0);

            var bg = new cc.Sprite("res/Texture/Home/dialog_toast_bg.png");
            this.addChild(bg);
            this.bg =bg;
            var messageLabel = cc.Label.createWithBMFont(cc.res.font.Tahoma_Regular_24, "Loading");
            messageLabel.setColor(cc.color("#ffffff"));
            this.addChild(messageLabel);
            this.messageLabel = messageLabel;
        },

        setMessage : function (message) {
            this.messageLabel.setString(message);
        },
        setBg : function (bg) {
            this.bg.setSpriteFrame(bg);
        },
        resetBg : function () {
            //dang dung file nen ko setSpriteFrame => initwithfile
            //this.bg.setSpriteFrame("res/Texture/Home/dialog_toast_bg.png");
        },
        showWithBg : function (bg,message, time, mScene) {
            this.setBg(bg);
            this.show(message, time, mScene);
        },

        show : function (message,time,mScene) {
            if(mScene ===  undefined){
                mScene = cc.director.getRunningScene();
                if(mScene.messageLayer){
                    mScene = mScene.messageLayer;
                }
            }
            this._super(mScene);

            if(time ===  undefined){
                time = 3.0;
            }

            this.setMessage(message);

            var thiz = this;
            this.stopAllActions();
            this.runAction(new cc.Sequence(new cc.DelayTime(time), new cc.CallFunc(function () {
                thiz.hide();
            })));
        },

        /*onTouchBegan : function () {
            return true;
        },
        onTouchMoved : function (){},
        onTouchEnded : function () {
            this.hide();
        }*/

        addTouchEvent : function () {
            var thiz = this;
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:false,
                onTouchBegan : function (touch, event) {
                    return thiz.onTouchBegan(touch, event);
                },
                onTouchMoved : function (touch, event){
                    thiz.onTouchMoved(touch, event);
                },
                onTouchEnded : function (touch, event) {
                    thiz.onTouchEnded(touch, event);
                }
            }, this);
        },
    });

    MessageNodeClass.getInstance = function() {
        if (!instance) {
            instance = new MessageNodeClass();
            instance.retain();
        }
        return instance;
    }

    return MessageNodeClass;
})();