/**
 * Created by anhvt on 12/5/2016.
 */


// s_sfs_error_msg[10] = "Không đủ tiền để quay";
//  s_sfs_error_msg[1002] = "Bình tĩnh em ơi!";
// s_sfs_error_msg[1003] = "Lựa chọn không hợp lệ";
// s_sfs_error_msg[1004] = "Phải chọn ít nhất 1 line";
// s_sfs_error_msg[1005] = "Chưa chọn mức cược";
var GiftCodeController = AoeController.extend({


    initWithView: function (view) {
        this._view = view;
        this.gameGroup = "gift_hunting";

        SocketClient.getInstance().addListener("1601", this.onResuftRotate, this);
        SocketClient.getInstance().addListener("1603", this.onTop, this);
        SocketClient.getInstance().addListener("1604", this.onStartGiftCode, this);
        SocketClient.getInstance().addListener("ua", this._onUpdateAsset, this);
        SocketClient.getInstance().addListener("err", this.onError, this);
        SocketClient.getInstance().addListener("jackpot", this.onJacpot, this);
        SocketClient.getInstance().addListener("1000", this.onJoinGame, this);
        SocketClient.getInstance().addListener("uJackpot", this.onUpJacpot, this);
        SocketClient.getInstance().addListener("preJackpot", this.onPreJacpot, this);
        SocketClient.getInstance().addListener("1609", this._updateRankMe, this);
    },
    onPreJacpot: function (cmd, message) {
        if(message["ch"] == this.gameGroup){
            this.isNohu = true;
        }

    },


    _updateRankMe:function (cmd, message) {
        this._view.updateRankMe( message["data"]["1"]);
    },
    onUpJacpot:function (cmd, message) {

    },
    onJacpot: function (cmd, message) {
        this._view.saveDataJackpot( message["data"]["2"]);

    },

    onError: function (cmd, message) {
        // if(message["code"]==1001){
            this._view.onError(message);
        // }


    },
    _onUpdateAsset : function (cmd, data) {
        // if(data["r"] >=0){
        //     this._view.updateInfor();
        // }
    },
    releaseController: function () {
        this._view = null;

        SocketClient.getInstance().removeListener(this);

        this.requestQuitRoom();
    },




        _onPerformChangeRewardFund : function (messageType, content) {
        if (content.p.group !== this.gameGroup){
            return;
        }

        this._view.performChangeRewardFund(content.p.data["1"]);
    },

    onJoinGame : function(cmd, message){
        var thiz = this;
        if( message["data"]["1"] > 0){
            this._view.setFreeSpin(message["data"]["1"]);

        };

        setTimeout(function () {
            if(message["data"]["5"] > 0){
            // time remain
                // var action = new ext.ActionNumber(0.5,parseInt(message["2"]));
                // this.lblSodu.runAction(action);
               thiz._view.setTimeRemainGift(message["data"]["5"]);

            }
            if(message["data"]["6"]){
                thiz._view.handleResuftZ(true,message["data"]["6"]);
            }
        }, 0.1);
    },
    _onFreeSpin:function (messageType, content) {
        this.onFreeSpin(content.p["data"]);
    },

    _onReconnect : function (messageType, content) {
        if (content.p.group !== this.gameGroup){
            return;
        }
        this._view.initHuThuong(content.p.data["pbs"]);
        this.onReconnect(content.p["data"]);
        this._view.runAction(new cc.Sequence(new cc.DelayTime(0), new cc.CallFunc(function () {
            LoadingDialog.getInstance().hide();
        })));
    },
    _onNhanThuong:function (messageType, content) {
        this._view.onNhanThuong();
    },
    _onNohu:function (messageType, content) {

        this._view.showJackpot ();
    },
    _onLucky:function (messageType, content) {

        this.onLucky(content.p["data"]);
    },

    _onBonus:function (messageType, content) {

        this.onBonus(content.p["data"]);
    },

    _onExitGame:function (messageType, content) {
        this._view.exitToGame();
    },
    _onResuftRotate:function (messageType, content) {
        cc.log("aaaa");
        if (content.p.group !== this.gameGroup){
            return;
        }
        this.onResuftRotate(content.p["data"]);
    },
    _onResuftTry:function (messageType, content) {
        cc.log("aaaa");
        if (content.p.group !== this.gameGroup){
            return;
        }
        this.onResuftTry(content.p["data"]);
    },

    onTop:function (cmd, message) {
        var arrPlayer = message["data"]["1"];
        this._view.onRefreshTop(arrPlayer);
    },
    onResuftRotate:function (cmd, message) {

        var param = message["data"];
        // this._view.lblID.setString("ID: "+ param[1]);
        this._view.handleResuftZ(false,param);
    },
    onStartGiftCode:function (cmd, message) {

        var param = message["data"];

        this._view.updateTimeRemain(param["2"],param["1"]);
        this._view.resetLuot();
    },

    onResuftTry:function (param) {
        this._view.lblID.setString("ID: "+ param[1]);

        this._view.handleResuftZ(false,param);
    },

    onFreeSpin:function (param) {

        this._view.onFreeSpin(param);
    },

    onBonus:function (param) {
        this._view.onBonus(param[1],param[2],param[3]);
    },
    onLucky:function (param) {
        if(param[3])
        {
            this._view.openAllLucky(param[3],param[4]);
        }
        else {
            this._view.openOneLucky(param[2],param[1]);
        }

    },

    onChangeAssets: function (gold, changeAmount) {

    },



    requestQuitRoom: function () {
        var request = {
            c: "game",
            g: this.gameGroup,
            a:9999
        };
        SocketClient.getInstance().send(request);
    },

    sendJoinGame: function () {
        var request = {
            c: "game",
            g: this.gameGroup,
            a:1000,

        };
        SocketClient.getInstance().send(request);
    },
    sendRouteRequest:function (indexBet,lineBets) {

        this.isNohu = false;
        var request = {
            c: "game",
            g: this.gameGroup,
            a:1601
        };
        SocketClient.getInstance().send(request);

        // SmartfoxClient.getInstance().sendExtensionRequest(-1, "1001", {2: lineBets, 1: indexBet});//,3:1  7 bonus -1 no hu 8 la free
    },


    sendGetTopRequest: function () {
    },
    sendGiveGold:function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1003", null);
    },



});