/**
 * Created by Balua on 7/18/17.
 */

var SignupScene = IScene.extend({
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("res/Texture/game_bg.jpg");
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.sceneLayer.addChild(bg);

        var signupLayer = new SignupLayer();
        this.sceneLayer.addChild(signupLayer);
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("login", this._onSocketLogin, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    _onSocketLogin : function (cmd, data) {
        var status = data["stt"];
        if(status === 0){
            //login ok
            var homeScene = new HomeScene();
            //homeScene.startHome();
            SceneNavigator.replaceScene(homeScene);
        }
    }
});