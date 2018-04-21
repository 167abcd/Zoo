/**
 * Created by ext on 7/1/2016.
 */

var VongQuayCountLayer = cc.Node.extend({
    ctor: function () {
        this._super();

        this.setAnchorPoint(cc.p(0.5, 0.5));

        var _bg = cc.Sprite.create("#floatBt-bg_countdown.png");
        // _bg.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2));
        _bg.setVisible(false);
        this.addChild(_bg);
        this.bg = _bg;

        var _lb_count = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, "", cc.TEXT_ALIGNMENT_CENTER);
        _lb_count.setColor(cc.color("#fff996"));
        _lb_count.setPosition(cc.p(this.bg.getContentSize().width/2, this.bg.getContentSize().height/2));
        this.bg.addChild(_lb_count);
        this.lb_count = _lb_count;
    },

    _onUpdateCount:function (cmd, message) {
        var homeScene = SceneNavigator.getRunningScene();
        if(message["ch"] == "mini_luckywheel" && homeScene.startHome){
            var luotConlau  = message["data"]["8"];
           if(luotConlau>0){

                    this.bg.setVisible(true);
                    this.lb_count.setString(luotConlau.toString());

           }else {
               this.bg.setVisible(false);
           }
        }
    },
    onEnter: function () {
        this._super();
        SocketClient.getInstance().addListener("1301", this._onUpdateCount, this);
        SocketClient.getInstance().addListener("1310", this._onUpdateCount, this);

    },

    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);

    }
});

var LobbyBottomBar = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));

        var bg = new cc.Sprite("#home_rightBar.png");
        this.setContentSize(bg.getContentSize());
        bg.setPosition(this.width/2, this.height/2);
        this.addChild(bg);

        var btn_vip = new ccui.Button("home_rightBar_vip.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_vip.setPosition(cc.p(38, 207));
        this.addChild(btn_vip);

        var btn_payment = new ccui.Button("home_rightBar_payment.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_payment.setPosition(cc.p(36, 91));
        this.addChild(btn_payment);

        btn_vip.addClickEventListener(function () {
            SceneNavigator.showPaymentDialog();
            // MessageNode.getInstance().show("Không hỗ trợ trong thời gian Alpha Test")
            // var vippop = new VipLayer();
            // vippop.show();
        });
        btn_payment.addClickEventListener(function () {
            // MessageNode.getInstance().show("Không hỗ trợ trong thời gian Alpha Test")
            SceneNavigator.showPaymentDialog();
        });
    }
});