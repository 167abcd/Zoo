/**
 * Created by Balua on 7/31/17.
 */

var HomeTopBarLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var topBar = new LobbyTopBar();
        this.addChild(topBar);
        this.topBar = topBar;

        var loginLayer = new LoginLayer();
        this.addChild(loginLayer,1);
        this.loginLayer = loginLayer;

        topBar.btn_back.addClickEventListener(function () {
            thiz.backButtonHandler(1);
        });

        loginLayer.btn_back.addClickEventListener(function () {
            thiz.backButtonHandler(2);
        });
    },
    
    backButtonHandler: function () {cc.log("backButtonHandler");},

    startHome : function () {
        this.loginLayer.setHidden(false);
        this.topBar.setHidden(true);
    },

    startLobby : function () {
        this.loginLayer.setHidden(true);
        this.topBar.setHidden(false);
    },

    showLobbyTopBar : function () {
        if(!SocketClient.getInstance().isLoggin()) {
            this.startHome();
        }
        else {
            this.startLobby();
        }
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("login", this._onSocketLogin, this);
        SocketClient.getInstance().addListener("logout", this._onSocketLogout, this);

        if(SocketClient.getInstance().isLoggin()){
            this.startLobby();
        }else{
            this.startHome();
        }
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    _onSocketLogin : function (cmd, data) {
        var status = data["stt"];
        if(status === 0){
            //login ok
            this.showLobbyTopBar();
        }

    },

    _onSocketLogout : function (cmd, data) {
        var status = data["stt"];
        if(status === 0){
            //logout ok
            cc.Global.clearPlayerMeData();
            this.showLobbyTopBar();
        }
    }
});

var TopBarTouchLayer = HomeTopBarLayer.extend({
    ctor : function () {
        this._super();
        var thiz = this;
        this.loginLayer.btn_back.setVisible(true);
    },

    onEnter: function () {
        this._super();

        var mRect = cc.rect(327, 780, 1345, 80);
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function () {
                var node = thiz;
                while(node){
                    if(!node.isVisible()){
                        return false;
                    }
                    node = node.getParent();
                }
                return true;
            },
            onTouchEnded : function (touch,e) {
                var p = thiz.convertToNodeSpace(touch.getLocation());
                if(!cc.rectContainsPoint(mRect, p)){
                    thiz.showGameTopBar(false);
                }
            }
        }, this);
    },

    showGameTopBar : function (isshow) {
        this.setVisible(isshow);
        if(isshow) {
            this.showLobbyTopBar();
        }
    }
});