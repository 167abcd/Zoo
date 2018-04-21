/**
 * Created by ext on 5/6/2017.
 */

var MiniTaiXiuNotification = cc.Node.extend({
    ctor :function () {
        this._super();

        this.timeRemaining = 0.0;

       // this.setContentSize(cc.size(50, 50));
        var _bg = cc.Sprite.create("#floatBt-bg_countdown.png");
       // _bg.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2));
        _bg.setVisible(false);
        this.addChild(_bg);
        this.bg = _bg;

        var _lb_count = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, "", cc.TEXT_ALIGNMENT_CENTER);
        _lb_count.setColor(cc.color("#fff996"));
        _lb_count.setPosition(cc.p(this.bg.getContentSize().width/2, this.bg.getContentSize().height/2));
        this.bg.addChild(_lb_count);
        this.lb_count = _lb_count;
        // SocketClient.getInstance().addListener("updateMiniGameMetaData", this.updateMiniGameMetaData, this);


    },
    update:function(dt) {
        if(this.timeRemaining >= 0){
            this.timeRemaining -= dt;
            this.bg.setVisible(true);
            this.lb_count.setString(Math.round(this.timeRemaining));

        }
        else{
            this.bg.setVisible(false);
        }
    },

    onEnter: function () {
        this._super();
        SocketClient.getInstance().addListener("1008", this.onJoinGame, this);
        SocketClient.getInstance().addListener("1009", this.onStateGame, this);
        this.scheduleUpdate();

        var request = {
            c: "game",
            g: "mini_taixiu",
            a:1012
        };
        SocketClient.getInstance().send(request);
    },

    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
        this.unscheduleUpdate();
    },

    onJoinGame:function (cmd, message) {
        this.arrHistory = [];
        if(message["ch"] == "mini_taixiu") {
            var param = message["data"];
            var state = param[1];
            var timeRemain = param[2];
            this.updateMiniGameMetaData(state, timeRemain);
        }
    },
    onStateGame:function (cmd, message) {
        var param = message["data"];
        var state = param[1];
        var timeState = param[2];

        this.updateMiniGameMetaData(state, timeState);
    },

    updateMiniGameMetaData : function(state, timeremain){
        if(state === 3)
        {
            this.timeRemaining = timeremain;
        }

    },



});