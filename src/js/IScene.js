/**
 * Created by ext on 6/30/2016.
 */

var MainScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        this._runningScene = null;

        this.bottomScene = new cc.Node();
        this.addChild(this.bottomScene, 0);

        this.addChild(new JackpotFloatButton(), 2);

        this.addChild(new FloatButton(), 2);

        this.miniGameLayer = new cc.Node();
        this.addChild(this.miniGameLayer, 2);

        this.popupLayer = new cc.Node();
        this.addChild(this.popupLayer, 2);

        this.messageLayer = new cc.Node();
        this.addChild(this.messageLayer, 2);

        this.topScene = new cc.Node();
        this.addChild(this.topScene, 2);

    //    FloatButton.getInstance().show();
    },

    getRunningScene : function () {
        return this._runningScene;
    },

    replaceScene : function (newScene) {
        if(this._runningScene){
            this._runningScene.removeFromParent(true);
            this._runningScene =  null;
        }
        this._runningScene = newScene;
        this._runningScene.setAnchorPoint(cc.p(0,0));
        this._runningScene.setPosition(0,0);
        this.addChild(this._runningScene, 1);
    },

    removeAllPopup: function () {
        this.popupLayer.removeAllChildren(true);
    }
});

var IScene = cc.Node.extend({
    sceneLayer:null,
    popupLayer:null,
    winSize:null,
    screenScale:null,
    ctor : function () {
        this._super();
        this.type = "IScene";

        this.sceneLayer = new cc.Node();
        this.addChild(this.sceneLayer, 0);

        this.popupLayer = new cc.Node();
        this.addChild(this.popupLayer, 100);

        this.messageLayer = new cc.Node();
        this.addChild(this.messageLayer, 101);

        this.floatButtonLayer = new cc.Node();
        this.addChild(this.floatButtonLayer, 2);

        this.sceneLayer.setContentSize(cc.size(2000, 1000));

        SceneNavigator.resizeEvent(this);
    },

    onCanvasResize : function () {
        this.sceneLayer.y = cc.winSize.height - this.sceneLayer.height;
    },

    onExit : function () {
        this._super();
        var runningScene = cc.director.getRunningScene();
        runningScene.removeAllPopup();
    },

    onEnter : function () {
        this._super();
    }
});