/**
 * Created by VGA10 on 12/8/2016.
 * Rat la dep trai
 */

var VQ_TYPE_NONE = 0;
var VQ_TYPE_GOLD = 1;
var VQ_TYPE_ADD = 2;
var VQ_TYPE_EXP = 3;
var VQ_TYPE_KT = 4;
var VQ_BUY_FIRST = 0;
var VQ_BUY_SECOND = 1;
var VQ_BUY_INGAME = 2;


var VongQuayController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);
        SocketClient.getInstance().addListener("1301", this.onResuft, this);
        SocketClient.getInstance().addListener("1000", this.onJoinGame, this);
        SocketClient.getInstance().addListener("1305", this.onSoluot, this);
        SocketClient.getInstance().addListener("err", this.onError, this);
        this.gameGroup = "mini_luckywheel";
    },
    onError: function (cmd, message) {
        if(message["ch"]=="mini_luckywheel"){
        this._view.onError(message);
        }


    },


    onTouchBegan: function (touch, event) {

        return this._super(touch, event);
    },

    _onJoinGame : function(messageType, content){

    },
    onShowMoneyExchange:function (param) {

      //  this._view.onChangeAssets("",(parseInt(param[1])>0)? parseInt(param[1]):0);
    },
    onReconnect:function (param) {
        cc.log("1");
        this.onJoinGame(param[1]);

    },



    onSoluot:function (cmd, message) {
        if(message["ch"] == this.gameGroup){
            var luotConlau  = message["data"]["8"];

            this._view.onUpdateLuot(luotConlau);

        }
    },

    onJoinGame:function (cmd, message) {
        if(message["ch"] == this.gameGroup){
            var luotConlau  = message["data"]["8"];

            this._view.onUpdateLuot(luotConlau);

        }

    },
    onBuySucess:function (param) {
        MessageNode.getInstance().show("Bạn có thêm " + param["3"]["2"] + " lượt");
    },
    onOtherBet:function (param) {

    },
    onResuft:function (cmd, message) {

        var idVongTo = message["data"]["5"]["4"];
        var idVongNho = message["data"]["6"]["4"];
        var idVongTo2 = message["data"]["13"]["4"];
        var luotConlau  = message["data"]["8"];


        this._view.handelResuft(idVongNho,idVongTo,idVongTo2,luotConlau);

    },
    requestQuitRoom: function () {
        var request = {
            c: "game",
            g: this.gameGroup,
            a:9999
        };
        SocketClient.getInstance().send(request);
    },
    onHistory:function (param) {

    },
    onStateGame:function (param) {

    },
    handleStateGame:function (state, timeState,isEffect) {

    },


    sendJoinGame: function () {
        this.isNohu = false;
        var request = {
            c: "game",
            g: this.gameGroup,
            a:1000
        };
        SocketClient.getInstance().send(request);
    },




    sendRotate: function (captcha, capchakey) {
        this.isNohu = false;
        var request = {
            c: "game",
            g: this.gameGroup,
            p:{7:captcha,9:capchakey},
            a:1301
        };
        SocketClient.getInstance().send(request);
    },

    sendBuyRotate: function (idCua) {

    },
    sendGiveMoney:function () {

    },
    sendGetUserHistory: function () {

    },
    sendGetRank: function () {

    }

});