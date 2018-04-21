/**
 * Created by anhvt on 12/5/2016.
 */
var CuopBienController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);


        this.gameGroup = "slot_27";
    },

    initWithView : function (view) {
        this._super(view);


        SocketClient.getInstance().addListener("err", this.onError, this);
        SocketClient.getInstance().addListener("jackpot", this.onJacpot, this);
        SocketClient.getInstance().addListener("preJackpot", this.onPreJacpot, this);
        SocketClient.getInstance().addListener("uJackpot", this.onUpJacpot, this);
        SocketClient.getInstance().addListener("1601", this.onResuftRotate, this);

        // SocketClient.getInstance().addListener("ua", this._onUpdateAsset, this);
    },
    onUpJacpot:function (cmd, message) {
        if(message["g"] == this.gameGroup &&  !this.isNohu){
            this._view.updateHuThuong();
        }
    },
    onPreJacpot: function (cmd, message) {
       if(message["ch"] == this.gameGroup){
           this.isNohu = true;
       }

    },
    onJacpot: function (cmd, message) {
        this._view.saveDataJackpot( message["data"]["2"]);

    },
    _onUpdateAsset : function (cmd, data) {

    },

    onResuftRotate:function (cmd, message) {

        var param = message["data"];
        // this._view.lblID.setString("ID: "+ param[1]);
        this._view.handleResuftZ(false,param);
    },

    onError: function (cmd, message) {

        if(message["ch"] == this.gameGroup ||message["code"] == 102 ){
            this._view.onError(message);
        }
    },



    onJoinGame:function (cmd, message) {
        this.isNohu = false;
        var data = message["data"]["11"];

        if(data){
            this._view.setGameId(data["15"]);
            if(data["5"])
                for(var i =0; i < data["5"].length; i ++){

                    this._view.pushKing((data["5"][i]% 13) == 11);
                    this._view.addHistory( data["5"][i]);
                }


            this.onInitGame(data);
        }

    },


    sendInitGame: function (betType) {

        var request = {
            c: "game",
            g: this.gameGroup,
            p:{9:betType},
            a:1101
        };
        SocketClient.getInstance().send(request);
        this._view.setLuotMoiBtEnable(false);
        this._view.setHighLowBtEnable(false);
    },

    sendRouteRequest: function (indexBet) {

        var request = {
            c: "game",
            g: this.gameGroup,
            p:{1:indexBet},
            a:1601
        };
        SocketClient.getInstance().send(request);

    },



    sendJoinGame: function (indexBet) {
        var request = {
            c: "game",
            g: this.gameGroup,
            a:1000,
            p:{1:indexBet}
        };
        SocketClient.getInstance().send(request);
    },

    requestQuitRoom: function () {
        var request = {
            c: "game",
            g: this.gameGroup,
            a:9999
        };
        SocketClient.getInstance().send(request);
    },



    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "403", null);
    },

    sendGetUserHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "401", null);
    }
});